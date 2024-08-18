import "../pages/index.css";
import { config } from "../utils/constants.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import PopupDelete from "../components/PopupDelete.js";
import Api from "../components/api.js";

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
    const submitButton = profileEditForm.querySelector(".modal__save");
    const initialButtonText = submitButton.textContent;
    submitButton.textContent = "Saving...";

    api
      .editProfile(profileData.title, profileData.subheader)
      .then((updatedUserInfo) => {
        user.setUserInfo(updatedUserInfo.name, updatedUserInfo.about);
        editProfilePopup.close();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        submitButton.textContent = initialButtonText;
      });
  }
);
editProfilePopup.setEventListeners();

// Add New Card Popup
const newCardPopup = new PopupWithForm("#add-card-modal", (newCardData) => {
  const submitButton = addCardForm.querySelector(".modal__save");
  const initialButtonText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .addNewCard({ name: newCardData.title, link: newCardData.url })
    .then((cardData) => {
      renderCard(cardData);
      newCardPopup.close();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      submitButton.textContent = initialButtonText;
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

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

// Render card function
function renderCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  const cardElement = card.getView();
  section.addItem(cardElement);
}

// Handle image click
function handleImageClick(card) {
  previewImagePopup.open(card.name, card.link);
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

/* -------------------------------------------------------------------------- */
/*                               Validation                                    */
/* -------------------------------------------------------------------------- */
const addCardFormValidator = new FormValidator(config, addCardForm);
addCardFormValidator.enableValidation();
const profileEditFormValidator = new FormValidator(config, profileEditForm);
profileEditFormValidator.enableValidation();

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
