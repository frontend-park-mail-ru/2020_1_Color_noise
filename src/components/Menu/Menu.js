import logoImage from '../../images/logo.svg';
import MenuTemplate from './menu.pug';
import { createProfile } from '../Profile/Profile';
import { setInfo } from '../Profile/Profile';
import { validators } from '../Validation/Validation';
import { ajax } from '../Network/Network';
import './menu.css';

import '../Autorization/authorization.css';
import AutorizationTemplate from '../Autorization/choose.pug';
import LoginTemplate from '../Autorization/login.pug';
import RegTemplate from '../Autorization/reg.pug';

const application = document.getElementById('root');

const buildMenu = () => {
    const menu = MenuTemplate();
    const root = document.getElementById('menu');
    root.innerHTML = menu;
}

const menuItems = {
    follows: 'Подписки',
    desks: 'Доски',
    logo: '',
    chats: 'Чаты',
    profile: 'Профиль'
};

const addElements = () => {
    const root = document.getElementById('elements');

    root.innerHTML = '';
    Object.keys(menuItems).forEach(function (key) {
        const menuItem = document.createElement('a');
        menuItem.textContent = menuItems[key];
        menuItem.href = `/${key}`;
        menuItem.dataset.section = key;

        root.appendChild(menuItem);
    });
}

export const createMenu = () => {
    buildMenu();
    addElements();
}

const routes = {
    follows: goFollows,
    desks: goDesks,
    logo: null,
    chats: goChats,
    profile: goProfile
};


function goFollows() {
    //alert("Раздел в разработке");
}

function goDesks() {
    //alert("Раздел в разработке");
}

function goChats() {
    //alert("Раздел в разработке");
}

function setError() {
    const content = document.getElementById('content');
    content.innerHTML = "";

    const err = document.createElement('h1');
    err.textContent = 'Что-то пошло не так :(';

    content.appendChild(err);
}

function createAutorization() {
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

function createLogin() {
    const login_modal = LoginTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = login_modal;

    const login = document.getElementById('submit_login');
    login.addEventListener('click', function (evt) {
        evt.preventDefault();
        const username_form = document.getElementById('flogin').value;
        const password_form = document.getElementById('fpass').value;
        if (validators.username(username_form) && validators.password(password_form)) {
            //TODO: promise network-module
            ajax(
                'POST',
                'http://95.163.212.121/login',
                {
                    login: username_form,
                    password: password_form
                },
                function (status, response) {
                    if (status === 200) {
                        const data = JSON.parse(response);
                        if (data.status == 200) {
                            root.innerHTML = "";
                        } else {
                            setInfo('Пароль или логин не верны');
                        }
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                }
            )
        } else {
            setInfo('Данные в форме некорректны');
        }
    });
}

function createReg() {
    const reg_modal = RegTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = reg_modal;

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
            // TODO: promise network-module
            ajax(
                'POST',
                'http://95.163.212.121/signup',
                {
                    login: username_form,
                    email: email_form,
                    password: password_form
                },
                function (status, response) {
                    if (status === 200) {
                        const data = JSON.parse(response);
                        if (data.status == 200) {
                            root.innerHTML = "";
                        } else {
                            setInfo('Что-то пошло не так');
                        }
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                }
            )
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
    // TODO: promise network-module
    ajax(
        'GET',
        'http://95.163.212.121/profile',
        null,
        function (status, response) {
            if (status === 200) {
                const data = JSON.parse(response);
                if (data.status == 200) {
                    createProfile(data.body.user.login, data.body.user.email,
                        data.body.user.about, data.body.user.avatar, data.body.id);
                } else {
                    createAutorization();
                }
            } else {
                setError();
            }
        }
    );
}

application.addEventListener('click', function (evt) {
    const { target } = evt;

    if (target instanceof HTMLAnchorElement) {
        evt.preventDefault();
        routes[target.dataset.section]();
    }
});