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
    this.client = EosJS({httpEndpoint: config.httpEndpoint, chainId: config.chainId, keyProvider: [key]})
  }
 
  upload(uuid, name, description, url, price) {
    if (!/\d\.\d\d\d\d\sEOS/.test(price)) {
      return alert('Price does not have correct format')
    }
    return this.client.transaction(
        {
          actions: [
            {
              account: config.contract,
              name: 'upload',
              authorization: [{
                actor: config.owner,
                permission: 'active',
              }],
              data: {
                owner: config.owner,
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
}


export default {
  priveos,
  Eos
}
