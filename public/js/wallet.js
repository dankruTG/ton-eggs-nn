import { TonConnect } from '@tonconnect/sdk';

const connector = new TonConnect({
  manifestUrl: 'https://github.com/dankruTG/ton-eggs-nn/blob/master/tonconnect-manifest.json'
});
const unsubscribe = connector.onStatusChange(
    walletInfo => {
        // update state/reactive variables to show updates in the ui
    } 
);
const walletsList = await connector.getWallets();
import {
    isWalletInfoCurrentlyEmbedded,
    isWalletInfoInjectable,
    isWalletInfoCurrentlyInjected,
    isWalletInfoRemote,
    WalletInfo
} from '@tonconnect/sdk';

/* Use for filtration */
const remoteConnectionWalletInfos = walletInfoList.filter(isWalletInfoRemote);

// all wallets that supports injecteble connection (EVEN THOSE THAT ARE NOT INJECTED TO THE CURRENT PAGE) 
const injectableConnectionWalletInfos = walletInfoList.filter(isWalletInfoInjectable);

// wallets that are injected to the current webpage 
const currentlyInjectedWalletInfos = walletInfoList.filter(isWalletInfoCurrentlyInjected);
const embeddedWalletInfo = walletInfoList.find(isWalletInfoCurrentlyEmbedded);

    
/* or use as type guard */
if (isWalletInfoRemote(walletInfo)) {
    connector.connect({
        universalLink: walletInfo.universalLink,
        bridgeUrl: walletInfo.bridgeUrl
    });
    return;
}

if (isWalletInfoCurrentlyInjected(walletInfo)) {
    connector.connect({
        jsBridgeKey: walletInfo.jsBridgeKey
    });
    return;
}

const universalLink = connector.connect(walletConnectionSource);
const walletConnectionSource = {
    universalLink: 'https://app.tonkeeper.com/ton-connect',
    bridgeUrl: 'https://bridge.tonapi.io/bridge',
    jsBridgeKey: 'tonkeeper'
}
const sources = [
    {
        bridgeUrl: 'https://bridge.tonapi.io/bridge' // Tonkeeper
    },
    {
        bridgeUrl: 'https://<OTHER_WALLET_BRIDGE>' // Tonkeeper
    }
];

connector.connect(sources);

connector.connect(walletConnectionSource);
import { isWalletInfoCurrentlyEmbedded, WalletInfoCurrentlyEmbedded } from '@tonconnect/sdk';

// "connect button" click handler.
// Execute this before show wallet selection modal.

  

if (!connector.connected) {
    alert('Please connect wallet to send the transaction!');
}

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
        {
            address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
            amount: "20000000",
         // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
        {
            address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
            amount: "60000000",
         // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
        }
    ]
}

try {
    const result = await connector.sendTransaction(transaction);
    
    // you can use signed boc to find the transaction 
    const someTxData = await myAppExplorerService.getTransaction(result.boc);
    alert('Transaction was sent successfully', someTxData);
} catch (e) {
    if (e instanceof UserRejectedError) {
        alert('You rejected the transaction. Please confirm it to send to the blockchain');
    } else {
        alert('Unknown error happened', e);
    }
}
if (connector.connected) {
    await connector.disconnect();
}

// else show modal and ask user to select a wallet

const connectWalletButton = document.getElementById('connectWalletButton');
const walletStatus = document.getElementById('walletTaskStatus');

connectWalletButton.addEventListener('click', async () => {
    try {
        // Получаем список доступных кошельков
        const walletsList = await connector.getWallets();
        console.log(walletsList);

        // Проверяем, что есть доступные кошельки
        if (walletsList.length > 0) {
            // Предположим, что пользователь выбрал первый кошелек из списка
            const selectedWallet = walletsList[0];

            // Подключение к выбранному кошельку
            const connectionSource = {
                universalLink: selectedWallet.universalLink,
                bridgeUrl: selectedWallet.bridgeUrl
            };
            await connector.connect(connectionSource);

            // Обновляем статус и выводим информацию о кошельке
            const account = connector.account;
            walletStatus.textContent = 'Done!';
            console.log('Wallet address:', account.address);
        } else {
            walletStatus.textContent = 'No wallets found';
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        walletStatus.textContent = 'none';
    }
});
