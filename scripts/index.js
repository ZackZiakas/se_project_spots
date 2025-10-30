// ------------------ Initial Cards ------------------
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// ------------------ Helper functions ------------------
function openModal(modal) {
  modal.classList.add("modal_is-opened");
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

// ------------------ Edit Profile ------------------
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

// Open Edit Profile modal
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  // pass settings
  if (typeof resetFormValidation === "function") {
    resetFormValidation(editProfileForm, settings);
  }
  openModal(editProfileModal);
});

// Close Edit Profile modal
editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
  editProfileForm.reset();
  if (typeof resetFormValidation === "function") {
    resetFormValidation(editProfileForm, settings);
  }
});

// Handle Edit Profile form submit
editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (!editProfileForm.checkValidity()) {
    Array.from(
      editProfileForm.querySelectorAll(settings.inputSelector)
    ).forEach((i) => checkInputValidity(editProfileForm, i, settings));
    return;
  }

  profileNameEl.textContent = editProfileNameInput.value.trim();
  profileDescriptionEl.textContent = editProfileDescriptionInput.value.trim();

  closeModal(editProfileModal);
  editProfileForm.reset();
  if (typeof resetFormValidation === "function") {
    resetFormValidation(editProfileForm, settings);
  }
});

// ------------------ New Post ------------------
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const newPostForm = newPostModal.querySelector(".modal__form");
const nameInput = newPostForm.querySelector("#card-caption-input"); // caption
const linkInput = newPostForm.querySelector("#card-image-input"); // image link

// Open New Post modal
newPostBtn.addEventListener("click", () => {
  if (typeof resetFormValidation === "function") {
    resetFormValidation(newPostForm, settings);
  }
  openModal(newPostModal);
});

// Close New Post modal
newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
  newPostForm.reset();
  if (typeof resetFormValidation === "function") {
    resetFormValidation(newPostForm, settings);
  }
});

// Handle New Post form submit
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  if (!newPostForm.checkValidity()) {
    Array.from(newPostForm.querySelectorAll(settings.inputSelector)).forEach(
      (i) => checkInputValidity(newPostForm, i, settings)
    );
    return;
  }

  const inputValues = {
    name: nameInput.value.trim(),
    link: linkInput.value.trim(),
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  closeModal(newPostModal);
  newPostForm.reset();
  if (typeof resetFormValidation === "function") {
    resetFormValidation(newPostForm, settings);
  }
}
newPostForm.addEventListener("submit", handleAddCardSubmit);

// ------------------ Preview Modal ------------------
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// ------------------ Cards ------------------
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  // Set image and title
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Like button
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  // Delete button
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
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

// Render initial cards
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
