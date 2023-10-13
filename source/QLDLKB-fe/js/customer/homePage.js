const openMenu = document.getElementById("open-menu");
const overlay = document.getElementById("overlay");
const menu = document.getElementById("menu");

function handleClickOutsideMenu(event) {
    if (!openMenu.contains(event.target)) {
        menu.style.display = "none";
        overlay.style.display = "none";
    }
}

function showMenu() {
    if(menu.style.display === "block") {
        menu.style.display = "none";
        overlay.style.display = "none";
    }else {
        menu.style.display = "block";
        overlay.style.display = "block";
    }
}
