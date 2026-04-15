import React, { useState } from 'react';
import './ConnectWallet.css';

function ConnectWallet({ onConnect }) {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError('MetaMask not installed. Please install MetaMask extension.');
        setConnecting(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);
        onConnect(userAccount);
        console.log('Connected account:', userAccount);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
  };

  return (
    <div className="wallet-container">
      {error && <div className="wallet-error">{error}</div>}
      
      {account ? (
        <div className="wallet-connected">
          <span className="wallet-address">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </span>
          <button 
            className="wallet-btn disconnect"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          className="wallet-btn connect"
          onClick={connectWallet}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;
