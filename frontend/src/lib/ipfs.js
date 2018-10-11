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


export const upload = (fileStreamObject) => {

    return new Promise((resolve, reject) => {

        if (!isReady) {
            alert('IPFS is not ready yet')
        }

        const stream = node.files.addReadableStream({
            progress: (data) => {
                console.log('upload progress', data)
            }
        })
        stream.on('data', function (file) {
            console.log('stream data hook called', file)
            node.files.get(file.hash, (err, files) => {
                files = files.map((f) => {
                    return {
                        ...f,
                        utf8: new TextDecoder("utf-8").decode(f.content)
                    }
                })
                console.log(err, files)
                if (err) return reject(err)
                return resolve(files)
            });
        })

        stream.write({
            path: '/tmp1234',
            content: fileStreamObject
        })

        stream.end()

    })
}

export default {
    upload
}