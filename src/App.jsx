import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ClipLoader } from "react-spinners";
import {
  API_URL,
  baseChainId,
  baseChainParams,
  CONTRACT_ADDRESS,
  TOKEN_VAULT_FACTORY_ADDRESS,
} from "./config/config.js";
import { metaMaskImage } from "./assets/metamask.js";
import { formatAddress, isValidEthereumAddress } from "./utils/utils.js";
import AlertModal from "./components/alertModal.js";
import "./App.css";
import { getContract } from "./utils/contract.js";
import { vault_factory_abi } from "./abi/vault_factory_abi.js";
import { bitcoin, logo } from "./assets/images.js";
import TextInput from "./components/TextInput.js";
import VaultInput from "./components/VaultInput.js";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [deployedVault, setDeployedVault] = useState("");

  const [apiResponse, setApiResponse] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [price, setPrice] = useState("");
  const [apy, setAPY] = useState("");

  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({
    tokenAddress: "",
    price: "",
    symbol: "",
  });
  const [remainingTime, setRemainingTime] = useState(0);
  const [accessStatus, setAccessStatus] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiShow, setApiShow] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setErrorMessage(
          "MetaMask is not installed. Please install it to use this app."
        );
        return;
      }
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== baseChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: baseChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [baseChainParams],
              });
            } catch {
              setErrorMessage("Failed to add Base network to MetaMask.");
              return;
            }
          } else {
            setErrorMessage("Failed to switch to the Base network.");
            return;
          }
        }
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setIsConnected(true);
    } catch {
      setErrorMessage("Failed to connect to MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    setErrorMessage("");
    setApiResponse("");
    setAccessStatus(false);
    setApiKey("");
    localStorage.clear();
    sessionStorage.clear();
  };

  const deployTokenVault = async () => {
    setLoading(true);
    if (!walletAddress) {
      setErrorMessage("Please connect your MetaMask wallet first.");
      setLoading(false);
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token_vault_factory = new ethers.Contract(
      TOKEN_VAULT_FACTORY_ADDRESS,
      vault_factory_abi,
      signer
    );

    const deployerAddress = walletAddress;
    const deployerBytes = ethers.utils.arrayify(deployerAddress).slice(0, 20);
    const randomString = Math.random().toString(); // This value must change on every ArtworkToken deployment
    const randomBytes = ethers.utils.toUtf8Bytes(randomString);

    const concatenatedBytes = ethers.utils.concat([deployerBytes, randomBytes]);

    // Generating the salt by hashing the concatenated bytes
    let salt = ethers.utils.keccak256(concatenatedBytes);

    if (!name || !symbol) {
      setErrorMessage("Please Input the Name and Symbol");
      return;
    }
    if (!isValidEthereumAddress(tokenAddress)) {
      setErrorMessage("Token address is not a valid Ethereum address.");
      return;
    }
    if (name && symbol && tokenAddress) {
      token_vault_factory
        .deployTokenVault(salt, name, symbol, tokenAddress)
        .then(() => {
          token_vault_factory
            .computeTokenAddress(
              salt,
              name,
              symbol,
              tokenAddress,
              walletAddress
            )
            .then((address) => {
              setDeployedVault(address);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("Error occured:", error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="App">
      <div className="NavBar">
        <h2>ERC4626 TokenVault Deploy Platform</h2>
        <div className="WalletConnect">
          <button onClick={isConnected ? disconnectWallet : connectWallet}>
            <img src={metaMaskImage} alt="Metamask" />
            <div>
              {isConnected ? formatAddress(walletAddress) : `Connect Wallet`}
            </div>
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>🎇 Please Deploy Your Token Vaults. 🎇</h2>
        <div className="Card">
          <div
            className="Card-Header"
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              padding: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={logo} width="20px" />
              <h3>COVAULT</h3>
            </div>
            <h3>Tokenized Yield Vault</h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
            }}
          >
            <TextInput
              text={name}
              setText={setName}
              title="Vault Name:"
              subtitle="Example Name"
              placeholder="Vault #001"
            />
            <TextInput
              text={symbol}
              setText={setSymbol}
              title="Symbol:"
              subtitle="Example Symbol"
              placeholder="$Y1LD"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "30px",
              width: "100%",
            }}
          >
            <VaultInput
              text={price}
              setText={setPrice}
              title="Vault Share Price"
              subtitle="Price Per Share:"
              placeholder="0.01 tBTC"
            />
            <VaultInput
              text={tokenAddress}
              setText={setTokenAddress}
              title="Deposit Token Address"
              subtitle="Enter Token Address:"
              placeholder="(0x...........)"
            />
            <VaultInput
              text={apy}
              setText={setAPY}
              title="Expected APY"
              subtitle="Annual Percentage Yield:"
              placeholder="10%"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <div style={{ padding: "0px" }}>
              <h3>Vault ID</h3>
              <div>(0x...........)</div>
            </div>
            <div>
              <h4>Estimated Network Fees</h4>
              <div>
                <div>Approval $0.15</div>
                <div>Deposit $0.11</div>
                <div>Withdrawal $0.15</div>
              </div>
            </div>
          </div>
          <button
            onClick={deployTokenVault}
            style={{ width: "80%", backgroundColor: "#F6F951", color: "black" }}
          >
            {!loading ? (
              <p>Deploy Vault</p>
            ) : (
              <ClipLoader color={"#3498db"} size={20} />
            )}
          </button>
          <div style={{ paddingBottom: "30px" }}>
            By clicking "Fonfirm DEPLOY Vault", you agree to the Terms of
            Service and acknowledge that you have read and understand the
            [compnay] disclaimer. Learn more about the vault you're deploying
          </div>
        </div>
      </div>
      <AlertModal
        isOpen={deployedVault}
        onClose={() => setDeployedVault("")}
        message={`Your vault has been deployed to the address: ${deployedVault}`}
      />
      <AlertModal
        isOpen={errorMessage}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </div>
  );
}

export default App;
