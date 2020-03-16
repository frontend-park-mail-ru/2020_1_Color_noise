import ProfileTemplate from './profile.pug';
import { validators } from '../Validation/Validation';
import PinTemplate from '../CreatePin/createPin.pug';
import PinImage from '../../images/pin_default.jpg';
import { ajax } from '../Network/Network';
import { createDesk } from '../Desk/Desk';
import './profile.css';

export const createProfile = (login, email, about, image, id) => {
    const profile = ProfileTemplate( { image : "http://95.163.212.121/" + image, login : login, email: email, about: about } );
    const root = document.getElementById('content');
    root.innerHTML = profile;

    const edit = document.getElementById('submit_edit');
    edit.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_avatar = document.getElementById('avatar');
        const input = document.createElement('input');
        input.name = 'file'
        input.type = 'file';
        input.accept = ".jpg, .jpeg, .png";
        input.onchange = function () {
            if (input.value != "") {
                if (input.files && input.files[0]) {
                    const formData = new FormData();
                    formData.append("image", input.files[0]);
                    //alert(formData.get(file));
                    //alert(input.files[0]);

                    ajax(
                        'POST',
                        'http://95.163.212.121/profile/avatar',
                        formData,
                        function (status, response) {
                            if (status === 200) {
                                const data = JSON.parse(response);
                                if (data.status == 201) {
                                    my_avatar.src = "http://95.163.212.121/" + data.body.image;
                                } else {
                                    setInfo('Что-то пошло не так');
                                }
                            } else {
                                setInfo('Что-то пошло не так');
                            }
                        },
                        true
                    )
                }
            }
        }
        input.click();
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

    const save = document.getElementById('submit_save');

    save.addEventListener('click', function (evt) {
        evt.preventDefault();
        const email_form = document.getElementById('femail').value;
        const username_form = document.getElementById('flogin').value;
        const about_form = document.getElementById('fabout').value;
        if (validators.email(email_form) && validators.username(username_form)) {
            // TODO: promise network-module
            ajax(
                'PUT',
                'http://95.163.212.121/profile',
                { 
                    login : username_form,  
                    email : email_form,  
                    about : about_form
                },
                function (status, response) {
                    if (status === 200) {
                        const data = JSON.parse(response);
                        if (data.status == 200) {
                            setInfo('Данные профиля обновлены');
                        } else {
                            setInfo('Что-то пошло не так');
                        }
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                }
            )
            
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
            // TODO: promise network-module
            ajax(
                'PUT',
                'http://95.163.212.121/password',
                { 
                    password: password_form
                },
                function (status, response) {
                    if (status === 200) {
                        const data = JSON.parse(response);
                        if (data.status == 200) {
                            setInfo('Данные обновлены');
                        } else {
                            setInfo('Что-то пошло не так');
                        }
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                }
            )
            
        } else if (!password_valid) {
            setInfo('Пароль должен быть из шести символов и более символов');
        }
    });

    const exit = document.getElementById('submit_exit');
    exit.addEventListener('click', function (evt) {
        evt.preventDefault();
            // TODO: promise network-module
            ajax(
                'POST',
                'http://95.163.212.121/logout',
                null,
                function (status, response) {
                    if (status === 200) {
                        const data = JSON.parse(response);
                        if (data.status == 200) {
                            createDesk();
                        } else {
                            setInfo('Что-то пошло не так');
                        }
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                }
            )
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
            if (input.value != "") {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        my_pin.src = e.target.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
        input.click();
    })
        


    const create = document.getElementById('submit_pin');
        create.addEventListener('click', function (evt) {
        evt.preventDefault();
        const my_pin = document.getElementById('new_pin');
        const name = document.getElementById('pin_name');
        const description = document.getElementById('pin_desc');

        if (my_pin.src != "http://95.163.212.121/a4817adc02e2f8d902d0002b6f793b82.jpg" && name.value.length > 0  && description.value.length > 0) {
            ajax(
                'POST',
                'http://95.163.212.121/pin', // + my_pin.getAttribute('img_id'),
                {
                    name : name.value,
                    description : description.value,
                    image : my_pin.src
                },
                function (status, response) {
                    if (status === 200) {
                        const data = JSON.parse(response);
                        if (data.status == 201) {
                            setInfo('Ваш пин добавлен');
                        } else {
                            setInfo('Что-то пошло не так');
                        }
                    } else {
                        setInfo('Что-то пошло не так');
                    }
                }
            )
        } else if (my_pin.src == "http://95.163.212.121/a4817adc02e2f8d902d0002b6f793b82.jpg") {
            setInfo('Загрузите картинку');
        } else if (name.value.length > 0) {
            setInfo('Введите имя пина');
        } else if (description.value.length > 0) {
            setInfo('Введите описание пина');
        }
    });
}

export function setInfo(text) {
    const content = document.getElementById('banner');
    content.innerHTML = "";

    const err = document.createElement('h4');
    err.textContent = text;

    content.appendChild(err);
}