import createPinTemplate from './createPin.css.pug';

import pinDefaultImage from '../../images/pinDefault.jpg';

import { createInfoModal } from "../Modal/modal"
import Router from "../../utils/router"
import { Requests } from '../Network/Requests'

export const createNewPin = () => {
    const template = createPinTemplate({ pinDefaultImage : pinDefaultImage });

    // const sendNewPin = document.getElementById('sendNewPin');
    // sendNewPin.addEventListener('click', sendNewPinFunc);
    // const sendNewPin = document.getElementById('sendNewPin');
    // sendNewPin.addEventListener('click', sendNewPinFunc);
};
