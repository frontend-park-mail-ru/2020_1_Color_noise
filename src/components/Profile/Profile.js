import {default as CurrentUser} from '../../utils/userDataSingl.js';
import ProfileTemplate from "../Profile/profile.pug";
import UserTemplate from "../Profile/user.pug";
import DeskTemplate from "../Profile/desk.pug";
import {serverLocate} from "../../utils/constants";
import { createProfileSettings } from '../ProfileSettings/ProfileSettings.js'
import FetchModule from "../Network/Network";
import PinTemplate from "../CreatePin/createPin.pug";
import PinImage from "../../images/pinDefault.jpg";
import logoImage from '../../images/logo.svg';
import SettingsImage from "../../images/001-pencil.svg";
import PlusImage from "../../images/002-plus.svg";
import LogoutImage from "../../images/003-logout.svg";

import { default as Router} from "../../utils/router.js"
import {setInfoContent, showChooseModal} from "../Modal/modal";

function openPins(id) { // add value name

    //alert("1 openPins user id:", id.toString());
    const state = {};
    state.userId = id;

    state.username = "Alex"; // replace ALEX to name value

    Router.go("/userPins/" + id.toString(), "userPins", state);
}

function openDesk(id_user, id_desk) {
    //alert("openDesk desk id:", id_desk);
    const state = {};
    state.deskId = id_desk;
    Router.go("/board/" + id_desk.toString(), "Board", state);
}


function createDesks(id) {
    const desks = document.getElementById("desks");
    desks.innerHTML = "";
    FetchModule.fetchRequest({url:serverLocate + '/api/board/user/' + id,
        method: 'get'})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
                return response.json();
            },
        )
        .then((result) => {
            if (result.status === 200) {
                result.body.forEach((item) => {
                    if (item.last_pin.image === undefined) {
                        item.last_pin.image = "images/logoRound.svg";
                    }
                    let desk = DeskTemplate({ img: serverLocate + "/" + item.last_pin.image, text : item.description, id : item.id });

                    let div = document.createElement('div');

                    div.innerHTML = desk;
                    let back = div.getElementsByClassName("item_back")[0];
                    back.setAttribute("id_desk", item.id);
                    back.setAttribute("id", id);
                    div.setAttribute("class", "desk2");
                    div.addEventListener('click', function (evt) {
                         openDesk(evt.target.getAttribute("id"), evt.target.getAttribute("id_desk"));
                    });
                    desks.append(div);
                });
            } else {
                setInfoContent('Что-то пошло не так с обработкой запроса');
            }
        })
        .catch(function(error) {
            setInfoContent('Что-то пошло не так с отправкой запроса');
        });
}




export function createProfile(user_id = CurrentUser.Data.id, User = null) {
    if (user_id === CurrentUser.Data.id) {
        const profile = ProfileTemplate( { image :  serverLocate + '/' + CurrentUser.Data.avatarPath,
            login : CurrentUser.Data.login, email: CurrentUser.Data.email, about: CurrentUser.Data.about,
            changeProfileLinkImage: "settingsLinkPic.png", settings: SettingsImage, plus: PlusImage,
            logout: LogoutImage } );
        const root = document.getElementById('content');
        root.innerHTML = profile;

        const profileLogin = document.getElementById("profileLogin");
        profileLogin.innerText = CurrentUser.Data.login;

        const profileAbout = document.getElementById("profileAbout");
        if (CurrentUser.Data.about !== undefined) {
            profileAbout.innerText = CurrentUser.Data.about;
        }

        const changeProfileLink = document.getElementById('change_profile_link');
        changeProfileLink.addEventListener('click', (evt) => {
            evt.preventDefault();
            createProfileSettings();
        });

        const pin = document.getElementById('submit_pin');
        pin.addEventListener('click', function (evt) {
            evt.preventDefault();
            showChooseModal();
        });

        const exit = document.getElementById('submit_exit');
        exit.addEventListener('click', function (evt) {
            evt.preventDefault();

            FetchModule.fetchRequest({url:serverLocate + '/api/auth', method: 'delete', body: null})
                .then((res) => {
                    return res.ok ? res : Promise.reject(res);
                })
                .then((response) => {
                        return response.json();
                    },
                )
                .then((result) => {
                    if (result.status === 200) {

                        CurrentUser.Data.login = "null"; // must mark !!!
                        Router.go("/main","Main");

                    } else {
                        setInfoContent('Что-то пошло не так с обработкой запроса');
                    }
                })
                .catch(function(error) {
                    setInfoContent('Что-то пошло не так с отправкой запроса');
                });
        });

        const pins = document.getElementById('my_pins');
        pins.addEventListener('click', function (evt) {
            evt.preventDefault();
            openPins(user_id);
        });
        createDesks(user_id);
        // const desks = document.getElementById('my_desks');
        // desks.addEventListener('click', function (evt) {
        //     createDesks(user_id);
        // });
    } else {
        const profile = UserTemplate( { image :  serverLocate + '/' + User.avatarPath,
            login : User.login } );
        const root = document.getElementById('content');
        root.innerHTML = profile;
        const profileLogin = document.getElementById("profileLogin");
        profileLogin.innerText = User.login;
        const btn_follow = document.getElementById( "follow_btn");
        btn_follow.addEventListener('click', function (evt) {
            evt.preventDefault();
            FetchModule.fetchRequest({url:serverLocate + '/api/user/following/' + user_id, method: 'post'})
                .then((res) => {
                    return res.ok ? res : Promise.reject(res);
                })
                .then((response) => {
                        return response.json();
                    },
                )
                .then((result) => {
                    if (result.status === 201) {
                        createInfo('Вы подписаны');
                    } else {
                        setInfoContent('Что-то пошло не так с обработкой запроса');
                    }
                })
                .catch(function(error) {
                    setInfoContent('Что-то пошло не так с отправкой запроса');
                });
        });

        const sendMessage = document.getElementById("message_btn")
        sendMessage.addEventListener("click", (evt)=>{
            Router.go("/chats", "Chat", User)
        })

        const pins = document.getElementById('my_pins');
        pins.addEventListener('click', function (evt) {
            evt.preventDefault();
            openPins(user_id);
        });
        createDesks(user_id);
    }
    //console.log("AVATAR:", CurrentUser.Data.avatarPath);

}
