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

  fetch(id) {
    let webfingerEndpoint = new URL('/.well-known/webfinger', id)
    let rel = 'http://oauth.net/specs/federation/1.0/entity'
    let resource = id
    return rp({
      url: webfingerEndpoint,
      qs: {
        rel: rel,
        resource: resource
      }
    })
      .then((data) => {
        let res = JSON.parse(data)
        if (res.links.length < 1) {
          throw new Error("No links provided in LRD")
        }
        return this.fetchES(res.links[0].href)
      })


  }


}

module.exports = ESFetcher
