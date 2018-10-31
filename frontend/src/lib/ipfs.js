const ipfsAPI = require('ipfs-api')
const node = ipfsAPI('localhost', '5001', {protocol: 'http'})


export function upload(data) {
    return new Promise((resolve, reject) => {
        node.files.add(Buffer.from(data)).then((files) => {
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