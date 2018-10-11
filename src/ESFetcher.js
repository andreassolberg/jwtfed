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
        let eslist = JSON.parse(data)
        return new SignedEntityStatement(eslist[0])
      })
  }

  fetch(sub, iss) {
    iss = iss || sub
    let federationAPIendpoint = new URL('/.well-known/openid-federation', iss)
    console.log("Performing a Federation API requwest request to " + federationAPIendpoint + " with this queried resource ")
    console.log("Iss: " + iss)
    console.log("Sub: " + sub)
    return rp({
      url: federationAPIendpoint,
      qs: {
        iss, sub
      }
    })
      .then((data) => {
        // console.log(" --- data ---")
        // console.log(data)
        let eslist = JSON.parse(data)
        return new SignedEntityStatement(eslist[0])

        // let res = JSON.parse(data)
        // if (res.links.length < 1) {
        //   throw new Error("No links provided in LRD")
        // }
        // return this.fetchES(res.links[0].href)
      })
      .catch((err) => {
        console.error("Error fetching webfinger data form "+ webfingerEndpoint + " with this queried resource " + sub + "   error=" + err)
      })

  }

  fetchChained(sub, iss) {
    let eslist = []
    console.log("Contacting issuer [" + iss + "] to requeset statements wrt [" + sub + "]" )
    return this.fetch(sub, iss)
      .then((ses) => {
        eslist.push(ses)
        // console.log("----")
        // console.log(ses.decoded)
        let hints = ses.getHints()
        if (hints.length > 0) {
          return Promise.all(hints.map(hint => this.fetchChained(ses.decoded.payload.iss, hint)))
            .then((list) => {
              return eslist.concat([].concat.apply([], list))
            })
        }
        return eslist
      })
  }


}

module.exports = ESFetcher
