import { saveProgress, getProgress } from './firebase.js';

let completedTasks = [];

// Восстановление данных из базы данных при загрузке
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        walletStatus = savedProgress.walletStatus || 'none';
        completedTasks = savedProgress.completedTasks || [];
        // Не вызываем updateTasksDisplay здесь, чтобы избежать двойного вызова
    }
}).catch(error => {
    console.error('Error connecting to Firebase:', error);
});

const tasks = [
    {
        id: 1,
        description: 'Привяжи кошелек',
        action: checkWalletAndClaim
    }
];

async function checkWalletAndClaim() {
    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    const userProgress = await getProgress(userId);

    if (userProgress.walletStatus === 'Done!') {
        giveEggs();
        completedTasks.push(1);
        await saveProgress(userId, { completedTasks });
        updateTasksDisplay();
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

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const description = document.createElement('p');
    description.textContent = task.description;
    taskElement.appendChild(description);

    if (completedTasks.includes(task.id)) {
        const doneText = document.createElement('span');
        doneText.textContent = 'Done';
        taskElement.appendChild(doneText);
    } else {
        const claimButton = document.createElement('button');
        claimButton.classList.add('claim-button');
        claimButton.textContent = 'Claim';
        claimButton.onclick = task.action;
        taskElement.appendChild(claimButton);
    }

    return taskElement;
}

function updateTasksDisplay() {
    const taskContainer = document.getElementById('taskContainer');
    if (!taskContainer) return;

    taskContainer.innerHTML = '';

    tasks.forEach(task => {
        if (!completedTasks.includes(task.id)) {
            const taskElement = createTaskElement(task);
            taskContainer.appendChild(taskElement);
        }
    });
}

async function openRewardsModal() {
    try {
        let rewardsModal = document.getElementById('rewardsModal');
        if (!rewardsModal) {
            rewardsModal = document.createElement('div');
            rewardsModal.id = 'rewardsModal';
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

            document.body.appendChild(rewardsModal);

            closeButton.addEventListener('click', () => {
                rewardsModal.style.display = 'none';
            });
        } else {
            rewardsModal.style.display = 'block';
        }

        // Обновление выполненных заданий перед открытием
        const userProgress = await getProgress(userId);
        completedTasks = userProgress.completedTasks || [];

        updateTasksDisplay();
    } catch (error) {
        console.error('Error in openRewardsModal:', error);
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
