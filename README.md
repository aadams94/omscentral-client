# @omscentral/client

React app behind [omscentral.com](https://omscentral.com).

## Tech

- [create-react-app](https://github.com/facebook/create-react-app)
- [material-ui](https://material-ui.com/)
- [graphql](https://graphql.org/)
- [apollo](https://www.apollographql.com/)
- [firebase](https://firebase.google.com/)

## Getting Started

```sh
rm -rf node_modules
npm ci
npm run generate
```

## Environment Variables

Copy `.env.development`:

```
cp .env.development .env.development.local
```

Then, modify `.env.development.local` such that:

```sh
REACT_APP_API_URI="http://localhost:8080/graphql"
```

This requires `PORT=8080` to be specified in the `.env` for `@omscentral/server`.

Next, update the Firebase settings. This first requires creating a new project in the [Firebase console](console.firebase.google.com). Once the project is created, click "Add app" from the "Project Overview" page to add a new "Web" app to the project. Once the app is added, navigate to the "Settings" page, "General" tab, and look for "Firebase SDK snippet" > "Config". Copy the config settings to your `.env.development.local`.

## OAuth

In order to authenticate with OAUTH providers (Facebook, GitHub, Google, Twitter), additional configuration is required:

- [facebook](https://firebase.google.com/docs/auth/web/facebook-login)
- [github](https://firebase.google.com/docs/auth/web/github-auth)
- [google](https://firebase.google.com/docs/auth/web/google-signin)
- [twitter](https://firebase.google.com/docs/auth/web/twitter-login)

Note that Facebook blocks authentication if `location.protocol !== 'https'`. To force `https://localhost:3000`, add the following to your `.env.development.local`:

```
HTTPS=true
```

## Start

```sh
npm start
```

Starts server w/hot-reloading. Note: If the GraphQL schema changes, `npm run generate` must be run to re-generate the GraphQL TypeScript artifacts required by client code.

## Deployment

Static assets are hosted in Firebase.

### Manual

First authenticate w/firebase:

```sh
npm i -g firebase-tools
firebase login
```

Then, make sure your Firebase project is active:

```sh
firebase use <your_project_name>
```

Finally, build the static assets and deploy them to Firebase hosting:

```sh
npm run build:staging
firebase deploy --only hosting
```

Use `build:staging` to load environment variables from `.env.development`. Use `build:production` to load environment variables from `.env.production`.

### CI

For the live applications, GitHub Actions automate static asset compilation and deployment to Firebase. When code is merged into the `staging` branch, a new build is deployed to `omscentral-staging.firebaseapp.com`. When code is merged into `master` branch, a new build is deployed to `omscentral.com`.
