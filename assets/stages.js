/* ============================================================================
 *  Stages — affichage depuis data/stages.json (géré dans l'espace admin)
 *  Repli : si le fichier n'est pas joignable, le contenu déjà présent dans
 *  la page (bloc « À venir ») reste affiché.
 * ==========================================================================*/
(function () {
  "use strict";
  var box = document.getElementById("cv-stages");
  if (!box) return;

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function render(stages) {
    if (!stages || !stages.length) return;
    box.innerHTML = stages.map(function (s) {
      return '' +
        '<div class="cv-stage">' +
          '<div class="cv-stage__date">' + escapeHtml(s.date || "") + '</div>' +
          '<div class="cv-stage__body">' +
            '<h3>' + escapeHtml(s.titre || "") + '</h3>' +
            '<p class="cv-p" style="margin:0;">' + escapeHtml(s.description || "") + '</p>' +
          '</div>' +
        '</div>';
    }).join("");
  }

  fetch("data/stages.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { if (j && j.stages) render(j.stages); })
    .catch(function () { /* on garde le contenu de repli déjà dans la page */ });
})();
