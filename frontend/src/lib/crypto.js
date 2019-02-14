import nacl from 'tweetnacl'
import eosjs_ecc from 'eosjs-ecc'
import Priveos from 'priveos'

export function encrypt(message, secret) {
    console.log('secret1', secret)
    return Priveos.encryption.encrypt(message, secret);
}

export function decrypt(cyphertext, secret) {
    let decrypted_message = Priveos.encryption.decrypt(cyphertext, secret)
    return decrypted_message
}

export async function getEphemeralKeys() {
  const ephemeral_key_private = await eosjs_ecc.randomKey()
  const ephemeral_key_public = eosjs_ecc.privateToPublic(ephemeral_key_private)
  return {
      private: ephemeral_key_private,
      public: ephemeral_key_public,
  }
}

export default {
    encrypt,
    decrypt,
}