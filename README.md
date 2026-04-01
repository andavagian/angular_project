# CMS Angular

This project uses Angular 21 and Firebase.

## Config File Structure

All project package and TypeScript config files are centralized in `config/`:

- `config/package.json`
- `config/tsconfig.json`
- `config/tsconfig.app.json`
- `config/tsconfig.spec.json`

Root `package.json` is a lightweight command proxy to keep standard `npm run` commands working from project root.

## Install Dependencies

Install dependencies in the centralized config folder:

```bash
npm --prefix ./config install
```

## Development server

Start the app from the project root:

```bash
npm start
```

Then open `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

## Direct Angular CLI Usage

You can still use Angular CLI through the proxy script:

```bash
npm run ng -- generate component my-component
```
# angular_project
