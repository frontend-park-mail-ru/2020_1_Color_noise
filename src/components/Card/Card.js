import './card.css';
import CardTemplate from './card.pug';
import { createPinPage } from '../Pin/Pin.js'
import { unSetScroll } from '../Desk/Desk.js'

/**
 * addCard
 *  Добавляет картинку в указанную колонку
 *  Вешает действие при клике на картинку - открыть страницу пина
 *  В target информация о конкретном пине
 * @param {map} pin - request url
 * @param {string} idColumn - add img in it
 * @return {void}
 */
export const addCard = (pin, idColumn) => {
    const card = CardTemplate( { image: 'fakeImages/' + pin.src, pinId: pin.id }); // todo delete fakeImages
    const root = document.getElementById(idColumn);

    let div = document.createElement('div');
    div.className = "card";
    div.innerHTML = card.trim();
    root.append(div);

    const addedCard = document.getElementById(pin.id);

    addedCard.addEventListener('click', (evt) => {
        evt.target.name = "fakeNameInCard.js"; // todo delete fake hardcode pin info
        evt.target.about = "fakeAbout 123 123 123 123 hello,home";
        evt.target.image = pin.src;
        createPinPage(evt.target);
        unSetScroll();
    });
};