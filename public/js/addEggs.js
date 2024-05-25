import { saveProgress, getProgress } from './firebase.js';
import { decreaseEnergy } from './energy.js';
let eggContainerIdCounter = 1; // Инициализация счетчика
let inventoryItems = {}; // Объект для хранения элементов инвентаря по id
let clickCount = 0; // Счетчик кликов
let currentEgg = null; // Текущее добываемое яйцо

// Восстановление данных из базы данных при загрузке
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        inventoryItems = savedProgress.inventoryItems || {};
        currentEgg = savedProgress.currentEgg || null;
        clickCount = savedProgress.clickCount || 0;
        restoreInventory();
        if (currentEgg) {
            startDiggEgg(currentEgg, true); // true указывает на восстановление добычи
        }
    }
});
const userData = await getProgress(userId);

function restoreInventory() {
    const inventoryContainer = document.getElementById('inventoryItemsContainer');
    if (inventoryContainer) {
        for (const eggId in inventoryItems) {
            const eggData = inventoryItems[eggId];
            const eggContainer = createEggContainer(eggData, eggId);
            inventoryContainer.appendChild(eggContainer);
        }
    }
}

// Функция для добавления яйца в инвентарь
function addEggToInventory(egg) {
    const inventoryContainer = document.getElementById('inventoryItemsContainer');
    if (inventoryContainer) {
        const eggContainer = createEggContainer(egg);
        inventoryContainer.appendChild(eggContainer);
        saveInventory(); // Сохранение инвентаря после добавления яйца
    }
}

function giveEggs() {
    const inventoryContainer = document.getElementById('inventoryItemsContainer');
    if (inventoryContainer) {
        // Фильтрация яиц по редкости Common
        const commonEggs = eggs.filter((egg) => egg.rarity === 'Common');
        
        // Проверка наличия яиц категории Common
        if (commonEggs.length > 0) {
            // Выбор случайного яйца из списка commonEggs
            const randomIndex = Math.floor(Math.random() * commonEggs.length);
            const selectedEgg = commonEggs[randomIndex];
            
            // Создание контейнера для выбранного яйца и добавление его в инвентарь
            const eggContainer = createEggContainer(selectedEgg);
            inventoryContainer.appendChild(eggContainer);
            saveInventory(); // Сохранение инвентаря после добавления яйца
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

function saveInventory() {
    saveProgress(userId, { inventoryItems });
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

function startDiggEggByName(eggName, eggContainerId) {
    const eggData = eggs.find((egg) => egg.name === eggName);

    // Проверяем, есть ли уже активное яйцо для клика
    if (currentEgg) {
        // Показываем модальное окно, что уже идет добыча другого яйца
        showModal('Вы уже DIGG другое EGG. Завершите его сначала!');
        return;
    }

    if (eggData) {
        // Закрываем модальное окно с информацией о яйце
        const modal = document.getElementById('eggInfoModal');
        if (modal) {
            modal.style.display = 'none';
        }
        closeInventory();

        // Удаляем новое яйцо из инвентаря
        removeEggFromInventory(eggContainerId);

        // Начинаем добычу нового яйца
        startDiggEgg(eggData);
        currentEgg = eggData;
        saveProgress(userId, { currentEgg, clickCount }); // Сохранение прогресса
        changeBackgroundByRarity(eggData.rarity)
    } else {
        console.log('Яйцо не найдено в инвентаре');
    }
}


function removeEggFromInventory(eggContainerId) {
    const eggContainer = document.getElementById(eggContainerId);
    if (eggContainer) {
        eggContainer.remove();
        delete inventoryItems[eggContainerId]; // Удаление элемента из объекта инвентаря
        saveInventory(); // Сохранение инвентаря после удаления яйца
    }
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

// Функция начала добычи яйца
function startDiggEgg(eggData, isRestoring = false) {
    // Удаление предыдущей зоны для клика, если она была добавлена
    const previousClickArea = document.getElementById('clickArea');
    if (previousClickArea) {
        previousClickArea.remove();
    }

    if (!currentEgg || isRestoring) {
        createClickArea(eggData); // Создание области для клика (добычи) яйца
        currentEgg = eggData; // Устанавливаем текущее яйцо для добычи
        if (!isRestoring) {
            saveProgress(userId, { currentEgg, clickCount }); // Сохранение прогресса при начале новой добычи
        }
    } else {
        console.log('Яйцо уже добавлено для добычи');
    }
}


function createClickArea(eggData) {
    const clickArea = document.createElement('div');
    clickArea.id = 'clickArea';
    clickArea.style.width = '200px';
    clickArea.style.height = '200px';
    clickArea.style.backgroundColor = 'transparent';
    clickArea.style.position = 'relative';
    clickArea.style.overflow = 'block'; // Ограничиваем область, чтобы скрыть "урон" за пределами
    clickArea.style.display = 'flex';
    clickArea.style.justifyContent = 'center';
    clickArea.style.alignItems = 'center';

    const eggImage = document.createElement('img');
    eggImage.src = eggData.icon;
    eggImage.style.width = '100%';
    eggImage.style.height = '100%';
    eggImage.style.objectFit = 'contain';
    clickArea.appendChild(eggImage);
    

    let initialClickCount = eggData.strength; // Начальное количество кликов для открытия
    let currentClickCount = initialClickCount - clickCount; // Восстановленный счетчик кликов
    let clickValue = userData.speedUpgradeLevel;
    console.log('clickValue:', clickValue);

    clickArea.addEventListener('click', (event) => {
        if (currentClickCount > 0) {
            currentClickCount -= clickValue;
            clickCount = initialClickCount - currentClickCount; // Обновляем глобальный счетчик кликов
            updateClickCounter(currentClickCount);
            saveProgress(userId, { clickCount }); // Сохранение прогресса кликов
            decreaseEnergy(); // Уменьшение энергии при клике

            // Анимация увеличения яйца
            eggImage.style.transform = 'scale(1.1)';
            eggImage.style.transition = 'transform 0.3s ease';

            // Создание элемента "урона"
            const damageElement = document.createElement('span');
            damageElement.textContent = `-${clickValue}`;
            damageElement.style.position = 'absolute';
            damageElement.style.color = 'white'; // Цвет текста "урона"
            damageElement.style.fontSize = '16px'; // Размер шрифта "урона"

            // Добавление элемента "урона" к области клика
            clickArea.appendChild(damageElement);

            // Анимация "урона"
            damageElement.animate(
                [
                    { opacity: 1, transform: 'translateY(0)' },
                    { opacity: 0, transform: 'translateY(-20px)' }
                ],
                {
                    duration: 1000,
                    easing: 'ease',
                    fill: 'forwards'
                }
            );

            setTimeout(() => {
                damageElement.remove(); // Удалить элемент "урона" после завершения анимации
            }, 1000);

        if (currentClickCount <= 0) {
                finishDiggEgg(eggData); // Завершение добычи яйца
            }

            // Сброс анимации увеличения яйца
            setTimeout(() => {
                eggImage.style.transform = 'scale(1)';
            }, 100);
        }
    });

    document.body.appendChild(clickArea);
    updateClickCounter(currentClickCount);
}

async function finishDiggEgg(eggData) {
    currentEgg = null; // Сброс текущего яйца для добычи
    clickCount = 0; // Сброс счетчика кликов
    saveProgress(userId, { currentEgg, clickCount }); // Сохранение прогресса
    let coinsDropped = 0;
    let eggDropped = null;

    let clickCountText = 'Начни добывать любое яйцо';
    updateClickCounter(clickCountText);
    changeBackgroundByRarity(eggData.rarity);

    switch (eggData.rarity) {
        case 'Common':
            coinsDropped = getRandomInt(10, 100);
            eggDropped = getRandomEggByRarity('Common');
            break;
        case 'Uncommon':
            coinsDropped = getRandomInt(350, 650);
            eggDropped = getRandomEggByRarity('Uncommon');
            break;
        case 'Rare':
            coinsDropped = getRandomInt(700, 1300);
            eggDropped = getRandomEggByRarity('Rare');
            break;
        case 'Secret':
            coinsDropped = getRandomInt(1800, 3000);
            eggDropped = getRandomEggByRarity('Secret');
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
        const currentBalance = progress.balance || 0;

        // Обновление баланса монет
        const newBalance = currentBalance + coinsDropped;
        balance = newBalance;
        saveProgress(userId, { balance });
        console.log('Coins balance:', balance);
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
        addEggToInventory(eggDropped);

        // Возвращаем объект с информацией о дропе (монеты и яйцо)
        return { coinsDropped, eggDropped };
    }

    // Возвращаем только информацию о монетах, если что-то не найдено
    return coinsDropped;
}

function getRandomEggByRarity(rarity) {
    const rarityChances = {
        Common: { Common: 0.93, Uncommon: 0.06, Rare: 0.0075, Secret: 0.0025 },
        Uncommon: { Common: 0.52, Uncommon: 0.41, Rare: 0.06, Secret: 0.02 },
        Rare: { Common: 0.28, Uncommon: 0.50, Rare: 0.14, Secret: 0.08 },
        Secret: { Common: 0.14, Uncommon: 0.26, Rare: 0.28, Secret: 0.32 }
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

function changeBackgroundByRarity(rarity) {
    const bodyElement = document.body;
    // Проверяем значение eggAddedForDigg
    if (!currentEgg) {
        // Если currentEgg равно null, устанавливаем фон по умолчанию
        bodyElement.style.backgroundImage = `url('public/images/Backgrounds/DefBackground.png')`;
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
            default:
                // По умолчанию используем фон по умолчанию
                backgroundImagePath = 'public/images/Backgrounds/DefBackground.png';
                break;
        }

        // Устанавливаем фоновое изображение для элемента body
        bodyElement.style.backgroundImage = `url('${backgroundImagePath}')`;
    }
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
window.giveEggs = giveEggs;