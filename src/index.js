import "./pages/index.css"; 
import { handleLikeButtonClick, createCard, deleteCard,} from "./components/card.js"; 
import { openModal, closeModal } from "./components/modal"; 
import { initialCards } from "./components/cards.js"; 

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


// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы
  // Обновляем данные профиля на странице
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  // Закрываем попап
  closeModal(editProfilePopup);
}
function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const data = {
        name: addCardForm.elements['place-name'].value,
        link: addCardForm.elements['link'].value,
    };
    const newCard = createCard(data, {
        deleteCard,
        handleLikeButtonClick,
        cardImageClick
    });
    placeList.prepend(newCard);
    closeModal(addCardPopup);
    addCardForm.reset();
}

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
    const cardElement = createCard(cardData,{deleteCard, handleLikeButtonClick, cardImageClick});
    placeList.append(cardElement);
  });
}
addCards();

// Функция для обработки клика по карточке
function cardImageClick({ link, name }) {
    
    imagePopupImage.src = link;
    imagePopupImage.alt = name;
    imagePopupCaption.textContent = name;
    
    // Открываем попап
    openModal(imagePopup);
}
