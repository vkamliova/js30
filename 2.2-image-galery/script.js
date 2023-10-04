const searchInput = document.getElementById("searchInput");
const imageContainer = document.getElementById("imageContainer");

searchInput.focus();

const UNSPLASH_ACCESS_KEY = "KxbGdKeAg-vo67OBgbSm06iAx02XgNS1jtV-pseHu18";

const UNSPLASH_RANDOM_URL = "https://api.unsplash.com/photos/random?count=9&client_id=" + UNSPLASH_ACCESS_KEY;

// Выполнить начальный запрос на получение случайных изображений при загрузке страницы
getRandomImages();

async function getRandomImages() {
    try {
        const response = await fetch(UNSPLASH_RANDOM_URL);
        const data = await response.json();
        const imageUrls = data.map(result => result.urls.regular);
        displayImages(imageUrls);
        initialLoad = false;
    } catch (error) {
        console.error("Error fetching random images from Unsplash:", error);
    }
}

// Флаг, чтобы определить, является ли запрос начальной загрузкой страницы
let initialLoad = true;

// Выполнить начальный поиск при загрузке страницы
searchImages();

async function searchImages() {
    const searchTerm = searchInput.value.trim();
    if (initialLoad || searchTerm !== "") {
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`);
            const data = await response.json();
            const imageUrls = data.results.map(result => result.urls.regular);
            displayImages(imageUrls);
            initialLoad = false;
        } catch (error) {
            console.error("Error fetching images from Unsplash:", error);
        }
    }
}

function displayImages(imageUrls) {
    imageContainer.innerHTML = "";
    imageUrls.forEach(url => {
        const imgElement = document.createElement("img");
        imgElement.src = url;
        imageContainer.appendChild(imgElement);
    });
}

function clearSearch() {
    searchInput.value = "";
    imageContainer.innerHTML = "";
}

searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchImages();
    }
});

const clearSearchBtn = document.getElementById("clearSearchBtn");

// Показать или скрыть крестик в зависимости от содержимого поля ввода
function toggleClearSearchBtn() {
    if (searchInput.value.trim() !== "") {
        clearSearchBtn.style.display = "inline-block";
    } else {
        clearSearchBtn.style.display = "none";
    }
}

// Удалить поисковый запрос и отобразить placeholder при клике на крестик
clearSearchBtn.addEventListener("click", function() {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    searchInput.focus();
});

// Вызов функции toggleClearSearchBtn() при изменении содержимого поля ввода
searchInput.addEventListener("input", toggleClearSearchBtn);

// Вызов функции toggleClearSearchBtn() при загрузке страницы для установки начального состояния
toggleClearSearchBtn();
