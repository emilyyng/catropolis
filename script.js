// meet the cats carousel on home screen
document.addEventListener('DOMContentLoaded', () => {
    
    let cats = [];
    let currentIndex = 0;
    const cardsToShow = 3;

    // Helper: Save cat to localStorage
    function saveToFavorites(cat) {
        let favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];
        const exists = favorites.some(fav => fav.name === cat.name);

        if (!exists) {
            favorites.push(cat);
            localStorage.setItem("favoriteCats", JSON.stringify(favorites));
        }
    }

    // 1. Fetch your cat data
    fetch('cats.json')
        .then(response => response.json())
        .then(data => {
            cats = data;
            updateCarousel();
        })
        .catch(error => console.error('Error loading cat data:', error));

    // 2. Render cards based on currentIndex
    function updateCarousel() {
        if (!cats.length) return; // Guard clause in case data hasn't loaded yet

        const cards = document.querySelectorAll(".carousel-card");
        
        // Always read the latest saved favorites when updating the view
        const favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

        cards.forEach((card, i) => {
            const targetIndex = (currentIndex + i) % cats.length;
            const cat = cats[targetIndex];

            card.id = `${cat.name}`;

            card.querySelector("img").src = cat.image;
            card.querySelector("img").alt = cat.name;

            card.querySelector("h3").textContent = cat.name;
            card.querySelector(".age").textContent = `${cat.age}`;
            card.querySelector(".breed").innerHTML = `<strong>breed:</strong> ${cat.breed}`;
            card.querySelector(".sex").innerHTML = `<strong>sex:</strong> ${cat.sex} · ${cat["s/n"]}`;

            // --- FAVORITES LOGIC FOR CAROUSEL ---
            const isFavorited = favorites.some(fav => fav.name === cat.name);
            const favBtn = card.querySelector(".fav-btn");

            if (favBtn) {
                // Update button visual state based on current storage
                favBtn.textContent = isFavorited ? "✓ favorited!" : "+ add to favorites";
                favBtn.disabled = isFavorited;

                // Clone and replace the button to strip any old click listeners 
                // from previously rendered cats on this card element
                const newFavBtn = favBtn.cloneNode(true);
                favBtn.parentNode.replaceChild(newFavBtn, favBtn);

                // Add fresh click listener for the currently active cat
                newFavBtn.addEventListener("click", () => {
                    saveToFavorites(cat);
                    newFavBtn.textContent = "✓ favorited!";
                    newFavBtn.disabled = true;
                });
            }
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


// meet the cats grid
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("cats");

  // Fetch your JSON file
  fetch("cats.json")
    .then(response => response.json())
    .then(data => {
      // 1. Get the current list of favorited cats from localStorage
      const favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

      // Loop through each item in the JSON array
      data.forEach(cat => {
        // Create the card element
        const card = document.createElement("div");
        card.classList.add("card");
        card.id = `${cat.name}`;

        // 2. Check if this specific cat is already in favorites
        const isFavorited = favorites.some(fav => fav.name === cat.name);

        // Populate the card's inner HTML using conditional button text
        card.innerHTML = `
          <img src="${cat.image}" alt="${cat.name}" />
          <div id="name-age">
              <h3>${cat.name}</h3>
              <p class="age">${cat.age}</p>
          </div>
          <p class="breed">${cat.breed}</p>
          <hr>
          <p class="sex">${cat.sex} · ${cat["s/n"]}</p>
          <button class="fav-btn" ${isFavorited ? "disabled" : ""}>
            ${isFavorited ? "✓ favorited!" : "+ add to favorites"}
          </button>
        `;

        // Add event listener to the favorites button
        const favBtn = card.querySelector(".fav-btn");
        favBtn.addEventListener("click", () => {
          saveToFavorites(cat);
          favBtn.textContent = "✓ favorited!";
          favBtn.disabled = true;
        });

        // Append the completed card to the container
        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error loading JSON data:", error));
});

function saveToFavorites(cat) {
  // Get existing favorites array from localStorage, or start with an empty array
  let favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

  // Check if the cat is already in favorites by name or unique ID
  const exists = favorites.some(fav => fav.name === cat.name);

  if (!exists) {
    favorites.push(cat);
    localStorage.setItem("favoriteCats", JSON.stringify(favorites));
  }
}



// faq accordian
document.addEventListener("DOMContentLoaded", function() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
    }
});



// footer newsletter subscription
const subButton = document.getElementById('subscribe-btn');
const validateForm = (event) => {
    event.preventDefault();
    let containsErrors = false;

    var newsInputs = document.getElementById('newsletter').elements;
    for (let i = 0; i < newsInputs.length; i++) {
        if (newsInputs[i].tagName === "BUTTON") {
            continue;
        }

        if (newsInputs[i].value.length < 2) {
            containsErrors = true;
            newsInputs[i].classList.add("error");
        } else {
            newsInputs[i].classList.remove("error");
        }
    }

    let emailInput = document.getElementById("email");
    if (!emailInput.value.includes("@")) {
        containsErrors = true;
        emailInput.classList.add("error");
    } else {
        emailInput.classList.remove("error");
    }

    if (containsErrors == false) {
        for (let i = 0; i < newsInputs.length; i++) {
            if (newsInputs[i].tagName !== "BUTTON") {
                newsInputs[i].value = "";
            }
        }

        // subscribed to newsletter popup
        const popup = document.getElementById('timed-popup');
        popup.classList.remove('hidden');
        setTimeout(() => {
        popup.classList.add('hidden');
        }, 3000); 
    }
}
subButton.addEventListener('click', validateForm);