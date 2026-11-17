# Les Centimes du Cœur

Site de l'association Les Centimes du Cœur, consacré à la solidarité et à l'entraide. Il présente ses actions auprès des nouveau-nés et des familles, contre la précarité, pour l'éducation et le lien social, en France et en Afrique. Il permet aussi de rejoindre l'association, de consulter son espace personnel et, pour les administrateurs, de gérer les comptes et de consulter les dons enregistrés.

Ce dépôt contient une application Next.js créée avec `create-next-app`. Le présent document décrit le code disponible dans le dépôt : il ne constitue pas un inventaire de la configuration réelle des services externes ni du schéma complet de la base de données.

## Technologies

Les versions de référence et les scripts sont définis dans [`package.json`](./package.json) ; le fichier [`package-lock.json`](./package-lock.json) verrouille les dépendances installées.

| Technologie | Utilisation dans le projet |
| --- | --- |
| Next.js 16 et React 19 | App Router, rendu des pages, routes API et navigation. |
| TypeScript | Pages, composants et logique côté serveur. |
| Tailwind CSS 4 | Styles utilitaires et configuration globale dans [`app/globals.css`](./app/globals.css). |
| Neon PostgreSQL | Stockage des profils, rôles et dons ; requêtes avec `@neondatabase/serverless`. |
| Better Auth | Authentification par email et mot de passe, vérification des emails, sessions et réinitialisation du mot de passe. |
| Kysely et `pg` | Adaptateur PostgreSQL et pool utilisés par Better Auth. |
| Resend | Envoi des emails de vérification et de réinitialisation. |
| Motion et Lucide React | Animations et icônes de l'interface. |
| ESLint | Vérification statique du code. |
| Vercel | Plateforme de déploiement possible ; sa configuration effective dépend du projet Vercel et n'est pas décrite dans le dépôt. |

[`app/layout.tsx`](./app/layout.tsx) définit les métadonnées et charge les polices Geist avec `next/font`. Des images sont locales dans `public/`, tandis que plusieurs visuels et l'icône du site sont hébergés sur Cloudinary.

## Organisation du projet

```text
app/
  page.tsx                        Accueil public
  layout.tsx, globals.css        Structure et styles globaux
  components/                     Sections de l'accueil
  inscription/                    Formulaire et page de confirmation
  connexion/                      Connexion
  mot-de-passe-oublie/            Demande de réinitialisation
  reinitialiser-mot-de-passe/     Saisie du nouveau mot de passe
  espace-personnel/               Profil, rôles, dons et déconnexion
  admin/                          Tableau de bord et pages de gestion
  api/
    auth/[...all]/                Routes Better Auth
    inscription/                  Création du profil
    admin/utilisateurs/[id]/      Modification des rôles et du statut
lib/
  auth.ts                         Configuration serveur Better Auth et Resend
  auth_clients.ts                 Client Better Auth pour le navigateur
  db.ts                           Client SQL Neon côté serveur
  admin.ts                        Fonction serveur de recherche d'un administrateur
  phone.ts                        Validation du numéro de téléphone
public/                           Images et fichiers statiques
```

Les pages `page.tsx` correspondent aux routes de l'App Router ; les fichiers `route.ts` exposent des endpoints HTTP. Les pages qui accèdent à la session ou à la base interrogent les services côté serveur ; les formulaires interactifs utilisent des composants clients et des requêtes HTTP.

## Pages et fonctionnalités

### Site public

[`app/page.tsx`](./app/page.tsx) assemble l'en-tête, les sections « hero », mission, actions, international, don et adhésion, puis le pied de page. Leur contenu et leurs styles se trouvent dans [`app/components/`](./app/components/).

- La navigation utilise des ancres vers les sections de l'accueil. L'en-tête utilise la session Better Auth côté client pour afficher un lien vers l'espace personnel lorsque l'utilisateur est connecté.
- « Nous rejoindre » ouvre le formulaire d'inscription.
- Dans la section don, « Faire un don » ouvre `https://lescentimesducoeur.fr/#don` dans un nouvel onglet. Le code de ce dépôt ne met pas en œuvre de paiement ni d'enregistrement automatique du don.
- Le pied de page affiche les coordonnées et les liens sociaux.
- `/contact` présente un formulaire de contact en préparation, accessible depuis le pied de page. Son bouton d'envoi est désactivé : aucun message n'est enregistré ni transmis par ce formulaire. La politique de confidentialité et une protection partagée contre les abus restent à définir avant toute activation de l'envoi.

### Inscription et connexion

1. `/inscription` recueille prénom, nom, email, téléphone facultatif, mot de passe et confirmation, ainsi qu'un profil `adherent`, `partenaire` ou `donateur`. Le rôle administrateur n'est pas proposé à l'inscription publique.
2. `POST /api/inscription` valide les données, dont le téléphone s'il est renseigné, vérifie l'absence de profil avec le même email et appelle Better Auth pour créer le compte. Il insère ensuite le profil et le rôle dans une transaction Neon et marque le profil comme complété. La création Better Auth précède cette transaction : elles ne constituent pas une transaction unique.
3. La page `/inscription/succes` invite à vérifier l'email. Better Auth est configuré pour demander un email de confirmation à l'inscription et lors d'une connexion avec une adresse non vérifiée. Le succès affiché ne garantit pas la livraison effective du message.
4. `/connexion` utilise le client Better Auth pour se connecter, puis ouvre `/espace-personnel`. L'email doit être vérifié avant l'ouverture d'une session.
5. `/mot-de-passe-oublie` demande un lien de réinitialisation ; `/reinitialiser-mot-de-passe` utilise le jeton reçu pour choisir un nouveau mot de passe. La réponse générique du formulaire de demande ne confirme ni l'existence d'un compte ni la livraison du message.

### Espace personnel

[`app/espace-personnel/page.tsx`](./app/espace-personnel/page.tsx) récupère la session à partir des en-têtes de la requête. Sans session, l'utilisateur est redirigé vers la connexion. Le profil est recherché via `auth_user_id` et doit être actif et complété ; sinon une page « Profil en attente » est affichée.

La page lit les rôles associés au profil et les 20 derniers dons dont `payment_status` vaut `completed`. Elle affiche les informations personnelles, le téléphone s'il existe, les rôles et l'historique des dons. Un lien vers `/admin` est affiché si le rôle `admin` est présent. La déconnexion est assurée par [`logout-button.tsx`](./app/espace-personnel/logout-button.tsx).

### Administration

Les pages sous `/admin` vérifient côté serveur la session et recherchent un profil administrateur actif et complété. L'accès à la page d'accueil de l'administration affiche un message de restriction si le contrôle échoue ; les autres pages administrateur redirigent les utilisateurs non autorisés vers l'espace personnel.

| Page | Données et fonctionnement |
| --- | --- |
| `/admin` | Compte les utilisateurs distincts par rôle `adherent`, `partenaire` et `donateur` ; additionne les dons `completed` en euros. |
| `/admin/utilisateurs` | Liste au maximum 100 profils, triés par date d'inscription, avec recherche sur le nom, le prénom ou l'email et filtre par rôle. |
| `/admin/utilisateurs/[id]` | Vérifie le format UUID, lit le profil et ses rôles, puis propose les éditeurs de rôles et de statut. |
| `/admin/adherents`, `/admin/partenaires`, `/admin/donateurs` | Listent les profils correspondant au rôle concerné et renvoient à leur fiche utilisateur. Un même profil peut avoir plusieurs rôles. |
| `/admin/dons` | Affiche jusqu'à 200 dons, avec les informations du profil associé lorsqu'il existe ; calcule les totaux et nombres de dons confirmés par devise. |

Les éditeurs de la fiche utilisateur appellent les routes `PATCH /api/admin/utilisateurs/[id]/roles` et `PATCH /api/admin/utilisateurs/[id]/status`. Elles vérifient notamment l'origine, la session, les droits administrateur, l'UUID et les données reçues. Le changement de droits administrateur nécessite une confirmation ; un administrateur ne peut pas retirer ses propres droits ni modifier son propre statut. La route des rôles appelle la fonction PostgreSQL `public.update_user_roles` ; le code indique qu'elle effectue la modification de manière atomique et protège le dernier administrateur, mais sa définition n'est pas présente dans le dépôt. La désactivation d'un compte supprime ses sessions dans `auth.session` ; un contrôle à la création d'une session refuse également un profil explicitement inactif.

## Base de données

[`lib/db.ts`](./lib/db.ts) crée le client Neon à partir de `DATABASE_URL`. Better Auth utilise la même variable via un pool PostgreSQL configuré dans [`lib/auth.ts`](./lib/auth.ts), avec le schéma `auth`. Les requêtes applicatives utilisent des paramètres SQL plutôt que la concaténation des valeurs saisies.

Les relations suivantes sont **celles observables dans le code**, et non une description exhaustive des contraintes ou des tables de la base :

| Élément | Rôle observable |
| --- | --- |
| `public.users` | Profil applicatif : identifiant, lien `auth_user_id`, nom, email, téléphone, coordonnées, statut, date et indicateur `profile_completed`, selon les colonnes utilisées par les pages. |
| `public.user_roles` | Associe `user_id` à un rôle ; permet plusieurs rôles par profil. Les rôles utilisés sont `adherent`, `partenaire`, `donateur` et `admin`. |
| `public.donations` | Dons consultés avec montant, devise, statut de paiement, date et éventuel `user_id`, relié aux profils dans les requêtes. |
| Schéma `auth` | Better Auth y gère ses données d'authentification ; le code utilise explicitement `auth.session` pour supprimer les sessions d'un compte désactivé. |
| `public.update_user_roles(...)` | Fonction appelée par la route de modification des rôles. Sa définition et ses éventuelles dépendances doivent être disponibles en base. |

Le rôle `partenaire` est associé à un utilisateur dans le code actuel. Aucune table d'organisations ni relation entre organisations n'est définie ou utilisée dans les fichiers du dépôt : il ne faut donc pas en déduire le modèle. Aucun fichier de création du schéma, migration ou jeu de données initial n'est fourni. Une base vide ne peut pas être reconstituée à partir de ce dépôt seul : obtenir et vérifier séparément le schéma, les contraintes, la fonction SQL et le schéma Better Auth avant une nouvelle installation ou une migration. La création initiale d'un administrateur n'est pas décrite par le code.

## Configuration et exécution locale

### Prérequis

- Node.js compatible avec les dépendances du projet et npm. Pour les tests avec la version de Vite installée, utiliser Node.js 20.19+ ou 22.12+ (ou une version ultérieure compatible).
- Une base PostgreSQL Neon existante contenant les éléments attendus ci-dessus.
- Un compte Resend et une clé API pour les emails.

Installez les dépendances et préparez un fichier `.env.local` à la racine, sans le committer :

```bash
npm ci
```

```dotenv
DATABASE_URL=<url-postgresql-neon>
RESEND_API_KEY=<cle-api-resend>
```

Ces deux variables sont lues explicitement par le code serveur. Ne mettez jamais de vraies clés dans le README ou dans un fichier versionné ; `.env*` est ignoré par Git. Better Auth nécessite également une configuration adaptée de son secret et de l'URL de l'application selon l'environnement : consulter sa [documentation de configuration](https://www.better-auth.com/docs/installation) et définir des valeurs propres à chaque environnement, sans les exposer au navigateur. Les valeurs et la configuration effective des services ne sont pas incluses dans ce dépôt.

**Emails :** les deux expéditeurs sont actuellement codés en dur dans `lib/auth.ts` avec `onboarding@resend.dev`. Cette adresse Resend est destinée aux tests et ne permet pas l'envoi normal à tous les destinataires. Pour un usage réel, vérifier un domaine auprès de Resend et adapter l'adresse d'expédition dans le code. Contrôler également les journaux côté serveur et le tableau de bord Resend ; l'affichage d'une page de confirmation ne prouve pas qu'un email a été livré.

### Commandes

```bash
npm run dev       # serveur de développement
npm run lint      # analyse ESLint
npm test          # tests unitaires avec Vitest
npm run build     # construction de production
npm run start     # serveur de production après build
```

Ouvrir [http://localhost:3000](http://localhost:3000). Les modifications de `app/page.tsx` et des autres fichiers sont prises en compte par le serveur de développement. Le README initial mentionnait aussi `yarn dev`, `pnpm dev` et `bun dev` ; npm et son fichier de verrouillage sont présents dans le dépôt.

Les tests dans `tests/` couvrent certains cas de validation du téléphone, d'inscription et de modification des rôles et statuts administrateur. Les accès Neon et Better Auth y sont simulés : ils n'utilisent ni base réelle ni envoi d'email. Ces tests ne remplacent pas des tests d'intégration ni un audit de sécurité ; en particulier, ils ne vérifient pas l'exécution réelle de `public.update_user_roles`.

Certaines vérifications peuvent nécessiter les variables d'environnement, les services externes et une base correctement initialisée. Les pages administrateur `adherents`, `donateurs` et `partenaires` contiennent actuellement des apostrophes signalées par la règle ESLint `react/no-unescaped-entities` ; en tenir compte lors du diagnostic du lint ou du build.

## GitHub et déploiement Vercel

Le dépôt est hébergé sur GitHub : [Samir3200/les-centimes-du-coeur](https://github.com/Samir3200/les-centimes-du-coeur). Le code source et ses dépendances sont versionnés ; les variables d'environnement et la configuration locale Vercel ne le sont pas.

Pour déployer sur [Vercel](https://vercel.com/new), importer le dépôt, configurer les variables et la branche de production dans le projet Vercel, puis vérifier les journaux et l'état du déploiement. Si l'intégration Git est activée, les pushes peuvent déclencher des déploiements selon la configuration de branches et d'environnements du projet. Le dépôt seul ne permet pas de confirmer que cette intégration est active, quelle branche est publiée ou qu'un déploiement a réussi. Voir la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

Avant une mise en production, vérifier en particulier la disponibilité de la base, la configuration et la livraison des emails, les URLs d'authentification, les variables propres à l'environnement et les droits des comptes administrateur.

## Pistes d'évolution

Les éléments ci-dessous sont des objectifs envisagés, **pas des fonctionnalités implémentées** dans ce dépôt :

- Intégrer Stripe pour les paiements et définir comment les dons confirmés seraient enregistrés.
- Importer les dons provenant d'autres sources, avec contrôle des doublons et rapprochement des profils.
- Ajouter des statistiques par ville à partir de données fiables et adaptées à cet usage.
- Préparer le remplacement du site actuel, notamment la transition du lien externe de don et la reprise éventuelle des données.

## Ressources

- [Documentation Next.js](https://nextjs.org/docs) et [cours Next.js](https://nextjs.org/learn).
- [Dépôt GitHub Next.js](https://github.com/vercel/next.js).
- [Documentation Better Auth](https://www.better-auth.com/docs).
- [Documentation Neon](https://neon.com/docs) et [documentation Resend](https://resend.com/docs).
