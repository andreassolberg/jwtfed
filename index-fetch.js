const highlight = require('cli-highlight').highlight
const Sequelize = require('sequelize')

const
  ESFetcher = require('./src/ESFetcher'),
  // EntityStatementSigner = require('./src/EntityStatementSigner'),
  // TrustChain = require('./src/TrustChain'),
  // JWKS = require('./src/JWKS'),
  // jwt = require('jsonwebtoken'),
  fs = require('fs')

const target = 'http://localhost:3000/jallajalla'

console.log(highlight("--------- ", {language: "markdown"}))
console.log(highlight("About to fetch entity statements for " + target, {language: "markdown"}))

const esf = new ESFetcher()
esf.fetch(target)
  .then((ses) => {
    console.log("RESult")
    // console.log(ses)
    console.log(highlight(JSON.stringify(ses.decoded, undefined, 2), {language: "json"}))
  })
  .catch((err) => {
    console.error("error ", err)
  })


//
// const jwks = new JWKS(JSON.parse(fs.readFileSync('./etc/jwks.json', "utf8")))
// const signer = new EntityStatementSigner(jwks)
//
//
// let metadata = tc.validate(paths[0], 'openidClient')
// console.log(highlight("--------- ", {language: "markdown"}))
// console.log(highlight("Resolved metadata for " + metadata.identifier, {language: "markdown"}))
// console.log(highlight("Type " + metadata.entityType, {language: "markdown"}))
// console.log(highlight("Metadata:", {language: "markdown"}))
// console.log(highlight(JSON.stringify(metadata.metadata, undefined, 2), {language: "json"}))
// console.log(highlight("Trusted JWKS:", {language: "markdown"}))
// console.log(highlight(JSON.stringify(metadata.jwks, undefined, 2), {language: "json"}))
// console.log()
