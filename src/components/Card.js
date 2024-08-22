export default class Card {
  constructor(
    { _id, name, link, isLiked },
    cardSelector,
    handleImageClick,
    handleCardDelete,
    handleLikeCard
  ) {
    this.name = name;
    this.link = link;
    this._id = _id;
    this._isLiked = isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleCardDelete = handleCardDelete;
    this._handleLikeCard = handleLikeCard;
    this._previewImageElement = null;
  }

  _setEventListeners() {
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._likeButton.addEventListener("click", () => {
      this._handleLikeIcon();
    });

    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    this._deleteButton.addEventListener("click", () => {
      this._handleCardDelete(this);
    });

    this._cardImageElement = this._cardElement.querySelector(".card__image");
    this._cardImageElement.addEventListener("click", () => {
      this._handleImageClick(this);
    });
  }

  _handleDeleteCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  _handleLikeIcon() {
    this._likeButton.classList.toggle("card__like-button_active");
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._setEventListeners();

    this._cardTitleElement = this._cardElement.querySelector(".card-title");
    this._cardImageElement.src = this.link;
    this._cardImageElement.alt = this.name;
    this._cardTitleElement.textContent = this.name;

    return this._cardElement;
  }
}
