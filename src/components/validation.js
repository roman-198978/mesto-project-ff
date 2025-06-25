

// Функция добавления класса с ошибкой
const showInputError = (formElement, inputElement, errorMessage,config) => {
const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
inputElement.classList.add(config.inputErrorClass);
errorElement.classList.add(config.errorClass);
errorElement.textContent = errorMessage;
};

// Функция удаления класса с ошибкой
const hideInputError = (formElement, inputElement,config) => {
const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
// Сбрасываем кастомное сообщение об ошибке
inputElement.setCustomValidity('');
inputElement.classList.remove(config.inputErrorClass);
errorElement.classList.remove(config.errorClass);
errorElement.textContent = "";
};
//Функция валидации полей
const checkInputValidity = (formElement, inputElement,config) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    // если передать пустую строку, то будут доступны
    // стандартные браузерные сообщения
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage,config);
  } else {
    hideInputError(formElement, inputElement,config);
  }
};



const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
  return !inputElement.validity.valid;
  });
};
// Функция деактивации кнопки
function disableSubmitButton (buttonElement, config) {
  buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
}

// Функция активации кнопки
function enableSubmitButton (buttonElement, config) {
  buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
}
// Функция переключает состояние кнопки

const toggleButtonState = (inputList, buttonElement,config) => {
  // Если есть хотя бы один невалидный инпут
  if (hasInvalidInput(inputList)) {
    // сделай кнопку неактивной
    disableSubmitButton(buttonElement, config);
  } else {
    // иначе сделай кнопку активной
    enableSubmitButton(buttonElement, config);
  }
};

const setEventListeners = (formElement,config) => {
const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
   toggleButtonState(inputList, buttonElement,config);
 inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
     checkInputValidity(formElement, inputElement,config);
      toggleButtonState(inputList, buttonElement,config);
    });
  });
};
export const clearValidation = (formElement,config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
inputList.forEach((input) => {
    hideInputError(formElement, input,config);
  });

 disableSubmitButton(buttonElement, config);
};
export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
formList.forEach((formElement) => { 
    setEventListeners(formElement,config); 
  }); 
};