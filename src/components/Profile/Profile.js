import {default as CurrentUser} from '../../utils/userDataSingl.js';
import ProfileTemplate from "../Profile/profile.pug";
import UserTemplate from "../Profile/user.pug";
import {serverLocate} from "../../utils/constants";
import { createProfileSettings } from '../ProfileSettings/ProfileSettings.js'
import {FetchModule} from "../Network/Network";
import {setInfo} from "../ProfileSettings/ProfileSettings";
import ChooseCreate from "../ChooseCreate/choose.pug";
import PinTemplate from "../CreatePin/createPin.pug";
import InfoTemplate from "../CreatePin/info.pug";
import CreateDeskTemplate from "../CreatePin/createDesk.pug";
import PinImage from "../../images/pin_default.jpg";
import logoImage from '../../images/logo.svg';
import SettingsImage from "../../images/001-pencil.svg";
import PlusImage from "../../images/002-plus.svg";
import LogoutImage from "../../images/003-logout.svg";
import {createDesk} from "../Desk/Desk";
import './profile.css';
import {changeLocation} from "../../utils/changeLocation";

export function createProfile(user_id = CurrentUser.Data.id, User = null) {
    console.log("changeLocation('/profile','Profile');");
    changeLocation("/profile", "Profile");
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
            const chooseWindow = ChooseCreate({ image : logoImage });
            const root = document.getElementById('modal');
            root.innerHTML = chooseWindow;
            addChooseListeners();
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
                        setInfo('Что-то пошло не так с обработкой запроса');
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так с отправкой запроса');
                });
        });

        const pins = document.getElementById('my_pins');
        pins.addEventListener('click', function (evt) {
            evt.preventDefault();

        });

        const desks = document.getElementById('my_desks');
        desks.addEventListener('click', function (evt) {
            evt.preventDefault();
            FetchModule.fetchRequest({url:serverLocate + '/api/board/user/' + CurrentUser.Data.id,
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
                        //alert(result.body);
                        //createInfo('Новая доска создана');
                    } else {
                        setInfo('Что-то пошло не так с обработкой запроса');
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так с отправкой запроса');
                });
        });
    } else {
        const profile = UserTemplate( { image :  serverLocate + '/' + User.avatarPath,
            login : User.login } );
        const root = document.getElementById('content');
        root.innerHTML = profile;
        const profileLogin = document.getElementById("profileLogin");
        profileLogin.innerText = User.login;
    }
    //console.log("AVATAR:", CurrentUser.Data.avatarPath);

}

export const addChooseListeners = () => {
    const pin = document.getElementById('submit_pin_choose');
    pin.addEventListener('click', function (evt) {
        evt.preventDefault();
        const modal = document.getElementById('modal');
        modal.innerHTML = "";
        const pinWindow = PinTemplate({ image : PinImage });
        const root = document.getElementById('content');
        root.innerHTML = pinWindow;
        addPinListeners();
    });

    const desk = document.getElementById('submit_desk_choose');
    desk.addEventListener('click', function (evt) {
        evt.preventDefault();
        const modal = document.getElementById('modal');
        const deskWindow = CreateDeskTemplate({ image : logoImage });
        modal.innerHTML = deskWindow;
        addDeskListeners();
    });
}

const addDeskListeners = () => {
    const create = document.getElementById('submit_desk_create');
    create.addEventListener('click', function (evt) {
        evt.preventDefault();
        const name = document.getElementById('deskname');
        const description = document.getElementById('deskdesc');

        FetchModule.fetchRequest({url:serverLocate + '/api/board', method: 'post', body: {
                name : name.value,
                description : description.value
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
                    createInfo('Новая доска создана');
                } else {
                    setInfo('Что-то пошло не так с обработкой запроса');
                }
            })
            .catch(function(error) {
                setInfo('Что-то пошло не так с отправкой запроса');
            });

        const modal = document.getElementById('modal');
        modal.innerHTML = "";
    });
};

const addInfoListeners = () => {
    const ok = document.getElementById('submit_ok');
    ok.addEventListener('click', function (evt) {
        evt.preventDefault();
        const root = document.getElementById('modal');
        root.innerHTML = "";
    });
};

const createInfo = (text) => {
    const root = document.getElementById('modal');
    root.innerHTML = InfoTemplate({title: text, image: logoImage});
    addInfoListeners();
};

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

            FetchModule.fetchRequest({url:serverLocate + '/api/pin', method: 'post', body: {
                    name : name.value,
                    description : description.value,
                    board_id: 14, //todo add BOARD ID
                    image : my_pin.src
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
                        createProfile();
                        createInfo('Ваш пин добавлен');
                    } else {
                        setInfo('Что-то пошло не так с обработкой запроса');
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так с отправкой запроса');
                });

        } else if (my_pin.src === serverLocate + '/a4817adc02e2f8d902d0002b6f793b82.jpg') {
            setInfo('Загрузите картинку');
        } else if (name.value.length == 0) {
            setInfo('Введите имя пина');
        } else if (description.value.length == 0) {
            setInfo('Введите описание пина');
        }
    });
};
