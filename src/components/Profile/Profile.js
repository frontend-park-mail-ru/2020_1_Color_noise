import {default as CurrentUser} from '../../utils/userDataSingl.js';
import ProfileTemplate from "../Profile/profile.pug";
import {serverLocate} from "../../utils/constants";
import { createProfileSettings } from '../ProfileSettings/ProfileSettings.js'
import {FetchModule} from "../Network/Network";
import {setInfo} from "../ProfileSettings/ProfileSettings";
import PinTemplate from "../CreatePin/createPin.pug";
import PinImage from "../../images/pin_default.jpg";
import {createDesk} from "../Desk/Desk";
import './profile.css';
import {changeLocation} from "../../utils/changeLocation";

export function createProfile() {
    changeLocation("/profile", "Profile");
    console.log("AVATAR:", CurrentUser.Data.avatarPath);
    const profile = ProfileTemplate( { image :  serverLocate + '/' + CurrentUser.Data.avatarPath,
        login : CurrentUser.Data.login, email: CurrentUser.Data.email, about: CurrentUser.Data.about,
        changeProfileLinkImage: "settingsLinkPic.png"} );
    const root = document.getElementById('content');
    root.innerHTML = profile;

    const profileLogin = document.getElementById("profileLogin");
    profileLogin.innerText = CurrentUser.Data.login;

    const profileAbout = document.getElementById("profileAbout");
    if (CurrentUser.Data.about !== undefined)
        profileAbout.innerText = CurrentUser.Data.about;


    const changeProfileLink = document.getElementById('changeProfileLink');
    changeProfileLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        createProfileSettings();
    });


    const pin = document.getElementById('submit_pin');
    pin.addEventListener('click', function (evt) {
        evt.preventDefault();
        // вероятно тут еще одна отправка на api/login?
        const pinWindow = PinTemplate({ image : PinImage });
        const root = document.getElementById('content');
        root.innerHTML = pinWindow;
        addPinListeners();
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
                    createDesk();
                } else {
                    setInfo('Что-то пошло не так');
                }
            })
            .catch(function(error) {
                setInfo('Что-то пошло не так');
            });
    });

}



const addPinListeners = () => {
    const edit = document.getElementById('submit_edit');
    edit.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_pin = document.getElementById('new_pin');
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = function () {
            if (input.value !== "") {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        my_pin.src = e.target.result;
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            }
        };
        input.click();
    });


    const create = document.getElementById('submit_pin');
    create.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_pin = document.getElementById('new_pin');
        const name = document.getElementById('pin_name');
        const description = document.getElementById('pin_desc');

        // @todo what hardcode path?
        if (my_pin.src !== serverLocate + '/a4817adc02e2f8d902d0002b6f793b82.jpg' && name.value.length > 0
            && description.value.length > 0) {

            FetchModule.fetchRequest({url:serverLocate + '/api/pin ', method: 'post', body: {
                    name : name.value,
                    description : description.value,
                    board_id: 10, //todo add BOARD ID
                    image : my_pin.src //todo base64
                }})
                .then((res) => {
                    return res.ok ? res : Promise.reject(res);
                })
                .then((response) => {
                        return response.json();
                    },
                )
                .then((result) => {
                    if (result.status === 201) {
                        setInfo('Ваш пин добавлен');
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так');
                });

        } else if (my_pin.src === serverLocate + '/a4817adc02e2f8d902d0002b6f793b82.jpg') {
            setInfo('Загрузите картинку');
        } else if (name.value.length > 0) {
            setInfo('Введите имя пина');
        } else if (description.value.length > 0) {
            setInfo('Введите описание пина');
        }
    });

};
