export default class Card {
  constructor({ name, link }, cardTemplate, handleImageClick) {
    this._name = name;
    this._link = link;
    this._cardTemplate = cardTemplate;
    this._handleImageClick = handleImageClick;
  }

  _setEventListeners() {
    //".card__like-button"
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._toggleLike();
      });
    //".card__delete-button"
    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._deleteCard();
      });
    //".card__image"
    this._cardElement
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleImageClick(this._name, this._link);
      });
  }

  _toggleLike() {
    this._cardElement
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active");
  }

  _deleteCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  _handleImageClick() {
    this._previewImageModal.querySelector(
      ".modal__container_image-preview"
    ).src = this._link;
    this._previewImageModal.querySelector(
      ".modal__container_image-preview"
    ).alt = this._name;
    this._previewImageModal.querySelector(".modal__image-title").textContent =
      this._name;
  }

  getView() {
    const template = this._cardTemplate.cloneNode(true);
    this._cardElement = template;

    this._cardElement.querySelector(".card__image").src = this._link;
    this._cardElement.querySelector(".card__image").alt = this._name;
    this._cardElement.querySelector(".card-title").textContent = this._name;

    this._setEventListeners();

    return this._cardElement;
  }
}
