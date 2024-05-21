// inventory.js

// Функция для открытия модального окна инвентаря
function openInventory() {
    const modal = document.getElementById('inventoryModal');
    if (modal) {
        modal.style.display = 'flex';
    }
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
