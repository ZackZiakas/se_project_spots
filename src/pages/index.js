import "./index.css";
import {
  settings as validationConfig,
  enableValidation,
  resetFormValidation,
  checkInputValidity,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// ------------------ API instance ------------------
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "005be639-a26e-4a82-b748-263413624bcb",
    "Content-Type": "application/json",
  },
});

// ------------------ Modals: general helpers ------------------
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

// ------------------ Profile elements ------------------
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

// ------------------ Avatar modal elements ------------------
const avatarOpenBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");

// ------------------ New Post elements ------------------
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const nameInput = newPostForm.querySelector("#card-caption-input");
const linkInput = newPostForm.querySelector("#card-image-input");

// ------------------ Preview Modal ------------------
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// ------------------ Delete confirmation modal ------------------
const deleteModal = document.querySelector("#delete-modal");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteSubmitButton = deleteForm.querySelector(
  ".modal__button[type='submit']"
);
const deleteCancelButton = deleteForm.querySelector(
  ".modal__button_type_cancel"
);

let selectedCard = null;
let selectedCardId = null;

deleteCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

// ------------------ Cards ------------------
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  // Optional like counter, only if you add it later
  const likeCountEl = cardElement.querySelector(".card__like-count");

  // Set image and title
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Initial like state (if backend sends it)
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }
  if (likeCountEl && Array.isArray(data.likes)) {
    likeCountEl.textContent = data.likes.length;
  }

  // Like button: PUT or DELETE /cards/:cardId/likes
  cardLikeBtnEl.addEventListener("click", () => {
    const isActive = cardLikeBtnEl.classList.contains("card__like-btn_active");
    const cardId = data._id;

    const request = isActive ? api.removeLike(cardId) : api.addLike(cardId);

    request
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          cardLikeBtnEl.classList.add("card__like-btn_active");
        } else {
          cardLikeBtnEl.classList.remove("card__like-btn_active");
        }

        if (likeCountEl && Array.isArray(updatedCard.likes)) {
          likeCountEl.textContent = updatedCard.likes.length;
        }

        data.isLiked = updatedCard.isLiked;
        data.likes = updatedCard.likes;
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // Delete button: open confirmation modal
  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  // Image click → open preview modal
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// ------------------ Delete card flow ------------------
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  if (!selectedCard || !selectedCardId) return;

  const originalText = deleteSubmitButton.textContent;
  deleteSubmitButton.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      deleteSubmitButton.textContent = originalText;
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

// ------------------ Avatar form handler ------------------
function handleAvatarSubmit(evt) {
  evt.preventDefault();

  if (!avatarForm.checkValidity()) {
    Array.from(
      avatarForm.querySelectorAll(validationConfig.inputSelector)
    ).forEach((i) => checkInputValidity(avatarForm, i, validationConfig));
    return;
  }

  const submitButton = avatarForm.querySelector(".modal__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  const avatarLink = avatarInput.value.trim();

  api
    .editAvatar({ avatar: avatarLink })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = data.name;

      closeModal(avatarModal);
      avatarForm.reset();
      resetFormValidation(avatarForm, validationConfig);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

if (avatarOpenBtn) {
  avatarOpenBtn.addEventListener("click", () => {
    resetFormValidation(avatarForm, validationConfig);
    openModal(avatarModal);
  });
}

avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
  avatarForm.reset();
  resetFormValidation(avatarForm, validationConfig);
});

// ------------------ Load user + cards from API ------------------
api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    if (profileAvatarEl) {
      profileAvatarEl.src = userData.avatar;
      profileAvatarEl.alt = userData.name;
    }

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// ------------------ Edit Profile ------------------
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  resetFormValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
  editProfileForm.reset();
  resetFormValidation(editProfileForm, validationConfig);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (!editProfileForm.checkValidity()) {
    Array.from(
      editProfileForm.querySelectorAll(validationConfig.inputSelector)
    ).forEach((i) => checkInputValidity(editProfileForm, i, validationConfig));
    return;
  }

  const newName = editProfileNameInput.value.trim();
  const newAbout = editProfileDescriptionInput.value.trim();

  const submitButton = editProfileForm.querySelector(".modal__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .editUserInfo({ name: newName, about: newAbout })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      closeModal(editProfileModal);
      editProfileForm.reset();
      resetFormValidation(editProfileForm, validationConfig);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

// ------------------ New Post ------------------
newPostBtn.addEventListener("click", () => {
  resetFormValidation(newPostForm, validationConfig);
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
  newPostForm.reset();
  resetFormValidation(newPostForm, validationConfig);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  if (!newPostForm.checkValidity()) {
    Array.from(
      newPostForm.querySelectorAll(validationConfig.inputSelector)
    ).forEach((i) => checkInputValidity(newPostForm, i, validationConfig));
    return;
  }

  const inputValues = {
    name: nameInput.value.trim(),
    link: linkInput.value.trim(),
  };

  const submitButton = newPostForm.querySelector(".modal__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);

      closeModal(newPostModal);
      newPostForm.reset();
      resetFormValidation(newPostForm, validationConfig);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

// ------------------ Init validation ------------------
enableValidation(validationConfig);
