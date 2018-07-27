
const
  jwkToPem = require('jwk-to-pem')

class JWKS {

  constructor(jwks) {
    this.jwks = jwks
  }

  getSigningKeys(operation) {

    if (!this.jwks || !this.jwks.length) {
      throw new Error('JWKS not provided');
    }

    const signingKeys = this.jwks
      .filter(
          key => key.use === 'sig' && key.kty === 'RSA' && key.kid && key.key_ops &&
          key.key_ops.includes(operation) &&
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
