import TonConnect from '@tonconnect/sdk';

const connector = new TonConnect({
  manifestUrl: 'https://github.com/dankruTG/ton-eggs-nn/blob/master/tonconnect-manifest.json'
});

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
