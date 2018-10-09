const
  JWKS = require('./JWKS'),
  SignedEntityStatement = require('./SignedEntityStatement'),
  objectAssignDeep = require('object-assign-deep'),
  rp = require('request-promise'),
  URL = require('url').URL


class ESFetcher {

  constructor() {
  }

  fetchES(url) {
    return rp({url})
      .then((data) => {
        return new SignedEntityStatement(data)
      })
  }

  fetch(sub, iss) {
    iss = iss || sub
    let webfingerEndpoint = new URL('/.well-known/webfinger', iss)
    let rel = 'http://oauth.net/specs/federation/1.0/entity'
    console.log("Performing a WebFinger request to " + webfingerEndpoint + " with this queried resource " + sub)
    return rp({
      url: webfingerEndpoint,
      qs: {
        rel: rel,
        resource: sub
      }
    })
      .then((data) => {
        console.log(" --- data ---")
        console.log(data)
        let res = JSON.parse(data)
        if (res.links.length < 1) {
          throw new Error("No links provided in LRD")
        }
        return this.fetchES(res.links[0].href)
      })
      .catch((err) => {
        console.error("Error fetching webfinger data form "+ webfingerEndpoint + " with this queried resource " + sub + "   error=" + err)
      })

  }

  fetchChained(sub, iss) {
    let eslist = []
    // console.log("Contacting issuer [" + iss + "] to requeset statements wrt [" + sub +"]" )
    return this.fetch(sub, iss)
      .then((ses) => {
        eslist.push(ses)
        console.log("----")
        console.log(ses.decoded)
        if (ses.decoded.payload.authority_hints && ses.decoded.payload.authority_hints.length) {
          return Promise.all(ses.decoded.payload.authorityHints.map(hint => this.fetchChained(ses.decoded.payload.iss, hint)))
            .then((list) => {
              return eslist.concat([].concat.apply([], list))
            })
        }
        return eslist
      })
  }


}

module.exports = ESFetcher
