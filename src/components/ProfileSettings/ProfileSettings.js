import ProfileTemplate from './profileSetting.pug';
import { validators } from '../Validation/Validation';
import './profileSettings.css';
import { FetchModule } from  '../Network/Network.js'
import { serverLocate } from '../../utils/constants.js'
import {default as CurrentUser} from '../../utils/userDataSingl.js';
import { createProfile } from '../Profile/Profile.js'
import {changeLocation} from "../../utils/changeLocation";


export const createProfileSettings = () => {
    changeLocation("/profileSettings", "Profile Settings");
    const profile = ProfileTemplate( { image :  serverLocate + '/' + CurrentUser.Data.avatarPath,
        login : CurrentUser.Data.login, email: CurrentUser.Data.email, about: CurrentUser.Data.about } );
    const root = document.getElementById('content');
    root.innerHTML = profile;

    const edit = document.getElementById('submit_edit');
    edit.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_avatar = document.getElementById('avatar');
        const input = document.createElement('input');
        input.name = 'file';
        input.type = 'file';
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = function () {
            if (input.value !== "") {
                if (input.files && input.files[0]) {
                    const formData = new FormData();
                    formData.append("image", input.files[0]);
                    //alert(formData.get(file));
                    //alert(input.files[0]);

                    FetchModule.fetchRequestSendImage({url:serverLocate + '/api/user/settings/avatar', method: 'put',
                        body: formData})
                        .then((res) => {
                            return res.ok ? res : Promise.reject(res);
                        })
                        .then((response) => {
                                return response.json();
                            },
                        )
                        .then((result) => {
                            if (result.status === 201) {
                                my_avatar.src = serverLocate + '/' + result.body.image;
                            } else {
                                setInfo('Что-то пошло не так');
                            }
                        })
                        .catch(function(error) {
                            setInfo('Что-то пошло не так');
                        });
                }
            }
        };
        input.click();
    });

    const save = document.getElementById('submit_save');

    save.addEventListener('click', function (evt) {
        evt.preventDefault();
        const email_form = document.getElementById('femail').value;
        const username_form = document.getElementById('flogin').value;
        const about_form = document.getElementById('fabout').value;  // not user
        if (validators.email(email_form) && validators.username(username_form)) {

            FetchModule.fetchRequest({url:serverLocate + '/api/user/settings/profile', method: 'put', body: {
                    login : username_form,
                    email : email_form,
                    //about : about_form // в api отдельный запрос about
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
                        setInfo('Данные профиля обновлены');
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так');
                });

        } else if (!email_valid) {
            setInfo('Введите корректный email');
        }  else if (!login_valid) {
            setInfo('Логин должен быть более,<br>чем из трех символов: a-z, A-Z, 0-9, _');
        }
    });

    const save_pass = document.getElementById('submit_pass');
    save_pass.addEventListener('click', function (evt) {
        evt.preventDefault();
        const password_form = document.getElementById('fpass').value;
        
        if (validators.password(password_form)) {

            // @todo 404 /password
            FetchModule.fetchRequest({url:serverLocate + '/api/user/settings/password', method: 'put', body: {
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
                    console.log("JSON",result);
                    if (result.status === 200) {
                        setInfo('Данные обновлены');
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                })
                .catch(function(error) {
                    setInfo('Что-то пошло не так');
                });

        } else if (!password_valid) {
            setInfo('Пароль должен быть из шести символов и более символов');
        }
    });

    const returnToProfile = document.getElementById('returnProfile');
    returnToProfile.addEventListener('click', function (evt) {
        evt.preventDefault();
        createProfile();
    })

};

export function setInfo(text) {
    const content = document.getElementById('banner');
    content.innerHTML = "";

    const err = document.createElement('h4');
    err.textContent = text;

    content.appendChild(err);
}