import pinTemplate from "./pin.pug";
import {serverLocate} from "../../utils/constants";

export const createPagePin = (pin) => {
    const template = pinTemplate({
        pinImage : serverLocate + '/' + pin.image
    });

    const content = document.getElementById('content');
    content.innerHTML = template;
};