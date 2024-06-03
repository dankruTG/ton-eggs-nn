import { getProgress } from './firebase.js';
import { showLoadingIndicator, hideLoadingIndicator } from './openShop.js';
const userId = Telegram.WebApp.initDataUnsafe.user.id;
// Функция форматирования числа
function formatNumber(number) {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'B'; // Миллиарды
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M'; // Миллионы
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K'; // Тысячи
    } else {
        return number; // Если число меньше тысячи, выводим его как есть
    }
}

// Открытие модального окна
export async function openLeaderboardModal() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) {
        modal.style.display = 'block';
        await loadLeaderboard();
    }
}

// Закрытие модального окна
export function closeLeaderboardModal() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Загрузка данных из базы данных и обновление отображения
async function loadLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    const playerRank = document.getElementById('playerRank');

    showLoadingIndicator();

    // Загрузка данных из базы данных (например, используя Firebase)
    const snapshot = await firebase.database().ref('users').orderByChild('totalBalance').once('value');
    const users = [];
    snapshot.forEach(childSnapshot => {
        const user = childSnapshot.val();
        users.push(user);
    });

    // Сортировка пользователей по totalBalance в порядке убывания
    users.sort((a, b) => b.totalBalance - a.totalBalance);

    // Очистка контейнера перед обновлением
    leaderboardContainer.innerHTML = '';

    // Заполнение списка пользователей
    users.forEach((user, index) => {
        const userName = user.username || 'ANONDIGGER';
        const totalBalance = formatNumber(user.totalBalance);

        const userElement = document.createElement('div');
        userElement.textContent = `${index + 1}. ${userName} - ${totalBalance}`;
        leaderboardContainer.appendChild(userElement);

        // Если текущий пользователь, отображаем его ранг отдельно
        if (user.id === userId) {
            playerRank.textContent = `Ваше место: ${index + 1}\nВаше имя: ${userName}\nОбщее количество монет: ${totalBalance}`;
        }
    });

    hideLoadingIndicator();
}

// Назначение функции открытия модального окна на кнопку
document.getElementById('leaderboardButton').onclick = openLeaderboardModal;
window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
