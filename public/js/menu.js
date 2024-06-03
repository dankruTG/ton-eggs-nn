
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');

    menuButton.addEventListener('click', () => {
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'block';
        }
    });

    // Close the menu if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target !== menuButton && !menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});
