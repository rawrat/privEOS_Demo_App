import Eos from 'eosjs'
import config from '../config'
import Priveos from 'priveos'
import uuidv5 from 'uuid/v4'

export const priveos = new Priveos(config.priveos)

let client = null
export function login(key) {
    client = Eos({httpEndpoint: config.httpEndpoint, chainId: config.chainId, keyProvider: [key]})
}

export function generateUuid() {
  return uuidv5()
}

export function upload(uuid, name, description, url, price) {
  if (!/\d\.\d\d\d\d\sEOS/.test(price)) {
    return alert('Price does not have correct format')
  }
  return client.transaction(
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

export default {
    upload,
    login
}