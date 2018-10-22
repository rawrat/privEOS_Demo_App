import nacl from 'tweetnacl'
import eosjs_ecc from 'eosjs-ecc'
import ByteBuffer from 'bytebuffer'
nacl.util = require('tweetnacl-util')

export function encrypt(message, nonce, secret) {
    console.log('nonce1', nonce)
    console.log('secret1', secret)
    return nacl.secretbox(nacl.util.decodeUTF8(message), nonce, secret);
}

export function decrypt(cyphertext, nonce, secret) {
    let decrypted_message = nacl.secretbox.open(cyphertext, nonce, secret);
    return nacl.util.encodeUTF8(decrypted_message)
}

export function encodeHex(value) {
    let ret = ByteBuffer.fromHex(value).toArrayBuffer()
    ret = new Uint8Array(ret)
    return ret
}

export function getEphemeralKeys() {
    return new Promise((resolve) => {
        return eosjs_ecc.randomKey().then(ephemeral_key_private => {
            const ephemeral_key_public = eosjs_ecc.privateToPublic(ephemeral_key_private)
            console.log('built eph keys')
            return resolve({
                private: ephemeral_key_private,
                public: ephemeral_key_public
            })
        })
    })
}

export default {
    encrypt,
    decrypt,
    encodeHex
}