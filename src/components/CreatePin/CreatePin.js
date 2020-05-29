import createPinTemplate from './createPin.pug';
import pinDefaultImage from '../../images/pinDefault.jpg';
import {showInfoModal, setInfoPage} from "../Modal/modal"

import Router from '../../utils/router'
import FetchModule from "../Network/Network";
import {serverLocate} from "../../utils/constants";
import backBtn from "../../images/backBtn.svg";
import {addDesksChoose} from "../Modal/modal";
import {default as CurrentUser} from "../../utils/userDataSingl";

export const createPageNewPin = (desks) => {
    const template = createPinTemplate({ pinDefaultImage : pinDefaultImage, backBtn : backBtn });

    const content = document.getElementById('content');
    content.innerHTML = template;

    addDesksChoose(desks);

    const chooseImage = document.getElementById('chooseImage');
    chooseImage.addEventListener('click', chooseImageFunc);

    const sendNewPin = document.getElementById('sendNewPin');
    sendNewPin.addEventListener('click', sendNewPinFunc);
    const backProfileLink = document.getElementById('backProfileLink');
    backProfileLink.addEventListener('click', goBack);
};

const goBack = () => {
    window.history.back();
};

const chooseImageFunc = (evt) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg, .jpeg, .png';
    input.addEventListener('change', chooseChoiceImageFunc);
    input.click();
};

const chooseChoiceImageFunc = (evt) => {
    const pinImage = document.getElementById('pinImage');
    const chooseImage = document.getElementById('chooseImage');
    const target = evt.target;
    if (target.value !== '') {
        if (target.files && target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const formData = new FormData();
                formData.append('image', target.files[0]);

                FetchModule.fetchRequestSendImage({
                    url:serverLocate + '/api/pin/image',
                    method: 'post',
                    body: formData
                    }).then((res) => {
                        return res.ok ? res : Promise.reject(res);
                    }).then((response) => {
                        return response.json();
                    }).then((result) => {
                        if (result.status === 201) {
                            pinImage.setAttribute('loaded', result.body.id);
                        } else {
                            setInfoPage('Ошибка обработки запроса');
                        }
                    }).catch(function(error) {
                        setInfoPage('Ошибка отправки запроса');
                    });
                pinImage.src = e.target.result;
                chooseImage.value = "Изменить изображение";
            };
            reader.readAsDataURL(target.files[0]);
        }
    }
};

const sendNewPinFunc = (evt) => {
    const pinImage = document.getElementById('pinImage');
    const imageID = pinImage.getAttribute('loaded');
    if (!imageID) {
        setInfoPage("Загрузите изображение");
        return;
    }

    const name = document.getElementById('pinName').value;
    const description = document.getElementById('pinDesc').value;

    if (name.length < 1) {
        setInfoPage("Название пина не может быть пустым");
        return;
    }

    const deskSelect = document.getElementById("deskSelect");
    const deskID = deskSelect.options[deskSelect.selectedIndex].id;

    FetchModule.fetchRequest(
        {
            url:serverLocate + '/api/pin/' + imageID,
            method: 'post',
            body: {
                name : name,
                description : description,
                board_id: Number(deskID)
            }
        }).then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
                return response.json();
            },
        ).then((result) => {
            if (result.status === 201) {
                Router.go("/", "Zinterest", null);
                showInfoModal('Ваш пин добавлен');
            } else {
                setInfoPage('Ошибка обработки запроса');
            }
        }).catch(function(error) {
            setInfoPage('Ошибка отправки запроса');
        });
};