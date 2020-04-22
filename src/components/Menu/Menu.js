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


import { FetchModule } from '../Network/Network.js'
import { serverLocate } from '../../utils/constants.js'
import { Requests } from '../Network/Requests.js'

import { getSubPins, getMainPins, setScroll, unSetScroll, clearColumns } from '../Desk/Desk.js'
import {default as CurrentDesk} from "../Desk/CurrentDesk";
import ChooseCreate from "../ChooseCreate/choose.pug";
import { default as Router} from "../../utils/router.js"

const application = document.getElementById('root');

const buildMenu = () => {
    const menu = MenuTemplate({ plus : serverLocate +"/"+PlusImage });
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
let isSubLink = true;
function goFollows() {

    //const firstColumn = document.getElementById('column1');
    if ((document.title) === ("Subscriptions"))
        isSubLink =false;

    if (isSubLink) {
        Router.go("/subscriptions", "subscriptions");
        isSubLink = false;

    } else {
        Router.go("/main", "Main");
        isSubLink = true;
    }
}


function goDesks() {
    //alert("Раздел в разработке"); // ADD Router.go( url, title) надо добавить View в папку Vied и в роутерт this.routs
}

export function goChats() {

    Router.go("/chats","Chats");

}

export function createNotif(notifiArr) {
    const nitifSection =  document.getElementById("nitifSection");

    for (let i = 0; i < notifiArr.length; i++) {

        const oneNifitic = document.createElement('div');
        oneNifitic.innerText = notifiArr[i].message;
        oneNifitic.className = "one_nitif";
        nitifSection.append(oneNifitic);
    }
}


export function goNotif() {

    Router.go("/notifications","Notifications");

}

export function setError() {
    const content = document.getElementById('content');
    content.innerHTML = "";
    const err = document.createElement('h1');
    err.textContent = 'Что-то пошло не так :(';
    content.appendChild(err);
}

export function createAutorization() {

    Router.go("/authorizationOrRegistration", "AuthorizationOrRegistration");

}

export function createLogin() {
    Router.go('/login','Login');
}

/* move to view/createRegistration.js

export function createReg() {
    const reg_modal = RegTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = reg_modal;

    const loginLink = document.getElementById("loginLink");
    loginLink.addEventListener('click', (evt) => {
            evt.preventDefault();
        Router.go('/login','Login');
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
                        Requests.getUserProfile(); // get user data after signUp

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
*/



function goProfile() {

    Router.go('/profile','Profile');

}

application.addEventListener('click', function (evt) {
    const { target } = evt;

    if (target instanceof HTMLAnchorElement) {
        evt.preventDefault();
        // add undefined check (need for <a> change login to registration form
        let section = routes[target.dataset.section];
        if (section !== undefined)
            section();
    }
});
