# React Chrome Extension Boilerplate

> A react boilerplate for building chrome extension.

## Mounted with

| Package    | Version  |
| ---------- | -------- |
| Webpack    | 5.x      |
| TypeScript | 4.x      |
| ESLint     | 8.x      |
| PostCSS    | 8.x      |
| Less       | 4.x      |
| Node SASS  | 8.x      |
| Stylelint  | 14.x     |

## How to use

1. Clone this repo.
2. Change project properties.
3. Run `npm install`.
4. Start by `npm start`.
5. Build by `npm run build`.

## Tips

For WSL users, here's a trick you can develop in a linux sub system with hot reload, and preview in windows host system `Chrome` application:

1. In WSL

    ```sh
    npm start -- --distPath="/mnt/d/react-chrome-extension-boilerplate-dist"
    ```

2. In chrome: Load unpack extension from `D:/react-chrome-extension-boilerplate-dist`
