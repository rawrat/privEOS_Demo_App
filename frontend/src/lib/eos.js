import EosJS from 'eosjs'
import config from '../config'
import Priveos from 'priveos'
import uuidv5 from 'uuid/v4'

export const priveos = new Priveos(config.priveos)

export function generateUuid() {
  return uuidv5()
}


export class Eos {
  constructor(key) {
    console.log('key', key)
    this.client = EosJS({httpEndpoint: config.httpEndpoint, chainId: config.chainId, keyProvider: [key]})
  }
 
  upload(owner, uuid, name, description, url, price) {
    return this.client.transaction(
        {
          actions: [
            {
              account: config.contract,
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
    return this.client.getTableRows({json:true, scope: config.contract, code: config.contract,  table: 'files', limit:100})
    .then((res) => {
      console.log('eos.getFiles', res)
      return res.rows
    }).catch((err) => {
      console.error('Cannot retreive active nodes: ', err)
    })
  }

  getPurchasedFiles(user) {
    console.log(user)
    return this.client.getTableRows({json:true, scope: user, code: config.contract,  table: 'perms', limit:100})
    .then((res) => {
      console.log('eos.getPurchasedFiles', res)
      return res.rows
    }).catch((err) => {
      console.error('Cannot retreive active nodes: ', err)
    })
  }

  buy(user, quantity, uuid) {
    const self = this
    return this.client.transaction(
      {
        actions: [
          {
            account: config.contract,
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
              to: config.contract,
              quantity: quantity,
              memo: ''
            }
          },
          {
            account: config.contract,
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

  prepare(user) {
    console.log('prepare', user)
    return this.client.transaction(
      {
        actions: [
          {
            account: config.contract,
            name: 'prepare',
            authorization: [{
              actor: user,
              permission: 'active',
            }],
            data: {
              user: user
            }
          }
        ]
      }
    )
  }


  transfer(sender, receiver, quantity) {
    console.log('transfer from to', sender, receiver, quantity)
    return this.client.transaction(
      {
        actions: [
          
        ]
      }
    )
  }


  purchase(user, uuid) {
    console.log('purchase', user, uuid)
    return this.client.transaction(
      {
        actions: [
          {
            account: config.contract,
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

}


export default {
  priveos,
  Eos
}
