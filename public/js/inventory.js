import { saveProgress, getProgress } from './firebase.js';
import { showLoadingIndicator, hideLoadingIndicator } from './openShop.js';
import { restoreInventory } from './addEggs.js';

Telegram.WebApp.ready();
showLoadingIndicator();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        inventoryItems = savedProgress.inventoryItems || {};
    }
});
hideLoadingIndicator();

export async function openInventory() {
    const modal = document.getElementById('inventoryModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    showLoadingIndicator();
    await restoreInventory(userId);
    hideLoadingIndicator();
}

// Функция для закрытия модального окна инвентаря
function closeInventory() {
    const modal = document.getElementById('inventoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Назначаем функцию закрытия по клику на крестик
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('#inventoryModal .close');
    if (closeButton) {
        closeButton.addEventListener('click', closeInventory);
    }
});
document.querySelector('.iconContainer img[src="public/images/inventory_icon.png"]').parentElement.addEventListener('click', openInventory);

// Назначаем обработчик клика на крестик для закрытия магазина
document.querySelector('#inventoryModal .close').addEventListener('click', closeInventory);
document.addEventListener('DOMContentLoaded', () => {
    const inventoryModal = document.querySelector('.iconContainer img[src="public/images/inventory_icon.png"]');
    if (inventoryModal) {
        inventoryModal.parentElement.addEventListener('click', openInventory);
    }
    console.log('Event handlers assigned');
});

window.openInventory = openInventory;
window.closeInventory = closeInventory;