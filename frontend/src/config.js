import devtools from './lib/devtools'
import additionalConfig from './config-APP_TARGET.json'

let localConfig = {}
if (localStorage && localStorage.config) {
    localConfig = JSON.parse(localStorage.config)
}


console.log('localconfig', localConfig)

let host = 'jungle2.cryptolions.io'
let protocol = 'https'
let port = 443
let brokerUrl = 'https://slantagnode3.priveos.io'
let chainId = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'

if (/network=localhost/g.test(window.location.href)) {
    host = '127.0.0.1'
    protocol = 'http'
    port = 8888
    brokerUrl = 'http://localhost:4000'
    chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
}


function get_endpoint() {
    return `${protocol}://${host}:${port}`
}

console.log(`Network config: ${get_endpoint()} (chainId: ${chainId})`)

export default {
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
    },
    ...additionalConfig,
    ...localConfig
}