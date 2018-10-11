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

        const files = [{
            path: name,
            content: data
        }]

        node.files.add(files).then((err, files) => {
            console.log('added files', err, files)
            if (err) return reject(err)
            return resolve(files)
        })
    })
}

export default {
    upload
}