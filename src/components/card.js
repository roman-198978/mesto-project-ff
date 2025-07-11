import { removeCard, deleteLike, putLike } from "./api";
const cardTemplate = document.querySelector("#card-template").content;


// Функция создания карточки
export function createCard(cardData,{ deleteCard, handleLikeButtonClick, cardImageClick, userId}) {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true); // клонируем шаблон карты
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count"); // Получаем элемент для количества лайков

  // установка значения из данных карточки
  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length; // Устанавливаем количество лайков
  cardElement.dataset.id = cardData._id; // Устанавливаем cardId в data-id

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLikedByUser = cardData.likes.some(like => like._id === userId);
  
  if (isLikedByUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (cardData.owner && cardData.owner._id !== userId) {
    deleteButton.style.display = "none"; // Скрываем кнопку удаления, если карточка не принадлежит текущему пользователю
  } else {
    // обработчик удаления карточки
    deleteButton.addEventListener("click", () => {
      deleteCard(cardData._id, cardElement);
    });
  }

  cardImage.addEventListener("click", () => {
    cardImageClick({
      link: cardData.link,
      name: cardData.name,
    });
  });

  likeButton.addEventListener("click", () => 
        handleLikeButtonClick(cardData._id, likeButton, likeCountElement)
    );

    return cardElement;
}


// Функция для удаления карточки с сервера и из интерфейса
export function deleteCard(cardId, cardElement) {
  removeCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
    });
}

// Функция обработки клика по кнопке лайка
export function handleLikeButtonClick(_id, likeButton, likeCountElement) {
    // Получаем текущее состояние лайка
    const isLiked = likeButton.classList.contains("card__like-button_is-active");

    if (isLiked) {
        deleteLike(_id)
            .then((likeData) => {
                likeButton.classList.remove("card__like-button_is-active");
                likeCountElement.textContent = likeData.likes.length;
            })
            .catch((error) => {
                console.error("Ошибка при снятии лайка:", error);
            });
    } else {
        putLike(_id)
            .then((likeData) => {
                likeButton.classList.add("card__like-button_is-active");
                likeCountElement.textContent = likeData.likes.length;
            })
            .catch((error) => {
                console.error("Ошибка при постановке лайка:", error);
            });
    }
}



  
