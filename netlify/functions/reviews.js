// Avis Google — récupérés côté serveur.
// -----------------------------------------------------------------------------
// Pourquoi une fonction serveur ? Depuis un navigateur, avec une clé API
// restreinte par domaine, Google ne renvoie jamais le TEXTE des avis (seulement
// la note et leur nombre). Appelé depuis le serveur avec une clé non restreinte
// par domaine, l'API renvoie bien les avis rédigés.
//
// Variables d'environnement Netlify attendues :
//   GOOGLE_PLACES_KEY  (obligatoire) clé API serveur, restreinte à « Places API (New) »
//   GOOGLE_PLACE_ID    (optionnel)   identifiant de la fiche ; sinon celui du club

const PLACE_ID_PAR_DEFAUT = "ChIJH08d8WVC1xIRWFj-oVmxAAc"; // Costa Verde Aïkido

// Fiche de référence utilisée uniquement par ?test=1 (voir plus bas) : elle a
// des milliers d'avis rédigés. Elle sert à savoir si la clé sait lire les
// textes d'avis, indépendamment de la fiche du club. Volontairement codée en
// dur : la fiche interrogée ne doit pas pouvoir être choisie de l'extérieur,
// sinon n'importe qui pourrait consommer le quota Google du club.
const PLACE_ID_TEMOIN = "ChIJLU7jZClu5kcR4PcOOO6p3I0"; // Tour Eiffel

exports.handler = async (event) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const params = (event && event.queryStringParameters) || {};
  const test = !!params.test;
  const debug = !!params.debug || test;
  const placeId = test
    ? PLACE_ID_TEMOIN
    : process.env.GOOGLE_PLACE_ID || PLACE_ID_PAR_DEFAUT;

  const repondre = (code, corps) => ({
    statusCode: code,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Cache 1 h côté CDN : évite d'appeler Google à chaque visite.
      // En diagnostic, aucun cache : on veut la réponse réelle du moment.
      "Cache-Control": debug
        ? "no-store"
        : "public, max-age=0, s-maxage=3600",
    },
    body: JSON.stringify(corps),
  });

  if (!key) {
    return repondre(200, { reviews: [], rating: null, total: 0, erreur: "GOOGLE_PLACES_KEY manquante" });
  }

  try {
    const url =
      "https://places.googleapis.com/v1/places/" + encodeURIComponent(placeId) +
      "?languageCode=fr";
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        // « reviews » doit être demandé en entier : découpé en sous-champs
        // (reviews.text, reviews.rating…), Google renvoie la note mais omet
        // silencieusement les avis rédigés.
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
    });
    const data = await res.json();

    if (data.error) {
      return repondre(200, {
        reviews: [], rating: null, total: 0,
        erreur: data.error.message || "Appel Google refusé",
      });
    }

    const avis = (data.reviews || [])
      .map((r) => {
        const auteur = (r.authorAttribution || {}).displayName || "";
        const texte =
          (r.text && r.text.text) ||
          (r.originalText && r.originalText.text) ||
          "";
        return {
          author: auteur,
          rating: r.rating || 0,
          text: texte,
          time: r.relativePublishTimeDescription || "",
        };
      })
      .filter((r) => r.text.trim().length > 0); // on n'affiche que les avis rédigés

    const reponse = {
      reviews: avis,
      rating: data.rating || null,
      total: data.userRatingCount || 0,
    };

    // /.netlify/functions/reviews?debug=1 — aide au diagnostic.
    // N'expose aucune donnée sensible : ni la clé, ni autre chose que ce que
    // Google publie déjà sur la fiche.
    if (debug) {
      const bruts = data.reviews || [];
      reponse.diagnostic = {
        fiche: (data.displayName || {}).text || "(nom absent)",
        placeId: placeId,
        avisRenvoyesParGoogle: bruts.length,
        avisAvecTexte: avis.length,
        champsDuPremierAvis: bruts[0] ? Object.keys(bruts[0]) : [],
        champsDeLaReponse: Object.keys(data),
      };
    }

    return repondre(200, reponse);
  } catch (e) {
    return repondre(200, { reviews: [], rating: null, total: 0, erreur: "Erreur réseau" });
  }
};
