import SettingsTemplate from './settings.pug';
import {validators} from '../../utils/validation';
import FetchModule from  '../Network/Network'
import {serverLocate} from '../../utils/constants'
import {default as CurrentUser} from '../../utils/userDataSingl';
import backBtn from "../../images/backBtn.svg";
import {setInfoModal, setInfoPage, showInfoModal} from "../Modal/modal";

export const createPageSettings = () => {
    const template = SettingsTemplate({
        avatarImage : serverLocate + '/' + CurrentUser.Data.avatarPath,
        backBtn : backBtn,
        userEmail : CurrentUser.Data.email,
        userName : CurrentUser.Data.login,
        userAbout : CurrentUser.Data.about
    });

    const content = document.getElementById('content');
    content.innerHTML = template;

    const backProfileLink = document.getElementById('backProfileLink');
    backProfileLink.addEventListener('click', goBack);

    const changeAvatar = document.getElementById('changeAvatar');
    changeAvatar.addEventListener('click', openImageAvatar);

    const sendPass = document.getElementById('sendPass');
    sendPass.addEventListener('click', sendPassForm);

    const saveData = document.getElementById('saveData');
    saveData.addEventListener('click', sendInfoForm);
};

const goBack = () => {
    window.history.back();
};

const openImageAvatar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg, .jpeg, .png';
    input.addEventListener('change', chooseChoiceImageFunc);
    input.click();
};

const chooseChoiceImageFunc = (evt) => {
    const avatarImage = document.getElementById('avatarImage');
    const target = evt.target;
    if (target.value !== '') {
        if (target.files && target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const formData = new FormData();
                formData.append('image', target.files[0]);

                FetchModule.fetchRequestSendImage({
                    url:serverLocate + '/api/user/settings/avatar',
                    method: 'put',
                    body: formData
                }).then((res) => {
                    return res.ok ? res : Promise.reject(res);
                }).then((response) => {
                    return response.json();
                }).then((result) => {
                    if (result.status === 201) {
                        avatarImage.src = serverLocate + '/' + result.body.image;
                        CurrentUser.Data.avatarPath = result.body.image;
                        showInfoModal('Аватар успешно обновлен');
                    } else {
                        setInfoPage('Ошибка обработки запроса');
                    }
                }).catch(function(error) {
                    setInfoPage('Ошибка отправки запроса');
                });
            };
            reader.readAsDataURL(target.files[0]);
        }
    }
};

const sendPassForm = () => {
    const userPass = document.getElementById('userPass');
    const userPassValue = userPass.value;
    if (validators.password(userPassValue)) {
        FetchModule.fetchRequest({
                url:serverLocate + '/api/user/settings/password',
                method: 'put',
                body: {
                    password: userPassValue
                }
            }).then((res) => {
                return res.ok ? res : Promise.reject(res);
            }).then((response) => {
                return response.json();
            }).then((result) => {
                if (result.status === 200) {
                    userPass.value = '';
                    showInfoModal('Пароль успешно обновлен');
                } else {
                    setInfoPage('Ошибка обработки запроса');
                }
            }).catch(function(error) {
                setInfoPage('Ошибка отправки запроса');
            });
    } else {
        setInfoPage('Пароль должен быть из шести и более символов');
    }
};

const sendInfoForm = () => {
    const userEmail = document.getElementById('userEmail').value;
    const userName = document.getElementById('userName').value;
    if (!validators.email(userEmail)) {
        setInfoPage('Введите корректный email');
        return;
    }

    if (!validators.username(userName)) {
        setInfoPage('Логин должен состоять из трех и более символов,<br>' +
            'и содержать только латинские буквы, цифры и подчеркивание');
        return;
    }

    FetchModule.fetchRequest({
        url:serverLocate + '/api/user/settings/profile',
        method: 'put',
        body: {
            login: userName,
            email: userEmail
        }
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            CurrentUser.Data.login = userName;
            CurrentUser.Data.email = userEmail;
            sendDescriptionForm();
            showInfoModal('Данные успешно обновлены');
        } else {
            setInfoPage('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        setInfoPage('Ошибка отправки запроса');
    });
};

const sendDescriptionForm = () => {
    const userAbout = document.getElementById('userAbout').value;
    FetchModule.fetchRequest({
        url:serverLocate + '/api/user/settings/description',
        method: 'put',
        body: {
            description: userAbout
        }
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            CurrentUser.Data.about = userAbout;
            showInfoModal('Данные успешно обновлены');
        } else {
            setInfoPage('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        setInfoPage('Ошибка отправки запроса');
    });
}
