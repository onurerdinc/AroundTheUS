import "../pages/index.css";
import { initialCards, config } from "../Utility/Constant.js";
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
    authorization: "14397dd8-886c-41ac-9747-72b21d4fd4c0",
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                                  Elements                                  */
// /* -------------------------------------------------------------------------- */

//Edit Profile
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditForm = document.forms["profile-form"];
const profileEditBtn = document.querySelector("#profile-edit-button");
const profileTitleInput = profileEditModal.querySelector(
  "#profile-title-input"
);
const profileDescriptionInput = profileEditModal.querySelector(
  "#profile-description-input"
);

//Add New Card
const addCardModal = document.querySelector("#add-card-modal");
const addCardForm = document.forms["card-form"];
const addCardBtn = document.querySelector(".profile__add-button");

//UserInfo
const user = new UserInfo(".profile__title", ".profile__description");

// /* -------------------------------------------------------------------------- */
// /*                                  Popups                                    */
// /* -------------------------------------------------------------------------- */

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
        submitButton.textContent = initialButtonText; // Revert button text back to original
      });
  }
);
editProfilePopup.setEventListeners();

// Add New Card Popup
const newCardPopup = new PopupWithForm("#add-card-modal", (newCardData) => {
  const submitButton = addCardForm.querySelector(".modal__save"); // Get the submit button
  const initialButtonText = submitButton.textContent; // Store the initial button text

  submitButton.textContent = "Saving..."; // Change button text to 'Saving...'
  api
    .addNewCard({ name: newCardData.title, link: newCardData.url })
    .then((cardData) => {
      renderCard(cardData);
      newCardPopup.close();
    })
    .catch((err) => console.log(err));
}).finally(() => {
  submitButton.textContent = initialButtonText; // Revert button text back to original
});
newCardPopup.setEventListeners();

//Preview Image Popup
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
// /* -------------------------------------------------------------------------- */
// /*                                  Functions                                 */
// /* -------------------------------------------------------------------------- */
// Render card function
function renderCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  const cardElement = card.getView();

  // Add functionality for liking/unliking the card
  card.setLikeHandler((cardId) => {
    // <-- Added: Handler for like/unlike
    if (card.isLiked()) {
      api
        .removeLikes(cardId) // <-- Added: API call to remove like
        .then((updatedCardData) => {
          card.updateLikes(updatedCardData.likes); // <-- Modified: Update UI with server response
        })
        .catch((err) => console.log(err));
    } else {
      api
        .addLikes(cardId) // <-- Added: API call to add like
        .then((updatedCardData) => {
          card.updateLikes(updatedCardData.likes); // <-- Modified: Update UI with server response
        })
        .catch((err) => console.log(err));
    }
  });

  section.addItem(cardElement);
}

// Handle image click
function handleImageClick(name, link) {
  previewImagePopup.open(name, link);
}
// /* -------------------------------------------------------------------------- */
// /*                               Event Listeners                              */
// /* -------------------------------------------------------------------------- */
//Edit Profile Form
profileEditBtn.addEventListener("click", () => {
  const userInput = user.getUserInfo();
  editProfilePopup.setInputValues({
    title: userInput.name,
    subheader: userInput.about,
  });
  profileEditFormValidator.resetValidation();
  editProfilePopup.open();
});

//New Card Form
addCardBtn.addEventListener("click", () => {
  newCardPopup.open();
  addCardFormValidator.toggleButtonState();
});

// Delete Card Form
const confirmation = new PopupDelete({
  popupSelector: "#delete-card-modal",
});
confirmation.setEventListeners();

// /* -------------------------------------------------------------------------- */
// /*                               Validation                                 */
// /* -------------------------------------------------------------------------- */
const addCardFormValidator = new FormValidator(config, addCardForm);
addCardFormValidator.enableValidation();
const profileEditFormValidator = new FormValidator(config, profileEditForm);
profileEditFormValidator.enableValidation();

// Fetch user data and initial cards on page load
Promise.all([api.getUserData(), api.getInitialCards()]) // <-- Added: Fetch user data and cards from API
  .then(([userData, initialCards]) => {
    user.setUserInfo(userData.name, userData.about); // <-- Modified: Update UI with fetched user data
    section.renderItems(initialCards); // <-- Modified: Render fetched cards
  })
  .catch((err) => console.log(err));
