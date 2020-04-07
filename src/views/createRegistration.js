import { createDesk } from "../components/Desk/Desk.js";
import { createReg } from "../components/Menu/Menu.js";
import {default as CurrentUser} from '../utils/userDataSingl.js';

export function createRegistration() {
    if ( CurrentUser.Data.login !== 'null') {
        createDesk();
    } else {
        createDesk();
        createReg()
    }
}