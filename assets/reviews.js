/* ============================================================================
 *  Widget d'avis — Costa Verde Aïkido
 *  Logique d'affichage. Aucune modification nécessaire ici (voir config.js).
 * ==========================================================================*/
(function () {
  "use strict";

  var CFG = window.AVIS_CONFIG || {};
  var root = document.getElementById("cva-app");

  /* --- Petits utilitaires ------------------------------------------------ */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function initials(name) {
    var parts = String(name || "?").trim().split(/\s+/);
    var a = parts[0] ? parts[0][0] : "?";
    var b = parts[1] ? parts[1][0] : "";
    return (a + b).toUpperCase();
  }
  function starsHtml(note) {
    var n = Math.round(Number(note) || 0);
    var out = '<span class="cva-stars" aria-label="' + n + ' étoiles sur 5">';
    for (var i = 1; i <= 5; i++) {
      out += '<svg viewBox="0 0 20 20" class="' + (i <= n ? "on" : "off") + '"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"/></svg>';
    }
    return out + "</span>";
  }
  var GOOGLE_G =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"/></svg>';

  /* --- Normalisation d'un avis (source Google ou manuel) ----------------- */
  function normalizeManual(a) {
    return {
      nom: a.nom || "Anonyme",
      note: a.note || 5,
      date: a.date || "",
      texte: a.texte || "",
      photo: null,
      source: "manuel"
    };
  }
  function normalizeGoogle(r) {
    // API "Places (New)" : objet Review
    var author = (r.authorAttribution || {});
    var texte = "";
    if (r.text && typeof r.text === "object") texte = r.text.text || "";
    else if (typeof r.text === "string") texte = r.text;
    return {
      nom: author.displayName || "Utilisateur Google",
      note: r.rating || 0,
      date: r.relativePublishTimeDescription || "",
      texte: texte,
      photo: author.photoUri || null,
      source: "google"
    };
  }

  /* --- Rendu ------------------------------------------------------------- */
  function renderCard(a) {
    var card = el("article", "cva-card");

    var top = el("div", "cva-card__top");
    var avatar = el("div", "cva-avatar");
    if (a.photo) {
      var img = el("img");
      img.src = a.photo; img.alt = a.nom; img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      avatar.appendChild(img);
    } else {
      avatar.textContent = initials(a.nom);
    }
    var idBox = el("div", "cva-card__id");
    idBox.appendChild(el("div", "cva-card__name", escapeHtml(a.nom)));
    if (a.date) idBox.appendChild(el("div", "cva-card__date", escapeHtml(a.date)));
    top.appendChild(avatar);
    top.appendChild(idBox);

    var stars = el("div", null, starsHtml(a.note));
    var text = el("p", "cva-card__text", escapeHtml(a.texte));

    card.appendChild(top);
    card.appendChild(stars);
    card.appendChild(text);
    if (a.source === "google") {
      card.appendChild(el("div", "cva-badge-google", GOOGLE_G + "<span>Avis Google</span>"));
    }
    return card;
  }

  function renderHeader(avis, summary) {
    // Si l'API Google a renvoyé une note globale, on l'affiche telle quelle
    // (note authentique Google, même s'il n'y a pas encore d'avis rédigés).
    var count = summary ? summary.nombre : avis.length;
    var avg = summary
      ? summary.note
      : (avis.length
          ? avis.reduce(function (s, a) { return s + (Number(a.note) || 0); }, 0) / avis.length
          : 0);

    var header = el("div", "cva-header");

    var titles = el("div", "cva-header__titles");
    titles.appendChild(el("h2", null, escapeHtml(CFG.titre || "Avis")));
    if (CFG.sousTitre) titles.appendChild(el("p", null, escapeHtml(CFG.sousTitre)));
    header.appendChild(titles);

    var right = el("div", "cva-summary");
    if (count) {
      var score = el("div", "cva-summary__score", avg.toFixed(1).replace(".", ","));
      var meta = el("div", "cva-summary__meta");
      var label = summary
        ? (count + (count > 1 ? " avis sur Google" : " avis sur Google"))
        : (count + " avis");
      meta.innerHTML = starsHtml(avg) + "<div>" + label + "</div>";
      right.appendChild(score);
      right.appendChild(meta);
    }
    if (CFG.afficherBoutonAvis) {
      var link = ctaLink();
      if (link) {
        var cta = el("a", "cva-cta");
        cta.href = link;
        cta.target = "_blank";
        cta.rel = "noopener";
        cta.innerHTML =
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01z"/></svg>' +
          "<span>Laisser un avis</span>";
        right.appendChild(cta);
      }
    }
    header.appendChild(right);
    return header;
  }

  function ctaLink() {
    if (CFG.lienLaisserUnAvis) return CFG.lienLaisserUnAvis;
    if (CFG.placeId) {
      return "https://search.google.com/local/writereview?placeid=" +
        encodeURIComponent(CFG.placeId);
    }
    return null;
  }

  function paint(avis, summary) {
    root.innerHTML = "";
    root.appendChild(renderHeader(avis, summary));
    if (!avis.length) {
      root.appendChild(el("div", "cva-state",
        "Soyez le premier à laisser un avis !"));
    } else {
      var grid = el("div", "cva-grid");
      avis.forEach(function (a, i) {
        var c = renderCard(a);
        c.style.animationDelay = (i * 40) + "ms";
        grid.appendChild(c);
      });
      root.appendChild(grid);
    }
    var note = el("div", "cva-footer-note");
    note.innerHTML = 'Avis affichés depuis Google · Costa Verde Aïkido';
    root.appendChild(note);
    autoResize();
  }

  function paintLoading() {
    root.innerHTML = "";
    root.appendChild(renderHeader([]));
    var grid = el("div", "cva-grid");
    for (var i = 0; i < 3; i++) grid.appendChild(el("div", "cva-skeleton"));
    root.appendChild(grid);
  }

  /* --- Filtres de modération --------------------------------------------- */
  function applyModeration(googleReviews) {
    var min = Number(CFG.noteMinimale) || 0;
    var hidden = (CFG.auteursMasques || []).map(function (n) {
      return String(n).trim().toLowerCase();
    });
    return googleReviews.filter(function (a) {
      if ((Number(a.note) || 0) < min) return false;
      if (hidden.indexOf(String(a.nom).trim().toLowerCase()) !== -1) return false;
      return true;
    });
  }

  /* --- Chargement des avis Google via l'API Places (New) ----------------- */
  function loadGoogle() {
    return new Promise(function (resolve, reject) {
      if (!CFG.placeId || !CFG.cleApiGoogle) {
        return reject(new Error("placeId ou cleApiGoogle manquant"));
      }
      var cb = "cvaGmapsInit_" + Date.now();
      window[cb] = function () {
        google.maps.importLibrary("places").then(function (lib) {
          var Place = lib.Place;
          var place = new Place({ id: CFG.placeId });
          return place.fetchFields({
            fields: ["reviews", "rating", "userRatingCount", "displayName"]
          });
        }).then(function (res) {
          var place = res.place || {};
          var reviews = place.reviews || [];
          resolve({
            reviews: reviews.map(normalizeGoogle),
            rating: place.rating || 0,
            count: place.userRatingCount || 0
          });
        }).catch(reject);
      };
      var s = document.createElement("script");
      s.async = true;
      s.onerror = function () { reject(new Error("Échec du chargement de l'API Google Maps")); };
      s.src = "https://maps.googleapis.com/maps/api/js?key=" +
        encodeURIComponent(CFG.cleApiGoogle) +
        "&loading=async&libraries=places&callback=" + cb;
      document.head.appendChild(s);
    });
  }

  /* --- Ajuste la hauteur transmise au parent (Google Sites) -------------- */
  function autoResize() {
    try {
      var h = document.body.scrollHeight;
      if (window.parent) {
        window.parent.postMessage({ cvaHeight: h }, "*");
      }
    } catch (e) { /* silencieux */ }
  }
  window.addEventListener("resize", autoResize);

  /* --- Orchestration ----------------------------------------------------- */
  function start() {
    if (!root) return;
    var manual = (CFG.avisMisEnAvant || []).map(normalizeManual);
    var mode = CFG.mode || "hybride";

    if (mode === "manuel") {
      paint(manual);
      return;
    }

    paintLoading();
    loadGoogle().then(function (googleData) {
      var filtered = applyModeration(googleData.reviews);
      var combined = (mode === "google") ? filtered : manual.concat(filtered);
      // Dédoublonnage léger (même nom + même texte)
      var seen = {};
      combined = combined.filter(function (a) {
        var k = (a.nom + "|" + a.texte).toLowerCase();
        if (seen[k]) return false;
        seen[k] = true;
        return true;
      });
      // Note globale authentique Google (affichée même sans avis rédigés)
      var summary = googleData.count
        ? { note: googleData.rating, nombre: googleData.count }
        : null;
      paint(combined, summary);
    }).catch(function (err) {
      // En cas d'échec de l'API, on retombe sur les avis mis en avant
      // (ou un message si le mode était "google").
      console.warn("[Avis] API Google indisponible :", err && err.message);
      if (mode === "google") {
        paint([]);
      } else {
        paint(manual);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
