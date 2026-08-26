/* ============================================================================
 *  Statistiques de visite (Google Analytics) + bandeau de consentement
 * ----------------------------------------------------------------------------
 *  Google Analytics n'est chargé QUE si le visiteur a accepté. Tant qu'il n'a
 *  pas répondu, aucun cookie de suivi n'est déposé (conforme RGPD / CNIL).
 *
 *  👉 SEULE LIGNE À MODIFIER : l'identifiant de mesure ci-dessous.
 *     On le trouve dans Google Analytics → Admin → Flux de données → site web.
 *     Tant qu'il est vide, rien ne se charge et aucun bandeau ne s'affiche.
 * ==========================================================================*/
var CV_GA_ID = ""; // ex. "G-XXXXXXXXXX"

(function () {
  "use strict";

  var CLE = "cv-consent";          // mémorise le choix du visiteur
  var ACCEPTE = "accepte";
  var REFUSE = "refuse";

  /* --- Mémoire du choix (protégée : certains navigateurs bloquent) -------- */
  function lireChoix() {
    try { return localStorage.getItem(CLE); } catch (e) { return null; }
  }
  function ecrireChoix(v) {
    try {
      if (v) { localStorage.setItem(CLE, v); } else { localStorage.removeItem(CLE); }
    } catch (e) { /* sans effet */ }
  }

  /* --- Chargement de Google Analytics ------------------------------------ */
  var gaCharge = false;
  function chargerAnalytics() {
    if (gaCharge || !CV_GA_ID) return;
    gaCharge = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CV_GA_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", CV_GA_ID, { anonymize_ip: true });
  }

  /* --- Bandeau ------------------------------------------------------------ */
  function afficherBandeau() {
    var b = document.createElement("div");
    b.className = "cv-cookies";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Choix concernant les cookies de mesure d'audience");
    b.innerHTML =
      '<p class="cv-cookies__texte">Nous utilisons des cookies de mesure d\'audience pour ' +
      'comprendre la fréquentation du site. Ils ne sont déposés qu\'avec votre accord.</p>' +
      '<div class="cv-cookies__actions">' +
        '<button type="button" class="cv-btn cv-btn--gold cv-cookies__btn" data-choix="' + ACCEPTE + '">Accepter</button>' +
        '<button type="button" class="cv-btn cv-cookies__btn cv-cookies__btn--refus" data-choix="' + REFUSE + '">Refuser</button>' +
      '</div>';

    b.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-choix]");
      if (!btn) return;
      var choix = btn.getAttribute("data-choix");
      ecrireChoix(choix);
      b.remove();
      if (choix === ACCEPTE) {
        window["ga-disable-" + CV_GA_ID] = false;
        chargerAnalytics();
      } else {
        // si GA avait été chargé lors d'un choix précédent, on le neutralise
        window["ga-disable-" + CV_GA_ID] = true;
      }
      ajouterLienReglage();
    });

    document.body.appendChild(b);
  }

  /* --- Lien discret en pied de page pour revenir sur son choix ------------ */
  function ajouterLienReglage() {
    if (document.querySelector(".cv-cookies-lien")) return;
    var cible = document.querySelector(".cv-footer__inner > div");
    if (!cible) return;

    var p = document.createElement("div");
    p.className = "cv-footer__meta cv-cookies-lien";
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = "Gérer les cookies";
    a.style.color = "inherit";
    a.addEventListener("click", function (e) {
      e.preventDefault();
      ecrireChoix("");
      p.remove();
      afficherBandeau();
    });
    p.appendChild(a);
    cible.appendChild(p);
  }

  /* --- Démarrage ---------------------------------------------------------- */
  function demarrer() {
    if (!CV_GA_ID) return;            // pas encore configuré : on ne fait rien
    var choix = lireChoix();
    if (choix === ACCEPTE) {
      chargerAnalytics();
      ajouterLienReglage();
    } else if (choix === REFUSE) {
      ajouterLienReglage();
    } else {
      afficherBandeau();              // aucun choix encore fait
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
