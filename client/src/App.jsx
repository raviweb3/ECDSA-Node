import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Sign from './Sign';
import "./App.scss";
import { useState, useEffect } from "react";
import server from "./server";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
        <Wallet
            balance={balance}
            setBalance={setBalance}
            address={address}
            setAddress={setAddress}
        />
        <Transfer
            setBalance={setBalance}
            address={address} 
            signature={signature}
            setSignature={setSignature}
        />
        <Sign />
    </div>
  );
}

export default App;
