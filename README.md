# JWT Federations

JWTFed is a Node.js library that implements creating and signing entity statements, validation of entity statements, validation of trust chains, resolving protocol specific metadata and more.

[Read more about JWT Federations](https://oauth.no/jwtfederations/)

To install

```
npm i jwtfed --save
```


Run demo suite with:

```
npm start
```

Edit `index.js` to play with different entity statement claims, and run again.


```
node lookup.js openidClient https://serviceprovider.andreas.labs.uninett.no/application1007
```
---


Generate new keys for the jwks keystore (to stdout) by typing:

```
node generate some_key_identifier
```


## Class ESFetcher

Fetching entity statements

```
const fetcher = new ESFetcher()
fetcher.fetchChained(entityid)
  .then((list) => {
    console.log("Result")
  })
```


## Class TrustChain

Instanciate with a trustroot.

```
const tc = new TrustChain(trustroot)
```

Add signed entitystatement objects.

```
list.forEach((es) => {
  tc.add(es)
})
tc.dump()
```

Look for paths, for a specific leaf node:

```
let paths = tc.findPaths('https://foodle.uninett.no')
if (paths.length === 0) {throw new Error("No trust paths found")}
```

## Class EntityStatement

## Class SignedEntityStatement
