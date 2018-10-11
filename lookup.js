const
  ESFetcher = require('./src/ESFetcher'),
  TrustChain = require('./src/TrustChain'),
  highlight = require('cli-highlight').highlight,
  Sequelize = require('sequelize'),
  fs = require('fs')


let entityid = process.argv[3]
let usage = process.argv[2]
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const trustroot = [
  {
    "sub": "https://edugain.andreas.labs.uninett.no/openid",
    "metadata": {
      "openid_client": {
        "special": true
      }
    },
    "jwks": {
      "keys": [
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
  },
  {
    "sub": "https://agaton-sax.com:6000/alpha",
    "metadata": {
      "openid_client": {
        "special": true
      }
    },
    "jwks": {
      "keys": [
        {
          "kty": "RSA",
          "use": "sig",
          "kid": "alpha1",
          "e": "AQAB",
          "n": "6B5BoSGfQ3dNvsNQ6U5Jph0wqszNNXAsEcMarjOUdSUWg7ayHJ4x0w62qZ4eGH1nFcj5OtlYL354fyfHOsAOUhiAHDrd9g6NZNLgA5QjykT1zwCHky8dXP6GfUrkrhVouIo5ynVWNqtxVMDsAtwYblqevKeNpVfBGNBV79FiIQPBboqOG8jo1cOthXNfmHsTdmKRETr385B1Hbz1jBpXA6MnZcCF3mwBueHJrSuRV4UFKf7MdRhcUYx9lDXGpe7lCijh1dfPd-Qn5sfTCljyKnad26MZJmYYLddIo1Fuo0r6cHjnuEMoQp7PdwCZNyOo84M2i4DFCOVEgjfEBRioMw"
        },
        {
          "kty": "EC",
          "use": "sig",
          "kid": "alpha2",
          "crv": "P-256",
          "x": "NTKbxqcPqk30mkxwNqTN90DYkE4baXUoonbGionNHVo",
          "y": "zlHh5u8D7E9Sfff586he6f8Ij_WTW29vKDZ3tH_hE7E"
        }
      ]
    }
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

    let metadata = tc.validate(paths[0], usage)
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
