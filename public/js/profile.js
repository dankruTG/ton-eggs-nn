import { getProgress, saveProgress } from './firebase.js';

const userId = Telegram.WebApp.initDataUnsafe.user.id;

async function openProfileModal() {
    showLoadingIndicator();
    const userData = await getProgress(userId);
    hideLoadingIndicator();

    if (userData.username) {
        showProfile(userData);
    } else {
        openUsernameModal();
    }
}

function showProfile(userData) {
    const profileContent = document.getElementById('profileContent');
    profileContent.innerHTML = `
        <h2>Профиль</h2>
        <p>Имя: ${userData.username}</p>
        <p>Общее количество монет: ${userData.totalBalance}</p>
        <p>Общее количество урона: ${userData.totalDamage}</p>
    `;
    const profileModal = document.getElementById('profileModal');
    profileModal.style.display = 'block';
}

function openUsernameModal() {
    const usernameModal = document.getElementById('usernameModal');
    usernameModal.style.display = 'block';
}

function closeProfileModal() {
    const profileModal = document.getElementById('profileModal');
    profileModal.style.display = 'none';
}

function closeUsernameModal() {
    const usernameModal = document.getElementById('usernameModal');
    usernameModal.style.display = 'none';
}

async function saveUsername() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();

    if (username.length >= 5 && username.length <= 15) {
        showLoadingIndicator();
        await saveProgress(userId, { username });
        hideLoadingIndicator();
        closeUsernameModal();
        openProfileModal(); // Открыть профиль после сохранения имени
    } else {
        alert('Имя должно содержать от 5 до 15 символов.');
    }
}

document.getElementById('profileButton').onclick = openProfileModal;

window.openProfileModal = openProfileModal;
window.saveUsername = saveUsername;
window.closeProfileModal = closeProfileModal;
window.closeUsernameModal = closeUsernameModal;
