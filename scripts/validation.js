// enabling validation by calling enableValidation()
// pass all the settings on call
//Functions

function setEventListeners(formEl, options) {
  const { inputSelector } = options;
  const inputEls = [...formEl.querySelectorAll(inputSelector)];
  console.log(inputEls);
}

function enableValidation(options) {
  const formEls = [...document.querySelectorAll(options.formSelector)];
  formEls.forEach((formEl) => {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    setEventListeners(formEl, options);
    // loof for all the inputs inside the forms
    // see if they are valid
    // if any input is not valid
    // get validation message
    // add error class to input
    // display error message
    // disable the button
    // if all the inputs valid, enable button
    // reset error messages
  });
}

// Variables

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(config);
