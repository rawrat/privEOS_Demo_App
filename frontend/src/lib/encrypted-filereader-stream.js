/*
  Copyright (c) 2013, Max Ogden
  Copyright (c) 2013, Brian J Brennan
  Copyright (c) 2018, privEOS
*/
/* global FileReader */
const from2 = require('from2')
const toBuffer = require('typedarray-to-buffer')
const { stream } = require('nacl-stream')


module.exports = function (file, options) {

  var encryptor = stream.createEncryptor(options.secret, options.nonce, options.maxChunkLength)
  
  options = options || {}
  var offset = options.offset || 0
  var chunkSize = options.chunkSize || 1024 * 1024
  var fileReader = new FileReader(file)

  var from = from2(function (size, cb) {
    if (offset >= file.size) return cb(null, null)
    fileReader.onloadend = function loaded(event) {
      var data = event.target.result
      data = new Uint8Array(data)
      data = encryptor.encryptChunk(data)
      console.log('chunk', data)
      if (data instanceof ArrayBuffer) data = toBuffer(data)
      cb(null, data)
    }
    var end = offset + chunkSize
    var slice = file.slice(offset, end)
    fileReader.readAsArrayBuffer(slice) 
    offset = end
  })

  from.name = file.name
  from.size = file.size
  from.type = file.type
  from.lastModified = file.lastModified

  fileReader.onerror = function (err) {
    from.destroy(err)
  }

  return from
}