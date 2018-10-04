const
  ESFetcher = require('./src/ESFetcher'),
  TrustChain = require('./src/TrustChain'),
  highlight = require('cli-highlight').highlight,
  SignedEntityStatement = require('./src/SignedEntityStatement'),
  Sequelize = require('sequelize'),
  fs = require('fs')


// let entityid = process.argv[3]
// let usage = process.argv[2]

const eslist = [


  "eyJhbGciOiJSUzI1NiIsImtpZCI6IllXZERVM0JEVTBaUlJEQTBia2hzT0RSc1ZEUnBiMTlrTm5veFVsOWlaWEZxTlMxYVJqbGxaRTU1UVEifQ.eyJpc3MiOiAiaHR0cHM6Ly9mZWlkZS5ubyIsICJpYXQiOiAxNTM4NDY0NzQ3LCAiZXhwIjogMTUzODU1MTE0NywgIm1ldGFkYXRhIjogeyJvcGVuaWRfY2xpZW50Ijoge319LCAic3ViIjogImh0dHBzOi8vbnRudS5ubyIsICJqd2tzIjogeyJrZXlzIjogW3sia3R5IjogIlJTQSIsICJraWQiOiAiVXpWRFpWWm5lVlZ2V1dsWU0wdFNOMHRwUTA4eFVtdzFOM2RDZG5sVExVeFRXbTQwWDBwWlFVOXRPQSIsICJuIjogInhFMDh6dFJ4YUxuOXFZX29XVEg2WEE4RzNrZjZRRk9UZ1hoeDdfaTZDQmpyQ1VseHpVa2tHb0FGRlhqdldKYTUtUnBNVjdMSy04cWkzazJ3b2s2ZTEycHdaWk9leENkUlNQbWo2WWlYRzVFS2xVVGdTVEtPZVJmdmRnUTkyOGRVcVlxY1o4Q2g3Sk5HWGFRc1M1bmhEMm01U1Z5c200XzFVcE9VYm15a2kwTW1wNXV2QzZvV2oxQm9HcjJlaUNEc3hyZ2VuQ0hsRnI4Z0U3eUt2RGRPaEhIOEcycFlPOHRUN0tlamhSRXNlcXBUOVhUOEVKTjJKcUdJSGZYMXVQRzJWdnpET0JOYjhxQXhYeU4xVlZlYmRDUmxJdGh1dDJvMnhuUFZsMXJYYm0tT0EzV1ZwcUpTZ01OUHdZQ1JiTGdpbWVSUnNLZFdlR3h3U0NYMndQNFNKdyIsICJlIjogIkFRQUIifV19LCAia2lkIjogIllXZERVM0JEVTBaUlJEQTBia2hzT0RSc1ZEUnBiMTlrTm5veFVsOWlaWEZxTlMxYVJqbGxaRTU1UVEifQ.kvxgO3p_3oPbdZiMFprGpAWswPd7imTwuvQZxiOHQAr2j3GRV5YQklep03CieixX27JbvM8DhEaJXVYhPXY93t224wXYLR0QP0Ylx3LSfTYLSEAqFhrk9zc7X10f53oA8N_ae_-3V_JgIbgSRrNaIL2qXH0e8xJJBFso-PIcYmnSDZ10k0W0UBGK7WmktOI8v6nTfjAReEDxrePd6NEQmdmyOb5iW1cVidMgfIKTL1FwSeqV0DUzME3mNANUMw4Tz_OUepTAipHfSFYYe_n0FLrWVUaW4_mqk5O-x2xDvA2pTrxlD26DP8i2M8oPPv9i9uN5aWa5c8fqHJTcfOyJXQ",
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IlV6VkRaVlpuZVZWdldXbFlNMHRTTjB0cFEwOHhVbXcxTjNkQ2RubFRMVXhUV200MFgwcFpRVTl0T0EifQ.eyJpc3MiOiAiaHR0cHM6Ly9udG51Lm5vIiwgImlhdCI6IDE1Mzg0NjQ3NDgsICJleHAiOiAxNTM4NTUxMTQ4LCAibWV0YWRhdGEiOiB7Im9wZW5pZF9jbGllbnQiOiB7ImFsbG93ZWRfY2xhaW1zIjogWyJzdWIiLCAibmFtZSIsICJlbWFpbCJdLCAiaWRfdG9rZW5fc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6IFsiUlMyNTYiLCAiUlM1MTIiXSwgInJlc3BvbnNlX3R5cGVzIjogWyJjb2RlIl19fSwgInN1YiI6ICJodHRwczovL2Zvb2RsZS51bmluZXR0Lm5vIiwgImF1dGhvcml0eV9oaW50cyI6IHsiaHR0cHM6Ly9mZWlkZS5ubyI6IFsiaHR0cHM6Ly9mZWlkZS5ubyJdfSwgImp3a3MiOiB7ImtleXMiOiBbeyJrdHkiOiAiUlNBIiwgImtpZCI6ICJaRUZLWVVwUFEySnFjV1J6VFZweGNERm9NM04zUzFaTVRISjFiRFJNVDFKWk1IbFpTMGxRUTJsbE9BIiwgImUiOiAiQVFBQiIsICJuIjogIndJN0lKNi1SaWJUMmktQURJcjEtR25iSmgzZVE2V2RaMUpHX2RDMUE4Q1lSdnRjLURJMHV6U3N4UlpvNkU0TURLRnBKaHNnRWxFNzJLN2xXSTUwSUlWWDZhYVlqWUNHbTkyZTA4UG1FblpwWkx3U1ByWTZEWF96M1M1MHZ6UUNKUlBVbHQ0dElqeWIycENVXzdteVpicUc3WXlha2Q4djVvbTJMLVhrVElPR0VvV244eVVBdW9NTU1BbmJIeGNsUm9CWGU2T0VmOV9lWDF6MkRzWThIQWFfUlJNdnVxZkpZNmNyWUZIQ3hJRkJKQjF2SDlVWnZwb09UeXVZdU1DYURiMl8wbkdtdXYxN2hCcWI1MldpZWFPbjd2NDJDWkFWdUJPcU00VlZkYlllSGs1eGQycW9hakFJN0VTSU1mQnNqN3lGWThMUV9rWXFuV0h4cUk2SlhBdyJ9XX0sICJraWQiOiAiVXpWRFpWWm5lVlZ2V1dsWU0wdFNOMHRwUTA4eFVtdzFOM2RDZG5sVExVeFRXbTQwWDBwWlFVOXRPQSJ9.l24fyo67pn3MfE_qiBrr0L3HhiUAFBoJMS9t0J9t4ckdBCPA8UGuXW2pAnfllvO6-pQgv33cdXoiw6M1q7865KQJj1ec6q1qFy751ttZckE7Z1R90zq5lmKQhVvoYsvGn2KQz03Jox4s5IC2D8gmSyn-Nvgfvhcaf1BV_fwgnn1K0fGeA4JA1mummUOBle5tDUZE6UW3mPp3wtfmFzQ8NSUft7EJsALDYuAgjHNaaEQamYjTkV6KphANQVRaX_wSNvyq9WB5vAV3bzWnE7pFsrVuCBg7UBu8QkYIfjmklz9WnLd3ham4UJpZ7WhZ2NI8m9TcT4-JUCPpS_Ir_Xklxg",
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IlpFRktZVXBQUTJKcWNXUnpUVnB4Y0RGb00zTjNTMVpNVEhKMWJEUk1UMUpaTUhsWlMwbFFRMmxsT0EifQ.eyJpc3MiOiAiaHR0cHM6Ly9mb29kbGUudW5pbmV0dC5ubyIsICJpYXQiOiAxNTM4NDY0NzQ4LCAiZXhwIjogMTUzODU1MTE0OCwgIm1ldGFkYXRhIjogeyJvcGVuaWRfY2xpZW50IjogeyJhcHBsaWNhdGlvbl90eXBlIjogIndlYiIsICJjbGFpbXMiOiBbInN1YiIsICJuYW1lIiwgImVtYWlsIiwgInBpY3R1cmUiXSwgImlkX3Rva2VuX3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOiBbIlJTMjU2IiwgIlJTNTEyIl0sICJyZWRpcmVjdF91cmlzIjogWyJodHRwczovL2Zvb2RsZS51bmluZXR0Lm5vL2NhbGxiYWNrIl0sICJyZXNwb25zZV90eXBlcyI6IFsiY29kZSJdfX0sICJzdWIiOiAiaHR0cHM6Ly9mb29kbGUudW5pbmV0dC5ubyIsICJhdXRob3JpdHlfaGludHMiOiB7Imh0dHBzOi8vbnRudS5ubyI6IFsiaHR0cHM6Ly9mZWlkZS5ubyJdfSwgImp3a3MiOiB7ImtleXMiOiBbeyJrdHkiOiAiUlNBIiwgImtpZCI6ICJaRUZLWVVwUFEySnFjV1J6VFZweGNERm9NM04zUzFaTVRISjFiRFJNVDFKWk1IbFpTMGxRUTJsbE9BIiwgIm4iOiAid0k3SUo2LVJpYlQyaS1BRElyMS1HbmJKaDNlUTZXZFoxSkdfZEMxQThDWVJ2dGMtREkwdXpTc3hSWm82RTRNREtGcEpoc2dFbEU3Mks3bFdJNTBJSVZYNmFhWWpZQ0dtOTJlMDhQbUVuWnBaTHdTUHJZNkRYX3ozUzUwdnpRQ0pSUFVsdDR0SWp5YjJwQ1VfN215WmJxRzdZeWFrZDh2NW9tMkwtWGtUSU9HRW9Xbjh5VUF1b01NTUFuYkh4Y2xSb0JYZTZPRWY5X2VYMXoyRHNZOEhBYV9SUk12dXFmSlk2Y3JZRkhDeElGQkpCMXZIOVVadnBvT1R5dVl1TUNhRGIyXzBuR211djE3aEJxYjUyV2llYU9uN3Y0MkNaQVZ1Qk9xTTRWVmRiWWVIazV4ZDJxb2FqQUk3RVNJTWZCc2o3eUZZOExRX2tZcW5XSHhxSTZKWEF3IiwgImUiOiAiQVFBQiJ9LCB7Imt0eSI6ICJSU0EiLCAia2lkIjogIlpFRktZVXBQUTJKcWNXUnpUVnB4Y0RGb00zTjNTMVpNVEhKMWJEUk1UMUpaTUhsWlMwbFFRMmxsT0EiLCAibiI6ICJ3STdJSjYtUmliVDJpLUFESXIxLUduYkpoM2VRNldkWjFKR19kQzFBOENZUnZ0Yy1ESTB1elNzeFJabzZFNE1ES0ZwSmhzZ0VsRTcySzdsV0k1MElJVlg2YWFZallDR205MmUwOFBtRW5acFpMd1NQclk2RFhfejNTNTB2elFDSlJQVWx0NHRJanliMnBDVV83bXlaYnFHN1l5YWtkOHY1b20yTC1Ya1RJT0dFb1duOHlVQXVvTU1NQW5iSHhjbFJvQlhlNk9FZjlfZVgxejJEc1k4SEFhX1JSTXZ1cWZKWTZjcllGSEN4SUZCSkIxdkg5VVp2cG9PVHl1WXVNQ2FEYjJfMG5HbXV2MTdoQnFiNTJXaWVhT243djQyQ1pBVnVCT3FNNFZWZGJZZUhrNXhkMnFvYWpBSTdFU0lNZkJzajd5Rlk4TFFfa1lxbldIeHFJNkpYQXciLCAiZSI6ICJBUUFCIn1dfSwgImtpZCI6ICJaRUZLWVVwUFEySnFjV1J6VFZweGNERm9NM04zUzFaTVRISjFiRFJNVDFKWk1IbFpTMGxRUTJsbE9BIn0.eYpLtDsWuh1mkKYncoF7oKFB3WLtFHmUUk6laWPFlUiwhzJUgjaGe9Qc_sqWQDgj1ejQSIjwLn9qS7DCvEs1JcNMIUMVLIUpIzeFgMH8OOtx0KmAS7RHlj2uGaGJ-ZgFNBK_-lJQP5KXlSPKBLJN_jVP4Z-gMnQVSYjXdCEHzaHz6Zp9O7i6mAndYvbKk3BAjAbJZphlGKeYl2sjz5X8QbUHv4uTx7HrpQYneA2wmTyhIxT76VtXjR72icOkZasBOR8lq5_uZYgTjV_0hVuweo2VfIr_ay-3WJTW7f58HPvioqZTMV-yStjcclpFiP_o8qHnSrIOu99YQmRey-d1pg"
]

const trustroot = [
  {
    "sub": "https://feide.no",
    "metadata": {
      "openid-client": {
        "special": true
      }
    },
    "jwks": {
      "keys": [
        {
          "key_ops": [
            "verify"
          ],
          "use": "sig",
          "kty": "RSA",
          "kid": "YWdDU3BDU0ZRRDA0bkhsODRsVDRpb19kNnoxUl9iZXFqNS1aRjllZE55QQ",
          "e": "AQAB",
          "n": "tlEoSbeWkRR67I4czPEa8kRAS5At-gpb6wxYxuhyUrkJw_s3PoePc32Xvl2qKycReXx5CwVKV7zjFdNwvQDCBLvaaqC46_H4J2jcZdcoR7DAaaJzIutrrOk5IjhjJOsmaUZ78En9q6-TID5bJeQa-X6EbU8g_Yi5u8GW6qKbehHCzH4ORpYV7Zxt2wtYiZuZp-TtPFOgnp1IyceGUrPEJUsN9RwYgGLYyALxVxz_LlUk8bMAxqeu7EE110z_Rjo_S8e86wdEXaGw0wH_bn6AjmuSZFXBnHdZj5f16OYXfk5jsJ6a7ZhQr5XfCxxDTmxj_WSJeqG3FjiLlqGZuT1DYQ",
          "d": "T0lqIOzzUPK8JqYDBmmQU221HGd-ZzAcG1NKRG6QUUNhaNaWht4DV7F1zXcEazHZWqD0LwPE-fUOOM60R63NsqtTaG2vHgUj61eiCbQRM2Q9uXLJaZVCRXdDvosRKtwM31mkyrIS3JhFfo8_qnHR_VC1HKh962SLiYi-Lho7TVEyH5wpI_bZ7HPapPYNm6lpRaxqSrPSf-gmejHTSJ6wMWpsOFGUBsnwhXEc2s9eXDPKGCcXjm74YEX33ItIblmcYTO_Z6OLvECLnDKqUvJbwE_G6z7Praj75zUJKA0xbi2hKJUyH9-JS3ZYvBHmJD4eSlOWTJhI89S6CzrVU_FsJQ",
          "p": "2pHQSp_i4WwCOWZWFYPTPuCLColdaGLwl2O4lthwlImH67t2OxE9pt9tHdoKsmTBeNgCWTmdNg8yTLC5LhU37MWpCwhD42AMs_vp62-P-7Iq0dLneUHkTxQWyjrUOsc5bctNxR_6-_9EZKNZ5Uc4vMmBfV_i8G-RigKg7es_NUs",
          "q": "1YoD9Ylvr_aK-GcoHszYPFHLsIhiqxAvqsaWMXcjDK9YxTxDdmfcb9P3Lk7EPBEHR1twCiJa9C1YtPEflqYuQ_KT_wVc46fTs8OJlvfI54zT_pAIMTrDPjfFUud4tA8EOUlvvs7rhx-cN35ckh-PGsEBpNE0A9PKXrbfVVg2OoM"
        }
      ]
    }
  }
]

// if (!entityid || !usage) {
//   console.error("Usage: node lookup.js openidClient https://serviceprovider.andreas.labs.uninett.no/application1007")
//   process.exit(1)
// }

// const esf = new ESFetcher()
// console.log(highlight("--------- ", {language: "markdown"}))
// console.log(highlight("Looking up trusted [" + usage + "] metadata for " + entityid + ".", {language: "markdown"}))


let esl = eslist.map((esraw) => new SignedEntityStatement(esraw))
console.log("----- Dump")
esl.forEach((es) => {
  console.log("-------")
  console.log(highlight(JSON.stringify(es.decoded.payload, undefined, 2), {language: "json"}))
})

const tc = new TrustChain(trustroot)
esl.forEach((es) => {
  tc.add(es)
})
// tc.dump()

let paths = tc.findPaths()
if (paths.length === 0) {throw new Error("No trust paths found")}

console.log("--- paths")
console.log(paths)

console.log()
console.log(highlight("Discovered trusted paths ", {language: "markdown"}))
console.log(highlight(JSON.stringify(paths, undefined, 2), {language: "json"}))
console.log()

let usage = 'openid_client'
let metadata = tc.validate(paths[0], usage)
console.log(highlight("--------- ", {language: "markdown"}))
console.log(highlight("Resolved metadata for " + metadata.identifier, {language: "markdown"}))
console.log(highlight("Type " + metadata.entityType, {language: "markdown"}))
console.log(highlight("Metadata:", {language: "markdown"}))
console.log(highlight(JSON.stringify(metadata.getMetadata(), undefined, 2), {language: "json"}))
console.log(highlight("Trusted JWKS:", {language: "markdown"}))
console.log(highlight(JSON.stringify(metadata.jwks, undefined, 2), {language: "json"}))
console.log()


//
//
//
//
// esf.fetchChained(entityid)
//   .then((list) => {
//     console.log("Result")
//     // console.log(ses)
//     console.log(highlight(JSON.stringify(list, undefined, 2), {language: "json"}))
//
//
//     const tc = new TrustChain(trustroot)
//     list.forEach((es) => {
//       tc.add(es)
//     })
//
//
//     tc.dump()
//
//     let paths = tc.findPaths()
//     if (paths.length === 0) {throw new Error("No trust paths found")}
//
//     console.log()
//     console.log(highlight("Discovered trusted paths ", {language: "markdown"}))
//     console.log(highlight(JSON.stringify(paths, undefined, 2), {language: "json"}))
//     console.log()
//
//     let metadata = tc.validate(paths[0], usage)
//     console.log(highlight("--------- ", {language: "markdown"}))
//     console.log(highlight("Resolved metadata for " + metadata.identifier, {language: "markdown"}))
//     console.log(highlight("Type " + metadata.entityType, {language: "markdown"}))
//     console.log(highlight("Metadata:", {language: "markdown"}))
//     console.log(highlight(JSON.stringify(metadata.getMetadata(), undefined, 2), {language: "json"}))
//     console.log(highlight("Trusted JWKS:", {language: "markdown"}))
//     console.log(highlight(JSON.stringify(metadata.jwks, undefined, 2), {language: "json"}))
//     console.log()
//
//
//   })
//   .catch((err) => {
//     console.error("error ", err)
//   })
