# Costa Verde Aïkido — Site web

Site du club **Costa Verde Aïkido** (Santa Maria Poggio, Corse).
Page d'accueil moderne, responsive, en HTML/CSS/JS statique — hébergée
gratuitement sur **GitHub Pages**, sans build ni serveur à maintenir.

**En ligne :** https://7yptbmvt8d-wq.github.io/costa-verde-aikido-web/

---

## 🗂️ Structure

```
├── index.html          ← Accueil (hero + Le dojo + aperçus)
├── histoire.html       ← Un peu d'histoire (la voie + lignée Ueshiba/Tamura)
├── aikitaiso.html      ← Aïkitaïso
├── horaires.html       ← Horaires
├── stages.html         ← Stages
├── galerie.html        ← Galerie
├── avis.html           ← Avis (+ note Google en direct)
├── contact.html        ← Contact & inscription
├── assets/
│   ├── site.css        ← styles du site
│   ├── site.js         ← menu mobile + section « Avis »
│   ├── reviews.css     ← styles du widget d'avis autonome
│   └── reviews.js      ← logique du widget d'avis autonome
│   └── gallery.js      ← logique du carrousel de la galerie
├── config.js           ← ⚙️ AVIS : tes avis + réglages Google (fichier partagé)
├── galerie-config.js   ← ⚙️ GALERIE : tes photos, classées par saison
├── avis/
│   └── index.html      ← widget d'avis SEUL (embarquable, ex. Google Sites)
├── .nojekyll
└── README.md
```

Le site (`index.html`) et le widget (`avis/`) **partagent le même `config.js`** :
tu ne saisis tes avis qu'une seule fois.

---

## 🎛️ Espace admin (photos & stages)

Un espace d'administration visuel (Decap CMS) est disponible sur **`/admin/`**
pour gérer **les stages** et **la galerie photos** sans toucher au code.

### Installation (une seule fois, côté Netlify)
1. Netlify → ton projet → **Identity** → **Enable Identity**.
2. Identity → **Registration** → mets **« Invite only »** (recommandé).
3. Identity → **Services** → **Git Gateway** → **Enable**.
4. Identity → **Invite users** → saisis ton adresse e-mail → tu reçois un mail,
   clique le lien et choisis ton mot de passe.

### Utilisation
- Va sur **`https://snazzy-mandazi-e838c7.netlify.app/admin/`**, connecte-toi.
- **Stages** : ajoute / modifie / supprime un stage (date, titre, description).
- **Galerie photos** : crée une saison, importe des photos et ajoute une légende.
- Clique **« Publier »** : le site se met à jour tout seul en ~1 min.

Les données sont stockées dans `data/stages.json` et `data/galerie.json`
(éditables aussi à la main au besoin). Le fichier `galerie-config.js` ne sert
plus que de repli pour l'aperçu local.

---

## ✏️ Modifier le contenu (sans être développeur)

### Les avis → `config.js`
Ajoute / modifie les témoignages dans `avisMisEnAvant`. Duplique un bloc :
```js
{
  nom: "Prénom N.",
  note: 5,                 // de 1 à 5
  date: "Avis Google",
  texte: "Le texte de l'avis..."
},
```
La **note Google** affichée en haut de la section (ex. « 4,8 · 4 avis ») est
récupérée **automatiquement** depuis la fiche Google (via `placeId` + clé API,
déjà configurés dans `config.js`).

### Les horaires, dates, textes → `index.html`
Cherche la section concernée (repères `<!-- HORAIRES -->`, `<!-- HERO -->`, …)
et modifie le texte directement.

### Les photos → `index.html`
Les zones hachurées sont des **placeholders**. Pour mettre une vraie image :
1. Dépose ta photo dans `assets/img/` (crée le dossier).
2. Dans `index.html`, remplace le bloc placeholder, par exemple :
   ```html
   <div class="cv-media" style="background-image:url('assets/img/hero.jpg')"></div>
   ```
   ou pour un portrait : `<img class="cv-portrait" src="assets/img/ueshiba.jpg" alt="Moriheï Ueshiba">`

### La galerie photos → `galerie-config.js`
La galerie est un **carrousel classé par saison sportive**. Ouvre
`galerie-config.js` :
- Chaque bloc `{ titre: "...", photos: [...] }` = **une saison** (un onglet).
  Mets la saison la plus récente en 1er.
- Pour ajouter une photo : dépose-la dans `assets/img/galerie/` puis ajoute
  ```js
  { src: "assets/img/galerie/ma-photo.jpg", legende: "Ce que montre la photo" },
  ```
- Une photo sans `src` s'affiche comme un emplacement (pour préparer une saison).

### Les réseaux sociaux → `index.html` (footer)
Remplace les `href="#"` des liens Facebook / Instagram / WhatsApp / YouTube
par les vraies adresses du club.

### Les boutons « S'inscrire » / « Cours d'essai »
Ils pointent vers la section contact (`#contact`). Pour les envoyer vers un
e-mail ou un formulaire, remplace `href="#contact"` par
`href="mailto:ton-adresse@exemple.fr"` ou l'URL du formulaire.

---

## 🎨 Charte graphique

| Élément | Valeur |
|---|---|
| Vert profond (marque) | `#0e3b36` |
| Or sable (accent) | `#e0b15e` |
| Crème (fond) | `#f6f4ef` |
| Titres | Bricolage Grotesque |
| Corps | Libre Franklin |
| Breakpoint mobile | 820px |

---

## 🚀 Publication

Le site se met à jour **tout seul** à chaque modification enregistrée sur la
branche publiée (GitHub Pages → *Settings → Pages*), en ~1 minute.

> 💡 **Anti-cache** : les fichiers CSS/JS sont versionnés (`?v=1`). Après une
> grosse mise à jour, incrémente ce numéro dans `index.html` pour forcer les
> navigateurs à recharger la dernière version.

---

## 🔌 Widget d'avis autonome (`/avis/`)

Si tu veux afficher **uniquement les avis** ailleurs (ex. une page Google Sites),
intègre cette adresse dans un cadre :
```
https://7yptbmvt8d-wq.github.io/costa-verde-aikido-web/avis/
```
Il utilise le même `config.js` que le site.
