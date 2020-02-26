import ProfileTemplate from './profile.pug';
import { validators } from '../Validation/Validation';
import PinTemplate from '../CreatePin/createPin.pug';
import PinImage from '../../images/pin_default.jpg';

import './profile.css';

export const createProfile = (login, email, about, image, id) => {
    const profile = ProfileTemplate( { image : image, login : login, email: email, about: about } );
    const root = document.getElementById('content');
    root.innerHTML = profile;

    const edit = document.getElementById('submit_edit');
    edit.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_avatar = document.getElementById('avatar');
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = function () {
            if (input.value != "") {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        my_avatar.src = e.target.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
        input.click();
    });

    const pin = document.getElementById('submit_pin');

    pin.addEventListener('click', function (evt) {
        evt.preventDefault();
        // вероятно тут еще одна отправка на api/login?
        const pinWindow = PinTemplate({ image : PinImage });
        const root = document.getElementById('content');
        root.innerHTML = pinWindow;

        addPinListeners();

    

    });

    const save = document.getElementById('submit_save');

    save.addEventListener('click', function (evt) {
        evt.preventDefault();
        const email_form = document.getElementById('femail').value;
        const username_form = document.getElementById('flogin').value;
        const password_form = document.getElementById('fpass').value;
        if (validators.email(email_form) && validators.username(username_form) && validators.password(password_form)) {
            // TODO: promise network-module
            setInfo('Данные профиля обновлены');
        } else {
            setInfo('Данные в форме некорректны');
        }
    });
}

const addPinListeners = () => {
    const edit = document.getElementById('submit_edit');
        edit.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_pin = document.getElementById('new_pin');
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = function () {
            if (input.value != "") {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        my_pin.src = e.target.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
        input.click();
    });

    const create = document.getElementById('submit_pin');
        create.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_pin = document.getElementById('new_pin');
        const name = document.getElementById('pin_name');
        const description = document.getElementById('pin_desc');
        if (my_pin.src != "a4817adc02e2f8d902d0002b6f793b82.jpg" && name.value.length > 0  && description.value.length > 0) {
            alert("Ураааа! Сейчас будем добавлять Ваш пин!");
        } else {
            setInfo('Данные в форме некорректны');
        }
    });
}

export function setInfo(text) {
    const content = document.getElementById('banner');
    content.innerHTML = "";

    const err = document.createElement('h4');
    err.textContent = text;

    content.appendChild(err);
}