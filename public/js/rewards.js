let walletStatus = 'none'; // Переменная для отслеживания состояния кошелька
function doneWallet() {
    walletStatus = 'Done!'
}
// Проверка привязки кошелька и выполнение задания
function checkWalletAndClaim() {
    if (walletStatus === 'Done!') {
        giveEggs();
        document.getElementById('taskContainer').remove();
        closeRewardsModal();
    } else {
        openNotCompleteModal();
    }
}

function openNotCompleteModal() {
    const notCompleteModal = document.getElementById('notComplete');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'block'; // Показать модальное окно
    }
}
function closeNotCompleteModal() {
    const notCompleteModal = document.getElementById('notComplete');
    if (notCompleteModal) {
        notCompleteModal.style.display = 'none'; // Показать модальное окно
    }
}
function openRewardsModal() {
    const rewardsModal = document.getElementById('rewardsModal');
    if (rewardsModal) {
        rewardsModal.style.display = 'block'; // Показать модальное окно
    }
  }
  function closeRewardsModal() {
    const rewardsModal = document.getElementById('rewardsModal');
    if (rewardsModal) {
        rewardsModal.style.display = 'none'; // Скрыть модальное окно
    }
  }
// Назначаем обработчик клика на иконку магазина
document.querySelector('.iconContainer img[src="public/images/rewards_icon.png"]').parentElement.addEventListener('click', openRewardsModal);

// Назначаем обработчик клика на крестик для закрытия магазина
document.querySelector('#rewardsModal .close').addEventListener('click', closeRewardsModal);
console.log('Event handlers assigned');