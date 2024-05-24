import { saveProgress, getProgress } from './firebase.js';

// Восстановление данных из базы данных при загрузке
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        walletStatus = savedProgress.walletStatus || 'none';
    }
});

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

function openNotCompleteModal() {
    const notCompleteModal = document.getElementById('notComplete');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'block';
    }
}

function closeNotCompleteModal() {
    const notCompleteModal = document.getElementById('notComplete');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'none';
    }
}

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

function closeRewardsModal() {
    const rewardsModal = document.getElementById('rewardsModal');
    if (rewardsModal) {
        rewardsModal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rewardsIconContainer = document.querySelector('.iconContainer img[src="public/images/rewards_icon.png"]');
    if (rewardsIconContainer) {
        rewardsIconContainer.parentElement.addEventListener('click', openRewardsModal);
    }

    const rewardsModalCloseButton = document.querySelector('#rewardsModal .close');
    if (rewardsModalCloseButton) {
        rewardsModalCloseButton.addEventListener('click', closeRewardsModal);
    }

    console.log('Event handlers assigned');
});

window.openRewardsModal = openRewardsModal;
window.checkWalletAndClaim = checkWalletAndClaim;
