const
  ESFetcher = require('./src/ESFetcher'),
  TrustChain = require('./src/TrustChain'),
  highlight = require('cli-highlight').highlight,
  Sequelize = require('sequelize'),
  fs = require('fs')


let entityid = process.argv[3]
let usage = process.argv[2]

const trustroot = [
    {
        "sub": "https://edugain.andreas.labs.uninett.no/openid",
        "subTypes": ["openidProvider", "openidClient"],
        "metadata": {
          "openidClient": {
            "special": true
          }
        },
        "jwks": [
          {
            "kty": "RSA",
            "use": "sig",
            "alg": "RS256",
            "n": "qnd5_krrHKzuJzb5_YEt4sP-YOGSbfVL_g06h1Q-q0nzTsO8MwtWVQx1nuR1cV-ruNwF2sFFGRNejVNKOxL8n5tGuYgJBRJBB5KcbnvRqSEMpObJxQzQuQrzxXFqMlmVRaaCINL5qFWTmdJz79cPleBBPr9DsD9O-nDSGV-R0LT3YWH0SrY5cEDVasUhWnFRY5eOTMRtxUB2m8FXBaZVAlIr5-Gy-SaTmybKQJ74iVpG16Hbw4t0tw14ReEO0aAsDq24cU7bHOueWnxZPfOltueZnIEKe3_eAmh-fieLvkkZSKqXRWKg_tZDbnjUqWH2lVvC2ReEOrns971V0Hjcbw",
            "e": "AQAB",
            "key_ops": [
              "verify"
            ],
            "ext": true,
            "kid": "edugain"
          }
        ]
    }
]

if (!entityid || !usage) {
  console.error("Usage: node lookup.js openidClient https://serviceprovider.andreas.labs.uninett.no/application1007")
  process.exit(1)
}

const esf = new ESFetcher()
console.log(highlight("--------- ", {language: "markdown"}))
console.log(highlight("Looking up trusted [" + usage + "] metadata for " + entityid + ".", {language: "markdown"}))

esf.fetchChained(entityid)
  .then((list) => {
    console.log("Result")
    // console.log(ses)
    console.log(highlight(JSON.stringify(list, undefined, 2), {language: "json"}))


    const tc = new TrustChain(trustroot)
    list.forEach((es) => {
      tc.add(es)
    })


    tc.dump()

    let paths = tc.findPaths()
    if (paths.length === 0) {throw new Error("No trust paths found")}

    console.log()
    console.log(highlight("Discovered trusted paths ", {language: "markdown"}))
    console.log(highlight(JSON.stringify(paths, undefined, 2), {language: "json"}))
    console.log()

    let metadata = tc.validate(paths[0], 'openidClient')
    console.log(highlight("--------- ", {language: "markdown"}))
    console.log(highlight("Resolved metadata for " + metadata.identifier, {language: "markdown"}))
    console.log(highlight("Type " + metadata.entityType, {language: "markdown"}))
    console.log(highlight("Metadata:", {language: "markdown"}))
    console.log(highlight(JSON.stringify(metadata.getMetadata(), undefined, 2), {language: "json"}))
    console.log(highlight("Trusted JWKS:", {language: "markdown"}))
    console.log(highlight(JSON.stringify(metadata.jwks, undefined, 2), {language: "json"}))
    console.log()


  })
  .catch((err) => {
    console.error("error ", err)
  })
