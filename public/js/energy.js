import { saveProgress, getProgress } from './firebase.js';

let curenerg = 100; // Начальная энергия
let maxenerg = 100; // Максимальная энергия
let restoreEnergySpeed = 3000;

// Восстановление энергии из базы данных при загрузке
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        curenerg = savedProgress.curenerg || 100;
        maxenerg = savedProgress.maxenerg || 100;
        updateEnergyBar();
    }
});

export function decreaseEnergy() {
    curenerg--;
    updateEnergyBar();
    saveProgress(userId, { curenerg, maxenerg }); // Сохранение прогресса
    if (curenerg <= 0) {
        disableClick(); // Если энергия иссякла, блокируем возможность кликать
    }
}

export function updateEnergyBar() {
    let maxenerg = Number (getProgress.userId.maxenerg);
    const energyBar = document.getElementById('energyBar');
    if (energyBar) {
        energyBar.style.width = `${(curenerg / maxenerg) * 100}%`;
    }
    
    const energyText = document.getElementById('energyText');
    if (energyText) {
        energyText.textContent = `${curenerg}/${maxenerg}`;
    }

    if (curenerg > 0) {
        enableClick(); // Если энергия восстановилась, разрешаем кликать
    }
}

function restoreEnergy() {
    if (curenerg < maxenerg) {
        curenerg++; // Увеличиваем текущую энергию
        updateEnergyBar();
        saveProgress(userId, { curenerg, maxenerg }); // Сохранение прогресса
    }
}

// Восстановление энергии каждые 5 секунд
setInterval(restoreEnergy, restoreEnergySpeed);
updateEnergyBar();

function disableClick() {
    const eggImage = document.getElementById('clickArea');
    if (eggImage) {
        eggImage.style.opacity = '0.5'; // Уменьшаем прозрачность, чтобы показать, что яйцо заблокировано
        eggImage.style.pointerEvents = 'none'; // Отключаем события на изображении
    }
}

function enableClick() {
    const eggImage = document.getElementById('clickArea');
    if (eggImage) {
        eggImage.style.opacity = '1'; // Восстанавливаем прозрачность
        eggImage.style.pointerEvents = 'auto'; // Включаем события на изображении
    }
}

function updateClickCounter(clickCount) {
    const clickCounterElement = document.getElementById('clickCounter');
    if (clickCounterElement) {
        clickCounterElement.textContent = `${clickCount}`;
    }
}
export async function updateBalance() {
    const userData = await getProgress(userId);
    document.getElementById('coinBalance').textContent = userData.balance;
}

// Call updateBalance on page load
document.addEventListener('DOMContentLoaded', updateBalance);

// Periodically update the balance every 5 seconds (5000 milliseconds)
setInterval(updateBalance, 5000);

