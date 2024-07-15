export default class Card {
  constructor({ name, link }, cardTemplate, handleImageClick) {
    this._name = name;
    this._link = link;
    this._cardTemplate = cardTemplate;
    this._handleImageClick = handleImageClick;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._toggleLike();
    });
    this._deleteButton.addEventListener("click", () => {
      this._deleteCard();
    });
    this._imageElement.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link);
    });
  }

  _toggleLike() {
    this._likeButton.classList.toggle("card__like-button_active");
  }

  _deleteCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  getView() {
    const template = this._cardTemplate.cloneNode(true);
    this._cardElement = template;

    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._imageElement = this._cardElement.querySelector(".card__image");

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._cardElement.querySelector(".card-title").textContent = this._name;

    this._setEventListeners();

    return this._cardElement;
  }
}
