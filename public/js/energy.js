let curenerg = 100; // Начальная энергия
let maxenerg = 100; // Максимальная энергия

function decreaseEnergy() {
    curenerg--;
    updateEnergyBar();
    if (curenerg <= 0) {
        disableClick(); // Если энергия иссякла, блокируем возможность кликать
    }
}

function updateEnergyBar() {
    const energyBar = document.getElementById('energyBar');
    if (energyBar) {
        energyBar.style.width = `${(curenerg / maxenerg) * 100}%`;
    }
    
    const energyText = document.getElementById('energyText');
    if (energyText) {
        energyText.textContent = `${curenerg}/${maxenerg}`;
    }

    if (curenerg > 0) {
        enableClick(); // Если энергия иссякла, блокируем возможность кликать
    }
}

function restoreEnergy() {
    if (curenerg < maxenerg) {
        curenerg++; // Увеличиваем текущую энергию
        updateEnergyBar();
    }
}

// Восстановление энергии каждые 5 секунд
setInterval(restoreEnergy, 3000);
updateEnergyBar()
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