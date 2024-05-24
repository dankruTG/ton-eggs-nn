import { saveProgress, getProgress } from './firebase.js';

let walletStatus = 'none';

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
    const notCompleteModal = document.createElement('div');
    notCompleteModal.classList.add('modal');
    notCompleteModal.style.display = 'block';
    notCompleteModal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    notCompleteModal.appendChild(modalContent);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    modalContent.appendChild(closeButton);

    const message = document.createElement('p');
    message.textContent = 'Задание не выполнено';
    modalContent.appendChild(message);

    document.body.appendChild(notCompleteModal);

    closeButton.addEventListener('click', () => {
        notCompleteModal.style.display = 'none';
    });
}

function closeNotCompleteModal() {
    const notCompleteModal = document.querySelector('.modal');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'none';
    }
}

async function openRewardsModal() {
    const rewardsModal = document.createElement('div');
    rewardsModal.classList.add('modal');
    rewardsModal.style.display = 'block';
    rewardsModal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    rewardsModal.appendChild(modalContent);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    modalContent.appendChild(closeButton);

    const title = document.createElement('h2');
    title.textContent = 'Задания';
    modalContent.appendChild(title);

    const taskContainer = document.createElement('div');
    taskContainer.id = 'taskContainer';
    modalContent.appendChild(taskContainer);

    const userProgress = await getProgress(userId);

    if (userProgress.walletStatus !== 'Done!') {
        taskContainer.innerHTML = '<p>Привяжи кошелек <button class="claim-button" onclick="checkWalletAndClaim()">Claim</button></p>';
    } else {
        taskContainer.innerHTML = '<p>Все задания выполнены</p>';
    }

    document.body.appendChild(rewardsModal);

    closeButton.addEventListener('click', () => {
        rewardsModal.style.display = 'none';
    });
}

function closeRewardsModal() {
    const rewardsModal = document.querySelector('.modal');
    if (rewardsModal) {
        rewardsModal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rewardsIconContainer = document.querySelector('.iconContainer img[src="public/images/rewards_icon.png"]');
    if (rewardsIconContainer) {
        rewardsIconContainer.parentElement.addEventListener('click', openRewardsModal);
    }

    console.log('Event handlers assigned');
});

window.openRewardsModal = openRewardsModal;
window.checkWalletAndClaim = checkWalletAndClaim;
window.closeRewardsModal = closeRewardsModal;
