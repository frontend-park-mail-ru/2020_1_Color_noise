import MenuTemplate from './menu.pug';
import MenuLoginTemplate from './menuLogin.pug';
import MenuAlienTemplate from './menuAlien.pug';

import logoImage from '../../images/logo.svg';
import lupaImage from '../../images/find.svg'

import chatsImage from '../../images/menu/chatsIcon.svg';
import notifImage from '../../images/menu/notifIcon.svg';
import profileImage from '../../images/menu/profileIcon.svg';
import plusImage from '../../images/menu/plusIcon.svg';
import searchFilter from  '../../images/menu/searchFilter.svg'
import smartImage from '../../images/smartDeskIcon.svg'

import {showLoginModal, showRegModal, showChooseModal} from "../Modal/modal"
import Router from "../../utils/router"
import CurrentUser from "../../utils/userDataSingl";
import {setSearch} from "./search";

export const createMenu = (login = false) => {
    const template = MenuTemplate({ logoImage : logoImage, lupaImage:lupaImage, searchFilter:searchFilter });

    const menu = document.getElementById('menu');
    menu.innerHTML = template;

    if (login) {
        addLogin();
    } else {
        addReg();
    }

    const loginPart = document.getElementById('loginPart');
    loginPart.addEventListener('login', addLogin);
    loginPart.addEventListener('reg', addReg);

    setSearch();

};




const addLogin = () => {
    const menuLoginTemplate = MenuLoginTemplate({
        chatsImage : chatsImage,  notifImage : notifImage,
        profileImage : profileImage, plusImage : plusImage, userLink : '/user/' + CurrentUser.Data.id,
        smartImage:smartImage});

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

    const smartLink = document.getElementById("smartLink")
    smartLink.addEventListener("click", goSmart)

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
    Router.go('/user/' + CurrentUser.Data.id,'Profile');
};

const goSmart = (evt) => {
    evt.preventDefault();
    Router.go('/smart','Умная лента', null, true);
};