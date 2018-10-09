const IPFS = require('ipfs')
const node = new IPFS()

let isReady = false

node.on('ready', () => {
    console.log('ipfs is ready')
    isReady = true
})


export const upload = () => {

    if (!isReady) {
        alert('IPFS is not ready yet')
    }

    const stream = node.files.addReadableStream()
    stream.on('data', function (file) {
        console.log('stream data hook called', file)
    })

    stream.write({
        path: '/tmp/hello',
        content: 'what up?'
    })

    stream.end()
}


export default {
    upload
}