import { createDesk } from '../components/Desk/Desk.js';
import {createProfile} from "../components/Profile/Profile.js";
import {createMenu} from "../components/Menu/Menu.js";


export function createProfileV() {
    createMenu();
    createProfile();
}