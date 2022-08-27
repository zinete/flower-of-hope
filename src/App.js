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
        const tx = await nftContract.mintFlower()
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
        const balanceOf = await nftContract.balanceOf(currentAccount)
        const collectibleUpdate = [];
        for (let tokenIndex = 0; tokenIndex < Number(balanceOf); tokenIndex++) {
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
  }, [currentAccount, renderNFT])
  return (
    <div className="mx-auto container">
      <header>
        <ThemeSwitch />
        <div className="mt-4 flex items-center flex-col">
          <h3>FLOWER OF HOPE</h3>
          <div className="bg-colorA58-light cursor-pointer rounded px-5 py-2 my-2 text-colorFFF-light">
            {currentAccount ? mintNftButton() : connectWalletButton()}
          </div>
          <p>{currentAccount}</p>
        </div>
        <div className="grid grid-cols-6 gap-10 mt-10 ">
          {
            !tokenJson.length ? <p style={{ textAlign: 'center' }}>加载中。。。</p> : <>
              {
                tokenJson.map((items, index) => (
                  <div key={'token' + index} className="bg-slate-700 text-colorFFF-light p-10 cursor-pointer">
                    <div>
                      <span>{items.name}</span>
                      <span style={{}}>{items.description}</span>
                    </div>
                    <img src={items.image} alt={items.name} />

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
