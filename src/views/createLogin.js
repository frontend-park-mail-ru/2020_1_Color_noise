import { createDesk } from "../components/Desk/Desk.js";
import {default as CurrentUser} from '../utils/userDataSingl.js';
import { createLogin } from "../components/Menu/Menu.js"
import {createMainPage} from "./createMainPage.js";
import AutorizationTemplate from "../components/Autorization/choose.pug";
import logoImage from "../images/logo.svg";
import {createNotif, createReg} from "../components/Menu/Menu";
import { default as Router} from "../utils/router.js"
import LoginTemplate from "../components/Autorization/login.pug";
import {validators} from "../components/Validation/Validation.js";
import {FetchModule} from "../components/Network/Network.js";
import {serverLocate} from "../utils/constants.js";
import {Requests} from "../components/Network/Requests.js";
import {setInfo} from "../components/ProfileSettings/ProfileSettings.js";
import {createDeskView} from "./createDesk.js"


export function createLoginView() {


    createDeskView();


    if ( CurrentUser.Data.login === 'null') {


        const login_modal = LoginTemplate({ image: logoImage });
        const root = document.getElementById('modal');
        root.innerHTML = login_modal;

        const registrationLink = document.getElementById("registrationLink");
        registrationLink.addEventListener('click', (evt) => {
                evt.preventDefault();

                Router.go("/registration", "Registration");
            }
        );

        const login = document.getElementById('submit_login');
        login.addEventListener('click', function (evt) {
            evt.preventDefault();
            const username_form = document.getElementById('flogin').value;
            const password_form = document.getElementById('fpass').value;
            if (validators.username(username_form) && validators.password(password_form)) {

                FetchModule.fetchRequest({url: serverLocate + '/api/auth', method: 'post', body:{
                        login: username_form,
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
                            Requests.getUserProfile(null); // get user data after login
                            root.innerHTML = "";
                        } else {
                            throw "bad login or password";
                        }
                    })
                    .catch(function(error) {
                        setInfo('Пароль или логин не верны'); // @todo switch for error
                    });
            } else {
                setInfo('Данные в форме некорректны');
            }
        });


    }

    
}