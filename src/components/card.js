
const cardTemplate = document.querySelector("#card-template").content;

//Функция создания карточки
export function createCard(cardData, {deleteCard, handleLikeButtonClick, cardImageClick}) {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true); // клонируем шаблон карты
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardAlternative = cardElement.querySelector('.card__image');
  

  //установка значения из данных карточки

  cardImage.src = cardData.link;
  cardAlternative.alt = `Фотография места: ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  //обработчик удаления карточки

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });
  cardImage.addEventListener("click", () => { 
    cardImageClick({
        link: cardData.link,
        name: cardData.name,
    });
});

likeButton.addEventListener("click",(evt) => handleLikeButtonClick(evt));

return cardElement;
}

//Функция удаления карточки

export function deleteCard(cardElement) {
  cardElement.remove();
}

//кнопка лайка

export function handleLikeButtonClick(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

