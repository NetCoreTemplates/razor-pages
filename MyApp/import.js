// Usage: node import.js

const writeTo = './wwwroot/lib'
const files = {
  js: {
      'popper.js':               'https://cdn.jsdelivr.net/npm/@popperjs/core@2/dist/umd/popper.min.js',
      'bootstrap.mjs':           'https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.esm.min.js',
      'vue.mjs':                 'https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js',
      'servicestack-client.mjs': 'https://unpkg.com/@servicestack/client/dist/servicestack-client.mjs',
      'servicestack-vue.mjs':    'https://unpkg.com/@servicestack/vue@3/dist/servicestack-vue.mjs',
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

Object.keys(files).forEach(dir => {
    const dirFiles = files[dir]
    Object.keys(dirFiles).forEach(name => {
        const url = dirFiles[name]
        const toFile = path.join(writeTo, dir, name)
        const toDir = path.dirname(toFile)
        if (!fs.existsSync(toDir))
            fs.mkdirSync(toDir, { recursive: true });

        (async () => {
            for (let i=0; i<5; i++) {
                try {
                    let r = await fetch(url)
                    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
                    let txt = await r.text()
                    console.log(`writing ${url} to ${toFile} ...`)
                    fs.writeFileSync(toFile, txt)
                    return
                } catch (e) {
                    console.log(`fetching '${url}' failed: '${e}', retrying..`)
                }
            }
        })()
        
    })
})