import DeskTemplate from "../components/Desk/desk.pug";
import findIcon from "../images/find.svg";
import {getMainPins, getSubPins, setScroll, setSearch} from "../components/Desk/Desk.js";
import {clearColumns, unSetScroll} from "../components/Desk/Desk";
import {default as CurrentDesk} from "../components/Desk/CurrentDesk";


export function createDeskView() {

    const followsOrMainLink = document.getElementById('followsOrMainLink');
    document.title = "Main";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});

    getMainPins();
    setScroll(getMainPins);
    setSearch();

    unSetScroll();
    CurrentDesk.State.numberOfPins = 0;
    CurrentDesk.getSomePinsFunc = getSubPins;
    clearColumns();
    getMainPins();
    setScroll(getMainPins);
    followsOrMainLink.innerText = 'Подписки';

}



export function createSubDeskView() {

    const followsOrMainLink = document.getElementById('followsOrMainLink');
    document.title = "Subscriptions";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});

    getSubPins();
    setScroll(getSubPins);
    setSearch();

    unSetScroll();
    CurrentDesk.State.numberOfPins = 0;
    CurrentDesk.getSomePinsFunc = getMainPins;
    clearColumns();
    getSubPins();
    setScroll(getSubPins);

    followsOrMainLink.innerText = 'Главная';

}