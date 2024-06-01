import { saveProgress, getProgress } from './firebase.js';
import { giveEggs } from './addEggs.js';
import { hideLoadingIndicator, showLoadingIndicator } from './openShop.js';

// Переменные для хранения состояния пользователя
let completedTasks = [];
let walletStatus = 'none';

// Загрузка данных пользователя
Telegram.WebApp.ready();
const userId = Telegram.WebApp.initDataUnsafe.user.id;
getProgress(userId).then(savedProgress => {
    if (savedProgress) {
        walletStatus = savedProgress.walletStatus || 'none';
        completedTasks = savedProgress.completedTasks || [];
        console.log('Completed tasks:', completedTasks);
    }
});

// Список заданий
const tasks = [
    {
        id: 1,
        description: 'Привяжи кошелек',
        checkFunction: checkWalletAndClaim
    }
    // Можно добавить больше заданий сюда
];
export async function handleWalletConnection(userId, walletAddress) {
    try {
        await saveProgress(userId, { walletStatus: 'Done!', walletAddress });
        console.log('Wallet address saved:', walletAddress);
    } catch (error) {
        console.error('Error saving wallet address:', error);
    }
}

// Открытие модального окна с заданиями
async function openRewardsModal() {
    showLoadingIndicator();
    const userProgress = await getProgress(userId);
    completedTasks = userProgress.completedTasks || [];
    console.log('Completed tasks:', completedTasks);

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
    

    await updateTasksDisplay();
    hideLoadingIndicator();
}

// Обновление отображения заданий
async function updateTasksDisplay() {
    const taskContainer = document.getElementById('taskContainer');
    if (!taskContainer) return;

    taskContainer.innerHTML = '';
    showLoadingIndicator();
    completedTasks = await getProgress(userId.completedTasks);
    tasks.forEach(task => {
        if (!completedTasks.includes(task.id)) {
            const taskElement = createTaskElement(task);
            taskContainer.appendChild(taskElement);
        }
    });
    hideLoadingIndicator();
}

// Создание элемента задания
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const description = document.createElement('p');
    description.textContent = task.description;
    taskElement.appendChild(description);

    const claimButton = document.createElement('button');
    claimButton.classList.add('claim-button');
    claimButton.textContent = 'Claim';
    claimButton.onclick = () => task.checkFunction(task.id);
    taskElement.appendChild(claimButton);

    return taskElement;
}

// Проверка выполнения задания
async function checkWalletAndClaim(taskId) {
    showLoadingIndicator();
    const userProgress = await getProgress(userId);
    hideLoadingIndicator();

    if (userProgress.walletStatus === 'Done!') {
        giveEggs();
        completeTask(taskId);
    } else {
        openNotCompleteModal();
    }
}

// Обновление состояния выполнения задания в базе данных
async function completeTask(taskId) {
    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    showLoadingIndicator();
    const userProgress = await getProgress(userId);
    let completedTasks = userProgress.completedTasks || [];

    if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        await saveProgress(userId, { completedTasks });
        updateTasksDisplay();
        hideLoadingIndicator();
        openRewardModal();
    }
}
function openRewardModal() {
    const rewardModal = document.createElement('div');
    rewardModal.classList.add('modal');
    rewardModal.style.display = 'block';
    rewardModal.style.zIndex = '9999999999';
    rewardModal.style.backgroundColor = 'white';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    rewardModal.appendChild(modalContent);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    modalContent.appendChild(closeButton);

    const rewardImage = document.createElement('img');
    rewardImage.src = 'public/images/bronze_egg.png';
    rewardImage.alt = 'Bronze Egg';
    rewardImage.style.width = '200px';
    rewardImage.style.animation = 'shake 0.5s';
    rewardImage.style.animationIterationCount = 'infinite';
    modalContent.appendChild(rewardImage);

    document.body.appendChild(rewardModal);

    closeButton.addEventListener('click', () => {
        rewardModal.style.display = 'none';
    });
}
// Показ модального окна о невыполненном задании
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

// Инициализация событий и данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const rewardsIconContainer = document.querySelector('.iconContainer img[src="public/images/rewards_icon.png"]');
    if (rewardsIconContainer) {
        rewardsIconContainer.parentElement.addEventListener('click', openRewardsModal);
    }
    console.log('Event handlers assigned');
});

window.openRewardsModal = openRewardsModal;
window.completeTask = completeTask;
window.checkWalletAndClaim = checkWalletAndClaim;

// CSS анимация для тряски изображения
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(style);
