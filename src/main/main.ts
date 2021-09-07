// courtesy of https://github.com/282Haniwa/nuxt-electron-example/blob/master/src/main/index.ts

import { pathToFileURL } from 'url'
import { get, createServer } from 'http'
import path from 'path'
import { app, BrowserWindow, crashReporter } from 'electron'
// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
import { AddressInfo } from 'node:net'
import { IncomingMessage } from 'node:http'
import nuxtConfig from '../renderer/nuxt.config'

nuxtConfig.rootDir = path.resolve('src/renderer')

const isDev = nuxtConfig.dev
const nuxt = new Nuxt(nuxtConfig)
const builder = new Builder(nuxt)
const server = createServer(nuxt.render)

let _NUXT_URL_ = ''

if (isDev) {
  /* eslint-disable no-console */
  builder.build().catch((error: any) => {
    console.error(error)
    process.exit(1)
  })
  server.listen()
  const { port } = server.address() as AddressInfo
  _NUXT_URL_ = `http://localhost:${port}`
  console.log(`Nuxt working on ${_NUXT_URL_}`)
  /* eslint-enable */
} else {
  _NUXT_URL_ = pathToFileURL(
    path.resolve(__dirname, '../../dist/nuxt-build/index.html')
  ).href
}

function pollServer(): void {
  get(_NUXT_URL_, (res: IncomingMessage) => {
    if (res.statusCode !== 200) {
      // eslint-disable-next-line no-console
      console.log('restart pollServer')
      setTimeout(pollServer, 300)
    }
  }).on('error', pollServer)
}

async function createWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev,
    },
  })
  if (isDev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    /* eslint-disable no-console */
    try {
      const name = await installExtension(VUEJS_DEVTOOLS.id)
      console.log(`Added Extension: ${name}`)
    } catch (error: any) {
      console.error(`An error occurred: ${error}`)
    }
    /* eslint-enable */
    pollServer()
  }
  await window.loadURL(_NUXT_URL_)
  if (isDev) window.webContents.openDevTools()
}

crashReporter.start({
  uploadToServer: false,
})

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
