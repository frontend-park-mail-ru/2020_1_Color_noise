import AutorizationTemplate from "../components/Autorization/choose.pug";
import logoImage from "../images/logo.svg";
import {default as Router} from "../utils/router.js";


export function authorizationOrRegistrationView() {

    const choose = AutorizationTemplate({ image: logoImage });
    const root = document.getElementById('modal');
    root.innerHTML = choose;

    const login = document.getElementById('submit_login_choose');
    login.addEventListener('click', function (evt) {

        Router.go("/authorization","Authorization");
    });

    const reg = document.getElementById('submit_reg_choose');
    reg.addEventListener('click', function (evt) {
        Router.go("/registration","Registration");
    });
}