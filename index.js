const
  highlight = require('cli-highlight').highlight,
  Sequelize = require('sequelize'),
  URL = require('url').URL
const
  EntityStatement = require('./src/EntityStatement'),
  EntityStatementSigner = require('./src/EntityStatementSigner'),
  TrustChain = require('./src/TrustChain'),
  JWKS = require('./src/JWKS'),
  WebFingerExample = require('./src/WebFingerExample'),
  jwt = require('jsonwebtoken'),
  fs = require('fs')

const
  jwks = new JWKS(JSON.parse(fs.readFileSync('./etc/jwks.json', "utf8"))),
  signer = new EntityStatementSigner(jwks),
  stringify = require("json-stringify-pretty-compact"),
  wfe = new WebFingerExample()

const E = {
  "UMU": "https://umu.se/openid",
  "SWAMID": "https://www.sunet.se/swamid",
  "EDUGAIN": "https://edugain.org/oidc",
  "FOODLE": "https://foodl.org/",
  "KALMAR": "https://kalmar2.org/openid"
}



// UMU self issued
let esu = new EntityStatement()
esu.add({
  "iss": E.UMU,
  "sub": E.UMU,
  "metadata": {
    "openid-provider": {
      "authorization_endpoint": "https://idp.umu.se/openid/authorization",
      "token_endpoint": "https://idp.umu.se/openid/token",
      "response_types_supported": ["code", "code id_token", "token"],
      "grant_types_supported": ["authorization_code", "implicit", "urn:ietf:params:oauth:grant-type:jwt-bearer"],
      "subject_types_supported": ["pairwise", "public"],
      "id_token_signing_alg_values_supported": ["RS256"],
      "logo_uri": "https://www.umu.se/SRWStatic/img/umu-logo-left-neg-SE.svg",
      "policy_uri": "https://www.umu.se/en/about-the-website/legal-information/",
      "loa_max": "http://eidas.europa.eu/LoA/high"
    }
  },
  "authority_hints": {
    [E.SWAMID]: [E.EDUGAIN],
    [E.KALMAR]: []
  },
  "jwks": {
    "keys": [
      jwks.getJWT('verify', 'umu')
    ]
  }
})
let esus = signer.sign(esu, 'umu')
esu.show("Umeå", esus)
wfe.show(esu, esus, 'idp.umu.se')




// SWAMID about UMU
let umuSwamid = new EntityStatement()
umuSwamid.add({
  "iss": E.SWAMID,
  "sub": E.UMU,
  "metadata": {
    "openid-provider": {
      "subject_types_supported": ["pairwise"],
      "id_token_signing_alg_values_supported": ["RS256", "RS512"],
      "organization": "University of Umeå",
      "contacts": ["legal@umu.se", "technical@umu.se"]
    },
    "openid-client": {}
  },
  "jwks": {
    "keys": [
      jwks.getJWT('verify', 'swamid')
    ]
  }
})
let umuSwamidS = signer.sign(umuSwamid, 'feide')
umuSwamid.show("SWAMID about Umeå", umuSwamidS)
wfe.show(umuSwamid, umuSwamidS)










let es1 = new EntityStatement()
es1.add({
  "iss": E.FOODLE,
  "sub": E.FOODLE,
  "metadata": {
    "openid-client": {
      "redirect_uris": ["https://foodl.org/openid/callback"]
    }
  },
  "jwks": {
    "keys": [
      jwks.getJWT('verify', 'key1')
    ]
  }
})
let es1s = signer.sign(es1, 'key1')
es1.show("Foodle", es1s)
wfe.show(es1, es1s)







const trustroot1 = [
  {
    "sub": E.SWAMID,
    "metadata": {
      "openid-provider": {
        "loa_max": "http://swamid.se/LoA/substantial"
      }
    },
    "jwks": {
      "keys": [
        jwks.getJWT('verify', 'swamid')
      ]
    }
  }
]


console.log(" === ==== Trust root (client) ==== ===")
trustroot1[0].jwks.keys[0].n = trustroot1[0].jwks.keys[0].n.substring(0, 30) + '[...]'
console.log(stringify(trustroot1))



const trustroot2 = [
  {
    "sub": E.EDUGAIN,
    "metadata": {
      "openid-client": {
        "rp_scopes": ["openid", "userid-targetedid", "eduperson"],
        "response_types": ["code", "code id_token"],
      }
    },
    "jwks": {
      "keys": [
        jwks.getJWT('verify', 'edugain')
      ]
    }
  },
  {
    "sub": E.SWAMID,
    "metadata": {
      "openid-client": {
        "rp_scopes": ["openid", "userid-persistent", "fs"],
        "response_types": ["code", "code id_token"],
      }
    },
    "jwks": {
      "keys": [
        jwks.getJWT('verify', 'swamid')
      ]
    }
  }
]

console.log(" === ==== Trust root (provider) ==== ===")
trustroot2[0].jwks.keys[0].n = trustroot2[0].jwks.keys[0].n.substring(0, 30) + '[...]'
trustroot2[1].jwks.keys[0].n = trustroot2[1].jwks.keys[0].n.substring(0, 30) + '[...]'
console.log(stringify(trustroot2))






console.log()
console.log('----------------------------------------------------------------')
let chain = [trustroot1[0].metadata['openid-provider'], umuSwamid.jwt.metadata['openid-provider'], esu.jwt.metadata['openid-provider']]
console.log(stringify(chain))
console.log('----------------------------------------------------------------')

console.log("GET /authorize?\n" +
    "  response_type=code\n" +
    "  &scope=openid%20profile%20email\n" +
    "  &client_id=" + encodeURIComponent(es1.jwt.iss) + "\n" +
    "  &state=2ff7e589-3848-46da-a3d2-949e1235e671\n" +
    "  &redirect_uri=" + encodeURIComponent(es1.jwt.metadata['openid-client'].redirect_uris[0]) + " HTTP/1.1")
console.log(`Host: ${ (new URL(esu.jwt.metadata['openid-provider'].authorization_endpoint)).host }`)



// "openidClient": {
//   "client_id": "https://blackboard.ntnu.no",
//   "client_name": "NTNU Blackboard",
//   "application_type": "web",
//   "technical_contact": "tech-support@ntnu.no",
//   "grant_types_supported": ["authorization_code"],
//   "redirect_uri_prefixes": ["https://blackboard.ntnu.no/", "https://localhost:8888/"],
//   "scopes": ["openid", "email"]
// }



















// return null
//
// let es2 = new EntityStatement()
// es2.add({
//   "iss": "https://ntnu.no/",
//   "sub": "https://localhost:8888/",
//   "leafNode": true,
//   "subTypes": ["samlProvider", "openidProvider"],
//   "metadata": {
//     "openidProvider": {},
//     "openidClient": {
//       "client_id": "https://blackboard.ntnu.no",
//       "client_name": "NTNU Blackboard",
//       "application_type": "web",
//       "technical_contact": "tech-support@ntnu.no",
//       "grant_types_supported": ["authorization_code"],
//       "redirect_uri_prefixes": ["https://blackboard.ntnu.no/", "https://localhost:8888/"],
//       "scopes": ["openid", "email"]
//     }
//   },
//   "jwks": [
//     jwks.getJWT('verify', 'key1')
//   ]
// })
// let es2s = signer.sign(es2, 'ntnu')
// console.log(highlight("-------- *JWT*  ", {language: "markdown"}))
// console.log(highlight(JSON.stringify(es2.getJWT(), undefined, 2), {language: "json"}))
// console.log('JWT: ' + es2s)
//
//


//
// let es4 = new EntityStatement()
// es4.add({
//   "iss": "https://edugain.org/",
//   "sub": "https://feide.no/",
//   "leafNode": true,
//   "subTypes": ["samlProvider", "openidProvider"],
//   "metadata": {
//     "openidProvider": {
//         "userTLDs": ["no"],
//         "id_token_signing_alg_values_supported": ["RS384", "RS512", "ES512"],
//     },
//     "openidClient": {
//       "scopes": ["openid", "email", "foo", "edugain", "bar"]
//     }
//   },
//   "jwks": [
//     jwks.getJWT('verify', 'feide')
//   ]
// })
// let es4s = signer.sign(es4, 'edugain')
// console.log(highlight("-------- *JWT*  ", {language: "markdown"}))
// console.log(highlight(JSON.stringify(es4.getJWT(), undefined, 2), {language: "json"}))
// console.log('JWT: ' + es4s)


//
// const tc = new TrustChain(trustroot1)
// tc.add(es1s)
// tc.add(es2s)
// tc.add(es3s)
// tc.add(es4s)
//
// let paths = tc.findPaths()
// if (paths.length === 0) {throw new Error("No trust paths found")}
//
// console.log()
// console.log(highlight("Discovered trusted paths ", {language: "markdown"}))
// console.log(highlight(JSON.stringify(paths, undefined, 2), {language: "json"}))
// console.log()
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
