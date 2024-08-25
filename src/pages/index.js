import "../pages/index.css";
import { config } from "../utils/constants.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import PopupDelete from "../components/PopupDelete.js";
import Api from "../components/Api.js";

/* -------------------------------------------------- API ---------------------------------------------- */

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "128649a3-288e-4d03-932e-695fc20e4348",
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                                  Elements                                  */
/* -------------------------------------------------------------------------- */

// Edit Profile
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditForm = document.forms["profile-form"];
const profileEditBtn = document.querySelector("#profile-edit-button");
const profileTitleInput = profileEditModal.querySelector(
  "#profile-title-input"
);
const profileDescriptionInput = profileEditModal.querySelector(
  "#profile-description-input"
);

// Edit Avatar
const avatarEditBtn = document.querySelector("#avatar-edit-button");
const avatarForm = document.forms["modal__form_avatar"];

const profileImage = document.querySelector(".profile__image");

// Add New Card
const addCardForm = document.forms["card-form"];
const addCardBtn = document.querySelector(".profile__add-button");

// UserInfo
const user = new UserInfo(
  ".profile__title",
  ".profile__description",
  ".profile__image"
);

api
  .getUserData()
  .then((profileData) => {
    if (profileData) {
      user.setUserInfo(profileData.name, profileData.about);
      user.changeAvatar(profileData.avatar);
    }
  })
  .catch((err) => console.log("Error loading user info:", err));

/* -------------------------------------------------------------------------- */
/*                                  Popups                                    */
/* -------------------------------------------------------------------------- */

// Edit Profile Popup
const editProfilePopup = new PopupWithForm(
  "#profile-edit-modal",
  (profileData) => {
    editProfilePopup.renderLoading(true);

    api
      .editProfile(profileData.title, profileData.subheader)
      .then((updatedUserInfo) => {
        user.setUserInfo(updatedUserInfo.name, updatedUserInfo.about);
        editProfilePopup.close();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        editProfilePopup.renderLoading(false);
      });
  }
);
editProfilePopup.setEventListeners();

// Add New Card Popup
const newCardPopup = new PopupWithForm("#add-card-modal", (newCardData) => {
  newCardPopup.renderLoading(true);

  api
    .addNewCard({ name: newCardData.title, link: newCardData.url })
    .then((cardData) => {
      renderCard(cardData);
      newCardPopup.close();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      newCardPopup.renderLoading(false);
    });
});
newCardPopup.setEventListeners();

// Preview Image Popup
const previewImagePopup = new PopupWithImage("#preview-modal");
previewImagePopup.setEventListeners();

// Section to render cards
const section = new Section(
  {
    items: [],
    renderer: renderCard,
  },
  ".cards__list"
);

api
  .getInitialCards()
  .then((cards) => {
    section.renderItems(cards);
  })
  .catch((err) => console.log("Error fetching cards:", err));

// Edit Avatar Popup
const avatarEditPopup = new PopupWithForm(
  "#profile-avatar-modal",
  (formData) => {
    avatarEditPopup.renderLoading(true);

    api
      .updateAvatar(formData.link)
      .then((res) => {
        user.changeAvatar(res.avatar);
        avatarEditPopup.close();
      })
      .catch((err) => console.log("Error updating avatar:", err))
      .finally(() => {
        avatarEditPopup.renderLoading(false);
      });
  }
);
avatarEditPopup.setEventListeners();

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

// Render card function
function renderCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleDelete,
    handleLikeCard
  );
  const cardElement = card.getView();
  section.addItem(cardElement);
}

// Handle image click
function handleImageClick(card) {
  previewImagePopup.open({ name: card.name, link: card.link });
}

// Handle card delete
function handleDelete(card) {
  confirmation.open();
  confirmation.setConfirmSubmit(() => {
    api
      .deleteCard(card._id)
      .then(() => {
        confirmation.close();
        card.handleDeleteCard();
      })
      .catch((err) => console.log(err));
  });
}

// Handle Like click
function handleLikeCard(card) {
  if (card._isLiked) {
    api
      .removeLike(card._id)
      .then((res) => {
        card.updateIsLiked(res.isLiked);
      })
      .catch((err) => console.log(err));
  } else {
    api
      .addLike(card._id)
      .then((res) => {
        card.updateIsLiked(res.isLiked);
      })
      .catch((err) => console.log(err));
  }
}

/* -------------------------------------------------------------------------- */
/*                               Event Listeners                              */
/* -------------------------------------------------------------------------- */

// Edit Profile Form
profileEditBtn.addEventListener("click", () => {
  const userInput = user.getUserInfo();
  profileTitleInput.value = userInput.name;
  profileDescriptionInput.value = userInput.about;
  editProfilePopup.open();
  profileEditFormValidator.resetValidation();
});

// New Card Form
addCardBtn.addEventListener("click", () => {
  newCardPopup.open();
  addCardFormValidator.toggleButtonState();
});

// Delete Card Form
const confirmation = new PopupDelete({
  popupSelector: "#delete-card-modal",
});
confirmation.setEventListeners();

// Avatar Edit Form
avatarEditBtn.addEventListener("click", () => {
  avatarEditPopup.open();
});

/* -------------------------------------------------------------------------- */
/*                               Validation                                    */
/* -------------------------------------------------------------------------- */
const addCardFormValidator = new FormValidator(config, addCardForm);
addCardFormValidator.enableValidation();
const profileEditFormValidator = new FormValidator(config, profileEditForm);
profileEditFormValidator.enableValidation();

const avatarFormValidator = new FormValidator(config, avatarForm);
avatarFormValidator.enableValidation();

/* -------------------------------------------------------------------------- */
/*                           Fetch and Render Data                           */
/* -------------------------------------------------------------------------- */

Promise.all([api.getUserData(), api.getInitialCards()])
  .then(([profileData, cards]) => {
    user.setUserInfo(profileData.name, profileData.about);
    user.changeAvatar(profileData.avatar);
    section.renderItems(cards);
  })
  .catch((err) => {
    console.error("Error fetching data:", err);
  });

// Questions

// 1) Like  dissapears when reload the page
// 2) No initial cards are showing - Reviewer said no initial cards are showing when the page first loads.
