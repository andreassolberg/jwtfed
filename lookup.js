const
  ESFetcher = require('./src/ESFetcher'),
  highlight = require('cli-highlight').highlight,
  Sequelize = require('sequelize'),
  fs = require('fs')


let entityid = process.argv[3]
let usage = process.argv[2]

const trustroot = [
    {
        "sub": "https://edugain.org/",
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
  })
  .catch((err) => {
    console.error("error ", err)
  })



const tc = new TrustChain(trustroot)
