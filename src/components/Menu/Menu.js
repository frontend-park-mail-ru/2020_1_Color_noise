import logoImage from '../../images/logo.svg';
import MenuTemplate from './menu.pug';
import { createProfile } from '../Profile/Profile.js';
import { setInfo } from '../ProfileSettings/ProfileSettings';
import { validators } from '../Validation/Validation';
import { addChooseListeners } from '../Profile/Profile';

import PlusImage from "../../images/002-plus.svg";
import './menu.css';

import '../Autorization/authorization.css';
import AutorizationTemplate from '../Autorization/choose.pug';
import LoginTemplate from '../Autorization/login.pug';
import RegTemplate from '../Autorization/reg.pug';
import ChatsTemplate from '../Profile/chats.pug';
import NotifTemplate from '../Profile/notifications.pug';

import { changeLocation } from '../../utils/changeLocation.js'
import { FetchModule } from '../Network/Network.js'
import { serverLocate } from '../../utils/constants.js'
import { Requests } from '../Network/Requests.js'

import { getSubPins, getMainPins, setScroll, unSetScroll, clearColumns, createDesk } from '../Desk/Desk.js'
import {default as CurrentDesk} from "../Desk/CurrentDesk";
import ChooseCreate from "../ChooseCreate/choose.pug";

const application = document.getElementById('root');

const buildMenu = () => {
    const menu = MenuTemplate({ plus : PlusImage });
    const root = document.getElementById('menu');
    root.innerHTML = menu;
    const plus_btn = document.getElementById('plus_btn');
    plus_btn.addEventListener('click', function (evt) {
        evt.preventDefault();
        const chooseWindow = ChooseCreate({ image : logoImage });
        const root = document.getElementById('modal');
        root.innerHTML = chooseWindow;
        addChooseListeners();
    });
};

const menuItems = {
    follows: 'Подписки',
    profile: 'Профиль',
    desks: '',
    chats: 'Чаты',
    notif: 'Уведомления'
};

const addElements = () => {
    const root = document.getElementById('elements');

    root.innerHTML = '';
    Object.keys(menuItems).forEach(function (key) {
        const menuItem = document.createElement('a');
        menuItem.textContent = menuItems[key];
        menuItem.href = `/${key}`;
        menuItem.dataset.section = key;
        if (key === 'follows')
            menuItem.id = 'followsOrMainLink';

        root.appendChild(menuItem);
    });
};

export const createMenu = () => {
    buildMenu();
    addElements();
};

const routes = {
    follows: goFollows,
    desks: goDesks,
    notif: goNotif,
    chats: goChats,
    profile: goProfile
};

/**
 *  GoFollows
 *  use GoFollows boolean
 *  Create Main or User follows pins
 *  change menu item innerText after
 * @return {void}
 */
var isSubLink = true;
function goFollows() {

    const followsOrMainLink = document.getElementById('followsOrMainLink');
    const firstColumn = document.getElementById('column1');

    if (isSubLink) {
        if (firstColumn === null)
            createDesk("follows");

        unSetScroll();
        CurrentDesk.State.numberOfPins = 0;
        CurrentDesk.getSomePinsFunc = getMainPins;
        clearColumns();
        getSubPins();
        setScroll(getSubPins);
        isSubLink = false;
        followsOrMainLink.innerText = 'Главная';

    } else {
        if (firstColumn === null)
            createDesk("mainRandom");

        unSetScroll();
        CurrentDesk.State.numberOfPins = 0;
        CurrentDesk.getSomePinsFunc = getSubPins;
        clearColumns();
        getMainPins();
        setScroll(getMainPins);
        isSubLink = true;
        followsOrMainLink.innerText = 'Подписки';
    }
}


function goDesks() {
    //alert("Раздел в разработке");
}

export function goChats() {
    //alert("Раздел в разработке");
    changeLocation("/chats","Chats");
    const chats = ChatsTemplate();
    const content = document.getElementById('content');
    content.innerHTML = chats;
}

export function goNotif() {
    //alert("Раздел в разработке");
    changeLocation("/notif","notif");
    const notif = NotifTemplate();
    const content = document.getElementById('content');
    content.innerHTML = notif;
}

function setError() {
    const content = document.getElementById('content');
    content.innerHTML = "";

    const err = document.createElement('h1');
    err.textContent = 'Что-то пошло не так :(';

    content.appendChild(err);
}

function createAutorization() {
    changeLocation("/autorization","autorization");
    const choose = AutorizationTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = choose;

    const login = document.getElementById('submit_login_choose');
    login.addEventListener('click', function (evt) {
        createLogin();
    });

    const reg = document.getElementById('submit_reg_choose');
    reg.addEventListener('click', function (evt) {
        createReg();
    });
}

export function createLogin() {
    changeLocation('/login','Login');
    const login_modal = LoginTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = login_modal;

    const registrationLink = document.getElementById("registrationLink");
    registrationLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        createReg();
    }
    );

    const login = document.getElementById('submit_login');
    login.addEventListener('click', function (evt) {
        evt.preventDefault();
        const username_form = document.getElementById('flogin').value;
        const password_form = document.getElementById('fpass').value;
        if (validators.username(username_form) && validators.password(password_form)) {

            FetchModule.fetchRequest({url: serverLocate + '/api/auth', method: 'post', body:{
                    login: username_form,
                    password: password_form
                }})
                .then((res) => {
                    return res.ok ? res : Promise.reject(res);
                })
                .then((response) => {
                        return response.json();
                    },
                )
                .then((result) => {
                    if (result.status === 200) {
                        Requests.getUserProfile(null); // get user data after login
                        root.innerHTML = "";
                    } else {
                        throw "bad login or password";
                    }
                })
                .catch(function(error) {
                    setInfo('Пароль или логин не верны'); // @todo switch for error
                });
        } else {
            setInfo('Данные в форме некорректны');
        }
    });
}

export function createReg() {
    const reg_modal = RegTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = reg_modal;

    const loginLink = document.getElementById("loginLink");
    loginLink.addEventListener('click', (evt) => {
            evt.preventDefault();
            createLogin();
        }
    );

    const reg = document.getElementById('submit_reg');
    reg.addEventListener('click', function (evt) {
        evt.preventDefault();
        const email_form = document.getElementById('femail').value;
        const username_form = document.getElementById('flogin').value;
        const password_form = document.getElementById('fpass').value;
        const email_valid = validators.email(email_form);
        const login_valid = validators.username(username_form);
        const password_valid = validators.password(password_form)

        if (email_valid && login_valid && password_valid) {
            FetchModule.fetchRequest({url:serverLocate + '/api/user', method: 'post', body: {
                    login: username_form,
                    email: email_form,
                    password: password_form
                }})
                .then((res) => {
                    return res.ok ? res : Promise.reject(res);
                })
                .then((response) => {
                        return response.json();
                    },
                )
                .then((result) => {
                    if (result.status === 200) {
                        Requests.getUserProfile(null); // get user data after signUp
                        root.innerHTML = "";
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так');
                });

        } else if (!email_valid) {
            setInfo('Введите корректный email');
        }  else if (!login_valid) {
            setInfo('Логин должен быть более,<br>чем из трех символов: a-z, A-Z, 0-9, _');
        }  else if (!password_valid) {
            setInfo('Пароль должен быть из шести символов и более символов');
        }
    });
}




function goProfile() {

    changeLocation('/profile','Profile');

    FetchModule.fetchRequest({url:serverLocate + '/api/user', method: 'get', body:null })
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
                return response.json();
            }
        )
        .then((result) => {
            unSetScroll();
            if (result.status === 200) {
                createProfile();
            }
            else {
                createAutorization();
            }
        })
        .catch(function(error) {
            setError();
        });

}

application.addEventListener('click', function (evt) {
    const { target } = evt;

    if (target instanceof HTMLAnchorElement) {
        evt.preventDefault();
        // add undefined check (need for <a> change login to registration form
        var section = routes[target.dataset.section];
        if (section !== undefined)
            section();
    }
});
