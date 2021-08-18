// courtesy of https://github.com/282Haniwa/nuxt-electron-example/blob/master/src/main/index.ts

import { pathToFileURL } from 'url'
import { app, BrowserWindow } from 'electron'
import nuxtConfig from '../renderer/nuxt.config'
const http = require('http')
const path = require('path')
const { Nuxt, Builder } = require('nuxt')

// @ts-ignore
nuxtConfig.rootDir = path.resolve('src/renderer')
// @ts-ignore
const isDev = nuxtConfig.dev

const nuxt = new Nuxt(nuxtConfig)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)

let _NUXT_URL_ = ''

if (isDev) {
  /* eslint-disable no-console */
  builder.build().catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
  server.listen()
  _NUXT_URL_ = `http://localhost:${server.address().port}`
  console.log(`Nuxt working on ${_NUXT_URL_}`)
  /* eslint-enable */
} else {
  _NUXT_URL_ = pathToFileURL(
    path.resolve(__dirname, '../../dist/nuxt-build/index.html')
  ).toString()
}

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      webSecurity: false,
    },
  })
  win.on('closed', () => (win = null))
  if (isDev) {
    /* eslint-disable no-console */
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id)
      .then((name: any) => {
        console.log(`Added Extension: ${name}`)
        if (win) win.webContents.openDevTools()
      })
      .catch((err: any) => console.log('An error occurred: ', err))
    const pollServer = () => {
      http
        .get(_NUXT_URL_, (res: any) => {
          if (res.statusCode === 200) {
            if (win) win.loadURL(_NUXT_URL_)
          } else {
            console.log('restart poolServer')
            setTimeout(pollServer, 300)
          }
        })
        .on('error', pollServer)
    }
    pollServer()
    /* eslint-enable */
  } else {
    return win.loadURL(_NUXT_URL_)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// NOTE:
// Dev環境のとき、
// アプリ終了時にDevサーバーを終了
// close()関数については以下参照
// https://github.com/nuxt/nuxt.js/blob/0145578493a123ee0ff0e9adc4921582d456d366/packages/builder/src/builder.js#L775
app.on('will-quit', () => {
  if (isDev) builder.close()
})
