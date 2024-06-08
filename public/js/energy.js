import { saveProgress, getProgress } from './firebase.js';
import { hideLoadingIndicator, showLoadingIndicator } from './openShop.js';


let curenerg = 100; // Начальная энергия
let maxenerg = 100; // Максимальная энергия
let restoreEnergySpeed = 3000;
let restoreRate = 1;
let energyTick = 0;
// Восстановление энергии из базы данных при загрузке
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
showLoadingIndicator();
await getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        curenerg = savedProgress.curenerg || 0;
        maxenerg = savedProgress.maxenerg || 100;
        const lastUpdate = savedProgress.lastEnergyUpdate || Date.now();
        const now = Date.now();
        const elapsedTime = now - lastUpdate;
        const energyToRestore = Math.floor(elapsedTime / restoreEnergySpeed) * restoreRate;
        
        curenerg = Math.min(curenerg + energyToRestore, maxenerg);
        
        updateEnergyBar();
        saveProgress(userId, { curenerg, lastEnergyUpdate: now });
    }
});
hideLoadingIndicator();
updateBalance();

export function decreaseEnergy() {
    curenerg--;
    energyTick++;
    updateEnergyBar();
    if (curenerg <= 0) {
        disableClick(); // Если энергия иссякла, блокируем возможность кликать
    }
    if (energyTick >= 10) {
        saveProgress(userId, { curenerg, lastEnergyUpdate: Date.now() });
    }
    
}

export function updateEnergyBar() {
    const energyBar = document.getElementById('energyBar');
    if (energyBar) {
        energyBar.style.width = `${(curenerg / maxenerg) * 100}%`;
    }
    
    const energyText = document.getElementById('energyText');
    if (energyText) {
        energyText.textContent = `${curenerg}/${maxenerg}`;
    }

    if (curenerg <= 0) {
        disableClick();
    }

    if (curenerg > 0) {
        enableClick(); // Если энергия восстановилась, разрешаем кликать
    }
    
}

function restoreEnergy() {
    if (curenerg < maxenerg) {
        curenerg += restoreRate; // Увеличиваем текущую энергию
        curenerg = Math.min(curenerg, maxenerg); // Ограничиваем максимальной энергией
        updateEnergyBar();
        saveProgress(userId, { curenerg, lastEnergyUpdate: Date.now() }); // Сохранение прогресса с обновлением времени
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

export async function updateBalance() {
    const userData = await getProgress(userId);
    const balanceElement = document.getElementById('coinBalance');
    if (balanceElement) {
        balanceElement.textContent = formatNumber(userData.balance);
    }

}
function formatNumber(number) {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'B'; // Миллиарды
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M'; // Миллионы
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K'; // Тысячи
    } else {
        return number; // Если число меньше тысячи, выводим его как есть
    }
}

// Call updateBalance on page load
document.addEventListener('DOMContentLoaded', updateBalance);

