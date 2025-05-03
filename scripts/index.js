function createCard(cardData, handleDelete) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true);

  // Получаем клонированный элемент из шаблона
  const clonedCard = cardElement.firstElementChild;

  const cardImage = clonedCard.querySelector('.card__image');
  const cardTitle = clonedCard.querySelector('.card__title');
  const deleteButton = clonedCard.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => {
    handleDelete(clonedCard);
  });

  return clonedCard;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

function renderCards() {
  const container = document.querySelector('.places__list');

  initialCards.forEach((cardData) => {
    const newCard = createCard(cardData, deleteCard);
    container.append(newCard);
  });
}

document.addEventListener("DOMContentLoaded", renderCards);
