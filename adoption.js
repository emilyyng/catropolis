// footer newsletter subscription
const submitButton = document.getElementById('submit-btn');
const validateAdoptionForm = (event) => {
    event.preventDefault();
    let containsErrors = false;

    var adoptInputs = document.getElementById('adoption-form').elements;
    for (let i = 0; i < adoptInputs.length; i++) {
        if (adoptInputs[i].tagName === "BUTTON") {
            continue;
        }

        if (adoptInputs[i].value.length < 2) {
            containsErrors = true;
            adoptInputs[i].classList.add("error");
        } else {
            adoptInputs[i].classList.remove("error");
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
        for (let i = 0; i < adoptInputs.length; i++) {
            if (adoptInputs[i].tagName !== "BUTTON") {
                adoptInputs[i].value = "";
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
submitButton.addEventListener('click', validateAdoptionForm);