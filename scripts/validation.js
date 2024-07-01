// enabling validation by calling enableValidation()
// pass all the settings on call
//Functions
function enableValidation(options) {
  const formEls = [...document.querySelectorAll(".popup_form")];
  formEls.forEach((formEl) =>
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    })
  );
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
