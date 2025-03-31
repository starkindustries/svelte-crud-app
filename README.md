# Notes App

A simple, elegant notes application built with SvelteKit.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Firebase Setup

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
npx firebase login
```

3. Deploy to Firebase:
```bash
npx firebase deploy
```

## Features

- Real-time note saving
- Dark theme
- Floating action button for adding notes
- Responsive design
- Local storage persistence

## Development

Once you've created a project and installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
