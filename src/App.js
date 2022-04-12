
import './App.css';
import React from 'react';
import { ethers } from 'ethers';
import { ThemeSwitch } from "./components";
import Flower from './contracts/config/index.js'



function App() {
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [tokenJson, setTokenJson] = React.useState([]);


  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }



  const mintNftHandler = async () => {

    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(Flower.contract.flower, Flower.abi.Flower, signer);
        console.log(nftContract, 'nftContract')

        const tx = await nftContract.mintFlower()
        console.log("Mining... please wait");
        tx.wait()
      }

    } catch (error) {
      console.log(error, 'mintNftHandler err')

    }
  }

  const renderNFT = async () => {
    const { ethereum, atob } = window
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(Flower.contract.flower, Flower.abi.Flower, signer);

        const collectibleUpdate = [];
        for (let tokenIndex = 1; tokenIndex < 10; tokenIndex++) {
          try {
            console.log("GEtting token index", tokenIndex);

            const tokenURI = await nftContract.tokenURI(tokenIndex);
            const jsonManifestString = atob(tokenURI.substring(29))
            console.log("jsonManifestString", jsonManifestString);
            /*
                      const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
                      console.log("ipfsHash", ipfsHash);
                      const jsonManifestBuffer = await getFromIPFS(ipfsHash);
                    */
            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              console.log("jsonManifest", jsonManifest);
              collectibleUpdate.push({ ...jsonManifest });
            } catch (e) {
              console.log(e);
            }

          } catch (e) {
            console.log(e);
          }
        }
        setTokenJson(collectibleUpdate)
      }
    } catch (error) {
      console.log(error, 'render error');

    }
  }
  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }
  React.useEffect(() => {
    checkWalletIsConnected()
    renderNFT()
  }, [currentAccount])
  return (
    <div className="App">
      <header className="App-header">
        <ThemeSwitch />

        <h3>FLOWER OF HOPE</h3>
        <div>
          {currentAccount ? mintNftButton() : connectWalletButton()}
        </div>
        <p>{currentAccount}</p>
        <div style={{
          gap: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
        }}>

          {
            !tokenJson.length ? <p style={{ textAlign: 'center' }}>加载中。。。</p> : <>
              {
                tokenJson.map((items, index) => (
                  <div key={'token' + index} style={{
                    display: 'flex',
                    flexDirection: 'column',

                  }}>
                    <div style={{ display: 'flex', width: '200px', flexDirection: 'column' }}>
                      <span>{items.name}</span>
                      <span style={{}}>{items.description}</span>
                    </div>
                    <img src={items.image} alt={items.name} style={{
                      width: '200px',
                      backgroundColor: '#00000010',
                      marginTop: '20px'
                    }} />

                  </div>
                ))
              }
            </>
          }


        </div>


      </header>
    </div>
  );
}

export default App;
