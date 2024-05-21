import { TonConnect } from '@tonconnect/sdk';

const connector = new TonConnect({
  manifestUrl: 'https://dankrutg.github.io/ton-eggs-nn/tonconnect-manifest.json'
});

const connectWalletButton = document.getElementById('connectWalletButton');
const walletStatus = document.getElementById('walletTaskStatus');

connectWalletButton.addEventListener('click', async () => {
    try {
        await connector.connect();
        const account = connector.account;
        walletStatus.textContent = 'Done!';
        console.log('Wallet address:', account.address);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        walletStatus.textContent = 'none';
    }
});
