import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { showLoadingIndicator, hideLoadingIndicator } from './openShop.js';
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    const q = query(collection(db, 'users'), orderBy('totalBalance', 'desc'));
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
        if (Number (user.id) === Number (userId)) {
            playerRank.textContent = `Ваше место: ${index + 1}\n Ваше имя: ${userName}\n Общее количество монет: ${totalBalance}`;
        }
        else {
            playerRank.textContent = 'Where?'
        }
    });

    hideLoadingIndicator();
}

// Назначение функции открытия модального окна на кнопку
document.getElementById('leaderboardButton').onclick = openLeaderboardModal;
window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
