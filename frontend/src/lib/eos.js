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

  getPurchasedFiles() {
    return this.client.getTableRows({json:true, scope: config.contract, code: config.contract,  table: 'files', limit:100})
    .then((res) => {
      console.log('eos.getFiles', res)
      return res.rows
    }).catch((err) => {
      console.error('Cannot retreive active nodes: ', err)
    })
  }

  buy(sender, quantity, uuid) {
    const self = this
    return self.prepare(sender)
    .then(() => self.transfer(sender, config.contract, quantity))
    .then(() => self.purchase(sender, uuid))
    .then(() => {
      console.log('successfully purchased file')
    })
    .catch((err) => {
      console.error('error while purchasing file', err)
    })
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
    return this.client.transaction(
      {
        actions: [
          {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
              actor: sender,
              permission: 'active',
            }],
            data: {
              from: sender,
              to: receiver,
              quantity: quantity,
              memo: ''
            }
          }
        ]
      }
    )
  }


  purchase(user, uuid) {
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
