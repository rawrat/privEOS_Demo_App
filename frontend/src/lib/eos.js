import EosJS from 'eosjs'
import config from '../config'
import Priveos from 'priveos'
import uuidv5 from 'uuid/v4'
import ScatterJS from 'scatterjs-core'; 
import ScatterEOS from 'scatterjs-plugin-eosjs'

const networkConfig = {
  blockchain: 'eos',
  protocol: config.protocol,
  host: config.host,
  port: config.port,
  chainId: config.chainId
}

ScatterJS.plugins(new ScatterEOS())

let priveos = null
let scatter = null

export function getScatterAccount(identity) {
  const account = identity.accounts.find(x => x.blockchain === 'eos')
  return account
}

export function loginWithScatter(scatter) {
  console.log(`NetworkConfig: ${JSON.stringify(networkConfig, null, 2)}`)
  return scatter.getIdentity({ accounts: [networkConfig] }).then(() => {
    const account = scatter.identity.accounts.find(x => x.blockchain === 'eos')
    return {
      scatter,
      identity: scatter.identity,
      account
    }
  }).catch(x => {
    if(x.type== "no_network") {
      alert(`Scatter Error: ${x.message}\nPlease add the network with chainID "${networkConfig.chainId}" \nto your scatter configuration`)
    }
    throw x
  })
}

export function addScatter() {
  console.log('connect scatter')
  return ScatterJS.scatter.connect(config.priveos.dappContract).then(connected => {
      if(!connected) return null
      scatter = ScatterJS.scatter
      window.ScatterJS = null
      return scatter
  })
}

export function logoutScatter() {
  scatter.forgetIdentity()
}


export function getPriveos() {
  return priveos
}

export function generateUuid() {
  return uuidv5()
}


export class Eos {
  constructor(options) {
    console.log('options', options)
    // if keys is an object we expect it to be a scatter instance returned by connectScatter() above
    if (options.scatter) {
      this.client = options.scatter.eos(networkConfig, EosJS);
    } else {
      this.client = EosJS({
        httpEndpoint: config.httpEndpoint,
        chainId: config.chainId,
        keyProvider: options.privateKeys
      })
    }
    
    priveos = new Priveos({
        ...config.priveos,
        eos: this.client,
        ephemeralKeyPrivate: options.ephemeralKeyPrivate,
        ephemeralKeyPublic: options.ephemeralKeyPublic,
    })
    
    this.seen_keys = []
  }
 
  upload(owner, uuid, name, description, url, price, secret_bytes, nonce_bytes) {
    return priveos.store(owner, uuid, secret_bytes, nonce_bytes, "4,EOS", [
        {
          account: config.priveos.dappContract,
          name: 'upload',
          authorization: [{
            actor: owner,
            permission: 'active',
          }],
          data: {
            owner: owner,
            uuid,
            name,
            description,
            url,
            price
          }
        }
      ]
    )
  }

  getFiles() {
    console.log('get files config', config)
    return this.client.getTableRows({json:true, scope: config.priveos.dappContract, code: config.priveos.dappContract,  table: 'files', limit:100})
    .then((files) => {
      console.log('eos.getFiles', files)
      return files.rows
    })
  }

  getPurchases(user) {
    console.log(user)
    return this.client.getTableRows({json:true, scope: user, code: config.priveos.dappContract,  table: 'perms', limit:100})
    .then((res) => {
      console.log('eos.getPurchasedFiles', res)
      return res.rows
    })
  }


  getBalance(user) {
    return this.client.getTableRows({json:true, scope: user, code: config.priveos.dappContract, table: 'balances', limit:100})
    .then((res) => {
      console.log('eos.getBalance', res)
      return res && res.rows && res.rows[0] || { funds: '0 EOS' }
    })
  }

  async purchase(user, file) {
    this.seen_keys.push(priveos.config.ephemeralKeyPublic + file.id)
    let actions = [] 
    
    if(parseFloat(file.price) > 0) {
        actions = actions.concat([
          {
            account: config.priveos.dappContract,
            name: 'prepare',
            authorization: [{
              actor: user,
              permission: 'active',
            }],
            data: {
              user: user
            }
          },
          {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
              actor: user,
              permission: 'active',
            }],
            data: {
              from: user,
              to: config.priveos.dappContract,
              quantity: ensure_asset_format(file.price),
              memo: `Buying read access to file ${file.name}`
            }
          },
          ]
        )
      }
      actions = actions.concat([
        {
          account: config.priveos.dappContract,
          name: 'purchase',
          authorization: [{
            actor: user,
            permission: 'active',
          }],
          data: {
            buyer: user,
            uuid: file.uuid
          }
        },
      ])
      return priveos.accessgrant(user, file.uuid, "4,EOS", actions)
        
    
  }

  async accessgrant(user, file) {
    if(this.seen_keys.includes(priveos.config.ephemeralKeyPublic + file.id)) {
      return
    }
    this.seen_keys.push(priveos.config.ephemeralKeyPublic + file.id)
    return priveos.accessgrant(user, file.uuid, "4,EOS")
  }

}

function ensure_asset_format(s) {
  const [a, b] = s.split(' ')
  return parseFloat(a).toFixed(4) + ' ' + b
}

export default {
  priveos,
  Eos
}
