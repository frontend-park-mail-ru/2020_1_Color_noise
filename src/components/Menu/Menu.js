import logoImage from '../../images/logo.svg';
import MenuTemplate from './menu.pug';
import { createProfile } from '../Profile/Profile';
import { setInfo } from '../Profile/Profile';
import { validators } from '../Validation/Validation';
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
    alert("Раздел в разработке");
}

function goDesks() {
    alert("Раздел в разработке");
}

function goChats() {
    alert("Раздел в разработке");
}

function ajax(method, url, body = null, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.withCredentials = true;

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState !== 4) return;

		callback(xhr.status, xhr.responseText);
	});

	if (body) {
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
		xhr.send(JSON.stringify(body));
		return;
	}

	xhr.send();
}

function setError() {
    const content = document.getElementById('content');
    content.innerHTML = "";

    const err = document.createElement('h1');
    err.textContent = 'Что-то пошло не так :(';

    content.appendChild(err);
}

function createAutorization() {
    const choose = AutorizationTemplate( { image: logoImage });
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
    const login_modal = LoginTemplate( { image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = login_modal;

    const login = document.getElementById('submit_login');
    login.addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: promise network-module
        const username_form = document.getElementById('flogin').value;
        const password_form = document.getElementById('fpass').value;
        if (validators.username(username_form) && validators.password(password_form)) {
            // TODO: promise network-module
            setInfo('ТУТ ОТПРАВКА ДАННЫХ! Пароль или логин не верны');
        } else {
            setInfo('Данные в форме некорректны');
        }
    });
}

function createReg() {
    const reg_modal = RegTemplate( { image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = reg_modal;

    const reg = document.getElementById('submit_reg');
    reg.addEventListener('click', function (evt) {
        evt.preventDefault();
        const email_form = document.getElementById('femail').value;
        const username_form = document.getElementById('flogin').value;
        const password_form = document.getElementById('fpass').value;
        if (validators.email(email_form) && validators.username(username_form) && validators.password(password_form)) {
            // TODO: promise network-module
            alert("Одну минуту, ща мы тебя зарегаем!");
        } else {
            setInfo('Данные в форме некорректны');
        }
    });
}

function goProfile() {
    // TODO: promise network-module
    ajax(
        'POST',
        '/api/login/',
        null,
        function (status, response) {
            if (status === 200) {
                const data = JSON.parse(response);
                if (data.status == 200) {
                    ajax(
                        'POST',
                        '/api/profile/',
                        null,
                        function (status, response) {
                            if (status === 200) {
                                const data = JSON.parse(response);
                                if (data.status == 200) {
                                    createProfile(data.body.login, data.body.email, data.body.about, data.body.image, data.body.id);
                                }
                            } else {
                                setError();
                            }
                        }
                    )
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
	const {target} = evt;

	if (target instanceof HTMLAnchorElement) {
		evt.preventDefault();
		routes[target.dataset.section]();
	}
});