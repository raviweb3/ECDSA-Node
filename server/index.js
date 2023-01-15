const secp = require("ethereum-cryptography/secp256k1");
const { getRandomBytesSync } = require("ethereum-cryptography/random");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {};

// Generate random key pair with balance
for(let i = 0; i < 5; i++){
  const privKey = secp.utils.randomPrivateKey();
  const pubKey = secp.getPublicKey(privKey);
  const hPrivKey = toHex(privKey);
  const hPubKey = toHex(pubKey);

  balances[hPubKey] = getRandomBytesSync(1)[0]; // uint8array

  console.log({ privateKey: hPrivKey, publicKey: hPubKey, balance: balances[hPubKey]});
};

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

async function recoverKey(message, signature, recoveryBit) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit);
}

app.get("/keys", (req, res) => {
  res.send({ "keys": keys });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, recovery } = req.body;
  
  let tx = JSON.stringify({ "to": recipient, "amount": amount });
  const sender = secp.recoverPublicKey(hashMessage(tx), signature, recovery);
  
  const isValid = secp.verify(signature, hashMessage(tx), sender);
  if(!isValid){
      res.status(400).send({ message: "Invalid signature" });
      return
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
