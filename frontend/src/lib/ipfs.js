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


export function upload(data) {
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

export function extractHashFromUrl(url) {
    let hash = url.split('/')
    console.log('hash', hash)
    return url.split('/').pop()
}


export function download(hash) {
    return new Promise((resolve, reject) => {
        console.log('ipfs download hash', hash)
        node.files.get(hash, (err, files) => {
            if (err) throw new Error(err)
            files = files.map((file) => {
                console.log('downloaded ipfs', file)
                console.log(file.path)
                console.log(file.content.toString('utf8'))
                return {
                    ...file,
                    content: file.content
                }
            })
            return resolve(files)
        })
    })
}

export function getUrl(hash) {
    return 'https://cloudflare-ipfs.com/ipfs/' + hash
}

export default {
    upload,
    download,
    getUrl,
    extractHashFromUrl
}