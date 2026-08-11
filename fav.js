document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("fav-cats");
  if (!container) return;

  // Retrieve saved favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

  if (favorites.length === 0) {
    container.innerHTML = "<p id='no-favorites'>no favorites added yet!</p>";
    return;
  }

  // Render each favorite cat
  favorites.forEach(cat => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${cat.image}" alt="${cat.name}" />
      <div id="name-age">
          <h3>${cat.name}</h3>
          <p class="age">${cat.age}</p>
      </div>
      <p class="breed">${cat.breed}</p>
      <hr>
      <p class="sex">${cat.sex}</p>
      <button class="remove-btn">remove favorite</button>
    `;

    // 1. Remove favorite button handler
    const removeBtn = card.querySelector(".remove-btn");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Stops profile modal from opening when clicking remove
      removeFavorite(cat.name);
      card.remove(); // Remove card from UI
    });

    // 2. Card click handler to open profile
    card.addEventListener("click", () => {
      openProfile(cat);
    });

    container.appendChild(card);
  });
});

function removeFavorite(catName) {
  let favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];
  favorites = favorites.filter(cat => cat.name !== catName);
  localStorage.setItem("favoriteCats", JSON.stringify(favorites));

  const container = document.getElementById("fav-cats");

  if (favorites.length === 0 && container) {
    container.innerHTML = "<p id='no-favorites'>no favorites added yet!</p>";
  }
}