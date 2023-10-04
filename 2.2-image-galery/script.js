const searchInput = document.getElementById("searchInput");
const imageContainer = document.getElementById("imageContainer");
const clearSearchBtn = document.getElementById("clearSearchBtn");

searchInput.focus();

const UNSPLASH_ACCESS_KEY = "KxbGdKeAg-vo67OBgbSm06iAx02XgNS1jtV-pseHu18";
const UNSPLASH_RANDOM_URL = "https://api.unsplash.com/photos/random?count=9&client_id=" + UNSPLASH_ACCESS_KEY;

// Выполнить запрос на получение случайных изображений при загрузке страницы
getRandomImages();

async function getRandomImages() {
    try {
        const response = await fetch(UNSPLASH_RANDOM_URL, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const imageUrls = data.map(result => result.urls.regular);
        displayImages(imageUrls);
        initialLoad = false;
    } catch (error) {
        console.error("Error fetching random images from Unsplash:", error);
    }
}

let initialLoad = true;

function searchImages() {
    const searchTerm = searchInput.value.trim();
    if (initialLoad || searchTerm !== "") {
        fetch(`https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`)
            .then(response => response.json())
            .then(data => {
                const imageUrls = data.results.map(result => result.urls.regular);
                displayImages(imageUrls);
                initialLoad = false;
            })
            .catch(error => {
                console.error("Error fetching images from Unsplash:", error);
            });
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
    clearSearchBtn.style.display = "none";
    getRandomImages();
}

searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchImages();
    }
});

function toggleClearSearchBtn() {
    if (searchInput.value.trim() !== "") {
        clearSearchBtn.style.display = "inline-block";
    } else {
        clearSearchBtn.style.display = "none";
        getRandomImages();
    }
}

clearSearchBtn.addEventListener("click", function() {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    searchInput.focus();
    getRandomImages();
});

searchInput.addEventListener("input", toggleClearSearchBtn);

toggleClearSearchBtn();
