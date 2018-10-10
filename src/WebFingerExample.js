const URL = require('url').URL
const REL = 'https://openid.net/specs/federation/1.0/entity'

class WebFingerExample {

  constructor() {

  }

  show(es, sign, apihost) {



    const webfingerUrl = new URL('/.well-known/openid-federation', es.jwt.iss)
    webfingerUrl.searchParams.set('iss', es.jwt.iss)
    if (es.jwt.iss !== es.jwt.sub) {
      webfingerUrl.searchParams.set('sub', es.jwt.sub)
    }


    const apiResponse = [sign.substring(0, 70) + '...']


    console.log(`======> Webfinger request to resolve ${es.jwt.iss} <======`)
    console.log(`GET ${webfingerUrl.pathname}${webfingerUrl.search} HTTP/1.1`)
    console.log(`Host: ${webfingerUrl.host}`)
    console.log()
    console.log('HTTP/1.1 200 OK')
    console.log('Content-Type: application/json')
    console.log(JSON.stringify(apiResponse))
    console.log(`======> ------------------------------------------ <======`)
    console.log()



  }



}

module.exports = WebFingerExample
