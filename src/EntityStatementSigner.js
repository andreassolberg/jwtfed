const
  jwt = require('jsonwebtoken'),
  uuidv4 = require('uuid/v4')




class EntityStatement {

  constructor(jwks) {
    this.jwks = jwks
  }

  getJSON(entityStatement) {
    return this.jwt
  }

  sign(es, kid, expiresIn) {
    let signingkey = this.jwks.getPrivateSigningKey(kid)
    expiresIn = expiresIn || '1w'
    let signed = jwt.sign(es.getJWT(), signingkey.pem, {
      algorithm: 'RS256',
      // expiresIn: expiresIn,
      keyid: kid,
      jwtid: uuidv4()
    })
    return signed
  }

}

module.exports = EntityStatement
