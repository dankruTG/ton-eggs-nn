import { saveProgress, getProgress } from './firebase.js';
import { addEggToInventory } from './addEggs.js';

let speedUpgradeLevel = 1;
let speedUpgradePrice = 100;
let energyUpgradeLevel = 1;
let energyUpgradePrice = 50;
let balance = 0;

// Восстановление данных из базы данных при загрузке
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        speedUpgradeLevel = savedProgress.speedUpgradeLevel || 1;
        speedUpgradePrice = savedProgress.speedUpgradePrice || 100;
        energyUpgradeLevel = savedProgress.energyUpgradeLevel || 1;
        energyUpgradePrice = savedProgress.energyUpgradePrice || 50;
        balance = savedProgress.balance || 0;
        updateShopDisplay();
    }
});

async function openShopModal() {
    const shopModal = document.getElementById('shopModal');
    if (shopModal) {
        shopModal.style.display = 'block'; // Показать модальное окно
    }
}

function closeShopModal() {
    const shopModal = document.getElementById('shopModal');
    if (shopModal) {
        shopModal.style.display = 'none'; // Скрыть модальное окно
    }
}

async function buyUpgrade(type) {
    const userData = await getProgress(userId);
    const coinBalance = Number(userData.balance);

    if (type === 'speed') {
        let speedUpgradeLevel = Number(userData.speedUpgradeLevel);
        let speedUpgradePrice = Number(userData.speedUpgradePrice);
        if (coinBalance >= speedUpgradePrice) {
            // Покупка улучшения скорости
            await updateCoinBalance(-speedUpgradePrice);
            speedUpgradeLevel++;
            speedUpgradePrice *= 3;
            await saveProgress(userId, { speedUpgradeLevel, speedUpgradePrice }); // Сохранение прогресса
            await updateShopDisplay();
            console.log({ speedUpgradeLevel }, { speedUpgradePrice });
        } else {
            showNotEnoughCoinsModal(speedUpgradePrice, coinBalance);
        }
    } else if (type === 'energy') {
        let energyUpgradePrice = Number(userData.energyUpgradePrice);
        let energyUpgradeLevel = Number(userData.energyUpgradeLevel);
        if (coinBalance >= energyUpgradePrice) {
            // Покупка улучшения энергии
            await upgradeEnergy();
            await updateCoinBalance(-energyUpgradePrice);
            energyUpgradeLevel++;
            energyUpgradePrice *= 2;
            await saveProgress(userId, { energyUpgradeLevel, energyUpgradePrice }); // Сохранение прогресса
            await updateShopDisplay();
        } else {
            showNotEnoughCoinsModal(energyUpgradePrice, coinBalance);
        }
    }
}

async function updateCoinBalance(amount) {
    const userData = await getProgress(userId);
    const newBalance = Number(userData.balance) + amount;
    await saveProgress(userId, { balance: newBalance });
}

function showNotEnoughCoinsModal(price, coinBalance) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'block';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    modalContent.appendChild(closeButton);

    const message = document.createElement('p');
    message.textContent = `Вам не хватает ${price - coinBalance} монет`;
    modalContent.appendChild(message);

    document.body.appendChild(modal);

    // Закрытие модального окна при клике на крестик
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

async function updateShopDisplay() {
    const userData = await getProgress(userId);
    const speedUpgradeLevel = userData.speedUpgradeLevel;
    const speedUpgradePrice = userData.speedUpgradePrice;
    const energyUpgradeLevel = userData.energyUpgradeLevel;
    const energyUpgradePrice = userData.energyUpgradePrice;

    // Обновление уровня и цены улучшения скорости
    document.getElementById('speedUpgradeLevel').textContent = `Lvl ${speedUpgradeLevel}`;
    document.getElementById('speedUpgradePrice').textContent = speedUpgradePrice;

    // Обновление уровня и цены улучшения энергии
    document.getElementById('energyUpgradeLevel').textContent = `Lvl ${energyUpgradeLevel}`;
    document.getElementById('energyUpgradePrice').textContent = energyUpgradePrice;
}

async function upgradeEnergy() {
    const userData = await getProgress(userId);
    let maxenerg = Number(userData.maxenerg);
    // Увеличиваем максимальную энергию на 10 за каждый уровень
    maxenerg += 10;
    await saveProgress(userId, { maxenerg }); // Сохранение прогресса
    updateEnergyBar(); // Обновляем отображение энергии после увеличения
}

async function buyEgg(rarity, price) {
    const userData = await getProgress(userId);
    const coinBalance = Number(userData.balance);
    if (coinBalance >= price) {
        const availableEggs = eggs.filter((egg) => egg.rarity === rarity);
        if (availableEggs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableEggs.length);
            const selectedEgg = availableEggs[randomIndex];

            // Добавить выбранное яйцо в инвентарь
            addEggToInventory(selectedEgg);

            // Вычесть стоимость из баланса монет
            await updateCoinBalance(-price);
        }
    } else {
        showNotEnoughCoinsModal(price, coinBalance);
    }
}

// Назначаем обработчик клика на иконку магазина
document.querySelector('.iconContainer img[src="public/images/shop_icon.png"]').parentElement.addEventListener('click', openShopModal);

// Назначаем обработчик клика на крестик для закрытия магазина
document.querySelector('#shopModal .close').addEventListener('click', closeShopModal);

// Начальное отображение уровней и цен
updateShopDisplay();
window.openShopModal = openShopModal;
window.buyEgg = buyEgg;
window.buyUpgrade = buyUpgrade;
