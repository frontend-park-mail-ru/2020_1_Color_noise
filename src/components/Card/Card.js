import './card.css';
import CardTemplate from './card.pug';
import { createPinPage } from '../Pin/Pin.js'
import { unSetScroll } from '../Desk/Desk.js'
import {serverLocate} from "../../utils/constants";

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
    const card = CardTemplate( { image: pin.image, pinId: pin.id });
    const root = document.getElementById(idColumn);

    let div = document.createElement('div');
    div.className = "card";
    div.innerHTML = card.trim();
    root.append(div);

    const addedCard = document.getElementById(pin.id);

    addedCard.addEventListener('click', (evt) => {
        evt.target.name = pin.name;
        evt.target.about = pin.description;
        evt.target.user_id = pin.user_id;
        evt.target.board_id = pin.board_id;
        evt.target.src = pin.image;

        createPinPage(evt.target);
        unSetScroll();
    });
};