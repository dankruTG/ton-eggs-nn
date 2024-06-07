import { saveProgress, getProgress } from './firebase.js';
import { decreaseEnergy, updateBalance } from './energy.js';
import { showLoadingIndicator, hideLoadingIndicator } from './openShop.js';
let eggContainerIdCounter = 1; // Инициализация счетчика
let inventoryItems = {}; // Объект для хранения элементов инвентаря по id
let clickCount = 0; // Счетчик кликов
let currentEgg = null; // Текущее добываемое яйцо
let speedUpgradeLevel = 0;
let isProcessing = false;
let isFinishing = false;
let totalBalance = 0;
let totalDamage = 0;
let localClickCount = 0; // Локальный счетчик кликов
let localTotalDamage = 0; // Локальный счетчик урона
let balance = 0;


// Восстановление данных из базы данных при загрузке
Telegram.WebApp.ready();
showLoadingIndicator();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        inventoryItems = savedProgress.inventoryItems || {};
        currentEgg = savedProgress.currentEgg || null;
        clickCount = savedProgress.clickCount || 0;
        speedUpgradeLevel = savedProgress.speedUpgradeLevel || 0;
        totalBalance = savedProgress.totalBalance || 0;
        totalDamage = savedProgress.totalDamage || 0;
        balance = savedProgress.balance || 0;
        restoreInventory(userId);
        if (currentEgg) {
            createClickArea(currentEgg);
        }
    }
});
hideLoadingIndicator();


export async function restoreInventory(userId) {
    showLoadingIndicator();
    const userData = await getProgress(userId);
    const inventoryItems = userData.inventoryItems || {};
    const inventoryContainer = document.getElementById('inventoryItemsContainer');
    if (inventoryContainer) {
        inventoryContainer.innerHTML = ''; // Очистить контейнер перед восстановлением
        for (const eggId in inventoryItems) {
            const eggData = inventoryItems[eggId];
            const eggContainer = createEggContainer(eggData, eggId);
            inventoryContainer.appendChild(eggContainer);
        }
    }
    hideLoadingIndicator();
}


// Функция для добавления яйца в инвентарь
export async function addEggToInventory(egg) {
    showLoadingIndicator();
    const userData = await getProgress(userId);
    const inventoryItems = userData.inventoryItems || {};
    
    // Генерация уникального идентификатора для нового яйца
    const eggContainerId = `egg_${Date.now()}`;
    inventoryItems[eggContainerId] = egg; // Добавить новое яйцо в инвентарь

    await saveProgress(userId, { inventoryItems }); // Сохранить обновленный инвентарь

    // Обновление UI
    const inventoryContainer = document.getElementById('inventoryItemsContainer');
    if (inventoryContainer) {
        const eggContainer = createEggContainer(egg, eggContainerId);
        inventoryContainer.appendChild(eggContainer);
    }
    hideLoadingIndicator();
}


export async function giveEggs() {
    const inventoryContainer = document.getElementById('inventoryItemsContainer');
    if (inventoryContainer) {
        // Фильтрация яиц по редкости Common
        const commonEggs = eggs.filter((egg) => egg.rarity === 'Common');
        
        // Проверка наличия яиц категории Common
        if (commonEggs.length > 0) {
            // Выбор случайного яйца из списка commonEggs
            const randomIndex = Math.floor(Math.random() * commonEggs.length);
            const selectedEgg = commonEggs[randomIndex];
            showLoadingIndicator();
            await addEggToInventory(selectedEgg);
            hideLoadingIndicator();
        } else {
            console.log('Нет яиц категории Common');
        }
    }
}

// Функция, которая создает контейнер для яйца
function createEggContainer(eggData, eggContainerId = null) {
    const eggContainer = document.createElement('div');
    eggContainer.classList.add('eggContainer');

    const eggIcon = document.createElement('img');
    eggIcon.src = eggData.icon;
    eggIcon.alt = eggData.name;
    eggIcon.style.maxWidth = '100%';
    eggIcon.style.height = 'auto';
    eggIcon.style.display = 'block';
    eggIcon.style.margin = '0 auto';

    eggContainer.appendChild(eggIcon);

    eggContainer.style.backgroundColor = getBackgroundColor(eggData.rarity); // Определяем цвет фона

    if (!eggContainerId) {
        // Присваиваем уникальный id контейнеру яйца, если он не передан
        eggContainerId = `${eggContainerIdCounter}`;
        eggContainerIdCounter++; // Увеличиваем счетчик id для следующего контейнера
    }
    eggContainer.id = eggContainerId;
    inventoryItems[eggContainerId] = eggData;

    eggContainer.addEventListener('click', () => {
        openEggInfoModal(eggData, eggContainerId);
    });

    return eggContainer;
}


// Функция, которая определяет цвет фона в зависимости от редкости яйца
function getBackgroundColor(rarity) {
    switch (rarity) {
        case 'Common':
            return 'lightgrey';
        case 'Uncommon':
            return 'lightblue';
        case 'Rare':
            return 'pink';
        case 'Secret':
            return 'red';
        case 'Myfical':
            return 'gold';
        default:
            return 'white';
    }
}
function openEggInfoModal(eggData, eggContainerId) {
    const modal = document.getElementById('eggInfoModal');
    if (modal) {
        modal.style.display = 'block';

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = '';

            const closeButton = document.createElement('span');
            closeButton.classList.add('close');
            closeButton.textContent = '×';
            modalContent.appendChild(closeButton);

            const title = document.createElement('h2');
            title.textContent = eggData.name;
            modalContent.appendChild(title);

            const eggIdInfo = document.createElement('div'); // Создаем элемент для отображения ID яйца
            eggIdInfo.textContent = `ID в инвентаре: ${eggContainerId}`; // Отображаем ID контейнера яйца
            modalContent.appendChild(eggIdInfo);

            const eggImage = document.createElement('img');
            eggImage.src = eggData.icon;
            eggImage.alt = eggData.name;
            eggImage.style.maxWidth = '100%';
            eggImage.style.display = 'block';
            eggImage.style.margin = '0 auto';
            modalContent.appendChild(eggImage);

            const startDiggButton = document.createElement('button');
            startDiggButton.textContent = 'Start Digg';
            startDiggButton.classList.add('startDiggButton');
            startDiggButton.style.background = 'linear-gradient(to right, #2D83EC, #1AC9FF)';
            startDiggButton.style.color = '#1E2337';
            startDiggButton.style.borderRadius = '10px';
            startDiggButton.style.padding = '5px 20px';
            startDiggButton.style.border = 'none';
            startDiggButton.style.marginTop = '10px';
            startDiggButton.style.display = 'flex';
            startDiggButton.style.alignItems = 'center';
            startDiggButton.style.justifyContent = 'center';
            startDiggButton.style.margin = '0 auto';

            const startDiggIcon = document.createElement('img');
            startDiggIcon.src = 'public/images/startdigg.png';
            startDiggIcon.alt = 'Start Digg';
            startDiggIcon.style.width = '20px';
            startDiggIcon.style.height = '20px';
            startDiggIcon.style.marginLeft = '10px';

            startDiggButton.appendChild(startDiggIcon);
            modalContent.appendChild(startDiggButton);

            startDiggButton.addEventListener('click', () => {
                startDiggEggByName(eggData.name, eggContainerId);
            });

            const rarityInfo = document.createElement('div');
            rarityInfo.textContent = `Редкость: ${eggData.rarity}`;
            modalContent.appendChild(rarityInfo);

            const strengthInfo = document.createElement('div');
            strengthInfo.textContent = `Количество кликов для открытия: ${eggData.strength}`;
            modalContent.appendChild(strengthInfo);

            const mintingInfo = document.createElement('div');
            mintingInfo.textContent = `Можно ли преобразовать в NFT: ${eggData.minting}`;
            modalContent.appendChild(mintingInfo);
        }

        const closeButton = modal.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modalContent.style.backgroundColor = getBackgroundColor(eggData.rarity);
    }
}

async function startDiggEggByName(eggName, eggContainerId) {
    const eggData = eggs.find((egg) => egg.name === eggName);
    const userData = await getProgress(userId);
    let { currentEgg } = userData;

    // Проверяем, есть ли уже активное яйцо для клика
    if (currentEgg) {
        showModal('Вы уже DIGG другое EGG. Завершите его сначала!');
        return;
    }

    if (eggData) {
        const modal = document.getElementById('eggInfoModal');
        if (modal) {
            modal.style.display = 'none';
        }
        showLoadingIndicator();
        closeInventory();

        // Удаляем новое яйцо из инвентаря
        await removeEggFromInventory(eggContainerId);

        // Начинаем добычу нового яйца
        createClickArea(eggData);
        await saveProgress(userId, { currentEgg: eggData, clickCount: 0 });
        changeBackgroundByRarity(eggData.rarity);
    } else {
        console.log('Яйцо не найдено в инвентаре');
    }
    hideLoadingIndicator();
}



async function removeEggFromInventory(eggContainerId) {
    showLoadingIndicator();
    const userData = await getProgress(userId);
    let inventoryItems = userData.inventoryItems || {};
    
    if (inventoryItems[eggContainerId]) {
        delete inventoryItems[eggContainerId];
        await saveProgress(userId, { inventoryItems });
        
        await restoreInventory(userId);
    }
    hideLoadingIndicator();
}


function showModal(message) {
    const modal = document.getElementById('notificationModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    // Закрытие модального окна при клике на фон или крестик
    modal.onclick = function(event) {
        if (event.target === modal || event.target.classList.contains('close')) {
            modal.style.display = 'none';
        }
    };
}




export async function createClickArea(eggData) {
    const previousClickArea = document.getElementById('clickArea');
    if (previousClickArea) {
        previousClickArea.remove();
    }
    changeBackgroundByRarity(eggData.rarity);

    const clickArea = document.createElement('div');
    clickArea.id = 'clickArea';
    clickArea.style.width = '200px';
    clickArea.style.height = '200px';
    clickArea.style.backgroundColor = 'transparent';
    clickArea.style.position = 'relative';
    clickArea.style.overflow = 'block';
    clickArea.style.display = 'flex';
    clickArea.style.justifyContent = 'center';
    clickArea.style.alignItems = 'center';

    const eggImage = document.createElement('img');
    eggImage.src = eggData.icon;
    eggImage.style.width = '100%';
    eggImage.style.height = '100%';
    eggImage.style.objectFit = 'contain';
    clickArea.appendChild(eggImage);

    let stl = eggData.strength;
    updateClickCounter(stl);
    showLoadingIndicator();

    const userData = await getProgress(userId);
    let { clickCount, speedUpgradeLevel, totalDamage } = userData;

    let initialClickCount = eggData.strength;
    let currentClickCount = initialClickCount - clickCount;
    updateClickCounter(currentClickCount);
    let clickValue = speedUpgradeLevel;
    hideLoadingIndicator();

    clickArea.addEventListener('click', async () => {
        if (isProcessing) return;

        if (currentClickCount > 0) {
            localTotalDamage += speedUpgradeLevel;
            currentClickCount -= clickValue;
            localClickCount += clickValue;

            updateClickCounter(currentClickCount);
            decreaseEnergy();

            eggImage.style.transform = 'scale(1.1)';
            eggImage.style.transition = 'transform 0.3s ease';

            const damageElement = document.createElement('span');
            damageElement.textContent = `-${clickValue}`;
            damageElement.style.position = 'absolute';
            damageElement.style.color = 'white';
            damageElement.style.fontSize = '16px';

            clickArea.appendChild(damageElement);

            damageElement.animate(
                [
                    { opacity: 1, transform: 'translateY(0)' },
                    { opacity: 0, transform: 'translateY(-20px)' }
                ],
                {
                    duration: 500,
                    easing: 'ease',
                    fill: 'forwards'
                }
            );

            setTimeout(() => {
                damageElement.remove();
            }, 1000);
            setTimeout(() => {
                eggImage.style.transform = 'scale(1)';
            }, 100);
        }

        if (localClickCount >= 10 || currentClickCount <= 0) {
            clickCount += localClickCount;
            totalDamage += localTotalDamage;
            saveProgress(userId, { clickCount, totalDamage });
            localClickCount = 0; // Сбрасываем локальные счетчики
            localTotalDamage = 0;
        }

        if (currentClickCount <= 0) {
            isProcessing = true;
            showLoadingIndicator();
            let { currentEgg } = userData;
            const rarity = currentEgg.rarity
            await finishDiggEgg(rarity);
            hideLoadingIndicator();
            isProcessing = false;
        }
    });

    document.body.appendChild(clickArea);
}

async function finishDiggEgg(rarity) {
    if (isFinishing) {
        return;
    }
    showLoadingIndicator();
    isFinishing = true;
    currentEgg = null; // Сброс текущего яйца для добычи
    clickCount = 0; // Сброс счетчика кликов
    await saveProgress(userId, { currentEgg, clickCount }); // Сохранение прогресса
    let coinsDropped = 0;
    let eggDropped = null;

    let clickCountText = 'Начни добывать любое яйцо';
    updateClickCounter(clickCountText);
    changeBackgroundByRarity(rarity);

    switch (rarity) {
        case 'Common':
            coinsDropped = getRandomInt(10, 100);
            eggDropped = getRandomEggByRarity('Common');
            break;
        case 'Uncommon':
            coinsDropped = getRandomInt(350, 650);
            eggDropped = getRandomEggByRarity('Uncommon');
            break;
        case 'Rare':
            coinsDropped = getRandomInt(1200, 1800);
            eggDropped = getRandomEggByRarity('Rare');
            break;
        case 'Secret':
            coinsDropped = getRandomInt(2400, 3600);
            eggDropped = getRandomEggByRarity('Secret');
            break;
            case 'Myfical':
            coinsDropped = getRandomInt(12000, 19000);
            eggDropped = getRandomEggByRarity('Myfical');
            break;
        default:
            coinsDropped = 0; // По умолчанию
            break;
    }
    

    console.log('Coins dropped:', coinsDropped);
    console.log('Egg dropped:', eggDropped);

    const previousClickArea = document.getElementById('clickArea');
    if (previousClickArea) {
        previousClickArea.remove();
    }

    const coinBalanceElement = document.getElementById('coinBalance');
    const droppedCoinsCount = document.getElementById('droppedCoinsCount');
    const modal = document.getElementById('coinModal');
    const eggImageElement = document.getElementById('eggImageInDrop');
    const eggNameElement = document.getElementById('eggNameInDrop');

    if (coinBalanceElement && droppedCoinsCount && modal) {
        // Загрузка текущего баланса пользователя из базы данных
        const progress = await getProgress(userId);
        const currentBalance = Number(progress.balance) || 0;
        const currentTotalBalance = Number(progress.totalBalance) || 0;

        // Обновление баланса монет
        const newBalance = currentBalance + coinsDropped;
        const newTotalBalance = currentTotalBalance + coinsDropped;
        await saveProgress(userId, { balance: newBalance, totalBalance: newTotalBalance });
        await updateBalance();
        console.log('Coins balance saved:', newBalance);
        eggImageElement.style.verticalAlign = 'middle';

        // Отображение выпавших монет
        droppedCoinsCount.textContent = `+${coinsDropped}`;
        // Отображение информации о выпавшем яйце
        eggImageElement.src = eggDropped.icon;
        eggImageElement.alt = eggDropped.name;
        eggNameElement.textContent = eggDropped.name;
        switch (eggDropped.rarity) {
            case 'Common':
                eggNameElement.style.color = 'black';
                eggNameElement.style.fontWeight = 'normal';
                break;
            case 'Uncommon':
                eggNameElement.style.color = 'black';
                eggNameElement.style.textShadow = '1px 1px 2px black'; // Добавляем контур
                break;
            case 'Rare':
                eggNameElement.style.color = 'blue';
                eggNameElement.style.fontWeight = 'bold';
                break;
            case 'Secret':
                eggNameElement.style.color = 'red';
                eggNameElement.style.fontWeight = 'bold';
                break;
            case 'Myfical':
                eggNameElement.style.color = 'gold';
                eggNameElement.style.textShadow = '1px 1px 2px black';
                eggNameElement.style.fontWeight = 'bold';
                break;
            default:
                eggNameElement.style.color = 'black'; // По умолчанию
                eggNameElement.style.fontWeight = 'normal';
                break;
        }
        eggNameElement.style.display = 'inline-block'; // Устанавливаем inline-block для правильного позиционирования
        eggNameElement.style.verticalAlign = 'middle'; // Выравниваем по вертикали
        eggNameElement.style.marginLeft = '10px'; // Пример отступа слева от изображения

        // Отображение модального окна с информацией о дропе
        modal.style.display = 'block';

        // Закрытие модального окна при щелчке на крестик
        const closeButton = document.querySelector('#coinModal .close');
        const coinModal = document.getElementById('coinModal');
        if (closeButton) {
            closeButton.onclick = function () {
                coinModal.style.display = 'none';
            };
        }

        // Закрытие модального окна при щелчке вне модального окна
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        // Добавление яйца в инвентарь
        console.log('Adding egg to inventory:', eggDropped);
        await addEggToInventory(eggDropped);

        // Возвращаем объект с информацией о дропе (монеты и яйцо)
    }
    isFinishing = false;
    hideLoadingIndicator();    
}

function getRandomEggByRarity(rarity) {
    const rarityChances = {
        Common: { Common: 0.93, Uncommon: 0.06, Rare: 0.0075, Secret: 0.0025 },
        Uncommon: { Common: 0.52, Uncommon: 0.4075, Rare: 0.06, Secret: 0.02, Myfical: 0.0025 },
        Rare: { Common: 0.28, Uncommon: 0.49, Rare: 0.14, Secret: 0.08, Myfical: 0.01 },
        Secret: { Common: 0.14, Uncommon: 0.24, Rare: 0.26, Secret: 0.32, Myfical: 0.04 },
        Myfical: { Uncommon: 0.04, Rare: 0.30, Secret: 0.50, Myfical: 0.16 }
    };

    const chances = rarityChances[rarity];
    let randomValue = Math.random();
    let selectedRarity = null;

    // Определяем редкость яйца в соответствии с заданными шансами
    for (const rarityType in chances) {
        if (randomValue < chances[rarityType]) {
            selectedRarity = rarityType;
            break;
        }
        randomValue -= chances[rarityType];
    }

    // Фильтруем яйца по выбранной редкости
    let filteredEggs = eggs.filter((egg) => egg.rarity === selectedRarity);

    // Выбираем случайное яйцо из отфильтрованного списка
    const randomIndex = Math.floor(Math.random() * filteredEggs.length);
    return filteredEggs[randomIndex];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function changeBackgroundByRarity(rarity) {
    showLoadingIndicator();
    const bodyElement = document.body;
    const userData = await getProgress(userId);

    // Проверяем значение eggAddedForDigg
    let currentEgg = userData.currentEgg;
    if (!currentEgg) {
        // Если currentEgg равно null, устанавливаем фон по умолчанию
        bodyElement.style.backgroundImage = "url('public/images/Backgrounds/DefBackground.png')";
    } else {
        // Если currentEgg не равно null, устанавливаем фон в зависимости от редкости
        let backgroundImagePath;
        switch (rarity) {
            case 'Common':
                backgroundImagePath = 'public/images/Backgrounds/DefBackground.png';
                break;
            case 'Uncommon':
                backgroundImagePath = 'public/images/Backgrounds/CommonBackground.png';
                break;
            case 'Rare':
                backgroundImagePath = 'public/images/Backgrounds/UncommonBackground.png';
                break;
            case 'Secret':
                backgroundImagePath = 'public/images/Backgrounds/RareBackground.png';
                break;
            case 'Myfical':
                backgroundImagePath = 'public/images/Backgrounds/MyficalBackground.png';
                break;
            default:
                // По умолчанию используем фон по умолчанию
                backgroundImagePath = 'public/images/Backgrounds/DefBackground.png';
                break;
        }

        // Устанавливаем фоновое изображение для элемента body
        bodyElement.style.backgroundImage = `url('${backgroundImagePath}')`;
    }
    hideLoadingIndicator();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Пример вызова начала добычи при загрузке страницы
    const initialEggName = 'EggName'; // Здесь 'EggName' должно быть заменено на имя выбранного яйца
    const eggData = findEggByName(initialEggName);
    if (eggData) {
        startDiggEgg(eggData); // Начало добычи выбранного яйца при загрузке
    }
});

function updateClickCounter(clickCount) {
    const clickCounterElement = document.getElementById('clickCounter');
    if (clickCounterElement) {
        clickCounterElement.textContent = `${clickCount}`;
    }
}

