const IPFS = require('ipfs')
const node = new IPFS()

let isReady = false

node.on('ready', () => {
    console.log('ipfs is ready')
    isReady = true
})
node.on('error', error => {
    console.error(error.message)
})


export function upload(data, name) {
    return new Promise((resolve, reject) => {
        if (!isReady) {
            return alert('IPFS is not ready yet')
        }

        // const files = [{
        //     path: name,
        //     content: data
        // }]

        node.files.add(Buffer.from(data, 'utf-8')).then((files) => {
            console.log('added files', files)
            return resolve(files[0])
        })
    })
}

export function getUrl(hash) {
    return 'https://cloudflare-ipfs.com/ipfs/' + hash
}

export default {
    upload,
    getUrl
}