import CardTemplate from './card.pug';
import {unSetScroll} from '../Desk/Desk.js'
import {serverLocate} from "../../utils/constants.js";
import {default as Router} from "../../utils/router.js"
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

    const card = CardTemplate( { image: serverLocate + "/" + pin.image, pinId: pin.id });

    const root = document.getElementById(idColumn);

    let div = document.createElement('div');
    div.className = "card";
    div.innerHTML = card.trim();
    root.append(div);

    const addedCard = document.getElementById(pin.id);

    const pinClickFunc = (evt) => {

        console.log("GO TO PIN:", pin.id.toString())

        const data = [];
        data.id = pin.id;
        data.name = pin.name;
        data.about = pin.description;

        data.user_id = pin.user_id;
        data.board_id = pin.board_id;
        data.src =  pin.image;
        data.user_id = pin.user_id;

        //console.log("клик на пин (ниже тут unSetScroll())")
        unSetScroll();
        //console.log("го роут")
        Router.go("/pin/" + pin.id.toString(), pin.name, null, true);
        // createPinPage(data);

    };

    addedCard.removeEventListener('click', pinClickFunc);

    addedCard.addEventListener('click', pinClickFunc);
};