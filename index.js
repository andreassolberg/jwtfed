
const
  EntityStatement = require('./src/EntityStatement'),
  EntityStatementSigner = require('./src/EntityStatementSigner'),
  TrustChain = require('./src/TrustChain'),
  JWKS = require('./src/JWKS'),
  jwt = require('jsonwebtoken'),
  fs = require('fs')



const jwks = new JWKS(JSON.parse(fs.readFileSync('./etc/jwks.json', "utf8")))
const signer = new EntityStatementSigner(jwks)

//
// let k = jwks.getPublicSigningKey('key1')
// console.log(" ---- Public Singing key ----")
// // console.log(JSON.stringify(k, undefined, 2))
// console.log(k.pem)
//
// let k2 = jwks.getPrivateSigningKey('key1')
// console.log(" ---- Private Singing key ----")
// console.log(JSON.stringify(k2, undefined, 2))
//
//
// console.log("==================")


let es1 = new EntityStatement()
es1.add({
  "iss": "https://localhost:8888/",
  "sub": "https://localhost:8888/",
  "leafNode": true,
  "subTypes": ["samlProvider", "openidProvider"],
  "metadata": {
    "openidProvider": {},
    "openidClient": {
      "redirect_uris": ["https://localhost:8888/callback"]
    }
  },
  "jwks": [
    jwks.getJWT('verify', 'key1')
  ]
})
let es1s = signer.sign(es1, 'key1')
console.log(" ---- JWT ----")
console.log(JSON.stringify(es1.getJWT(), undefined, 2))
console.log('JWT: ' + es1s)


let es2 = new EntityStatement()
es2.add({
  "iss": "https://ntnu.no/",
  "sub": "https://localhost:8888/",
  "leafNode": true,
  "subTypes": ["samlProvider", "openidProvider"],
  "metadata": {
    "openidProvider": {},
    "openidClient": {
      "client_id": "https://blackboard.ntnu.no",
      "client_name": "NTNU Blackboard",
      "application_type": "web",
      "technical_contact": "tech-support@ntnu.no",
      "grant_types_supported": ["authorization_code"],
      "redirect_uri_prefixes": ["https://blackboard.ntnu.no/", "https://localhost:8888/"],
      "scopes": ["openid", "email"]
    }
  },
  "jwks": [
    jwks.getJWT('verify', 'key1')
  ]
})
let es2s = signer.sign(es2, 'ntnu')
console.log(" ---- JWT ----")
console.log(JSON.stringify(es2.getJWT(), undefined, 2))
console.log('JWT: ' + es2s)


let es3 = new EntityStatement()
es3.add({
  "iss": "https://feide.no/",
  "sub": "https://ntnu.no/",
  "leafNode": true,
  "subTypes": ["samlProvider", "openidProvider"],
  "metadata": {
    "openidProvider": {},
    "openidClient": {
      "client_id": "https://blackboard.ntnu.no",
      "client_name": "NTNU Blackboard",
      "application_type": "web",
      "technical_contact": "tech-support@ntnu.no",
      "grant_types_supported": ["authorization_code"],
      "redirect_uri_prefixes": ["https://blackboard.ntnu.no/", "https://localhost:8888/"],
      "scopes": ["openid", "email"]
    }
  },
  "jwks": [
    jwks.getJWT('verify', 'ntnu')
  ]
})
let es3s = signer.sign(es3, 'feide')
console.log(" ---- JWT ----")
console.log(JSON.stringify(es3.getJWT(), undefined, 2))
console.log('JWT: ' + es3s)



let es4 = new EntityStatement()
es4.add({
  "iss": "https://edugain.org/",
  "sub": "https://feide.no/",
  "leafNode": true,
  "subTypes": ["samlProvider", "openidProvider"],
  "metadata": {
    "openidProvider": {
        "userTLDs": ["no"],
        "id_token_signing_alg_values_supported": ["RS384", "RS512", "ES512"],
    },
    "openidClient": {
      "scopes": ["openid", "email", "foo", "edugain", "bar"]
    }
  },
  "jwks": [
    jwks.getJWT('verify', 'ntnu')
  ]
})
let es4s = signer.sign(es4, 'edugain')
console.log(" ---- JWT ----")
console.log(JSON.stringify(es4.getJWT(), undefined, 2))
console.log('JWT: ' + es4s)

const trustroot = [
    {
        "sub": "https://edugain.org/",
        "subTypes": ["openidProvider", "openidClient"],
        "metadata": {
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

const tc = new TrustChain(trustroot)
tc.add(es1s)
tc.add(es2s)
tc.add(es3s)
tc.add(es4s)

let paths = tc.findPaths()
if (paths.length === 0) {throw new Error("No trust paths found")}
console.log(" ===> Paths")
console.log(JSON.stringify(paths, undefined, 2))

tc.validate(paths[0])
