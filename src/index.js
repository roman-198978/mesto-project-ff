import "./pages/index.css"; 
import { handleLikeButtonClick, createCard, deleteCard,} from "./components/card.js"; 
import { openModal, closeModal } from "./components/modal"; 

import { clearValidation, enableValidation } from './components/validation.js';
import { getCards, getUserData, updateUserData,addNewCard, updateUserAvatar } from './components/api.js';
// Получаем содержимое элементов
const placeList = document.querySelector(".places__list");
const editProfilePopup = document.querySelector(".popup_type_edit");
const editButton = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formProfile = document.querySelector('form[name="edit-profile"]');
const nameInput = formProfile.querySelector('input[name="name"]');
const jobInput = formProfile.querySelector('input[name="description"]');
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
const popups = document.querySelectorAll(".popup");
const addButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = document.querySelector('form[name="new-place"]');
const formAddNameCardInput = document.querySelector('input[name="place-name"]');
const formAddLinkInput = document.querySelector('input[name="link"]');

// Элементы для обновления аватара
const avatarEditButton = document.querySelector(".profile__image-edit");
const popupAvatar = document.querySelector(".popup_type_avatar");
const avatarForm = document.querySelector('form[name="update-avatar"]');
const formAvatarInput = avatarForm.querySelector('input[name="avatar-link"]');
const profileImage = document.querySelector(".profile__image");

function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  const newName = nameInput.value;
  const newAbout = jobInput.value;
// Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter;
  // Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent;
  // Включаем индикацию загрузки
  renderLoading(true, submitButton, originalButtonText);
  updateUserData(newName, newAbout)
    .then((responseData) => {
      // Обновляем данные профиля на странице
      profileTitle.textContent = responseData.name;
      profileDescription.textContent = responseData.about;
      // Закрываем попап
      closeModal(editProfilePopup);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      // Выключаем индикацию загрузки
      renderLoading(false, submitButton, originalButtonText);
    });
}

// Обработчик отправки формы добавления карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const nameCardValue = formAddNameCardInput.value;
  const linkInputValue = formAddLinkInput.value;
  const submitButton = evt.submitter;
  const originalButtonText = submitButton.textContent;
  // Включаем индикацию загрузки
  renderLoading(true, submitButton, originalButtonText);
  addNewCard(nameCardValue, linkInputValue)
    .then((newCard) => {
      if (newCard) {
        // Создаём элемент карточки только после успешного добавления
        const newCardElement = createCard(
          {
            name: newCard.name,
            link: newCard.link,
            _id: newCard._id,
            owner: newCard.owner._id,
            likes: newCard.likes
          },
          
          {
            deleteCard,
            handleLikeButtonClick,
            cardImageClick,
            
          }
        );
        placeList.prepend(newCardElement);
        // Закрываем попап
        closeModal(addCardPopup);
        // Сброс формы
        addCardForm.reset();
      }
    })
    .catch((error) => {
      console.error("Произошла ошибка при добавлении карточки:", error);
    })
.finally(() => {
      // Выключаем индикацию загрузки
      renderLoading(false, submitButton, originalButtonText);
    });
}

// Добавляем обработчик события к форме добавления карточки
addCardForm.addEventListener('submit', handleAddCardSubmit);




// Отправка формы редактирования профиля
formProfile.addEventListener("submit", handleProfileFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  //значения в инпуты
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
  clearValidation(editProfilePopup, config);
});

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => {
  openModal(addCardPopup);
  
});
//закрытие по клику на крестик и оверлей

popups.forEach(function (popup) {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    closeModal(popup);
  });
  popup.addEventListener("mousedown", function (evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });
});



// Функция для обработки клика по карточке
function cardImageClick({ link, name }) {
    
    imagePopupImage.src = link;
    imagePopupImage.alt = name;
    imagePopupCaption.textContent = name;
    
    // Открываем попап
    openModal(imagePopup);
}

//настройка валидации
const config = {
formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
enableValidation(config);

let userId = "";
// Загрузка данных пользователя и карточек при инициализации страницы

Promise.all([getUserData(), getCards()])
  .then(([userData, cardList]) => {
    // Сохраняем идентификатор пользователя
    userId = userData._id
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`; 
    // Функция для добавления карточек на страницу
    function addCards() {
      cardList.forEach((cardData) => {
        // Создаём новую карточку и добавляем её в список
        const cardElement = createCard(cardData, {
          deleteCard,
          handleLikeButtonClick,
          cardImageClick,
          userId
        });
        placeList.append(cardElement);
      });
    }

    // Вызываем функцию для добавления карточек
    addCards();
  })
  
  .catch((error) => {
    // Обработка ошибки
    console.error('Ошибка при загрузке данных:', error);
  });


function renderLoading(
  isLoading,
  button,
  buttonText = "Сохранить",
  loadingText = "Сохранение..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}
//РАБОТА С ОТКРЫТЫМ ПОПАПОМ "АВАТАР"

// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  // Получаем значение из инпута
  const avatarLink = formAvatarInput.value;

  // Получаем кнопку отправки формы через event.submitter
  const submitButton = evt.submitter;
  // Сохраняем оригинальный текст кнопки
  const originalButtonText = submitButton.textContent;
  // Включаем индикацию загрузки
  renderLoading(true, submitButton, originalButtonText);

  // Отправляем запрос на сервер для обновления аватара
  updateUserAvatar(avatarLink)
    .then((userData) => {
      // Обновляем аватар на странице
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      // Закрываем попап
      closeModal(popupAvatar);
      // Сбрасываем форму
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(`Ошибка обновления аватара: ${err}`);
    })
    .finally(() => {
      // Выключаем индикацию загрузки
      renderLoading(false, submitButton, originalButtonText);
    });
}

// Открытие попапа для замены аватара
avatarEditButton.addEventListener("click", () => {
  openModal(popupAvatar);
  clearValidation(popupAvatar, config);
  avatarForm.reset();
});
// Отправка формы обновления аватара
avatarForm.addEventListener("submit", handleAvatarFormSubmit);


