import DeskTemplate from "../components/Desk/desk.pug";
import findIcon from "../images/find.svg";
import {getMainPins, getSubPins, setScroll, setSearch, getUserPins, getBoardPins} from "../components/Desk/Desk.js";
import {clearColumns, unSetScroll} from "../components/Desk/Desk";
import {default as CurrentDesk} from "../components/Desk/CurrentDesk";


export function createDeskView() {

    //console.log("createDeskView()");
    
    const followsOrMainLink = document.getElementById('followsOrMainLink');
    followsOrMainLink.innerText = 'Подписки';
    document.title = "Main";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});

    /*
    getMainPins();
    setScroll(getMainPins);
    setSearch();

    unSetScroll();
    CurrentDesk.State.numberOfPins = 0;
    CurrentDesk.getSomePinsFunc = getSubPins;
    clearColumns();
    getMainPins();
    setScroll(getMainPins);
    */


    // try that way
    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;

    getMainPins();
    setScroll(getMainPins);

    setSearch();

    // try that way end



}



export function createSubDeskView() {

    const followsOrMainLink = document.getElementById('followsOrMainLink');
    document.title = "Subscriptions";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});

    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;


    getSubPins();
    //CurrentDesk.getSomePinsFunc = getMainPins;
    setScroll(getSubPins);

    setSearch();


    followsOrMainLink.innerText = 'Главная';

}


export function createUserPinsDeskView(state) {

    CurrentDesk.State.userId = state.userId;

    document.title = "User Pins";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});

    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;

    getUserPins();
    //CurrentDesk.getSomePinsFunc = getUserPins;
    setScroll(getUserPins);

    setSearch();

}


export function createBoardDeskView(state) {

    CurrentDesk.State.boardId = state.deskId;
    //CurrentDesk.State.username = state.username;
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});


    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;

    getBoardPins();
    //CurrentDesk.getSomePinsFunc = getBoardPins;
    setScroll(getBoardPins);

    setSearch();

}