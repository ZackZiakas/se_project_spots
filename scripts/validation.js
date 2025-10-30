// ================== Config (yours) ==================
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// ================== Validation helpers ==================
const showInputError = (formEl, inputEl, errorMsg, cfg = settings) => {
  const errorMsgID = `${inputEl.id}-error`;
  const errorMsgEl = formEl.querySelector(`#${errorMsgID}`);
  if (!errorMsgEl) return;
  inputEl.classList.add(cfg.inputErrorClass);
  errorMsgEl.textContent = errorMsg;
  errorMsgEl.classList.add(cfg.errorClass);
};

const hideInputError = (formEl, inputEl, cfg = settings) => {
  const errorMsgID = `${inputEl.id}-error`;
  const errorMsgEl = formEl.querySelector(`#${errorMsgID}`);
  if (!errorMsgEl) return;
  inputEl.classList.remove(cfg.inputErrorClass);
  errorMsgEl.textContent = "";
  errorMsgEl.classList.remove(cfg.errorClass);
};

// Treat whitespace-only as invalid for required text-like inputs
function updateCustomTextValidity(inputEl) {
  const isTextLike =
    ["text", "search", "url", "email", "tel", "password"].includes(
      inputEl.type
    ) || inputEl.tagName === "TEXTAREA";

  if (isTextLike && inputEl.required) {
    inputEl.setCustomValidity(
      inputEl.value.trim().length === 0 ? "Please fill out this field." : ""
    );
  } else {
    inputEl.setCustomValidity("");
  }
}

const checkInputValidity = (formEl, inputEl, cfg = settings) => {
  updateCustomTextValidity(inputEl);
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, cfg);
  } else {
    hideInputError(formEl, inputEl, cfg);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const getSubmitButton = (formEl, cfg = settings) =>
  formEl.querySelector(cfg.submitButtonSelector);

const toggleButtonState = (inputList, buttonEl, cfg = settings) => {
  if (!buttonEl) return;
  const disabled = hasInvalidInput(inputList);
  buttonEl.disabled = disabled;
  buttonEl.classList.toggle(cfg.inactiveButtonClass, disabled);
};

// Clear all UI errors + fix button (use after form.reset() or before opening)
function resetFormValidation(formEl, cfg = settings) {
  const inputs = Array.from(formEl.querySelectorAll(cfg.inputSelector));
  const btn = getSubmitButton(formEl, cfg);
  inputs.forEach((input) => {
    input.setCustomValidity("");
    hideInputError(formEl, input, cfg);
  });
  toggleButtonState(inputs, btn, cfg);
}

// Surface all errors at once (used on invalid submit)
function validateWholeForm(formEl, cfg = settings) {
  const inputs = Array.from(formEl.querySelectorAll(cfg.inputSelector));
  const btn = getSubmitButton(formEl, cfg);
  inputs.forEach((input) => checkInputValidity(formEl, input, cfg));
  toggleButtonState(inputs, btn, cfg);
}

// ================== Wiring ==================
const setEventListeners = (formEl, cfg = settings) => {
  const inputList = Array.from(formEl.querySelectorAll(cfg.inputSelector));
  const buttonEl = getSubmitButton(formEl, cfg);

  // initial state
  toggleButtonState(inputList, buttonEl, cfg);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, cfg);
      toggleButtonState(inputList, buttonEl, cfg);
    });
  });

  // If user hits submit with invalid fields, show all messages & block submit
  formEl.addEventListener("submit", (e) => {
    if (!formEl.checkValidity()) {
      e.preventDefault();
      validateWholeForm(formEl, cfg);
    }
  });

  // Optional convenience handle
  formEl.resetValidationUI = () => resetFormValidation(formEl, cfg);
};

const enableValidation = (cfg = settings) => {
  const formList = Array.from(document.querySelectorAll(cfg.formSelector));
  formList.forEach((formEl) => {
    formEl.setAttribute("novalidate", "true");
    setEventListeners(formEl, cfg);
  });
};

enableValidation(settings);
