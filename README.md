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
