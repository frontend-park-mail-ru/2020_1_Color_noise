import showChooseTemplate from './showChoose.pug';
import createDeskTemplate from './createDesk.pug';
import showInfoTemplate from "./showInfo.pug";
import loginTemplate from "./login.pug";
import regTemplate from "./reg.pug";

import logoImage from '../../images/logo.svg';

import { FetchModule } from "../Network/Network";
import { serverLocate } from "../../utils/constants";
import { validators } from '../Validation/Validation';

export const showLoginModal = () => {
    const modal = document.getElementById('modal');
    modal.innerHTML = loginTemplate({ logoImage : logoImage });

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const sendLogin = document.getElementById('sendLogin');
    sendLogin.addEventListener('click', sendLoginFunc);

    const regModal = document.getElementById('textRegModal');
    regModal.addEventListener('click', showRegModal);
};

export const showRegModal = () => {
    const modal = document.getElementById('modal');
    modal.innerHTML = regTemplate({ logoImage : logoImage });

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const sendReg = document.getElementById('sendReg');
    sendReg.addEventListener('click', sendRegFunc);

    const loginModal = document.getElementById('textLoginModal');
    loginModal.addEventListener('click', showLoginModal);
};

export const showChooseModal = () => {
    const modal = document.getElementById('modal');
    modal.innerHTML = showChooseTemplate({ logoImage : logoImage });

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const pinLink = document.getElementById('pinLink');
    pinLink.addEventListener('click', goPin);

    const newDeskModal = document.getElementById('newDeskModal');
    newDeskModal.addEventListener('click', deskCreateModal);
};

import { createPinTmp} from "../Profile/Profile";

const goPin = (evt) => {
    evt.preventDefault();
    createPinTmp();
};

const deskCreateModal = (evt) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = createDeskTemplate({ logoImage : logoImage });

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const sendDesk = document.getElementById('sendDesk');
    sendDesk.addEventListener('click', sendDeskFunc);
};

const sendLoginFunc = (evt) => {
    const login = document.getElementById('loginUser').value;
    const pass = document.getElementById('passUser').value;

    const login_valid = validators.username(login);
    const pass_valid = validators.password(pass);

    if (!login_valid || !pass_valid) {
        setInfoTitle('Некорректный логин или пароль');
        return;
    }

    FetchModule.fetchRequest(
        {
            url: serverLocate + '/api/auth',
            method: 'post',
            body:
                {
                    login : login,
                    password : pass
                }
        }
    ).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            createInfoModal('С возвращением!');
            const loginPart = document.getElementById('loginPart');
            loginPart.dispatchEvent(new Event('login'));
        } else {
            setInfoTitle('Неверный логин или пароль');
        }
    }).catch(function(error) {
            setInfoTitle('Ошибка отправки, попробуйте еще раз');
    });
};

const sendRegFunc = (evt) => {
    const email = document.getElementById('emailUser').value;
    const login = document.getElementById('loginUser').value;
    const pass = document.getElementById('passUser').value;

    const email_valid = validators.email(email);
    const login_valid = validators.username(login);
    const pass_valid = validators.password(pass);

    if (!email_valid) {
        setInfoTitle('Введите корректный email');
        return;
    } else if (!login_valid) {
        setInfoTitle('Логин должен состоять из более,<br>чем из трех символов: a-z, A-Z, 0-9, _');
        return;
    } else if (!pass_valid) {
        setInfoTitle('Пароль должен состоять из шести символов или более символов');
        return;
    }

    FetchModule.fetchRequest(
        {
            url: serverLocate + '/api/user',
            method: 'post',
            body:
                {
                    email: email,
                    login : login,
                    password : pass,
                }
        }
    ).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 201) {
            createInfoModal('Регистрация завершена!<br>Добро пожаловать!');
            const loginPart = document.getElementById('loginPart');
            loginPart.dispatchEvent(new Event('login'));
        } else if (result.status === 401 && result.body.error === "login") {
            setInfoTitle('Пользователь с таким логином уже есть');
        }  else if (result.status === 401 && result.body.error === "email") {
            setInfoTitle('Пользователь с такой почтой уже есть');
        } else {
            setInfoTitle('Ошибка регистрации');
        }
    }).catch(function(error) {
            setInfoTitle('Ошибка отправки, попробуйте еще раз');
    });
};

const sendDeskFunc = (evt) => {
    const name = document.getElementById('deskName').value;
    const description = document.getElementById('deskDesc').value;

    if (name.length <= 6) {
        setInfoTitle("Название доски должно содержать более 6 символов");
        return;
    }

    FetchModule.fetchRequest(
        {
            url: serverLocate + '/api/board',
            method: 'post',
            body:
                {
                    name : name,
                    description : description
                }
        }
        ).then((res) => {
            return res.ok ? res : Promise.reject(res);
        }).then((response) => {
                return response.json();
        }).then((result) => {
            if (result.status === 201) {
                createInfoModal('Новая доска создана');
                // if (profile_b === true) {
                //     createDesks(CurrentUser.Data.id);
                // }
            } else {
                setInfoTitle('Ошибка обработки, попробуйте еще раз');
            }
        }).catch(function(error) {
            setInfoTitle('Ошибка отправки, попробуйте еще раз');
        });
};

const hideModal = (evt) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = "";
};

export const createInfoModal = (info) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = showInfoTemplate({ logoImage : logoImage, infoMessage : info });

    const closeInfo  = document.getElementById('closeInfo');
    closeInfo.addEventListener('click', hideModal);

    const backModal  = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);
};

export const setInfoTitle = (info) => {
    const infoMessage = document.getElementById('infoMessage');
    infoMessage.innerHTML = info;
};

