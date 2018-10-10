const
  JWKS = require('./JWKS'),
  objectAssignDeep = require('object-assign-deep'),
  stringify = require("json-stringify-pretty-compact")



class EntityStatement {

  constructor() {
    this.jwt = {}
    this.init()
    this.jwt.metadata = {}
  }

  init() {
    this.jwt.iat = Math.round((new Date().getTime()) / 1000)
    this.jwt.exp = this.jwt.iat + 3600
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
    if (this.jwt.jwks && (!this.jwt.jwks.keys || !this.jwt.jwks.keys.length)) {
      console.log(" ----- Error with this statement ----")
      console.log(JSON.stringify(this.jwt.jwks, undefined, 2))
    }
    return new JWKS(this.jwt.jwks)
  }



  show (str, encoded) {

    let x = this.getJWT()
    if (x.jwks && x.jwks.keys.length > 0) {
      x.jwks.keys[0].n = x.jwks.keys[0].n.substring(0, 30) + '[...]'
    }

    console.log("-----------------")
    console.log(str)
    console.log("-----------------")
    console.log(stringify(x))
    console.log("")
    console.log("Encoded JWT: " + encoded)
    console.log("")

  }


}

module.exports = EntityStatement
