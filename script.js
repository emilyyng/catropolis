function playMeow() {
  const audio = document.getElementById("meowAudio");
  audio.play(); // Triggers the audio playback
}

// ==========================================
// HELPER FUNCTIONS & MODAL LOGIC
// ==========================================

// Save a cat object to localStorage
function saveToFavorites(cat) {
    let favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

    const exists = favorites.some(fav => fav.name === cat.name);

    if (!exists) {
        favorites.push(cat);
        localStorage.setItem("favoriteCats", JSON.stringify(favorites));
    }
}

// Populate and display the cat profile modal
// Global function to populate & display the cat profile modal
function openProfile(cat) {
    const profileModal = document.getElementById("cat-profile");
    if (!profileModal) return;

    // 1. Target specific elements by ID/structure cleanly
    const profileImg = profileModal.querySelector("#profile-content img");
    if (profileImg) {
        profileImg.src = cat.image;
        profileImg.alt = cat.name;
    }

    const catNameHeader = profileModal.querySelector("#profile-content h2");
    if (catNameHeader) {
        catNameHeader.textContent = cat.name;
    }

    // Get all paragraph tags inside #profile-content
    const pTags = profileModal.querySelectorAll("#profile-content p");

    if (pTags.length >= 5) {
        pTags[0].innerHTML = `<b>adoption fee</b>: $150`;
        pTags[1].innerHTML = `<b>shelter</b>: ${cat.shelter || 'N/A'}`;
        pTags[2].innerHTML = `<b>age</b>: ${cat.age}`;
        pTags[3].innerHTML = `<b>sex</b>: ${cat.sex} (${cat["s/n"]})`;
        pTags[4].innerHTML = `<b>breed</b>: ${cat.breed}`;
    }

    // 2. Handle Modal Favorites Button state & listener
    const favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];
    const isFavorited = favorites.some(fav => fav.name === cat.name);
    const favBtnContainer = document.querySelector("#profile-btns");
    const oldFavBtn = favBtnContainer ? favBtnContainer.querySelectorAll("button")[1] : null;

    if (oldFavBtn) {
        const newFavBtn = oldFavBtn.cloneNode(true);
        newFavBtn.textContent = isFavorited ? "✓ favorited!" : "+ add to favorites";
        newFavBtn.disabled = isFavorited;
        favBtnContainer.replaceChild(newFavBtn, oldFavBtn);

        newFavBtn.addEventListener("click", () => {
        saveToFavorites(cat);
        newFavBtn.textContent = "✓ favorited!";
        newFavBtn.disabled = true;

        // Sync active page buttons with the modal update
        document.querySelectorAll(".fav-btn").forEach(btn => {
            if (btn.closest(".card")?.id === cat.name || btn.closest(".carousel-card")?.id === cat.name) {
            btn.textContent = "✓ favorited!";
            btn.disabled = true;
            }
        });
        });
    }

    // 3. Display modal by adding the open class
    profileModal.classList.add("open");
    showOverlay();
}

document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("close-profile");
    const profileModal = document.getElementById("cat-profile");
    const overlay = document.getElementById("overlay");

    if (closeBtn && profileModal) {
        closeBtn.addEventListener("click", () => {
        profileModal.classList.remove("open");
        hideOverlay();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            if (profileModal) profileModal.classList.remove("open");
            hideOverlay();
        });
    }
});

// Helper functions to dim/undim background
function showOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.add("active");
}

function hideOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.remove("active");
}


// ==========================================
// 1. MEET THE CATS CAROUSEL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector(".carousel-card");
    if (!carouselContainer) return; // Guard clause if carousel isn't on this page

    let cats = [];
    let currentIndex = 0;

    fetch('cats.json')
        .then(response => response.json())
        .then(data => {
            cats = data;
            updateCarousel();
        })
        .catch(error => console.error('Error loading cat data:', error));

    function updateCarousel() {
        if (!cats.length) return;

        const cards = document.querySelectorAll(".carousel-card");
        const favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

        cards.forEach((card, i) => {
            const targetIndex = (currentIndex + i) % cats.length;
            const cat = cats[targetIndex];

            card.id = `${cat.name}`;
            card.style.cursor = "pointer";

            card.querySelector("img").src = cat.image;
            card.querySelector("img").alt = cat.name;
            card.querySelector("h3").textContent = cat.name;
            card.querySelector(".age").textContent = `${cat.age}`;
            card.querySelector(".breed").innerHTML = `<strong>breed:</strong> ${cat.breed}`;
            card.querySelector(".sex").innerHTML = `<strong>sex:</strong> ${cat.sex} · ${cat["s/n"]}`;

            // Rebind card node to clear old click handlers
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

            newCard.addEventListener("click", (e) => {
              if (e.target.classList.contains("fav-btn")) return;
              openProfile(cat);
            });

            // Update favorite button on newCard
            const isFavorited = favorites.some(fav => fav.name === cat.name);
            const favBtn = newCard.querySelector(".fav-btn");

            if (favBtn) {
                favBtn.textContent = isFavorited ? "✓ favorited!" : "+ add to favorites";
                favBtn.disabled = isFavorited;

                favBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    saveToFavorites(cat);
                    favBtn.textContent = "✓ favorited!";
                    favBtn.disabled = true;
                });
            }
        });
    }

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % cats.length;
          updateCarousel();
      });

      prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + cats.length) % cats.length;
          updateCarousel();
      });
    }
});


// ==========================================
// 2. MEET THE CATS GRID
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("cats");
  if (!container) return; // Guard clause if grid isn't on this page

  fetch("cats.json")
    .then(response => response.json())
    .then(data => {
      const favorites = JSON.parse(localStorage.getItem("favoriteCats")) || [];

      data.forEach(cat => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.id = `${cat.name}`;

        const isFavorited = favorites.some(fav => fav.name === cat.name);

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

        // Card click handler for modal
        card.addEventListener("click", (e) => {
          if (e.target.classList.contains("fav-btn")) return;
          openProfile(cat);
        });

        // Favorite button handler
        const favBtn = card.querySelector(".fav-btn");
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          saveToFavorites(cat);
          favBtn.textContent = "✓ favorited!";
          favBtn.disabled = true;
        });

        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error loading JSON data:", error));
});


// ==========================================
// 3. FAQ ACCORDION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    var acc = document.getElementsByClassName("accordion");

    for (var i = 0; i < acc.length; i++) {
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


// ==========================================
// 4. FOOTER NEWSLETTER SUBSCRIPTION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const subButton = document.getElementById('subscribe-btn');
  if (!subButton) return;

  const validateForm = (event) => {
      event.preventDefault();
      let containsErrors = false;

      var newsInputs = document.getElementById('newsletter').elements;
      for (let i = 0; i < newsInputs.length; i++) {
          if (newsInputs[i].tagName === "BUTTON") continue;

          if (newsInputs[i].value.length < 2) {
              containsErrors = true;
              newsInputs[i].classList.add("error");
          } else {
              newsInputs[i].classList.remove("error");
          }
      }

      let emailInput = document.getElementById("email");
      if (emailInput && !emailInput.value.includes("@")) {
          containsErrors = true;
          emailInput.classList.add("error");
      } else if (emailInput) {
          emailInput.classList.remove("error");
      }

      if (!containsErrors) {
          for (let i = 0; i < newsInputs.length; i++) {
              if (newsInputs[i].tagName !== "BUTTON") {
                  newsInputs[i].value = "";
              }
          }

          const popup = document.getElementById('timed-popup');
          if (popup) {
            popup.classList.remove('hidden');
            setTimeout(() => {
              popup.classList.add('hidden');
            }, 3000); 
          }
      }
  };

  subButton.addEventListener('click', validateForm);
});

// ==========================================
// 5. REGISTER ORGANIZATION MODAL & FORM
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const registerModal = document.getElementById("register");
    const getStartedBtn = document.querySelector("#partner-text button");
    const closeBtn = document.getElementById("close-register");
    const submitBtn = document.getElementById("submit-btn");
    const form = document.getElementById("register-form");
    const overlay = document.getElementById("overlay");

    // 1. Open Modal when clicking "Get Started" in Partner section
    if (getStartedBtn && registerModal) {
        getStartedBtn.addEventListener("click", () => {
            registerModal.classList.add("open");
            showOverlay();
        });
    }

    // 2. Close Modal when clicking the "x" button
    if (closeBtn && registerModal) {
        closeBtn.addEventListener("click", () => {
            registerModal.classList.remove("open");
            hideOverlay();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            if (registerModal) registerModal.classList.remove("open");
            hideOverlay();
        });
    }

    // 3. Form Validation & Submission Logic
    if (submitBtn && form) {
        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();
            let containsErrors = false;

            const nameInput = document.getElementById("reg-name") || document.getElementById("name");
            const emailInput = document.getElementById("reg-email") || document.getElementById("email");
            const phoneInput = document.getElementById("reg-phone") || document.getElementById("phone");

            // Validate Name (at least 2 characters)
            if (nameInput) {
                if (nameInput.value.trim().length < 2) {
                    containsErrors = true;
                    nameInput.classList.add("error");
                } else {
                    nameInput.classList.remove("error");
                }
            }

            // Validate Email (must contain @ and .)
            if (emailInput) {
                const emailVal = emailInput.value.trim();
                if (emailVal.length < 5 || !emailVal.includes("@") || !emailVal.includes(".")) {
                    containsErrors = true;
                    emailInput.classList.add("error");
                } else {
                    emailInput.classList.remove("error");
                }
            }

            // Validate Phone Number (must have at least 10 digits/characters)
            if (phoneInput) {
                if (phoneInput.value.trim().length < 10) {
                    containsErrors = true;
                    phoneInput.classList.add("error");
                } else {
                    phoneInput.classList.remove("error");
                }
            }

            // If validation passes
            if (!containsErrors) {
                // Clear input fields
                if (nameInput) nameInput.value = "";
                if (emailInput) emailInput.value = "";
                if (phoneInput) phoneInput.value = "";

                // Show submission banner inside modal
                const popup = document.getElementById("register-timed-popup") || document.getElementById("timed-popup");
                if (popup) {
                    popup.classList.remove("hidden");
                    
                    // Hide banner and close modal after 2.5 seconds
                    setTimeout(() => {
                        popup.classList.add("hidden");
                        if (registerModal) {
                            registerModal.classList.remove("open");
                            hideOverlay();
                        }
                    }, 2500);
                } else if (registerModal) {
                    // Fallback close if no popup found
                    registerModal.classList.remove("open");
                }
            }
        });
    }
});

// ==========================================
// 6. SCROLL ANIMATION
// ==========================================

// let revealableContainers = document.querySelectorAll(".revealable");

// const reveal = () => {
//     for (let i = 0; i < revealableContainers.length; i++) {
//         let current = revealableContainers[i];

//         // Get current height of container and window
//         let windowHeight = window.innerHeight;
//         let topOfRevealableContainer = current.getBoundingClientRect().top;
//         let revealDistance = parseInt(getComputedStyle(current).getPropertyValue('--reveal-distance'), 10);

//         // If the container is within range, add the 'active' class to reveal
//         if (topOfRevealableContainer < windowHeight - revealDistance) {
//             current.classList.add("active-scroll");
//         }
//         // If the container is not within range, hide it by removing the 'active' class
//         else { 
//             current.classList.remove("active-scroll");
//         }
//     }
// }

// window.addEventListener('scroll', reveal);

document.addEventListener("DOMContentLoaded", () => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class when element enters viewport
                entry.target.classList.add('active-scroll');
            } else {
                // Remove class when element leaves viewport
                entry.target.classList.remove('active-scroll');
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.revealable').forEach(el => {
        revealObserver.observe(el);
    });
});