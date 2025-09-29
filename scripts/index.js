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
  openModal(editProfileModal);
});

// Close Edit Profile modal
editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);

// Handle Edit Profile form submit
editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
});

// ------------------ New Post ------------------
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

// Query the form and its input fields inside the modal
const newPostForm = newPostModal.querySelector(".modal__form");
const nameInput = newPostForm.querySelector("#card-caption-input"); // Caption
const linkInput = newPostForm.querySelector("#card-image-input"); // Image URL

// Open New Post modal
newPostBtn.addEventListener("click", () => openModal(newPostModal));

// Close New Post modal
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

// Handle New Post form submit
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  // Log input values
  console.log("Card name:", nameInput.value);
  console.log("Image link:", linkInput.value);

  // Close modal and reset form
  closeModal(newPostModal);
  newPostForm.reset();
}

// Attach submit listener
newPostForm.addEventListener("submit", handleAddCardSubmit);
