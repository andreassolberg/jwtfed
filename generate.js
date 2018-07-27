const
  jwk = require('jwk-lite')


let kid = process.argv[2]
let data = []

jwk.generateKey('RS256')
  .then(keys => {
    // console.log(keys.publicKey)
    // console.log(keys.privateKey)
    jwk.exportKey(keys.publicKey)
      .then(jsonJwk => {
        // console.log(jsonJwk)
        jsonJwk.kid = kid
        jsonJwk.use = 'sig'
        data.push(jsonJwk)

        return jwk.exportKey(keys.privateKey)
      })
      .then(jsonJwk => {
        // console.log(jsonJwk)
        jsonJwk.kid = kid
        jsonJwk.use = 'sig'
        data.push(jsonJwk)

        console.log(" ========")
        console.log(JSON.stringify(data, undefined, 2))
      })
  })
