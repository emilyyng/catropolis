// meet the cats carousel on home screen
document.addEventListener('DOMContentLoaded', () => {
    
    let cats = [];
    let currentIndex = 0;
    const cardsToShow = 3;

    // 1. Fetch your cat data
    fetch('cats.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            cats = data;
            updateCarousel();
        })
        .catch(error => console.error('Error loading cat data:', error));

    // 2. Render 3 cards at a time
    function updateCarousel() {
    const cards = document.querySelectorAll(".carousel-card");

    cards.forEach((card, i) => {
        const targetIndex = (currentIndex + i) % cats.length;
        const cat = cats[targetIndex];

        card.querySelector("img").src = cat.image;
        card.querySelector("img").alt = cat.name;

        card.querySelector("h3").textContent = cat.name;
        card.querySelector(".age").textContent = `${cat.age}`;
        card.querySelector(".breed").innerHTML = `<strong>breed:</strong> ${cat.breed}`;
        card.querySelector(".sex").innerHTML = `<strong>sex:</strong> ${cat.sex} (${cat["s/n"]})`;
    });
}

    // 3. Navigation Controls
    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cats.length;
        updateCarousel();
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cats.length) % cats.length;
        updateCarousel();
    });

}); 