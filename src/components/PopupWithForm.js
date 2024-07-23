import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit, resetOnClose) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector(".modal__form");
    this._formButton = this._popupElement.querySelector(".modal__button");
    this._formButtonText = this._formButton.textContent;
    this._handleFormSubmit = handleFormSubmit;
    this._resetOnClose = resetOnClose;
    this._inputList = this._popupElement.querySelectorAll(".modal__input");
  }

  _getInputValues() {
    const inputValues = {};
    this._inputList.forEach((input) => (inputValues[input.name] = input.value));
    return inputValues;
  }

  setEventListeners() {
    this._popupForm.addEventListener("submit", this._handleSubmit);
    super.setEventListeners();
  }

  _handleSubmit = (evt) => {
    evt.preventDefault();
    this._handleFormSubmit(this._getInputValues());
  };

  close() {
    this._popupForm.reset();
    super.close();
  }
}
