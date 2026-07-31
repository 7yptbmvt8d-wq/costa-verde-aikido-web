# Costa Verde Aïkido — Site web

Site du club **Costa Verde Aïkido** (Santa Maria Poggio, Corse).
Page d'accueil moderne, responsive, en HTML/CSS/JS statique — hébergée
gratuitement sur **GitHub Pages**, sans build ni serveur à maintenir.

**En ligne :** https://7yptbmvt8d-wq.github.io/costa-verde-aikido-web/

---

## 🗂️ Structure

```
├── index.html          ← la page d'accueil (le site)
├── assets/
│   ├── site.css        ← styles du site
│   ├── site.js         ← menu mobile + section « Avis »
│   ├── reviews.css     ← styles du widget d'avis autonome
│   └── reviews.js      ← logique du widget d'avis autonome
├── config.js           ← ⚙️ AVIS : tes avis + réglages Google (fichier partagé)
├── avis/
│   └── index.html      ← widget d'avis SEUL (embarquable, ex. Google Sites)
├── .nojekyll
└── README.md
```

Le site (`index.html`) et le widget (`avis/`) **partagent le même `config.js`** :
tu ne saisis tes avis qu'une seule fois.

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
