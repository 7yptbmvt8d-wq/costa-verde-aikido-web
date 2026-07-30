/* ============================================================================
 *  CONFIGURATION DU WIDGET D'AVIS — Costa Verde Aïkido
 * ----------------------------------------------------------------------------
 *  C'EST LE SEUL FICHIER QUE TU AS BESOIN DE MODIFIER.
 *  Modifie les valeurs entre guillemets, puis enregistre. Rien d'autre à toucher.
 *  (Voir le README.md pour le mode d'emploi détaillé, pas à pas.)
 * ==========================================================================*/

window.AVIS_CONFIG = {

  /* --- Identité affichée en haut du widget ------------------------------- */
  titre: "Ce que disent nos pratiquants",
  sousTitre: "Costa Verde Aïkido — Dojo de Moriani-Plage",

  /* --- Mode d'affichage --------------------------------------------------
   *  "hybride" : avis Google + avis mis en avant par toi   (RECOMMANDÉ)
   *  "google"  : uniquement les vrais avis Google (API)
   *  "manuel"  : uniquement les avis de la liste `avisMisEnAvant` ci-dessous
   *              (aucune clé API nécessaire — fonctionne tout de suite)
   *
   *  👉 En "hybride" : les vrais avis Google (via l'API) s'affichent,
   *     complétés par les avis de `avisMisEnAvant` ci-dessous.
   * --------------------------------------------------------------------- */
  mode: "hybride",

  /* --- Connexion à ta fiche Google Business Profile ---------------------
   *  Nécessaire pour les modes "hybride" et "google".
   *  - placeId : l'identifiant de ta fiche établissement (voir README §2)
   *  - cleApiGoogle : ta clé "Places API (New)" restreinte (voir README §3)
   *  Laisse ces champs vides ("") si tu utilises le mode "manuel".
   * --------------------------------------------------------------------- */
  placeId: "ChIJH08d8WVC1xIRWFj-oVmxAAc",
  cleApiGoogle: "AIzaSyCPZhpOe8MZD8alz3paB7Y3UXn_QmQB6Q8",

  /* --- Modération / filtres ---------------------------------------------
   *  noteMinimale     : masque les avis Google en dessous de cette note (1 à 5).
   *                     Ex. 4 = on n'affiche que les avis 4★ et 5★.
   *  auteursMasques   : liste de noms d'auteurs Google à ne jamais afficher.
   *                     Ex. ["Jean Spam", "Compte Bidon"]
   * --------------------------------------------------------------------- */
  noteMinimale: 4,
  auteursMasques: [],

  /* --- Bouton "Laisser un avis" -----------------------------------------
   *  Si tu renseignes placeId ci-dessus, le lien est généré automatiquement.
   *  Sinon, colle ici l'URL vers laquelle envoyer les visiteurs (ta fiche Google).
   * --------------------------------------------------------------------- */
  lienLaisserUnAvis: "",
  afficherBoutonAvis: true,

  /* --- Avis mis en avant (ta sélection validée) --------------------------
   *  Utilisés en mode "hybride" (affichés en premier) et en mode "manuel".
   *  Duplique un bloc { ... } pour ajouter un avis. Note = nombre de 1 à 5.
   *  `date` est un simple texte libre (ex. "Mars 2025").
   * --------------------------------------------------------------------- */
  avisMisEnAvant: [
    {
      nom: "Marie L.",
      note: 5,
      date: "Février 2025",
      texte: "Un dojo accueillant et bienveillant. Les cours sont exigeants mais toujours dans la bonne humeur. Je recommande à 100%, débutants comme confirmés."
    },
    {
      nom: "Thomas R.",
      note: 5,
      date: "Janvier 2025",
      texte: "J'ai découvert l'Aïkido ici il y a un an. L'enseignement est de grande qualité et le professeur prend le temps d'expliquer. Une vraie école."
    },
    {
      nom: "Sophie B.",
      note: 5,
      date: "Décembre 2024",
      texte: "Ambiance familiale et respectueuse. Mes enfants adorent, et moi aussi ! Un club à taille humaine où chacun trouve sa place."
    }
  ]
};
