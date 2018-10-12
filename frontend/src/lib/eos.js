import Eos from 'eosjs'
import config from '../config'

let client = null
export function login(key) {
    client = Eos({httpEndpoint: config.httpEndpoint, chainId: config.chainId, keyProvider: [key]})
}

export function upload(owner, uuid, name, description, url, price) {
    return client.transaction(
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
                owner,
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