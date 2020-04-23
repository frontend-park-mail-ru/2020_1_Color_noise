import logoImage from '../../images/logo.svg';
import chatsImage from '../../images/chatsIcon.svg';
import notifImage from '../../images/notifIcon.svg';
import profileImage from '../../images/profileIcon.svg';
import './menu.css';
import MenuTemplate from './menu.pug';


import Router from "../../utils/router.js"

export const createMenu = () => {
    const template = MenuTemplate({ logoImage : logoImage,
        chatsImage : chatsImage,  notifImage : notifImage, profileImage : profileImage });

    const menu = document.getElementById('menu');
    menu.innerHTML = template;

    const logoLink  = document.getElementById('logoLink');
    logoLink.addEventListener('click', goMain);

    const chatsLink  = document.getElementById('chatsLink');
    chatsLink.addEventListener('click', goChats);

    const notifLink  = document.getElementById('notifLink');
    notifLink.addEventListener('click', goNotif);

    const profileLink  = document.getElementById('profileLink');
    profileLink.addEventListener('click', goProfile);
};

const goMain = (evt) => {
    evt.preventDefault();
    Router.go("/","Main");
};

const goChats = (evt) => {
    evt.preventDefault();
    Router.go("/chats","Chats");
};

const goNotif = (evt) => {
    evt.preventDefault();
    Router.go("/notifications","Notifications");
};

const goProfile = (evt) => {
    evt.preventDefault();
    Router.go('/profile','Profile');
};





import '../Autorization/authorization.css';
// to utils
export const setError = () => {
    const content = document.getElementById('content');
    content.innerHTML = "";
    const err = document.createElement('h1');
    err.textContent = 'Что-то пошло не так :(';
    content.appendChild(err);
};

export const createAutorization = () => {
    //evt.preventDefault();
    Router.go("/authorizationOrRegistration", "AuthorizationOrRegistration");
};

const createLogin = (evt) => {
    evt.preventDefault();
    Router.go('/login','Login');
};