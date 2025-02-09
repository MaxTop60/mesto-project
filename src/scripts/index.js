// @todo: Темплейт карточки
import '../images/add-icon.svg';
import '../images/avatar.jpg';
import '../images/card_1.jpg';
import '../images/card_2.jpg';
import '../images/card_3.jpg';
import '../images/close.svg';
import '../images/delete-icon.svg';
import '../images/edit-icon.svg';
import '../images/like-active.svg';
import '../images/like-inactive.svg';
import '../images/logo.svg';
import '../pages/index.css';
import { getUser } from './api.js';
import { getInitialCards } from './api.js';
import { patchProfile } from './api.js';
import { postCard } from './api.js';
import { deleteCard } from './api.js';
import { putLike } from './api.js';
import { deleteLike } from './api.js';
import { patchAvatar } from './api.js';


// @todo: DOM узлы
const name = document.querySelector('.profile__title');
const description = document.querySelector('.profile__description');
let initialCards = await getInitialCards();

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarEditButton = document.querySelector('.profile__image');
const avatarPopupClose = avatarPopup.querySelector('.popup__close');
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarLink = avatarPopup.querySelector('.popup__input_type_url');

const profilePopup = document.querySelector('.popup_type_edit');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileCloseButton = profilePopup.querySelector('.popup__close');
const profileFormElement = profilePopup.querySelector('.popup__form');
const profileName = profilePopup.querySelector('.popup__input_type_name');
const profileDesctiption = profilePopup.querySelector('.popup__input_type_description');

const cardPopup = document.querySelector('.popup_type_new-card');
const cardAddButton = document.querySelector('.profile__add-button');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardName = cardPopup.querySelector('.popup__input_type_card-name');
const cardLink = cardPopup.querySelector('.popup__input_type_url');
let cardLikeButtons = document.querySelectorAll('.card__like-button');


const imagePopup = document.querySelector('.popup_type_image');
const imagePopupClose = imagePopup.querySelector('.popup__close');
let image = imagePopup.querySelector(".popup__image");
let caption = imagePopup.querySelector(".popup__caption");

const cardTemplate = document.getElementById('card-template');
const placesList = document.querySelector('.places__list');

const forms = document.querySelectorAll('.popup__form');
const popups = document.querySelectorAll('.popup');

let user = await getUser()
           
name.innerText = user.name;
description.innerText = user.about;
avatarEditButton.style.backgroundImage = `url(${user.avatar})`;


forms.forEach(form => {
    const inputs = form.querySelectorAll('input'); // Получаем только поля ввода текущей формы
    const button = form.querySelector('.popup__button'); // Кнопка текущей формы

    inputs.forEach(inputElement => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(inputElement);
            toggleButton(button, inputs); // Передаем все поля ввода текущей формы
        });

        inputElement.addEventListener('blur', () => {
            toggleInputError(inputElement);
        });

        inputElement.addEventListener('focus', () => {
            toggleErrorSpan(inputElement);
        });
    });
});

function checkInputValidity(inputElement) {
    let errorMessage = '';

    if (inputElement.validity.patternMismatch) {
        errorMessage = inputElement.dataset.errorMessage;
    } else {
        errorMessage = checkLengthMismatch(inputElement);
    }

    inputElement.setCustomValidity(errorMessage); // Устанавливаем сообщение об ошибке

    // Очищаем сообщение об ошибке, если поле валидно
    if (inputElement.validity.valid) {
        inputElement.setCustomValidity('');
    }
}

function checkLengthMismatch(inputElement) {
    const valueLength = inputElement.value.trim().length;
    if (valueLength === 0) {
        return 'Вы пропустили это поле.';
    } else if (valueLength < inputElement.minLength) {
        return `Минимальное количество символов: ${inputElement.minLength}`;
    } 
    return '';
}

function toggleInputError(inputElement) {
    if (!inputElement.validity.valid) {
        toggleErrorSpan(inputElement, inputElement.validationMessage);
    } else {
        toggleErrorSpan(inputElement);
        inputElement.setCustomValidity(''); // Очищаем сообщение об ошибке
    }
}

function toggleButton(buttonElement, inputs) {
    if (hasInvalidInput(inputs)) {
        buttonElement.classList.add('button-inactive');
        buttonElement.setAttribute('aria-disabled', 'true');
        buttonElement.disabled = true; // Делаем кнопку неактивной
    } else {
        buttonElement.classList.remove('button-inactive');
        buttonElement.setAttribute('aria-disabled', 'false');
        buttonElement.disabled = false; // Возвращаем активность кнопки
    }
}

function hasInvalidInput(inputs) {
    const invalid = Array.from(inputs).some(inputElement => !inputElement.validity.valid);
    console.log('Has invalid input:', invalid);
    return invalid;
}

function toggleErrorSpan(inputElement, errorMessage) {
    const errorElement = document.querySelector(`.${inputElement.id}-error`);

    if (errorElement) { // Проверяем, существует ли элемент ошибки
        errorElement.textContent = errorMessage || '';
    }
}

// @todo: Функция создания карточки
function createCard(card) {
    let elem = cardTemplate.content.cloneNode(true);

    elem.querySelector('.card__title').innerHTML = card.name;
    elem.querySelector('.card__image').src = card.link;

    elem.querySelector('.card__image').addEventListener('click', function () {
        cardOpen(card);
    })

    if (card.owner.name != user.name) {
        elem.querySelector('.card__delete-button').classList.add('delete-disabled');
    }

    elem.querySelector('.card__like-number').innerText = card.likes.length;
    cardLike(elem, card);

    card.likes.forEach(function(el) {
        if (el._id == user._id) {
            elem.querySelector('.card__like-button').classList.add('card__like-button_is-active');
        }
    }) 

    return elem;
}

function openModal(popup) {
    popup.classList.add('popup_is-opened');
    const inputs = popup.querySelectorAll('input');
    const button = popup.querySelector('.button');
    toggleButton(button, inputs);

    document.addEventListener('keydown', function (event) {
        closeByEsc(event);
    })
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    profilePopup.querySelector('.popup__button').innerHTML = 'Сохранение...';

    let profileNameValue = profileName.value;
    let profileDescriptionValue = profileDesctiption.value;

    name.textContent = profileNameValue;
    description.textContent = profileDescriptionValue;

    patchProfile(profileNameValue, profileDescriptionValue).finally(() => {
        profilePopup.querySelector('.popup__button').innerHTML = 'Сохранить';
    });

    closeModal(profilePopup);
}

function cardLike(temp, card) {

    let cardLikeButton = temp.querySelector('.card__like-button');
    let like_number = temp.querySelector('.card__like-number');
    cardLikeButton.addEventListener('click', async function () {
        if(!cardLikeButton.classList.contains('card__like-button_is-active')) {
            card = await putLike(card._id);
        } else {
            card = await deleteLike(card._id);
        }
        cardLikeButton.classList.toggle('card__like-button_is-active');
        like_number.innerHTML = card.likes.length;
    })
}

function cardDelete() {
    let cardDeleteButtons = document.querySelectorAll('.card__delete-button');

    cardDeleteButtons.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            elem.closest('.card').remove();
            deleteCard(initialCards[index]._id);
        })
    })
}

function cardOpen(card) {
    openModal(imagePopup);

    image.src = card.link;
    caption.innerHTML = card.name;
}

async function cardFormSubmit(evt) {
    evt.preventDefault();

    cardPopup.querySelector('.popup__button').innerText = 'Сохранение...';

    let cardNameValue = cardName.value;
    let cardLinkValue = cardLink.value;

    postCard(cardNameValue, cardLinkValue)
    .finally(() => {
        cardPopup.querySelector('.popup__button').innerText = 'Сохранить.';
    });

    initialCards = await getInitialCards();

    placesList.prepend(createCard(initialCards[0]));
    
    cardName.value = '';
    cardLink.value = '';

    cardDelete();

    closeModal(cardPopup);
}

async function avatarFormSubmit(evt) {
    evt.preventDefault();

    avatarPopup.querySelector('.popup__button').innerHTML = 'Сохранение...';

    let avatarLinkValue = avatarLink.value;
    let newAvatar = await patchAvatar(avatarLinkValue).finally(() => {
        avatarPopup.querySelector('.popup__button').innerHTML = 'Сохранить';
    });

    avatarEditButton.style.backgroundImage = `url(${newAvatar.avatar})`;

    closeModal(avatarPopup);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

profileName.value = name.innerHTML;
profileDesctiption.value = description.innerHTML;

profileEditButton.addEventListener('click', function () {
    openModal(profilePopup);
});
profileCloseButton.addEventListener('click', function () {
    closeModal(profilePopup);
});



cardFormElement.addEventListener('submit', cardFormSubmit);

cardAddButton.addEventListener('click', function () {
    openModal(cardPopup);
})

cardCloseButton.addEventListener('click', function () {
    closeModal(cardPopup);
})

imagePopupClose.addEventListener('click', function () {
    closeModal(imagePopup);
})


avatarFormElement.addEventListener('submit', avatarFormSubmit);

avatarEditButton.addEventListener('click', function() {
    openModal(avatarPopup);
})

avatarPopupClose.addEventListener('click', function() {
    closeModal(avatarPopup);
})



initialCards.forEach(function (elem) {
    placesList.append(createCard(elem));
})

cardDelete();


profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');
avatarPopup.classList.add('popup_is-animated');

popups.forEach(function (popupElem) {
    popupElem.addEventListener('click', function () {
        closeModal(popupElem);
    })

    popupElem.querySelector('.popup__content').addEventListener('click', function (event) {
        event.stopPropagation();
    })
})

function closeByEsc(evt) {
    if (evt.key === "Escape") {
        const openedPopup = document.querySelector('.popup_is-opened');
        closeModal(openedPopup);
    }
}
