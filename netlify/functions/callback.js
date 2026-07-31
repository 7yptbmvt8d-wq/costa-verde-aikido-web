// OAuth GitHub — étape 2 : échange le "code" contre un token, puis le renvoie
// à la fenêtre de l'espace admin (Decap CMS). Aucune dépendance (fetch natif).
exports.handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const code = event.queryStringParameters && event.queryStringParameters.code;

  if (!clientId || !clientSecret) {
    return { statusCode: 500, body: "OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET manquants." };
  }
  if (!code) {
    return { statusCode: 400, body: "Code d'autorisation manquant." };
  }

  function page(status, content) {
    // Renvoie une page qui transmet le résultat à la fenêtre de l'admin (postMessage).
    const body =
      '<!doctype html><html><body><script>' +
      "(function(){" +
      "  function receive(e){" +
      "    window.opener.postMessage('authorization:github:" + status + ":' + JSON.stringify(content), e.origin);" +
      "    window.removeEventListener('message', receive, false);" +
      "  }" +
      "  window.addEventListener('message', receive, false);" +
      "  window.opener && window.opener.postMessage('authorizing:github', '*');" +
      "})();" +
      "</script><p>Connexion en cours…</p></body></html>";
    return { statusCode: 200, headers: { "Content-Type": "text/html" }, body };
  }

  try {
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await resp.json();
    if (data.error || !data.access_token) {
      return page("error", { message: data.error_description || "Échec de l'authentification." });
    }
    return page("success", { token: data.access_token, provider: "github" });
  } catch (e) {
    return page("error", { message: "Erreur réseau lors de l'authentification." });
  }
};
