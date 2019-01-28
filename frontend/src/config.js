import additionalConfig from './config-APP_TARGET.json'

// DEFAULT CONFIG: jungle2 testnet
let host = 'jungle2.cryptolions.io'
let protocol = 'https'
let port = 443
let ipfsDomain = 'demo.priveos.io'
let ipfsPort = 5002
let ipfsProtocol = 'https'
let brokerUrl = 'https://slantagnode3.priveos.io'
let chainId = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'

const environment = localStorage.getItem("environment")

// CONFIG SWITCH: localhost
if (/network=localhost/g.test(window.location.href) || (environment == "localhost")) {
    host = '127.0.0.1'
    protocol = 'http'
    ipfsDomain = 'localhost'
    ipfsPort = 5001
    ipfsProtocol = 'http'
    port = 8888
    brokerUrl = 'http://localhost:4000'
    chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
}


function get_endpoint() {
    return `${protocol}://${host}:${port}`
}

console.log(`Network config: ${get_endpoint()} (chainId: ${chainId})`)

export default {
    ipfs: {
        port: ipfsPort,
        host: ipfsDomain,
        protocol: ipfsProtocol,
        gateway: 'https://cloudflare-ipfs.com/ipfs/'
    },
    errorVisibility: 30000, // how long errors will be displayed before disappearing
    httpEndpoint: get_endpoint(),
    host,
    protocol,
    port,
    chainId,
    maxChunkLength: '1024',
    priveos: {
        dappContract: 'apriveosdemo',
        brokerUrl,
        chainId,
        httpEndpoint: get_endpoint(),
    }
}