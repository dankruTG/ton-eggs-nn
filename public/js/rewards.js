import { saveProgress, getProgress } from './public/js/firebase.js';

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
        document.getElementById('taskContainer').remove();
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

        if (userProgress.walletStatus !== 'Done!') {
            rewardsModal.style.display = 'block';
        } else {
            document.getElementById('taskContainer').innerHTML = '<p>Все задания выполнены</p>';
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
document.querySelector('.iconContainer img[src="public/images/rewards_icon.png"]').parentElement.addEventListener('click', openRewardsModal);

// Назначаем обработчик клика на крестик для закрытия магазина
document.querySelector('#rewardsModal .close').addEventListener('click', closeRewardsModal);

console.log('Event handlers assigned');
