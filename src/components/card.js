import { initialCards } from "./cards";
import { CardImageClick } from "../index";

const cardTemplate = document.querySelector("#card-template").content;
const placeList = document.querySelector(".places__list");
//Функция создания карточки
function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true); // клонируем шаблон карты

  //элементы внутри карточки

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  //установка значения из данных карточки

  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  //обработчик удаления карточки

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  //Обработчик лайка

  likeButton.addEventListener("click", handleLikeButtonClick);

  cardImage.addEventListener("click", () => CardImageClick(cardData));

  return cardElement;
}

//Функция удаления карточки

function deleteCard(cardElement) {
  cardElement.remove();
}

//кнопка лайка

function handleLikeButtonClick(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, handleLikeButtonClick };