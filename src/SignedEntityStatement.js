const
  EntityStatement = require('./EntityStatement'),
  jwt = require('jsonwebtoken'),
  es = require('./EntityStatement')

class SignedEntityStatement {

  constructor(encoded) {
    this.encoded = encoded
    this.decoded = jwt.decode(encoded, {complete: true})

    // console.log("DECODED is", this.decoded)
  }

  getIss() {
    return this.decoded.payload.iss
  }

  getSub() {
    return this.decoded.payload.sub
  }

  hasSub(sub) {
    // console.log("Comparing SUB " + this.decoded.sub + " with " + sub)
    return this.decoded.payload.sub === sub
  }

  hasIss(iss) {
    // console.log("Comparing ISS " + this.decoded.iss + " with " + iss)
    return this.decoded.payload.iss === iss
  }

  validate(jwks) {
    if (!this.decoded.header.kid) {
      throw new Error("Missing [kid] header claim. Will not attempt to verify.")
    }
    let signingKey = jwks.getPublicSigningKey(this.decoded.header.kid)
    let e = new EntityStatement()
    e.add(this.decoded)
    return e
  }

}

module.exports = SignedEntityStatement
