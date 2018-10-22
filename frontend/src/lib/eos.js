import EosJS from 'eosjs'
import eosjs_ecc from 'eosjs-ecc'
import config from '../config'
import Priveos from 'priveos'
import uuidv5 from 'uuid/v4'
import ScatterJS from 'scatterjs-core'; 
import ScatterEOS from 'scatterjs-plugin-eosjs'



const networkConfig = {
  blockchain: 'eos',
  protocol: 'http',
  host: 'localhost',
  port: 8888,
  chainId: config.chainId
}

ScatterJS.plugins(new ScatterEOS())


export function connectScatter() {
    return new Promise((resolve) => {
        ScatterJS.scatter.connect(config.priveos.dappContract).then(connected => {
            if(!connected) throw new Error('Could not connect scatter')
            const scatter = ScatterJS.scatter
            window.ScatterJS = null
            scatter.getIdentity({ accounts: [networkConfig] }).then(() => {
              const account = scatter.identity.accounts.find(x => x.blockchain === 'eos')
              return resolve({ scatter, account })
            })
        })
    })
}

let priveos = null
eosjs_ecc.randomKey().then(ephemeral_key_private => {
  const ephemeral_key_public = eosjs_ecc.privateToPublic(ephemeral_key_private)
  priveos = new Priveos({
    ...config.priveos,
    privateKey: config.eosAccounts.alice.privateKey,
    publicKey: config.eosAccounts.alice.publicKey,
    ...{
      ephemeralKeyPrivate: ephemeral_key_private,
      ephemeralKeyPublic: ephemeral_key_public,
    }
  })
})


export function getPriveos() {
  return priveos
}

export function generateUuid() {
  return uuidv5()
}


export class Eos {
  constructor(keys) {
    console.log('key', keys)
    // if keys is an object we expect it to be a scatter instance returned by connectScatter() above
    if (!Array.isArray(keys)) {
      this.client = keys.eos(networkConfig, EosJS);
    } else {
      this.client = EosJS({
        httpEndpoint: config.httpEndpoint,
        chainId: config.chainId,
        keyProvider: keys
      })
    }
  }
 
  upload(owner, uuid, name, description, url, price) {
    return this.client.transaction(
        {
          actions: [
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
        }
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
            purchased: purchases.find((p) => x.id == p.id) && true || false,
            owning: x.owner == user
          }
        })
        console.log('files', files.rows)
        return files.rows
      })
    }).catch((err) => {
      console.error('Cannot retreive active nodes: ', err)
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

  purchase(user, quantity, uuid) {
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
              quantity: quantity,
              memo: ''
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
              uuid: uuid
            }
          }
        ]
      }
    )
  }

  accessgrant(user, uuid, publicKey) {
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
              public_key: publicKey
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
