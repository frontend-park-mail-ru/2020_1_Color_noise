import DeskTemplate from "../components/Desk/desk.pug";
import findIcon from "../images/find.svg";
import {getMainPins, getSubPins, setScroll, getUserPins, getBoardPins} from "../components/Desk/Desk.js";
import {setSearch} from "../components/Menu/search.js"
import {clearColumns, unSetScroll} from "../components/Desk/Desk";
import {default as CurrentDesk} from "../components/Desk/CurrentDesk";
import {serverLocate} from "../utils/constants";


export function createDeskView() {

    //console.log("createDeskView()");
    document.title = "Main";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : serverLocate +"/"+findIcon});

    // try that way
    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;
    getMainPins();


    setTimeout(() => {
        setScroll(getMainPins);
    }, 1000);


   // setSearch();

}



export function createSubDeskView() {

    const followsOrMainLink = document.getElementById('followsOrMainLink');
    document.title = "Subscriptions";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : serverLocate +"/"+findIcon});

    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;


    getSubPins();
    //CurrentDesk.getSomePinsFunc = getMainPins;
    setScroll(getSubPins);
    setTimeout(() => {
        setScroll(getSubPins);
    }, 1000);


   // setSearch();


    followsOrMainLink.innerText = 'Главная';

}


export function createUserPinsDeskView(state) {

    CurrentDesk.State.userId = state.userId;

    document.title = "User Pins";
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : serverLocate +"/"+findIcon});

    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;

    getUserPins();
    //CurrentDesk.getSomePinsFunc = getUserPins;
    setTimeout(() => {
        setScroll(getUserPins);
    }, 1000);

   // setSearch();

}


export function createBoardDeskView(state) {

    CurrentDesk.State.boardId = state.deskId;
    //CurrentDesk.State.username = state.username;
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : serverLocate +"/"+findIcon});


    unSetScroll();
    clearColumns();
    CurrentDesk.State.numberOfPins = 0;

    getBoardPins();

    // не надо скролить доску пользователя - она разом вся приходит
    //setScroll(getBoardPins);

   // setSearch();

}