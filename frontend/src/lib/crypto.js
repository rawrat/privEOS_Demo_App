import nacl from 'tweetnacl'
import { encode } from 'querystring';
import ByteBuffer from 'bytebuffer'
nacl.util = require('tweetnacl-util')

export function encrypt(message, nonce, secret) {
    console.log('encrypt inside')
    console.log('secret', secret)
    console.log('nonce', nonce)
    return nacl.secretbox(nacl.util.decodeUTF8(message), nonce, secret);
}

export function decrypt(cyphertext, nonce, secret) {
    let decrypted_message = nacl.secretbox.open(cyphertext, nonce, secret);
    return nacl.util.encodeUTF8(decrypted_message)
}

export function encodeHex(value) {
    console.log('encodeHex', value)
    let ret = ByteBuffer.fromHex(value).toArrayBuffer()
    console.log('ret#1', ret)
    ret = new Uint8Array(ret)
    console.log('ret#2', ret)
    return ret
}