# Cabinet Nzeba — site public

Site vitrine du Cabinet Nzeba, conforme à la charte graphique (édition 2026).
HTML, CSS et JavaScript natifs, sans dépendance ni étape de compilation : le dossier
se met en ligne tel quel.

---

## 1. Contenu du dossier

```
site/
├── index.html               Accueil
├── cabinet.html             Le cabinet — positionnement, principes, direction, limites
├── domaines.html            Cinq domaines d’intervention, livrables et cadre
├── methode.html             Déroulé en cinq temps, cadre déontologique, délais
├── modalites.html           Formes d’intervention, honoraires, questions fréquentes
├── contact.html             Formulaire de prise de contact et coordonnées
├── mentions-legales.html
├── confidentialite.html
├── 404.html
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── _redirects               Netlify — URL sans extension et page 404
├── netlify.toml             Netlify — en-têtes de sécurité et cache
└── assets/
    ├── css/nzeba.css        Feuille de style unique, commentée
    ├── js/nzeba.js          Comportements (en-tête, menu, apparitions, formulaire)
    └── img/                 Logotypes et monogrammes, positifs et négatifs
```

---

## 2. Ce qui reste à renseigner avant la mise en ligne

Les valeurs ci-dessous sont des **espaces réservés**. Elles apparaissent dans plusieurs
fichiers ; un remplacement global suffit.

| À remplacer | Valeur actuelle | Où |
|---|---|---|
| Téléphone | `+243 000 000 000` et `tel:+243000000000` | toutes les pages, `sitemap` non concerné |
| Adresse électronique | `contact@cabinetnzeba.com` | toutes les pages |
| Domaine | `https://www.cabinetnzeba.com` | balises `canonical`, `og:url`, `robots.txt`, `sitemap.xml` |
| Forme juridique, RCCM, identification nationale, adresse du siège | `[à compléter]` | `mentions-legales.html` |
| Hébergeur | `[nom de l’hébergeur]` | `mentions-legales.html` |
| Portrait de la direction | placeholder rayé, `.portrait` | `cabinet.html` |

Les délais annoncés (48 h, 5 j, 8 j, 15 j) et les repères de fonctionnement sont des
engagements affichés : vérifiez qu’ils correspondent à la pratique du cabinet avant
publication.

---

## 3. Consultation en local

Ouvrir `index.html` directement dans un navigateur fonctionne, mais un petit serveur
évite les restrictions du protocole `file://` :

```bash
npx --yes http-server site -p 4173 -c-1
```

Puis `http://localhost:4173`.

---

## 4. Mise en ligne

### Netlify (recommandé — `_redirects` et `netlify.toml` sont déjà en place)

1. Déposer le dossier `site/` sur Netlify, ou connecter le dépôt en indiquant
   `site` comme répertoire de publication.
2. Rattacher le domaine, activer le certificat HTTPS.
3. `netlify.toml` applique HSTS, `X-Frame-Options`, une politique de sécurité du
   contenu et le cache long sur `/assets/`.

### Tout autre hébergement statique

Copier le contenu de `site/` à la racine du domaine. `_redirects` et `netlify.toml`
sont propres à Netlify : sur un autre hébergeur, reporter les en-têtes de sécurité
dans la configuration du serveur.

---

## 5. Formulaire de contact

Par défaut, le formulaire **ne dépend d’aucun service tiers**. À la validation, il
compose la demande et ouvre la messagerie du visiteur avec le message déjà rédigé.
Le site fonctionne donc immédiatement, où qu’il soit hébergé.

Pour recevoir les demandes directement dans une boîte de réception, choisissez un
point de collecte :

### Netlify Forms

Dans `contact.html`, sur la balise `<form>` :

```html
<form class="formulaire" data-formulaire data-collecte
      name="contact" method="POST" data-netlify="true"
      netlify-honeypot="societe-bis" novalidate>
```

L’attribut `data-collecte` indique au script de laisser l’envoi suivre son cours.
Le champ `societe-bis` sert déjà de piège à robots.

### Formspree ou équivalent

```html
<form class="formulaire" data-formulaire data-collecte
      action="https://formspree.io/f/VOTRE_ID" method="POST" novalidate>
```

Dans les deux cas, la validation côté client reste active et le bloc de confirmation
cesse d’être utilisé — prévoyez une page de remerciement côté service.

---

## 6. Conformité à la charte

- **Couleurs** : noir profond `#1A1918`, grège `#D5D4D0`, ivoire `#EDEAE3`,
  bronze `#8A6D4B`. Les proportions d’usage de la charte sont respectées : le grège
  porte les pages, le noir intervient sur les bandeaux, le bronze reste un accent rare.
- **Typographies** : Italiana (titres, capitales espacées), Cormorant Garamond
  (phrases d’introduction), Jost (texte courant et libellés).
- **Ton** : factuel, courtois, concis. Aucun superlatif, aucun point d’exclamation,
  aucune référence client.
- **Deux déclinaisons de lisibilité** ont été ajoutées à la palette — un gris et un
  bronze assombris pour les corps de 11 à 13 px, plus un bronze éclairci pour les
  fonds sombres. Elles ne servent qu’au petit texte ; filets, numéros et éléments
  graphiques emploient le bronze de la charte tel quel. Sans elles, les libellés en
  capitales de 11 px n’atteignaient pas le seuil de contraste AA.

---

## 7. Vérifications effectuées

- Aucun débordement horizontal de 320 px à 1600 px, sur les neuf pages.
- Contraste conforme au niveau AA sur l’ensemble des textes, sections sombres comprises.
- Une seule balise `h1` par page, aucune image sans attribut `alt`, aucune ancre morte,
  aucun lien interne cassé.
- Formulaire : validation bloquante, messages d’erreur reliés aux champs, composition
  du message, retour arrière.
- Menu mobile : ouverture, fermeture par la touche Échap, piège de focus, `inert` sur
  le contenu masqué.
- Repli sans JavaScript : en-tête opaque, contenus révélés, formulaire soumis nativement.
- `prefers-reduced-motion` respecté ; feuille d’impression fournie.

---

## 8. Entretien

Les fichiers HTML partagent le même en-tête, le même menu et le même pied de page.
Une modification de la navigation ou des coordonnées doit être reportée dans les
neuf pages. En cas de changement fréquent, il est plus sûr de passer à un générateur
de site statique — la structure actuelle s’y transpose sans réécriture du style.

Les liens vers `assets/css/nzeba.css` et `assets/js/nzeba.js` portent un paramètre
`?v=5`. Incrémentez-le après toute modification de ces deux fichiers pour forcer le
rafraîchissement chez les visiteurs.
