
const
  jwkToPem = require('jwk-to-pem')

class JWKS {

  constructor(jwks) {

    if (jwks && typeof jwks === 'object' && jwks.hasOwnProperty('keys')) {
      this.jwks = jwks
    } else if (!jwks) {
      this.jwks = {
        "keys": []
      }
    } else {
      throw new Error("JWKS contructor provided with something that was not an array of keys")
    }


  }

  getSigningKeys(operation) {

    if (!this.jwks || !this.jwks.keys || !this.jwks.keys.length) {
      throw new Error('JWKS not provided')
    }

    console.log("YAY operation", this.jwks.keys)

    const signingKeys = this.jwks.keys
      .filter(
          key =>
          ( !key.use || (key.use === 'sig')) &&
          key.kty === 'RSA' && key.kid &&
          ( !key.key_ops || key.key_ops.includes(operation)) &&
          ((key.x5c && key.x5c.length) || (key.n && key.e))
      )

    if (!signingKeys.length) {
      throw new Error('The JWKS endpoint did not contain any signing keys')
    }

    return signingKeys

  }




  getPublicSigningKey(kid) {
    const keys = this.getSigningKeys('verify')
    const key = keys.find(k => k.kid === kid)
    if (!key) {
      throw new Error("Could not find signing key with kid " + kid)
    }
    return { kid: key.kid, nbf: key.nbf, pem: jwkToPem(key) }
  }

  getPrivateSigningKey(kid) {
    const keys = this.getSigningKeys('sign')
    const key = keys.find(k => k.kid === kid)
    if (!key) {
      throw new Error("Could not find signing key with kid " + kid)
    }
    return { kid: key.kid, nbf: key.nbf, pem: jwkToPem(key, {private: true}) }
  }


  getJWT(operation, kid) {
    const keys = this.getSigningKeys(operation)
    const key = keys.find(k => k.kid === kid);
    if (!key) {
      throw new Error("Could not find key with kid " + kid)
    }
    return key
  }

}

module.exports = JWKS
