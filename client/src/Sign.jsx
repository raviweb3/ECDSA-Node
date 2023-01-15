import server from "./server";

import { useState } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";

import { recoverPublicKey, sign } from "ethereum-cryptography/secp256k1";

function Sign() {
    const [key, setKey] = useState("");
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [signature, setSignature] = useState("");
    const [recovery, setRecovery] = useState(0);
  
    function hashMessage(message) {
        return keccak256(utf8ToBytes(message));
    }
    
    async function signMessage(msg) {
        return sign(hashMessage(msg), new Uint8Array(hexToBytes(key)), { recovered: true });
    }
  
    const signTx = async () => {
        let tx = JSON.stringify({ "to": address, "amount": parseInt(amount) })
        const signed = await signMessage(tx);//Array [ Uint8Array(70), 0 ]
        setSignature(toHex(signed[0]));
        setRecovery(signed[1]);
    };

  return (
    <div className="container sign">
      <h1>Sign Transaction</h1>

      <label>
        Private key
        <input placeholder="Type a private key" value={key} onChange={e => setKey(e.target.value)}></input>
      </label>
      
      <label>
        Destination Address
        <input placeholder="Type an address" value={address} onChange={e => setAddress(e.target.value)}></input>
      </label>
      
      <label>
        Amount
        <input placeholder="Type an amount to send" value={amount} onChange={e => setAmount(e.target.value)}></input>
      </label>
      
      <label>
        Signature
        <input placeholder="Signature" value={signature}></input>
      </label>
      
      <label>
        Recovery Bit
        <input placeholder="Recovery Bit" value={recovery}></input>
      </label>

      <input type="submit" className="button" onClick={signTx} value="Sign"></input>
    </div>
  );
}

export default Sign;
