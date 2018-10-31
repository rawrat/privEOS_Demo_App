import devtools from './lib/devtools'
import additionalConfig from './config-APP_TARGET.json'

let localConfig = {}
if (localStorage && localStorage.config) {
    localConfig = JSON.parse(localStorage.config)
}


console.log('localconfig', localConfig)

const host = '127.0.0.1'
const protocol = 'http'
const port = 8888

function get_endpoint() {
  return `${protocol}://${host}:${port}`
}

export default {
    httpEndpoint: get_endpoint(),
    host: host,
    protocol: protocol,
    port: port,
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    maxChunkLength: '1024',
    priveos: {
        dappContract: 'demoapp',
        brokerUrl: 'http://localhost:4000'
    },
    ...additionalConfig,
    ...localConfig
}