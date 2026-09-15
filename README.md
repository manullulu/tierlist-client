# TierList - Front React (tierlist-client)

Interface du projet **TierList** : créer, partager, voter et commenter des classements de jeux vidéo.
Stack : React 19, Vite, React Router, Axios, dnd-kit. CSS pur, sans framework.

L'API est dans le repo `tierlist-server`.

**Démo :** https://tierlist-client.vercel.app (déployé automatiquement à chaque push sur `main`)

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Variable d'environnement :

| Variable        | Description                                      |
|-----------------|--------------------------------------------------|
| `VITE_API_URL`  | URL de l'API Express (`http://localhost:5005`)   |

## Fonctionnalités

- Inscription, connexion, déconnexion (token JWT stocké dans `localStorage`)
- Page d'accueil : tier lists publiques, recherche par titre, tri récentes / populaires
- Page de détail : le tableau S → F, votes 👍 / 👎, commentaires
- Création d'une tier list avec ses rangs personnalisables (nom + couleur)
- Éditeur : recherche de jeux via RAWG, ajout, **glisser-déposer** d'un jeu sur un rang
  (`@dnd-kit/core`), menu déroulant en solution de repli sur mobile, flèches pour l'ordre
  dans un rang, retrait
- Profil personnel : mes listes (publiques et privées), modification, suppression
- Profil public d'un utilisateur
- Page 404

## Routes

| Route                  | Page                          | Accès        |
|------------------------|-------------------------------|--------------|
| `/`                    | Accueil                       | public       |
| `/tierlists/:id`       | Détail d'une tier list        | public       |
| `/create`              | Créer une tier list           | connecté     |
| `/tierlists/:id/edit`  | Éditeur                       | propriétaire |
| `/profile`             | Mon profil                    | connecté     |
| `/users/:id`           | Profil public                 | public       |
| `/signup`, `/login`    | Authentification              | anonyme      |
| `*`                    | 404                           | public       |

## Structure

```
src/
├── api/          un fichier par ressource, chaque fonction fait un appel axios
├── components/   Navbar, TierRow, EditorTierRow, GameTile, TierListCard, GameCard, VoteButtons,
│                 CommentItem, IsPrivate, IsAnon
├── context/      auth.context.jsx : utilisateur connecté, token, login / logout
├── pages/        une page par route
├── App.jsx       les routes
├── main.jsx      point d'entrée
└── index.css     tous les styles
```

## Choix techniques

- **Glisser-déposer avec `@dnd-kit/core` seulement** : une tuile de jeu est `useDraggable`,
  chaque ligne de rang est `useDroppable`. Lâcher une tuile sur une ligne change son rang
  (même appel API que le menu déroulant). L'ordre dans une ligne se règle avec les flèches :
  on évite `@dnd-kit/sortable`, plus complexe, pour un gain visuel faible.
- **Poignée sur l'image** : les écouteurs de glissement sont posés sur l'image et le nom,
  pas sur la tuile entière, pour que le menu déroulant et les boutons restent cliquables.
- **Activation après 8 px** : un simple clic ne démarre pas de glissement.

## Évolutions possibles

- Tri par insertion entre deux jeux d'un même rang (`@dnd-kit/sortable`)
- Glisser-déposer au clavier
- Suivi entre utilisateurs, notifications
- Tier lists collaboratives

## Crédits

Données des jeux fournies par [RAWG](https://rawg.io).

## Licence

MIT
