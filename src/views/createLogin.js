import { createDesk } from "../components/Desk/Desk.js";
import {default as CurrentUser} from '../utils/userDataSingl.js';
import { createLogin } from "../components/Menu/Menu.js"
import {createMainPage} from "./createMainPage.js";

export function createLoginV() {
    createDesk();
    if ( CurrentUser.Data.login === 'null') {
        createLogin();
    } else {
        createMainPage();
    }

}