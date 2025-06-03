import "./pages/index.css"; 
import {
  createCard,
  deleteCard,
  handleLikeButtonClick,
} from "./components/card.js"; 
import { initialCards } from "./components/cards.js"; 
import { openModal, closeModal } from "./components/modal"; 

// Получаем содержимое элементов
const cardTemplate = document.querySelector("#card-template").content;
const placeList = document.querySelector(".places__list");
const editProfilePopup = document.querySelector(".popup_type_edit");
const editButton = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formElement = document.querySelector('form[name="edit-profile"]');
const nameInput = formElement.querySelector('input[name="name"]');
const jobInput = formElement.querySelector('input[name="description"]');
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
const popups = document.querySelectorAll(".popup");
const addButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = document.querySelector('form[name="new-place"]');
const placeNameInput = addCardForm.querySelector('input[name="place-name"]');
const placeLinkInput = addCardForm.querySelector('input[name="link"]');

// Обработчики и функции

export function CardImageClick({ link, name }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  // Обновляем данные профиля на странице
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  // Закрываем попап
  closeModal(editProfilePopup);
}

// Обработчик отправки формы добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  // Получаем значения из инпутов
  const name = placeNameInput.value;
  const link = placeLinkInput.value;
  // Создаём новую карточку с обработчиками
  const newCard = createCard({ name, link }, cardTemplate, deleteCard);
  // Добавляем карточку в начало списка
  placeList.prepend(newCard);
  // Закрываем попап и очищаем форму
  closeModal(addCardPopup);
  addCardForm.reset();
}



// Отправка формы редактирования профиля
formElement.addEventListener("submit", handleProfileFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  //значения в инпуты
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
});

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => openModal(addCardPopup));

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

//Вывод шести карточек при загрузке страницы

function addCards() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(cardData, deleteCard, CardImageClick);
    placeList.append(cardElement);
  });
}

addCards();