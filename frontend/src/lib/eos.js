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
  return scatter.getIdentity({ accounts: [networkConfig] }).then(() => {
    const account = scatter.identity.accounts.find(x => x.blockchain === 'eos')
    return {
      scatter,
      identity: scatter.identity,
      account
    }
  })
}

export function addScatter() {
  return ScatterJS.scatter.connect(config.priveos.dappContract).then(connected => {
      if(!connected) throw new Error('Could not connect scatter')
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
    return priveos.store(owner, uuid, secret_bytes, nonce_bytes, [
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

  getFiles(user) {
    const self = this
    console.log('get files config', config)
    return this.client.getTableRows({json:true, scope: config.priveos.dappContract, code: config.priveos.dappContract,  table: 'files', limit:100})
    .then((files) => {
      console.log('eos.getFiles', files)
      return self.getPurchasedFiles(user).then((purchases) => {
        files.rows = files.rows.map((x) => {
          return {
            ...x,
            purchased: purchases.some((p) => x.id == p.id),
            owning: x.owner == user,
          }
        })
        console.log('files', files.rows)
        return files.rows
      })
    }).catch((err) => {
      console.error('Cannot retrieve active nodes: ', err)
    })
  }

  getPurchasedFiles(user) {
    console.log(user)
    return this.client.getTableRows({json:true, scope: user, code: config.priveos.dappContract,  table: 'perms', limit:100})
    .then((res) => {
      console.log('eos.getPurchasedFiles', res)
      return res.rows
    }).catch((err) => {
      console.error('Cannot retreive active nodes: ', err)
    })
  }


  getBalance(user) {
    return this.client.getTableRows({json:true, scope: user, code: config.priveos.dappContract,  table: 'balances', limit:100})
    .then((res) => {
      console.log('eos.getBalance', res)
      return res && res.rows && res.rows[0] || { funds: '0 EOS' }
    }).catch((err) => {
      console.error('Cannot retreive active nodes: ', err)
    })
  }
  
  get_priveos_fee() {
    return this.client.getTableRows({json:true, scope: 'priveosrules', code: 'priveosrules',  table: 'price', limit:1, lower_bound: "EOS"})
    .then((res) => {
      console.log('get_priveos_fee: ', res.rows[0].money)
      return res.rows[0].money
    })
  }

  async purchase(user, file) {
    this.seen_keys.push(priveos.config.ephemeralKeyPublic)
    return this.client.transaction(
      {
        actions: [
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
              quantity: file.price,
              memo: `Buying read access to file ${file.name}`
            }
          },
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
          {
              account: 'priveosrules',
              name: 'prepare',
              authorization: [{
                actor: user,
                permission: 'active',
              }],
              data: {
                user,
                currency: "4,EOS",
              }
            },
            {
              account: "eosio.token",
              name: 'transfer',
              authorization: [{
                actor: user,
                permission: 'active',
              }],
              data: {
                from: user,
                to: 'priveosrules',
                quantity: await this.get_priveos_fee(),
                memo: `PrivEOS fee for file ${file.name}`,
              }
            },
          {
            account: 'priveosrules',
            name: 'accessgrant',
            authorization: [{
              actor: user,
              permission: 'active',
            }],
            data: {
              user,
              contract: config.priveos.dappContract,
              file: file.uuid,
              public_key: priveos.config.ephemeralKeyPublic,
              token: "4,EOS",
            }
          },
        ]
      }
    )
  }

  accessgrant(user, uuid) {
    if(this.seen_keys.includes(priveos.config.ephemeralKeyPublic)) {
      return new Promise(function (resolve, reject) {
        return resolve()
      })
    }
    return this.client.transaction(
      {
        actions: [
          {
            account: 'priveosrules',
            name: 'accessgrant',
            authorization: [{
              actor: user,
              permission: 'active',
            }],
            data: {
              user,
              contract: config.priveos.dappContract,
              file: uuid,
              public_key: priveos.config.ephemeralKeyPublic,
              token: "4,EOS",
            }
          }
        ]
      }
    ) 
  }

}


export default {
  priveos,
  Eos
}
