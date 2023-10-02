const searchInput = document.getElementById("searchInput");
const imageContainer = document.getElementById("imageContainer");

searchInput.focus();

const UNSPLASH_ACCESS_KEY = "KxbGdKeAg-vo67OBgbSm06iAx02XgNS1jtV-pseHu18";

async function searchImages() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${UNSPLASH_ACCESS_KEY}`);
            const data = await response.json();
            const imageUrls = data.results.map(result => result.urls.regular);
            displayImages(imageUrls);
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
