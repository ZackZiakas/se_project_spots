// ------------- Validation helpers -------------
const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgID = `${inputEl.id}-error`;
  const errorMsgEl = formEl.querySelector(`#${errorMsgID}`);
  if (!errorMsgEl) return;
  inputEl.classList.add("modal__input_type_error");
  errorMsgEl.textContent = errorMsg;
  errorMsgEl.classList.add("modal__input-error_active");
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgID = `${inputEl.id}-error`;
  const errorMsgEl = formEl.querySelector(`#${errorMsgID}`);
  if (!errorMsgEl) return;
  inputEl.classList.remove("modal__input_type_error");
  errorMsgEl.textContent = "";
  errorMsgEl.classList.remove("modal__input-error_active");
};

// Treat whitespace-only as invalid for required text-like inputs
function updateCustomTextValidity(inputEl) {
  const isTextLike =
    ["text", "search", "url", "email", "tel", "password"].includes(
      inputEl.type
    ) || inputEl.tagName === "TEXTAREA";

  if (isTextLike && inputEl.required) {
    if (inputEl.value.trim().length === 0) {
      inputEl.setCustomValidity("Please fill out this field.");
    } else {
      inputEl.setCustomValidity("");
    }
  } else {
    inputEl.setCustomValidity("");
  }
}

const checkInputValidity = (formEl, inputEl) => {
  updateCustomTextValidity(inputEl);
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const getSubmitButton = (formEl) =>
  formEl.querySelector(".modal__submit-btn") ||
  formEl.querySelector(".modal__submit"); // supports either class

const toggleButtonState = (inputList, buttonEl) => {
  if (!buttonEl) return;
  const disabled = hasInvalidInput(inputList);
  buttonEl.disabled = disabled;
  buttonEl.classList.toggle("modal__submit-btn_disabled", disabled);
};

// Clear all UI errors + fix button (use after form.reset() or before opening)
function resetFormValidation(formEl) {
  const inputs = Array.from(formEl.querySelectorAll(".modal__input"));
  const btn = getSubmitButton(formEl);
  inputs.forEach((input) => {
    input.setCustomValidity("");
    hideInputError(formEl, input);
  });
  toggleButtonState(inputs, btn);
}

// Surface all errors at once (used on invalid submit)
function validateWholeForm(formEl) {
  const inputs = Array.from(formEl.querySelectorAll(".modal__input"));
  const btn = getSubmitButton(formEl);
  inputs.forEach((input) => checkInputValidity(formEl, input));
  toggleButtonState(inputs, btn);
}

// ------------- Wire up listeners -------------
const setEventListeners = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonEl = getSubmitButton(formEl);

  // initial state
  toggleButtonState(inputList, buttonEl);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl);
      toggleButtonState(inputList, buttonEl);
    });
  });

  // If user hits submit with invalid fields, show all messages & block submit
  formEl.addEventListener("submit", (e) => {
    if (!formEl.checkValidity()) {
      e.preventDefault();
      validateWholeForm(formEl);
    }
  });

  // Expose a convenience method on the form element (optional, handy in your modal code)
  formEl.resetValidationUI = () => resetFormValidation(formEl);
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  formList.forEach((formEl) => {
    formEl.setAttribute("novalidate", "true");
    setEventListeners(formEl);
  });
};

enableValidation();

// Optional: export helpers to use in index.js if you want
window.resetFormValidation = resetFormValidation;
