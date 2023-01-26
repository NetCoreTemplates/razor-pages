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
const fs = require('fs')
const http = require('http')
const https = require('https')

Object.keys(files).forEach(dir => {
    const dirFiles = files[dir]
    Object.keys(dirFiles).forEach(name => {
        const url = dirFiles[name]
        const toFile = path.join(writeTo, dir, name)
        const toDir = path.dirname(toFile)
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, { recursive: true })
        }
        httpDownload(url, toFile, 5)
    })
})

function httpDownload(url, toFile, retries) {
    const client = url.startsWith('https') ? https : http
    const retry = (e) => {
        console.log(`get ${url} failed: ${e}${retries > 0 ? `, ${retries-1} retries remaining...` : ''}`)
        if (retries > 0) httpDownload(url, toFile, retries-1)
    }

    client.get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            let redirectTo = res.headers.location;
            if (redirectTo.startsWith('/'))
                redirectTo = new URL(res.headers.location, new URL(url).origin).href
            return httpDownload(redirectTo, toFile, retries)
        } else if (res.statusCode >= 400) {
            retry(`${res.statusCode} ${res.statusText || ''}`.trimEnd())
        }
        else {
            console.log(`writing ${url} to ${toFile}`)
            const file = fs.createWriteStream(toFile)
            res.pipe(file);
            file.on('finish', () => file.close())
        }
    }).on('error', retry)
}