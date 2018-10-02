const URL = require('url').URL
const REL = 'https://openid.net/specs/federation/1.0/entity'

class WebFingerExample {

  constructor() {

  }

  show(es, sign, apihost) {



    const webfingerUrl = new URL('/.well-known/webfinger', es.jwt.iss)
    webfingerUrl.searchParams.set('rel', REL)
    webfingerUrl.searchParams.set('resource', es.jwt.iss)
    const apiUrl = new URL('/openid-federation/metadata-api', es.jwt.iss)
    if (apihost) {
      apiUrl.host = apihost
    }

    const response = {
      "subject" : es.jwt.iss,
      "links" :
      [
        {
          "rel" : REL,
          "href" : apiUrl.href
        }
      ]
    }



    console.log(`======> Webfinger request to resolve ${es.jwt.iss} <======`)
    console.log(`GET ${webfingerUrl.pathname}${webfingerUrl.search} HTTP/1.1`)
    console.log(`Host: ${webfingerUrl.host}`)
    console.log()
    console.log('HTTP/1.1 200 OK')
    console.log('Access-Control-Allow-Origin: *')
    console.log('Content-Type: application/jrd+json')
    console.log(JSON.stringify(response, undefined, 2))
    console.log(`======> ------------------------------------------ <======`)


    console.log()


    const apiResponse = [sign.substring(0, 70) + '...']
    apiUrl.searchParams.set('target', es.jwt.iss)


    console.log(`======> API request to resolve ${es.jwt.iss} <======`)
    console.log(`GET ${apiUrl.pathname}${apiUrl.search} HTTP/1.1`)
    console.log(`Host: ${apiUrl.host}`)
    console.log()
    console.log('HTTP/1.1 200 OK')
    console.log('Content-Type: application/json')
    console.log(JSON.stringify(apiResponse))
    console.log(`======> ------------------------------------------ <======`)



  }



}

module.exports = WebFingerExample
