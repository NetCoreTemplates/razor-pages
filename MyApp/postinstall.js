// Usage: npm install

const writeTo = './wwwroot/lib'
const files = {
  js: {
      'popper.js':                   'https://cdn.jsdelivr.net/npm/@popperjs/core@2/dist/umd/popper.min.js',
      'bootstrap.mjs':               'https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.esm.min.js',
      'vue.mjs':                     'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      'vue.min.mjs':                 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js',
      'servicestack-client.mjs':     'https://unpkg.com/@servicestack/client@2/dist/servicestack-client.mjs',
      'servicestack-client.min.mjs': 'https://unpkg.com/@servicestack/client@2/dist/servicestack-client.min.mjs',
      'servicestack-vue.mjs':        'https://unpkg.com/@servicestack/vue@3/dist/servicestack-vue.mjs',
      'servicestack-vue.min.mjs':    'https://unpkg.com/@servicestack/vue@3/dist/servicestack-vue.min.mjs',
  },
  css: {
      'bootstrap.css': 'https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css',
      'buttons.css':   'https://raw.githubusercontent.com/ServiceStack/ServiceStack/main/ServiceStack/src/ServiceStack/css/buttons.css',
      'svg-auth.css':  'https://raw.githubusercontent.com/ServiceStack/Assets/master/css/svg-auth.css',
  },
  typings: {
      '@servicestack/client/index.d.ts': 'https://unpkg.com/@servicestack/client/dist/index.d.ts',  
      '@servicestack/vue/index.d.ts': 'https://unpkg.com/@servicestack/vue@3/dist/index.d.ts',
  }
}

const path = require('path')
const fs = require('fs').promises
const http = require('http')
const https = require('https')

const requests = []
Object.keys(files).forEach(dir => {
    const dirFiles = files[dir]
    Object.keys(dirFiles).forEach(name => {
        let url = dirFiles[name]
        if (url.startsWith('/'))
            url = defaultPrefix + url
        const toFile = path.join(writeTo, dir, name)
        requests.push(fetchDownload(url, toFile, 5))
    })
})

;(async () => {
    await Promise.all(requests)
})()

async function fetchDownload(url, toFile, retries) {
    const toDir = path.dirname(toFile)
    await fs.mkdir(toDir, { recursive: true })
    for (let i=retries; i>=0; --i) {
        try {
            let r = await fetch(url)
            if (!r.ok) {
                throw new Error(`${r.status} ${r.statusText}`);
            }
            let txt = await r.text()
            console.log(`writing ${url} to ${toFile}`)
            await fs.writeFile(toFile, txt)
            return
        } catch (e) {
            console.log(`get ${url} failed: ${e}${i > 0 ? `, ${i} retries remaining...` : ''}`)
        }
    }
}