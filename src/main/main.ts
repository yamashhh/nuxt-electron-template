// courtesy of https://github.com/282Haniwa/nuxt-electron-example/blob/master/src/main/index.ts

import { pathToFileURL } from 'url'
import { get, createServer } from 'http'
import path from 'path'
import { AddressInfo } from 'node:net'
import { IncomingMessage } from 'node:http'
import { app, BrowserWindow, crashReporter } from 'electron'
// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
import nuxtConfig from '../renderer/nuxt.config'

nuxtConfig.rootDir = path.resolve('src/renderer')

const isDev: boolean = nuxtConfig.dev as boolean
let _NUXT_URL_: string = ''

async function buildServer(): Promise<void> {
  const nuxt = new Nuxt(nuxtConfig)
  // https://blog.mamansoft.net/2019/12/29/nuxt-typescript-electron-sqlite-project2/
  // https://typescript.nuxtjs.org/guide/setup/#configuration
  await nuxt.ready()
  const builder = new Builder(nuxt)
  const server = createServer(nuxt.render)
  try {
    builder.build()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  }
  server.listen()
  const { port } = server.address() as AddressInfo
  _NUXT_URL_ = `http://localhost:${port}`
  // eslint-disable-next-line no-console
  console.log(`Nuxt working on ${_NUXT_URL_}`)

  // NOTE:
  // アプリ終了時にDevサーバーを終了
  // close()関数については以下参照
  // https://github.com/nuxt/nuxt.js/blob/0145578493a123ee0ff0e9adc4921582d456d366/packages/builder/src/builder.js#L775
  app.on('will-quit', () => {
    builder.close()
  })
}

if (isDev) {
  buildServer()
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
    try {
      const name = await installExtension(VUEJS_DEVTOOLS.id)
      // eslint-disable-next-line no-console
      console.log(`Added Extension: ${name}`)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(`An error occurred: ${error}`)
    }
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
