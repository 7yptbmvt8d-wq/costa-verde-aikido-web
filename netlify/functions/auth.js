// OAuth GitHub — étape 1 : redirige l'utilisateur vers la page d'autorisation GitHub.
// Utilisé par l'espace admin (Decap CMS). Aucune dépendance (fetch natif Node 18+).
exports.handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: "OAUTH_CLIENT_ID manquant (variable d'environnement Netlify)." };
  }
  const host = event.headers.host;
  const redirectUri = `https://${host}/.netlify/functions/callback`;
  const authorizeUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&scope=repo` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return { statusCode: 302, headers: { Location: authorizeUrl }, body: "" };
};
