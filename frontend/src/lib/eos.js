import EosJS from 'eosjs'
import eosjs_ecc from 'eosjs-ecc'
import config from '../config'
import Priveos from 'priveos'
import uuidv5 from 'uuid/v4'

let priveos = null
eosjs_ecc.randomKey().then(ephemeral_key_private => {
  const ephemeral_key_public = eosjs_ecc.privateToPublic(ephemeral_key_private)
  priveos = new Priveos({
    ...config.priveos,
    // TODO: set the private key here in the EosJS function in the constructor (async issues)
    privateKey: config.eosAccounts.alice.key,
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
    this.client = EosJS({httpEndpoint: config.httpEndpoint, chainId: config.chainId, keyProvider: keys})
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

  getFiles() {
    console.log('get files config', config)
    return this.client.getTableRows({json:true, scope: config.priveos.dappContract, code: config.priveos.dappContract,  table: 'files', limit:100})
    .then((res) => {
      console.log('eos.getFiles', res)
      return res.rows
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

  accessgrant(user, uuid) {
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
