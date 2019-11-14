require('dotenv').config()
const crypto = require('crypto')
const fs = require('fs')
const { join } = require('path')

const base64 = x => Buffer.from(x, 'base64').toString('utf8')
const PAYBASE_PUBLIC_KEY = base64(process.env.PUBLIC_KEY)

const verify = (body, signature) => {
  const verifyBase = crypto.createVerify('sha256WithRSAEncryption')
  verifyBase.update(typeof body === 'string' ? body : JSON.stringify(body))
  verifyBase.end()
  return verifyBase.verify(PAYBASE_PUBLIC_KEY, signature, 'base64')
}

module.exports = (req, res) => {
  const { body, headers } = req
  if (body.type === 'integration_handshake') res.status(204).end()
  else {
    console.log('PUBLIC_KEY', PAYBASE_PUBLIC_KEY)
    console.log('verify', headers['x-signature'], verify(body, headers['x-signature']))
    res.status(200).end(body.toString())
  }
  res.status(204)
}
