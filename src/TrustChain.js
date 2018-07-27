const
  SignedEntityStatement = require('./SignedEntityStatement'),
  EntityStatement = require('./EntityStatement'),
  ResolvedMetadata = require('./ResolvedMetadata'),
  JWKS = require('./JWKS'),
  objectAssignDeep = require('object-assign-deep'),
  highlight = require('cli-highlight').highlight

class TrustChain {

  constructor(trustroot) {
    this.trustroot = trustroot
    this.entityStatements = []

    // Keep track of iss->sub relations
    this.map = {
    }
  }

  getTrustRootBySub(sub) {
    let r = this.trustroot.find(e => e.sub === sub)
    if (!r) throw new Error("cannot find trust root configuration for " + sub )
    return r
  }

  add(entityStatement) {
    let es
    if (typeof entityStatement === 'string') {
      es = new SignedEntityStatement(entityStatement)
    } else {
      es = entityStatement
    }

    this._addMap(es.getIss(), es.getSub())
    this.entityStatements.push(es)
  }

  find(sub, iss) {
    // console.log("Entirs", this.entityStatements)
    let e = this.entityStatements.find(es => es.hasSub(sub) && es.hasIss(iss))
    if (!e) throw new Error("CAnnot find sub => iss ", sub, iss)
    return e
  }

  _addMap(iss, sub) {
    if (!iss) return
    if (!sub) return
    if (!this.map[iss]) this.map[iss] = []
    this.map[iss].push(sub)
  }

  _utilNextPaths(src) {
    if (!src) {
      return this.trustroot.map(es => es.sub)
    }
    if (!this.map[src]) return []
    return this.map[src].filter(e => e !== src)
  }

  _utilSelfissued(src) {
    if (!src) return false
    if (!this.map[src]) return false
    return this.map[src].includes(src)
  }


  findPaths(src) {
    // console.log("Looking for " + src)
    // console.log(this.map)
    let nextTargets = this._utilNextPaths(src)
    let paths = []
    if (this._utilSelfissued(src)) {
      paths.push([])
    }
    // console.log("Next target ", nextTargets)
    nextTargets.forEach((s) => {
      let links = this.findPaths(s)
      paths = paths.concat(links.map(p => [s].concat(p) ))
    })
    return paths
  }



  validate(path, entityType) {

    let validatedEntityStatements = []

    // console.log("Paths is ", this.map)
    console.log("Get trust root configuration for " + path[0])
    let root = this.getTrustRootBySub(path[0])
    let trustedJwks = new JWKS(root.jwks)

    const rootEs = new EntityStatement()
    rootEs.add(root)

    validatedEntityStatements.push(rootEs)

    for(let i = 0; i < path.length-1; i++) {

      console.log()
      console.log(highlight("Processing  *" + path[i] + "* -> *" + path[i+1] + "*", {language: "markdown"}))
      // console.log(highlight(JSON.stringify(paths, undefined, 2), {language: "json"}))

      let ess = this.find(path[i+1], path[i])
      let es = ess.validate(trustedJwks)
      validatedEntityStatements.push(es)
      trustedJwks = es.getJWKS()

      console.log(highlight(JSON.stringify(es, undefined, 2), {language: "json"}))
      console.log()
      console.log(highlight("Completed processing ", {language: "markdown"}))
      console.log()

    }

    console.log()
    console.log("Processing selfissued statement from " + path[path.length-1])
    let esl = this.find(path[path.length-1], path[path.length-1])
    let es = esl.validate(trustedJwks)
    validatedEntityStatements.push(es)

    console.log(highlight(JSON.stringify(es, undefined, 2), {language: "json"}))
    console.log()
    console.log(highlight("Completed processing ", {language: "markdown"}))
    console.log()

    let metadata = new ResolvedMetadata(es.getSub(), entityType)
    metadata.addJWKS(trustedJwks)
    for(let i = validatedEntityStatements.length-1; i >= 0; i--) {
      // console.log("Processing " + i)
      metadata.addMetadata(validatedEntityStatements[i])
    }

    return metadata
  }




}

module.exports = TrustChain
