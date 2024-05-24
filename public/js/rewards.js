import { saveProgress, getProgress } from './firebase.js';

let walletStatus = 'none'; // Переменная для отслеживания состояния кошелька

async function doneWallet() {
    walletStatus = 'Done!';
    
    // Сохранение состояния кошелька в базе данных
    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    await saveProgress(userId, { walletStatus });
}

// Проверка привязки кошелька и выполнение задания
async function checkWalletAndClaim() {
    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    const userProgress = await getProgress(userId);

    if (userProgress.walletStatus === 'Done!') {
        giveEggs();
        const taskContainer = document.getElementById('taskContainer');
        if (taskContainer) {
            taskContainer.remove();
        }
        closeRewardsModal();
    } else {
        openNotCompleteModal();
    }
}

// Открытие модального окна невыполненного задания
function openNotCompleteModal() {
    const notCompleteModal = document.getElementById('notComplete');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'block';
    }
}

// Закрытие модального окна невыполненного задания
function closeNotCompleteModal() {
    const notCompleteModal = document.getElementById('notComplete');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'none';
    }
}

// Открытие модального окна наград
async function openRewardsModal() {
    const rewardsModal = document.getElementById('rewardsModal');
    if (rewardsModal) {
        const userId = Telegram.WebApp.initDataUnsafe.user.id;
        const userProgress = await getProgress(userId);

        const taskContainer = document.getElementById('taskContainer');
        if (userProgress.walletStatus !== 'Done!') {
            if (taskContainer) {
                taskContainer.innerHTML = '<p>Привяжи кошелек <button class="claim-button" onclick="checkWalletAndClaim()">Claim</button></p>';
            }
            rewardsModal.style.display = 'block';
        } else {
            if (taskContainer) {
                taskContainer.innerHTML = '<p>Все задания выполнены</p>';
            }
            rewardsModal.style.display = 'block';
        }
    }
}

// Закрытие модального окна наград
function closeRewardsModal() {
    const rewardsModal = document.getElementById('rewardsModal');
    if (rewardsModal) {
        rewardsModal.style.display = 'none';
    }
}

// Назначаем обработчик клика на иконку наград
const rewardsIconContainer = document.querySelector('.iconContainer img[src="public/images/rewards_icon.png"]');
if (rewardsIconContainer) {
    rewardsIconContainer.parentElement.addEventListener('click', openRewardsModal);
}

// Назначаем обработчик клика на крестик для закрытия магазина
const rewardsModalCloseButton = document.querySelector('#rewardsModal .close');
if (rewardsModalCloseButton) {
    rewardsModalCloseButton.addEventListener('click', closeRewardsModal);
}

console.log('Event handlers assigned');
// Экспорт функций в глобальную область видимости
window.openRewardsModal = openRewardsModal;
window.checkWalletAndClaim = checkWalletAndClaim;