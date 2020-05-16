import MenuTemplate from './menu.pug';
import MenuLoginTemplate from './menuLogin.pug';
import MenuAlienTemplate from './menuAlien.pug';

import logoImage from '../../images/logo.svg';
import chatsImage from '../../images/chatsIcon.svg';
import notifImage from '../../images/notifIcon.svg';
import profileImage from '../../images/profileIcon.svg';
import plusImage from '../../images/plusIcon.svg';

import { showLoginModal, showRegModal, showChooseModal, showInfoModal } from "../Modal/modal"
import Router from "../../utils/router"
import { Requests } from '../Network/Requests'

import {setSearch} from "./search.js"
import {serverLocate} from "../../utils/constants";

export const createMenu = (login = false) => {

    const searchImgSrc =  serverLocate + "/images/find.svg"

    const template = MenuTemplate({ logoImage : logoImage, image:searchImgSrc });

    const menu = document.getElementById('menu');
    menu.innerHTML = template;

    if (login) {
        addLogin();
    } else {
        addReg();
    }

    const loginPart = document.getElementById('loginPart');
    loginPart.addEventListener('login', addLogin2);
    loginPart.addEventListener('reg', addReg);

    setSearch();
};


// will be deleted
const addLogin2 = () => {
    if (Requests.getUserProfile(false)) {
        addLogin();
    } else {
        showInfoModal('Login auth error');
    }
};

const addLogin = () => {
    const menuLoginTemplate = MenuLoginTemplate({
        chatsImage : chatsImage,  notifImage : notifImage,
        profileImage : profileImage, plusImage : plusImage });

    const loginPart = document.getElementById('loginPart');
    loginPart.innerHTML = menuLoginTemplate;

    const logoLink  = document.getElementById('logoLink');
    logoLink.addEventListener('click', goMain);

    const chatsLink  = document.getElementById('chatsLink');
    chatsLink.addEventListener('click', goChats);

    const notifLink  = document.getElementById('notifLink');
    notifLink.addEventListener('click', goNotif);

    const profileLink  = document.getElementById('profileLink');
    profileLink.addEventListener('click', goProfile);

    const addNewModal  = document.getElementById('addNewModal');
    addNewModal.addEventListener('click', showChooseModal);
};

const addReg = () => {
    const menuAlienTemplate = MenuAlienTemplate();

    const loginPart = document.getElementById('loginPart');
    loginPart.innerHTML = menuAlienTemplate;

    const loginModal  = document.getElementById('loginModal');
    loginModal.addEventListener('click', showLoginModal);

    const regModal  = document.getElementById('regModal');
    regModal.addEventListener('click', showRegModal);
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


