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

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* --- Onglets de saison ------------------------------------------------- */
  function renderSeasons() {
    seasonsEl.innerHTML = "";
    DATA.forEach(function (s, i) {
      var b = document.createElement("button");
      b.className = "cv-season-btn" + (i === current ? " is-active" : "");
      b.type = "button";
      b.textContent = s.titre || ("Saison " + (i + 1));
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
    var photos = (DATA[current] && DATA[current].photos) || [];
    slidesCount = photos.length;

    if (!slidesCount) {
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
      d.addEventListener("click", function () { go(i); });
    });

    go(0);
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

  var nextBtn = carouselEl.querySelector(".cv-carousel__btn--next");
  var prevBtn = carouselEl.querySelector(".cv-carousel__btn--prev");
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  carouselEl.setAttribute("tabindex", "0");
  carouselEl.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });

  var startX = null;
  carouselEl.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  carouselEl.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    startX = null;
  });

  /* --- Chargement des données -------------------------------------------- */
  function init(saisons) {
    DATA = saisons || [];
    if (!DATA.length) {
      seasonsEl.innerHTML = "";
      carouselEl.appendChild(mkEmpty());
      return;
    }
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
