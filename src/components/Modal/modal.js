import showChooseTemplate from './showChoose.pug';
import createDeskTemplate from './createDesk.pug';
import showInfoTemplate from "./showInfo.pug";
import loginTemplate from "./login.pug";
import regTemplate from "./reg.pug";
import followTemplate from './follow.pug';
import followItemTemplate from './followItem.pug';

import logoImage from '../../images/logo.svg';

import FetchModule from "../Network/Network";
import {serverLocate} from "../../utils/constants";
import {validators} from '../../utils/validation';
import Router from "../../utils/router";
import {setDataUser} from "../Network/Requests"

export const showLoginModal = () => {
    const modal = document.getElementById('modal');
    modal.innerHTML = loginTemplate({logoImage: logoImage});

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const sendLogin = document.getElementById('sendLogin');
    sendLogin.addEventListener('click', sendLoginFunc);

    const regModal = document.getElementById('textRegModal');
    regModal.addEventListener('click', showRegModal);

    const loginUser = document.getElementById('loginUser');
    loginUser.addEventListener('keypress', sendLoginFuncKey);

    const passUser = document.getElementById('passUser');
    passUser.addEventListener('keypress', sendLoginFuncKey);
};

const sendLoginFuncKey = (evt) => {
    if (evt.key === 'Enter') {
        sendLoginFunc();
    }
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

    const passUser = document.getElementById('passUser');
    passUser.addEventListener('keypress', sendRegFuncKey);
};

const sendRegFuncKey = (evt) => {
    if (evt.key === 'Enter') {
        sendRegFunc();
    }
};

export const showChooseModal = () => {
    const modal = document.getElementById('modal');
    modal.innerHTML = showChooseTemplate({ logoImage : logoImage });

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const pinLink = document.getElementById('pinLink');
    pinLink.addEventListener('click', goNewPin);

    const newDeskModal = document.getElementById('newDeskModal');
    newDeskModal.addEventListener('click', deskCreateModal);
};

const goNewPin = (evt) => {
    evt.preventDefault();
    hideModal();
    Router.go("/newpin","New Pin");
};

const deskCreateModal = (evt) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = createDeskTemplate({ logoImage : logoImage });

    const backModal = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);

    const sendDesk = document.getElementById('sendDesk');
    sendDesk.addEventListener('click', sendDeskFunc);
};

export const showFollowersModal = (evt) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = followTemplate({ logoImage : logoImage });

    const userID = evt.currentTarget.getAttribute('user_id');
    FetchModule.fetchRequest({
        url:serverLocate + '/api/user/subscribers/' + userID + '?start=0&limit=9999',
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            setFollow(result.body);
        } else {
            hideModal();
            setInfoPage('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        hideModal();
        setInfoPage('Ошибка отправки запроса');
    });

    const backModal  = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);
};

export const showFollowingModal = (evt) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = followTemplate({ logoImage : logoImage });

    const userID = evt.currentTarget.getAttribute('user_id');
    FetchModule.fetchRequest({
        url:serverLocate + '/api/user/subscriptions/' + userID + '?start=0&limit=9999',
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            setFollow(result.body);
        } else {
            hideModal();
            setInfoPage('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        hideModal();
        setInfoPage('Ошибка отправки запроса');
    });

    const backModal  = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);
};

const setFollow = (follows) => {
    const followBlock = document.getElementById('followBlockModal');
    followBlock.innerHTML = '';
    follows.forEach((item) => {
        const template = followItemTemplate({ followLogin : item.login,
            followLink : "/user/" + item.id, followAttrId : 'follow_' + item.id,
            avatarImage : serverLocate + '/' + item.avatar });
        followBlock.insertAdjacentHTML('beforeend', template);

        const follow = document.getElementById('follow_' + item.id);
        follow.addEventListener('click', goUser);
    });
};

const goUser = (evt) => {
    evt.preventDefault();
    const userID = evt.currentTarget.getAttribute('id').split('_', 2)[1];
    hideModal();
    Router.go("/user/" + userID,"User");
};

const sendLoginFunc = (evt) => {
    const login = document.getElementById('loginUser').value;
    const pass = document.getElementById('passUser').value;

    const login_valid = validators.username(login);
    const pass_valid = validators.password(pass);

    if (!login_valid || !pass_valid) {
        setInfoModal('Некорректный логин или пароль');
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
            setDataUser(result.body);
            showInfoModal('С возвращением!');
            const loginPart = document.getElementById('loginPart');
            loginPart.dispatchEvent(new Event('login'));
        } else {
            setInfoModal('Неверный логин или пароль');
        }
    }).catch(function(error) {
            setInfoModal('Ошибка отправки, попробуйте еще раз');
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
        setInfoModal('Введите корректный email');
        return;
    } else if (!login_valid) {
        setInfoModal('Логин должен состоять из трех и более символов,<br>' +
            'и содержать только латинские буквы, цифры и подчеркивание');
        return;
    } else if (!pass_valid) {
        setInfoModal('Пароль должен состоять из шести или более символов');
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
            setDataUser(result.body);
            showInfoModal('Регистрация завершена!<br>Добро пожаловать!');
            const loginPart = document.getElementById('loginPart');
            loginPart.dispatchEvent(new Event('login'));
        } else if (result.status === 401 && result.body.error === "login") {
            setInfoModal('Пользователь с таким логином уже есть');
        }  else if (result.status === 401 && result.body.error === "email") {
            setInfoModal('Пользователь с такой почтой уже есть');
        } else {
            setInfoModal('Ошибка регистрации');
        }
    }).catch(function(error) {
            setInfoModal('Ошибка отправки, попробуйте еще раз');
    });
};

const sendDeskFunc = (evt) => {
    const name = document.getElementById('deskName').value;
    const description = document.getElementById('deskDesc').value;

    if (name.length === 0) {
        setInfoModal("Название доски не может быть пустым");
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

                showInfoModal('Новая доска создана');

                const deskBlock = document.getElementById('deskBlock');
                if (deskBlock && deskBlock.hasAttribute('mine')) {
                    deskBlock.dispatchEvent(new CustomEvent("newDesk",
                        { detail:
                                { 'nameDesk': name, 'idDesk': result.body.id }
                        }));
                }
            } else {
                setInfoModal('Ошибка обработки, попробуйте еще раз');
            }
        }).catch(function(error) {
            setInfoModal('Ошибка отправки, попробуйте еще раз');
        });
};

const hideModal = (evt) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = "";
};

export const showShareModal = (evt) => {
    const pinID = evt.currentTarget.getAttribute('pin_id');
    alert(pinID);
};

export const showInfoModal = (info) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = showInfoTemplate({ logoImage : logoImage, infoModalMessage : info });

    const closeInfo  = document.getElementById('closeInfo');
    closeInfo.addEventListener('click', hideModal);

    const backModal  = document.getElementById('backModal');
    backModal.addEventListener('click', hideModal);
};

export const setInfoModal = (info) => {
    const infoMessage = document.createElement('div');
    infoMessage.className = 'mini_title';
    infoMessage.innerHTML = info;

    const infoMessageBlock = document.getElementById('infoModalMessage');
    infoMessageBlock.innerHTML = "";
    infoMessageBlock.appendChild(infoMessage);
};

export const setInfoContent = (text = 'Что-то пошло не так :(') => {
    const content = document.getElementById('content');
    content.innerHTML = "";
    const err = document.createElement('h2');
    err.textContent = text;
    content.appendChild(err);
};

export const setInfoPage = (info) => {
    const infoMessage = document.createElement('div');
    infoMessage.className = 'mini_title';
    infoMessage.innerHTML = info;

    const infoMessageBlock = document.getElementById('infoPageMessage');
    infoMessageBlock.innerHTML = "";
    infoMessageBlock.appendChild(infoMessage);
};