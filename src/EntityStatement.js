const
  JWKS = require('./JWKS'),
  objectAssignDeep = require('object-assign-deep')

class EntityStatement {

  constructor() {
    this.jwt = {
      metadata: {}
    }
  }

  add(data) {
    objectAssignDeep(this.jwt, data)
  }


  getJWT() {
    return this.jwt
  }

  getJWKS() {
    return new JWKS(this.jwt.jwks)
  }

}

module.exports = EntityStatement
