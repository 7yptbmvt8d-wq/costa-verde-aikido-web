/* ============================================================================
 *  GALERIE PHOTOS — Costa Verde Aïkido
 * ----------------------------------------------------------------------------
 *  C'EST LE SEUL FICHIER À MODIFIER POUR LA GALERIE.
 *
 *  Chaque « saison » devient un onglet au-dessus du carrousel.
 *  La 1re saison de la liste s'affiche par défaut (mets la plus récente en 1er).
 *
 *  Pour AJOUTER UNE PHOTO :
 *   1. Dépose l'image dans  assets/img/galerie/
 *   2. Ajoute une ligne { src: "assets/img/galerie/ma-photo.jpg", legende: "..." }
 *
 *  Pour AJOUTER UNE SAISON : duplique un bloc { titre: "...", photos: [...] }.
 *
 *  Astuce : une photo sans "src" s'affiche comme un emplacement (utile pour
 *  préparer une saison avant d'avoir les photos).
 * ==========================================================================*/

window.GALERIE = {
  saisons: [
    {
      titre: "2025 – 2026",
      photos: [
        { src: "", legende: "Cours enfants — reprise de septembre" },
        { src: "", legende: "Pratique adultes au dojo" },
        { src: "", legende: "Stage de fin d'année" }
      ]
    },
    {
      titre: "2024 – 2025",
      photos: [
        { src: "", legende: "Passage de grades" },
        { src: "", legende: "Démonstration au forum des associations" },
        { src: "", legende: "Entraînement du vendredi soir" }
      ]
    }
  ]
};
