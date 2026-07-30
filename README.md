# Système d'avis — Costa Verde Aïkido

Un petit widget d'avis **autonome** à intégrer dans ton site **Google Sites**.
Il affiche tes **vrais avis Google** (fiche établissement) **+** des avis que
**toi** tu mets en avant, avec un **bouton « Laisser un avis »** qui renvoie
directement vers ta fiche Google.

> ⚡ **Le seul fichier à modifier est [`config.js`](config.js).**
> Tu n'as jamais besoin de toucher au reste.

---

## 🎯 Ce que ça fait

- Affiche une note moyenne, des cartes d'avis (nom, étoiles, texte, date).
- **Modération intégrée** : tu peux n'afficher que les avis ≥ 4★ et masquer
  certains auteurs (voir `config.js`).
- **Fonctionne tout de suite** même sans clé Google : il affiche alors les avis
  de la liste `avisMisEnAvant` (mode `"manuel"`).
- S'adapte au mobile et au thème clair/sombre.

---

## 🚀 Mise en route rapide (3 étapes)

### Étape 1 — Publier le widget sur le web (GitHub Pages, gratuit)

Ce dépôt est déjà prêt. Pour le mettre en ligne :

1. Va dans ce dépôt GitHub → onglet **Settings** (Paramètres).
2. Menu de gauche → **Pages**.
3. Section *Build and deployment* → **Source : Deploy from a branch**.
4. **Branch** : choisis la branche `main` (ou celle où sont ces fichiers),
   dossier `/ (root)` → **Save**.
5. Attends ~1 minute. GitHub affiche une adresse du type :
   `https://<ton-utilisateur>.github.io/costa-verde-aikido-web/`

👉 **Note bien cette adresse**, c'est l'URL de ton widget.

Tu peux déjà l'ouvrir : elle affiche les 3 avis d'exemple. On va maintenant
la connecter à Google, puis l'intégrer dans Google Sites.

---

### Étape 2 — Trouver l'identifiant de ta fiche Google (Place ID)

Il te faut une **fiche établissement Google** (Google Business Profile) pour
ton dojo. Si tu n'en as pas encore, crée-la gratuitement sur
<https://www.google.com/business/>.

Pour récupérer le **Place ID** :

1. Ouvre l'outil officiel : <https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder>
2. Cherche le nom de ton dojo dans la barre de recherche.
3. Clique sur le repère : une bulle affiche `Place ID: ChIJ....`
4. Copie cette valeur (elle commence en général par `ChIJ`).

Colle-la dans `config.js` → champ **`placeId`**.

---

### Étape 3 — Créer une clé API Google (gratuit, quota largement suffisant)

1. Va sur la **Google Cloud Console** : <https://console.cloud.google.com/>
2. Crée un projet (ex. « Site Aïkido ») si tu n'en as pas.
3. Menu → **APIs & Services → Library**. Cherche et **active** :
   - **Places API (New)**
   *(la facturation doit être activée sur le projet, mais Google offre un
   crédit mensuel gratuit très largement suffisant pour un site associatif).*
4. Menu → **APIs & Services → Credentials → Create credentials → API key**.
5. Copie la clé, puis **restreins-la** (important pour la sécurité) :
   - Clique sur la clé → **Application restrictions** → **Websites**.
   - Ajoute ton domaine GitHub Pages, par ex. :
     `https://<ton-utilisateur>.github.io/*`
   - **API restrictions** → *Restrict key* → coche **Places API (New)**.
   - **Save**.

Colle la clé dans `config.js` → champ **`cleApiGoogle`**.

Enfin, dans `config.js`, mets **`mode: "hybride"`** (ou `"google"` si tu ne
veux QUE les avis Google).

> 💡 Après avoir modifié `config.js`, enregistre le fichier (commit) : GitHub
> Pages se met à jour tout seul en ~1 minute.

---

## 🧩 Intégrer dans Google Sites

1. Ouvre ta page Google Sites en édition.
2. À l'endroit voulu : menu de droite → **Insérer → Intégrer**.
3. Onglet **Par URL** → colle l'adresse de ton widget
   (`https://<ton-utilisateur>.github.io/costa-verde-aikido-web/`).
   *(Si « Par URL » n'affiche qu'une vignette, utilise plutôt l'onglet
   **Code d'intégration** et colle :*
   ```html
   <iframe src="https://<ton-utilisateur>.github.io/costa-verde-aikido-web/"
           style="width:100%; height:900px; border:0;"
           loading="lazy" title="Avis"></iframe>
   ```
   *)*
4. Clique **Insérer**, puis **redimensionne le cadre** en hauteur pour que
   tous les avis soient visibles (Google Sites ne s'ajuste pas tout seul).
5. **Publier** ton site Google Sites.

C'est fait ! 🎉

---

## ⚙️ Personnalisation (dans `config.js`)

| Réglage | À quoi ça sert |
|---|---|
| `titre`, `sousTitre` | Textes affichés en haut du widget |
| `mode` | `"hybride"` (Google + tes avis), `"google"` (Google seul), `"manuel"` (tes avis seuls, sans clé API) |
| `noteMinimale` | N'affiche les avis Google qu'à partir de cette note (ex. `4`) |
| `auteursMasques` | Liste de noms d'auteurs Google à ne jamais afficher |
| `avisMisEnAvant` | Tes avis validés, affichés en premier (mode hybride) ou seuls (mode manuel) |
| `lienLaisserUnAvis` | Optionnel : forcer l'URL du bouton (sinon généré depuis le `placeId`) |

---

## ❓ Questions fréquentes

**« Je ne veux pas créer de clé API pour l'instant. »**
Mets `mode: "manuel"` dans `config.js` et remplis `avisMisEnAvant`. Le widget
fonctionne immédiatement, sans Google. Tu pourras passer en `"hybride"` plus tard.

**« Combien d'avis Google s'affichent ? »**
L'API Google renvoie **jusqu'à 5 avis** (limite de Google, pas du widget).
C'est pour ça que le mode `"hybride"` est utile : tes avis mis en avant
complètent ceux de Google.

**« Puis-je choisir quels avis Google s'affichent ? »**
Pas individuellement (Google ne le permet pas via l'API), mais tu peux filtrer
par note (`noteMinimale`) et masquer des auteurs (`auteursMasques`).

**« Le widget est coupé dans Google Sites. »**
Agrandis la hauteur du cadre d'intégration dans l'éditeur Google Sites
(poignée du bas), ou augmente la valeur `height` de l'iframe.

---

## 📂 Structure du projet

```
├── index.html          ← page du widget (ne pas modifier)
├── config.js           ← ⚙️ TES réglages (le seul fichier à éditer)
├── assets/
│   ├── reviews.css     ← style (ne pas modifier)
│   └── reviews.js      ← logique (ne pas modifier)
├── .nojekyll           ← pour GitHub Pages
└── README.md           ← ce guide
```
