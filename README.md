HeartSync is a beautifully crafted app that generates personalized deep conversation prompts using AI. Simply describe your current situation — a late-night catch-up with an old friend, a first date at a cozy café, or a solo moment of self-reflection — and HeartSync creates 10 thoughtful questions designed to spark genuine connection.
✨ Features:
🎴 Elegant 3D card interface with flip animations
🤖 AI-generated prompts tailored to your context
🌏 Bilingual support (English & 中文)
💡 Each card includes conversation insights and pro-tips
🎨 Stunning glassmorphic design


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Gemini API key (Vite env var)

This app reads your Gemini API key from a Vite environment variable:

- `VITE_GEMINI_API_KEY`

Create a local env file (not committed):

```bash
cd heartsync-app
cp env.example .env
# then edit .env and paste your real key
```

Restart `npm run dev` after changing `.env`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
