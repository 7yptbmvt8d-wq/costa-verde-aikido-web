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
  sousTitre: "Costa Verde Aïkido — Dojo de Santa Maria Poggio",

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
      nom: "Sébastien D.",
      note: 5,
      date: "Avis Google",
      texte: "Un dojo accueillant et bienveillant où l'on progresse à son rythme, dans le respect des valeurs traditionnelles de l'Aïkido. Les cours sont dynamiques, pédagogiques et adaptés à tous les niveaux, que l'on soit débutant ou pratiquant confirmé. L'ambiance est conviviale et familiale — on s'y sent bien dès le premier pas sur le tatami. Un vrai lieu de partage et d'épanouissement personnel. Je recommande vivement Costa Verde Aïkido à toutes celles et ceux qui veulent découvrir ou approfondir cet art martial unique."
    },
    {
      nom: "Jessica D.",
      note: 5,
      date: "Avis Google",
      texte: "Dojo chaleureux et dynamique, où l'on progresse dans le respect, la convivialité et la tradition. Un vrai coup de cœur !"
    },
    {
      nom: "Anne-Frédérique B.",
      note: 5,
      date: "Avis Google",
      texte: "Depuis trois ans de pratique, l'Aïkido me permet de garder la forme, une bonne santé et un bon moral ! Pour moi l'unité et un bon état d'esprit dans une pratique sportive sont très importants, et c'est ce que propose le Dojo de Santa Maria Poggio grâce à nos enseignants toujours très impliqués !! Merci à eux 👍"
    }
  ]
};
