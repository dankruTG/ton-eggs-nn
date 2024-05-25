import { saveProgress, getProgress } from './firebase.js';
import { addEggToInventory } from './addEggs.js';

let speedUpgradeLevel = 1;
let speedUpgradePrice = 100;
let energyUpgradeLevel = 1;
let energyUpgradePrice = 50;

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

function openShopModal() {
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
    const coinBalance = Number (userData.balance);

    if (type === 'speed') {
        speedUpgradePrice = Number (userData.speedUpgradePrice);
        if (coinBalance >= speedUpgradePrice) {
            let speedUpgradeLevel = Number (userData.speedUpgradeLevel);
            let speedUpgradePrice = Number (userData.speedUpgradePrice);
            // Покупка улучшения скорости
            updateCoinBalance(-speedUpgradePrice);
            speedUpgradeLevel++;
            speedUpgradePrice *= 3;
            clickValue = Number (userData.clickValue);
            clickValue = speedUpgradeLevel;
            await saveProgress(userId, { speedUpgradeLevel, speedUpgradePrice, clickValue }); // Сохранение прогресса
            updateShopDisplay();
        } else {
            showNotEnoughCoinsModal(speedUpgradePrice, coinBalance);
        }
    } else if (type === 'energy') {
        energyUpgradePrice = Number (userData.energyUpgradePrice);
        energyUpgradeLevel = Number (userData.energyUpgradeLevel);
        if (coinBalance >= energyUpgradePrice) {
            // Покупка улучшения энергии
            upgradeEnergy();
            updateCoinBalance(-energyUpgradePrice);
            energyUpgradeLevel++;
            energyUpgradePrice *= 2;
            saveProgress(userId, { energyUpgradeLevel, energyUpgradePrice }); // Сохранение прогресса
            updateShopDisplay();
        } else {
            showNotEnoughCoinsModal(energyUpgradePrice, coinBalance);
        }
    }
}
async function updateCoinBalance(price) {
    const userData = await getProgress(userId);
    const balance = Number (userData.balance + price);
    await saveProgress(userId, { balance });
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

function updateShopDisplay() {
    // Обновление уровня и цены улучшения скорости
    document.getElementById('speedUpgradeLevel').textContent = `Lvl ${speedUpgradeLevel}`;
    document.getElementById('speedUpgradePrice').textContent = speedUpgradePrice;

    // Обновление уровня и цены улучшения энергии
    document.getElementById('energyUpgradeLevel').textContent = `Lvl ${energyUpgradeLevel}`;
    document.getElementById('energyUpgradePrice').textContent = energyUpgradePrice;
}

function upgradeSpeed() {
    // Увеличиваем значение одного клика на 1 за каждый уровень
    clickValue = speedUpgradeLevel;
    saveProgress(userId, { clickValue }); // Сохранение прогресса
}

async function upgradeEnergy() {
    const userData = await getProgress(userId);
    let maxenerg = Number (userData.maxenerg);
    // Увеличиваем максимальную энергию на 10 за каждый уровень
    maxenerg += 10;
    saveProgress(userId, { maxenerg }); // Сохранение прогресса
    updateEnergyBar(); // Обновляем отображение энергии после увеличения
}

async function buyEgg(rarity, price) {
    const userData = await getProgress(userId);
    const coinBalance = Number (userData.balance);
    if (coinBalance >= price) {
        const availableEggs = eggs.filter((egg) => egg.rarity === rarity);
        if (availableEggs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableEggs.length);
            const selectedEgg = availableEggs[randomIndex];

            // Добавить выбранное яйцо в инвентарь
            addEggToInventory(selectedEgg);

            // Вычесть стоимость из баланса монет
            updateCoinBalance(-price);
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