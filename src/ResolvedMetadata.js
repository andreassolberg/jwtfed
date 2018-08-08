const
  JWKS = require('./JWKS'),
  objectAssignDeep = require('object-assign-deep')

class ResolvedMetadata {

  constructor(identifier, entityType) {
    this.identifier = identifier
    this.metadata = {}
    this.entityType = entityType
    this.jwks = null
  }

  addJWKS(jwks) {
    this.jwks = jwks
  }

  addMetadata(es) {
    objectAssignDeep(this.metadata, es.getMetadata(this.entityType))
  }

  getMetadata() {
    let m = this.metadata
    objectAssignDeep(m, {
      "jwks": this.jwks.jwks
    })
    return m
  }


}

module.exports = ResolvedMetadata
