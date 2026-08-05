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

exports.handler = async () => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || PLACE_ID_PAR_DEFAUT;

  const repondre = (code, corps) => ({
    statusCode: code,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Cache 1 h côté CDN : évite d'appeler Google à chaque visite.
      "Cache-Control": "public, max-age=0, s-maxage=3600",
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
        "X-Goog-FieldMask":
          "rating,userRatingCount,reviews.rating,reviews.text,reviews.originalText," +
          "reviews.authorAttribution,reviews.relativePublishTimeDescription",
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

    return repondre(200, {
      reviews: avis,
      rating: data.rating || null,
      total: data.userRatingCount || 0,
    });
  } catch (e) {
    return repondre(200, { reviews: [], rating: null, total: 0, erreur: "Erreur réseau" });
  }
};
