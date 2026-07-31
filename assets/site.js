/* ============================================================================
 *  Costa Verde Aïkido — Comportements du site
 *  - Menu mobile (burger)
 *  - Section « Avis » : rend les avis mis en avant (config.js) + la note
 *    Google réelle (API Places New), aux couleurs du site.
 * ==========================================================================*/
(function () {
  "use strict";

  /* --- Menu mobile ------------------------------------------------------- */
  var header = document.getElementById("cv-header");
  var burger = document.getElementById("cv-burger");
  if (header && burger) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    // Referme le menu après un clic sur un lien
    header.querySelectorAll(".cv-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Section avis ------------------------------------------------------ */
  var CFG = window.AVIS_CONFIG || {};
  var grid = document.getElementById("cv-review-grid");

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function initials(name) {
    var p = String(name || "?").trim().split(/\s+/);
    return ((p[0] ? p[0][0] : "?") + (p[1] ? p[1][0] : "")).toUpperCase();
  }
  function starsHtml(note) {
    var n = Math.round(Number(note) || 0), out = '<span class="cv-stars" aria-label="' + n + ' sur 5">';
    for (var i = 1; i <= 5; i++) {
      out += '<svg viewBox="0 0 20 20" class="' + (i <= n ? "on" : "off") +
        '"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"/></svg>';
    }
    return out + "</span>";
  }
  var GOOGLE_G = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"/></svg>';

  function renderReviews() {
    if (!grid) return;
    var avis = CFG.avisMisEnAvant || [];
    grid.innerHTML = avis.map(function (a) {
      return '' +
        '<article class="cv-review-card">' +
          '<div class="cv-review-card__top">' +
            '<div class="cv-review-avatar">' + initials(a.nom) + '</div>' +
            '<div>' +
              '<div class="cv-review-card__name">' + escapeHtml(a.nom) + '</div>' +
              (a.date ? '<div class="cv-review-card__src">' + escapeHtml(a.date) + '</div>' : '') +
            '</div>' +
          '</div>' +
          starsHtml(a.note) +
          '<p class="cv-review-card__text">' + escapeHtml(a.texte) + '</p>' +
          '<span class="cv-badge-g">' + GOOGLE_G + '<span>Avis Google</span></span>' +
        '</article>';
    }).join("");
  }

  function reviewLink() {
    if (CFG.lienLaisserUnAvis) return CFG.lienLaisserUnAvis;
    if (CFG.placeId) return "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(CFG.placeId);
    return null;
  }

  /* Note Google réelle (moyenne + nombre) via l'API Places (New) */
  function loadGoogleScore() {
    if (!CFG.placeId || !CFG.cleApiGoogle) return;
    var cb = "cvSiteGmaps_" + Date.now();
    window[cb] = function () {
      google.maps.importLibrary("places").then(function (lib) {
        var place = new lib.Place({ id: CFG.placeId });
        return place.fetchFields({ fields: ["rating", "userRatingCount"] });
      }).then(function (res) {
        var p = res.place || {};
        if (!p.userRatingCount) return;
        var box = document.getElementById("cv-gscore");
        document.getElementById("cv-gscore-num").textContent =
          (Number(p.rating) || 0).toFixed(1).replace(".", ",");
        document.getElementById("cv-gscore-stars").innerHTML = starsHtml(p.rating);
        document.getElementById("cv-gscore-meta").textContent =
          p.userRatingCount + " avis sur Google";
        var cta = document.getElementById("cv-review-cta");
        var link = reviewLink();
        if (cta && link) cta.href = link; else if (cta) cta.style.display = "none";
        box.hidden = false;
      }).catch(function () { /* silencieux : la note reste masquée */ });
    };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://maps.googleapis.com/maps/api/js?key=" +
      encodeURIComponent(CFG.cleApiGoogle) + "&loading=async&libraries=places&callback=" + cb;
    document.head.appendChild(s);
  }

  function start() {
    renderReviews();
    loadGoogleScore();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

/* ============================================================================
 *  Photos du site — appliquées depuis data/site.json (gérées dans l'admin).
 *  Chaque emplacement porte un attribut data-photo="clé".
 * ==========================================================================*/
(function () {
  "use strict";
  var nodes = document.querySelectorAll("[data-photo]");
  if (!nodes.length) return;
  fetch("data/site.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (map) {
      if (!map) return;
      Array.prototype.forEach.call(nodes, function (el) {
        var src = map[el.getAttribute("data-photo")];
        if (!src) return;
        var adapt = el.getAttribute("data-photo-fit") === "adapt";
        el.classList.remove("cv-ph");
        el.textContent = "";
        el.style.background = "none";
        el.removeAttribute("role");

        var img = document.createElement("img");
        img.src = src;
        img.alt = el.getAttribute("aria-label") || "";
        img.loading = "lazy";
        img.style.display = "block";
        img.style.width = "100%";
        img.style.borderRadius = "inherit";
        if (adapt) {
          // S'adapte à l'orientation : image entière, sans recadrage ni bande.
          img.style.height = "auto";
          el.style.minHeight = "0";
          el.style.aspectRatio = "auto";
        } else {
          // Remplit le cadre (photo de fond) : aucune bande, recadrage centré.
          img.style.height = "100%";
          img.style.objectFit = "cover";
        }
        el.removeAttribute("aria-label");
        el.appendChild(img);
      });
    })
    .catch(function () { /* repli : les emplacements restent affichés */ });
})();
