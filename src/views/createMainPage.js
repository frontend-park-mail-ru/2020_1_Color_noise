import { createDesk } from '../components/Desk/Desk.js';
import { createContent } from '../components/Content/Content.js';
import { createMenu } from '../components/Menu/Menu.js';
import {changeLocation} from "../utils/changeLocation.js"

export function createMainPage() {
    changeLocation("/main", "Main");
    createContent();
    createDesk();
    createMenu();
}
