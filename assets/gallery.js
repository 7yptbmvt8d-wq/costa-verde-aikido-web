/* ============================================================================
 *  Galerie — carrousel par saison (Costa Verde Aïkido)
 *  Les photos se gèrent dans l'espace admin (data/galerie.json).
 *  Repli sur galerie-config.js si le fichier de données n'est pas joignable.
 * ==========================================================================*/
(function () {
  "use strict";

  var seasonsEl = document.getElementById("cv-seasons");
  var trackEl = document.getElementById("cv-track");
  var dotsEl = document.getElementById("cv-dots");
  var carouselEl = document.getElementById("cv-carousel");
  if (!seasonsEl || !trackEl || !carouselEl) return;

  var DATA = [];
  var current = 0;   // index de la saison
  var index = 0;     // index de la photo dans la saison
  var slidesCount = 0;

  var DELAI = 5000;  // temps d'affichage de chaque photo (ms)
  var minuteur = null;

  /* --- Saison sportive en cours ------------------------------------------
   * Une saison va de septembre à août : en septembre 2026, la saison en
   * cours est « 2026 – 2027 ». On ne retient que l'année de début.       */
  function anneeDebutSaisonActuelle() {
    var d = new Date();
    return d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
  }

  // « 2025 – 2026 » -> 2025. Renvoie null si le titre ne contient pas d'année.
  function anneeDebut(saison) {
    var m = String((saison && saison.titre) || "").match(/\d{4}/);
    return m ? parseInt(m[0], 10) : null;
  }

  // Les photos réellement affichables. Une entrée sans image produirait une
  // diapositive grise et vide : on l'écarte plutôt que de la montrer.
  function photosDe(saison) {
    return ((saison && saison.photos) || []).filter(function (p) {
      return String(p.image || p.src || "").trim() !== "";
    });
  }

  function aDesPhotos(saison) {
    return photosDe(saison).length > 0;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* --- Onglets de saison ------------------------------------------------- */
  var indexSaisonEnCours = -1;

  function renderSeasons() {
    seasonsEl.innerHTML = "";
    DATA.forEach(function (s, i) {
      var b = document.createElement("button");
      b.className = "cv-season-btn" + (i === current ? " is-active" : "");
      b.type = "button";
      b.textContent = s.titre || ("Saison " + (i + 1));

      // La saison en cours est signalée, où qu'elle soit dans la liste.
      if (i === indexSaisonEnCours) {
        b.classList.add("cv-season-btn--now");
        var badge = document.createElement("span");
        badge.className = "cv-season-btn__badge";
        badge.textContent = "en cours";
        b.appendChild(badge);
      }

      b.addEventListener("click", function () {
        if (current === i) return;
        current = i;
        index = 0;
        renderSeasons();
        renderSlides();
      });
      seasonsEl.appendChild(b);
    });
  }

  /* --- Diapositives ------------------------------------------------------ */
  function renderSlides() {
    var photos = photosDe(DATA[current]);
    slidesCount = photos.length;

    if (!slidesCount) {
      arreter();
      trackEl.innerHTML = "";
      if (!carouselEl.querySelector(".cv-carousel__empty")) carouselEl.appendChild(mkEmpty());
      toggleControls(false);
      dotsEl.innerHTML = "";
      return;
    }
    var empty = carouselEl.querySelector(".cv-carousel__empty");
    if (empty) empty.remove();
    toggleControls(true);

    trackEl.innerHTML = photos.map(function (p) {
      var src = p.image || p.src || "";
      var inner = src
        ? '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(p.legende || "") + '" loading="lazy">'
        : '<div class="cv-slide__ph">' + escapeHtml(p.legende || "photo") + '</div>';
      var cap = p.legende ? '<div class="cv-slide__cap">' + escapeHtml(p.legende) + '</div>' : '';
      return '<div class="cv-slide">' + inner + cap + '</div>';
    }).join("");

    dotsEl.innerHTML = photos.map(function (_, i) {
      return '<button class="cv-dot' + (i === 0 ? ' is-active' : '') +
        '" type="button" aria-label="Photo ' + (i + 1) + '"></button>';
    }).join("");
    Array.prototype.forEach.call(dotsEl.children, function (d, i) {
      d.addEventListener("click", manuel(function () { go(i); }));
    });

    go(0);
    demarrer();
  }

  function mkEmpty() {
    var d = document.createElement("div");
    d.className = "cv-carousel__empty";
    d.textContent = "Photos à venir pour cette saison.";
    return d;
  }

  function toggleControls(show) {
    ["prev", "next"].forEach(function (k) {
      var btn = carouselEl.querySelector(".cv-carousel__btn--" + k);
      if (btn) btn.style.display = show && slidesCount > 1 ? "" : "none";
    });
    dotsEl.style.display = show && slidesCount > 1 ? "" : "none";
  }

  /* --- Navigation -------------------------------------------------------- */
  function go(i) {
    if (!slidesCount) return;
    index = (i + slidesCount) % slidesCount;
    trackEl.style.transform = "translateX(" + (-index * 100) + "%)";
    Array.prototype.forEach.call(dotsEl.children, function (d, k) {
      d.classList.toggle("is-active", k === index);
    });
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  /* --- Défilement automatique --------------------------------------------
   * Les photos défilent seules, et s'arrêtent dès que le visiteur s'occupe
   * du carrousel (survol, navigation au clavier, doigt sur l'écran) pour ne
   * pas lui faire perdre la photo qu'il regarde. Toute action manuelle
   * relance ensuite un tour complet.                                      */
  var animationsReduites = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function arreter() {
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
  }
  function demarrer() {
    arreter();
    // Une seule photo, onglet en arrière-plan, ou réglage système
    // « animations réduites » : on ne fait rien défiler.
    if (animationsReduites || slidesCount < 2 || document.hidden) return;
    minuteur = setInterval(next, DELAI);
  }
  // Navigation manuelle : on avance, puis on repart d'un délai entier.
  function manuel(action) { return function () { action(); demarrer(); }; }

  var nextBtn = carouselEl.querySelector(".cv-carousel__btn--next");
  var prevBtn = carouselEl.querySelector(".cv-carousel__btn--prev");
  if (nextBtn) nextBtn.addEventListener("click", manuel(next));
  if (prevBtn) prevBtn.addEventListener("click", manuel(prev));

  carouselEl.addEventListener("mouseenter", arreter);
  carouselEl.addEventListener("mouseleave", demarrer);
  carouselEl.addEventListener("focusin", arreter);
  carouselEl.addEventListener("focusout", demarrer);
  document.addEventListener("visibilitychange", function () {
    document.hidden ? arreter() : demarrer();
  });

  carouselEl.setAttribute("tabindex", "0");
  carouselEl.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") manuel(next)();
    else if (e.key === "ArrowLeft") manuel(prev)();
  });

  var startX = null;
  carouselEl.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    arreter();
  }, { passive: true });
  carouselEl.addEventListener("touchend", function (e) {
    if (startX !== null) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    }
    startX = null;
    demarrer();
  });

  /* --- Chargement des données -------------------------------------------- */
  function init(saisons) {
    DATA = saisons || [];
    if (!DATA.length) {
      seasonsEl.innerHTML = "";
      carouselEl.appendChild(mkEmpty());
      return;
    }

    // La plus récente d'abord, quel que soit l'ordre de saisie dans l'admin.
    // Les saisons sans année dans le titre restent à la fin, dans leur ordre.
    DATA.sort(function (a, b) {
      var x = anneeDebut(a), y = anneeDebut(b);
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      return y - x;
    });

    var actuelle = anneeDebutSaisonActuelle();
    indexSaisonEnCours = DATA.findIndex
      ? DATA.findIndex(function (s) { return anneeDebut(s) === actuelle; })
      : -1;

    // On ouvre sur la saison en cours. Si elle est encore vide (début de
    // saison, photos pas encore ajoutées), on affiche la dernière saison qui
    // a des photos plutôt qu'une galerie vide — l'onglet « en cours » reste
    // visible et signalé.
    if (indexSaisonEnCours >= 0 && aDesPhotos(DATA[indexSaisonEnCours])) {
      current = indexSaisonEnCours;
    } else {
      var avecPhotos = -1;
      for (var i = 0; i < DATA.length; i++) {
        if (aDesPhotos(DATA[i])) { avecPhotos = i; break; }
      }
      current = avecPhotos >= 0 ? avecPhotos : Math.max(indexSaisonEnCours, 0);
    }

    index = 0;
    renderSeasons();
    renderSlides();
  }

  fetch("data/galerie.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (j) { init((j && j.saisons) || []); })
    .catch(function () {
      // Repli (aperçu local via galerie-config.js)
      init((window.GALERIE && window.GALERIE.saisons) || []);
    });
})();
