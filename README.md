# test-adding-electron-to-create-nuxt-app

## Environment

| Module           | Version                |
| ---------------- | ---------------------- |
| Node.js          | ^14.17.1 (Node.js LTS) |
| Nuxt.js          | ^2.15.7                |
| Electron         | ^13.2.1                |
| electron-builder | ^22.11.7               |

## Build Setup

```bash
# install dependencies
$ yarn install

# serve "renderer" with hot reload inside Electron app
$ yarn dev

# serve "renderer" with hot reload at localhost:3000
$ yarn dev:renderer

# compile "main" directory TypeScript files
$ yarn dev:main

# build Electron app for production
$ yarn build
       build:all
       build:win
       build:mac
       build:linux

# generate "renderer" static project
$ yarn build:renderer

# compile "main" directory TypeScript files for production
$ yarn build:main

# command to build Electron app
$ yarn build:electron

# clean build directories
$ yarn clean
       clean:build
       clean:dist

# make a git commit (recommended)
$ yarn commit
```
