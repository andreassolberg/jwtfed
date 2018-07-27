const
  JWKS = require('./JWKS'),
  objectAssignDeep = require('object-assign-deep')

class EntityStatement {

  constructor() {
    this.jwt = {
      metadata: {}
    }
  }

  getSub() {
    return this.jwt.sub
  }

  add(data) {
    objectAssignDeep(this.jwt, data)
  }


  getJWT() {
    return this.jwt
  }

  getMetadata(entityType) {
    if (!this.jwt.metadata) throw new Error("EntityStatement [" + this.jwt.sub + "] does not contain metadata" )
    if (!this.jwt.metadata[entityType]) {
      return {}
      // throw new Error("EntityStatement [" + this.jwt.sub + "] does not contain metadata for this entity type " + entityType)
    }
    return this.jwt.metadata[entityType]
  }

  getJWKS() {
    return new JWKS(this.jwt.jwks)
  }

}

module.exports = EntityStatement
