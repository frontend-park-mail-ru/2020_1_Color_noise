import {default as CurrentUser} from '../utils/userDataSingl.js';
import logoImage from "../images/logo.svg";
import {validators} from "../components/Validation/Validation";
import {FetchModule} from "../components/Network/Network";
import {serverLocate} from "../utils/constants";
import {Requests} from "../components/Network/Requests";
import {setInfo} from "../components/ProfileSettings/ProfileSettings";
import RegTemplate from '../components/Autorization/reg.pug';
import {default as Router} from "../utils/router.js";
import {createDeskView} from "./createDesk.js"

export function createRegistration() {

    createDeskView();

    if ( CurrentUser.Data.login === 'null') {

        console.log("createRegistrationVIEW: CurrentUser.Data.login === 'null':", CurrentUser.Data.login === 'null')

        const reg_modal = RegTemplate({ image: logoImage });
        const root = document.getElementById('modal');
        root.innerHTML = reg_modal;

        const loginLink = document.getElementById("loginLink");
        loginLink.addEventListener('click', (evt) => {
                evt.preventDefault();
                Router.go('/authorization','Authorization');
            }
        );

        const reg = document.getElementById('submit_reg');
        reg.addEventListener('click', function (evt) {
            evt.preventDefault();
            const email_form = document.getElementById('femail').value;
            const username_form = document.getElementById('flogin').value;
            const password_form = document.getElementById('fpass').value;
            const email_valid = validators.email(email_form);
            const login_valid = validators.username(username_form);
            const password_valid = validators.password(password_form)

            if (email_valid && login_valid && password_valid) {
                FetchModule.fetchRequest({url:serverLocate + '/api/user', method: 'post', body: {
                        login: username_form,
                        email: email_form,
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
                        if (result.status === 200) {
                            Requests.getUserProfile(); // get user data after signUp
                            Router.go("/main","Main");
                        }
                    })
                    .catch(function(error) {
                        setInfo('Что-то пошло не так');
                    });

            } else if (!email_valid) {
                setInfo('Введите корректный email');
            }  else if (!login_valid) {
                setInfo('Логин должен быть более,<br>чем из трех символов: a-z, A-Z, 0-9, _');
            }  else if (!password_valid) {
                setInfo('Пароль должен быть из шести символов и более символов');
            }
        });


        
    }
}