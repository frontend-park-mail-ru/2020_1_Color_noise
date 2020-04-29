import {addCard} from '../Card/Card';
import './desk.css';
import findUserTemplate from "./findUser.pug"
import {FetchModule} from '../Network/Network.js'
import {serverLocate} from '../../utils/constants.js'
import {default as CurrentDesk} from './CurrentDesk.js';

import Router from "../../utils/router.js"

/**
 *  getMainPins
 *  fetch request and call showPins(result of request)
 *  @return {void}
 */
export function getMainPins() {
    FetchModule.fetchRequest({ url: serverLocate + '/api/list?start=' + ( CurrentDesk.State.numberOfPins + 1 )
            + '&limit=15', method:'get', body:null})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("PINS:", result);
            showPins(result.body)
       })

        .catch(function(error) {
            console.log('ERR_MAIN_DESK',error);

            setInfoDesk("Что-то пошло не так с главной");
        });
}

/**
 *  getSubPins
 *  fetch request and call showPins(result of request)
 *  @return {void}
 */
export function getSubPins() {
    FetchModule.fetchRequest({ url: serverLocate + '/api/list/sub?start=' + ( CurrentDesk.State.numberOfPins + 1 )
            + '&limit=15', method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("SUB PINS:", result);
            if (result.body.length === 0) {
                setInfoDesk("Нет ничего нового в ваших подписках");
                return;
            }
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_SUB", error);
            setInfoDesk("Что-то пошло не так с подписками");
        });
}

export function getUserPins() {

    //  Все пины пользователя
    /*
    Получить массив пинов пользователя: /api/pin/user/{user_id}?start=value1&limit=value2 - (start - с какого количества,
     limit - сколько грузить (можно не добавлять, по умолчанию 10)) - get
    ARRAY:     id name description user_id board_id image
     */

    const userId = CurrentDesk.State.userId;
    const username = CurrentDesk.State.username;

    FetchModule.fetchRequest({ url: serverLocate + '/api/pin/user/' + userId.toString() + '?start=' + ( CurrentDesk.State.numberOfPins + 1 )
            + '&limit=20', method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("USER PINS:", result);
            if (result.body.length === 0) {
                setInfoDesk("Нет пинов у данного пользователя");
                return;
            }
            //document.title += username;
            console.log("GOOD REQUEST ");
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_UserPins", error);
            setInfoDesk("Что-то пошло не так с пинами пользователя");
        });

}

export function getBoardPins() {

    const boardId = CurrentDesk.State.boardId;

    //  доска пользователя
    // Получить доску: /api/board/{board_id} - get       просто доска

    // name description pins[ids] user_id

    // тут в теле приходят  pins[] они не ограничены диапазоном
    FetchModule.fetchRequest({ url: serverLocate + '/api/board/' + boardId.toString(), method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("Board PINS:", result);

            if (result.body.pins === undefined) {
                setInfoDesk("Нет пинов на этой доске");
                return;
            }
            //document.title += result.body.name;

            showPins(result.body.pins)

        })
        .catch(function(error) {
            console.log("ERR_Board Pins", error);
            setInfoDesk("Что-то пошло не так с пинами доски");
        });

}


/**
 *  showPins
 *  columnArr - array of column on main page
 *  sortColumnArr - func for sorting with comparator (add picture in the lowest column)
 *
 * @param {[{string, string}]} pinsArr - array of pins file names
 * @return {void}
 */
function showPins(pinsArr) {

    CurrentDesk.State.numberOfPins += pinsArr.length;
    let columnArr = document.getElementById('columns');

    pinsArr.forEach((item) => {
        addCard(item, columnArr.id); // @todo fakeImages only on deBug mod !!!
    });
}

/**
 *  showOnePin
 *  columnArr - array of column on main page
 *  sortColumnArr - func for sorting with comparator (add picture in the lowest column)
 *
 * @param {map} onePin - one pin (map with pin info)
 * @return {void}
 */
function showOnePin(onePin) {
    CurrentDesk.State.numberOfPins += 1;
    let columnArr = document.getElementById('columns');

    addCard(onePin, columnArr.id );
}

/**
 *  scroll
 *  call getSomePinsFunc
 *  remove event and reSet it after 1 second for protect from many requests
 *
 * @return {void}
 */
function scroll() {
        let content = document.getElementById('content');
        let contentHeight = content.offsetHeight;      // высота блока контента вместе с границами
        let yOffset       = window.pageYOffset;      // текущее положение скролбара
        let window_height = window.innerHeight;      // высота внутренней области окна документа
        let y             = yOffset + window_height;
        // если пользователь достиг конца
        if(y >= contentHeight - 500) {
            //console.log("вызов по скролу");
            CurrentDesk.getSomePinsFunc();
            window.removeEventListener("scroll", scroll);
            setTimeout(() => { window.addEventListener("scroll", scroll)}, 200);
        }
}

/**
 *  setScroll
 *  set event scroll
 *
 * @return {void}
 */

export function setScroll(getSomePinsFuncInPut) {
    //console.log("set SCROLLL:", getSomePinsFuncInPut);
    CurrentDesk.getSomePinsFunc = getSomePinsFuncInPut;
    window.addEventListener("scroll", scroll)
}

/**
 *  unSetScroll
 *  unset event scroll
 *
 * @return {void}
 */
export function unSetScroll() {
    //console.log("remove scrol");
    //console.log("unset:", getSomePinsFuncInPut);
    window.removeEventListener("scroll", scroll)
}

/**
 * clearColumns
 * clear columns for new pins
 *
 * @return {void}
 */
export function clearColumns() {
       let columns = document.getElementById('columns');
       if (columns !== null) {
           columns.innerHTML = ''
       } else {
           const mainDesk = document.getElementById("mainDesk")
           mainDesk.innerHTML = ""
           const columnsDiv = document.createElement("div");
           columnsDiv.id = "columns"
           mainDesk.appendChild(columnsDiv)
       }
}


/**
 * getInfoForShowing
 * get info about pin and call showOnePin for every pin
 *
 * @param {[int]} pinIdArr - pin id array
 * @return {void}
 */
function getInfoForShowing(pinIdArr) {

    CurrentDesk.State.numberOfPins = 0;
    //CurrentDesk.State.getSomePinsFunc = скрол по поиску
    clearColumns();
    unSetScroll();

    if (pinIdArr.length !==0) {
        setInfoDesk("")
    }


    pinIdArr.forEach((item) => {

        console.log("URL:",serverLocate + "/api/pin/" + item.id);

        FetchModule.fetchRequest({url:serverLocate + "/api/pin/" + item.id, method:'get'})
            .then((res) => {
                return res.ok ? res : Promise.reject(res);
            })
            .then((response) => {
                return response.json();
            })
            .then((result) => {

                if (result.status !== 200) {
                    throw Error("search pin get info request not 200");
                } else {


                showOnePin(result.body);


                }

            })

            .catch( (error) => {
                console.log("ERR_SEARCH_PIN::getInfoForShowing() :", error);
                //setInfoDesk("Что-то пошло не так с получением инфы о пине в поиске");
            });
    });
}


/**
 * setSearch
 * set action for search
 * @return {void}
 */
export function setSearch() {

    const searchImg = document.getElementById("search_main_img");
    const searchInput = document.getElementById("search_main_input");

    searchImg.addEventListener('click', (evt) => {
        searchEvent()
    })

    searchInput.addEventListener('keypress',  (e) =>{
        if (e.key === 'Enter') {
            searchEvent()
        }
    });



}


function searchEvent() {

    unSetScroll();
    const searchInput = document.getElementById("search_main_input");

    let isUserSearch = false
    const selectSearch = document.getElementById("select_search")
    if (selectSearch.options[selectSearch.selectedIndex].text === "Пользователь") {
        isUserSearch = true
    }

    const searchValue = searchInput.value.trim();
    let searchObj = "pin";

    if (isUserSearch){
        searchObj = "user"
    }

    const start = 0;
    const limit = 50;
    FetchModule.fetchRequest({url: serverLocate + "/api/search?what=" + searchObj + "&description=" +
            searchValue + "&start=" + start + "&limit=" + limit, method:'get'})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            if (result.status !== 200) {
                setInfoDesk("Ничего не найдено");
            } else {

                if (result.body.length === 0) {
                    setInfoDesk("Ничего не найдено");
                }
                if (isUserSearch) {
                    console.log("show users:", result.body)
                    showUserSearch(result.body)
                } else {
                    getInfoForShowing(result.body);
                }


            }
        })
        .catch( (error) => {
            console.log("ERR_SEARCH_PIN:", error);
            setInfoDesk("Что-то пошло не так с поиском пинов");
        });

}





function showUserSearch(UserArr) {

    const mainDesk = document.getElementById("mainDesk")

    if (UserArr.length !== 0) {

        mainDesk.innerHTML = ""
        setInfoDesk("") // убираем "ничего не найдено"

        UserArr.forEach((element) => {

            const userAvatarId = "avatarID:" + element.id

            const findUserHtml = findUserTemplate({
                avatarSrc: serverLocate + "/" + element.avatar, login: element.login,
                subscriptions: element.subscriptions, subscribers: element.subscribers, avatarID: userAvatarId
            })


            const findUserElement = document.createElement("div");
            findUserElement.innerHTML = findUserHtml

            mainDesk.appendChild(findUserElement)

            const addedAvatar = document.getElementById(userAvatarId)
            addedAvatar.addEventListener("click", (evt) => {
                element.avatarPath = element.avatar
                Router.go("/profile", "Profile", element)
            })

        })
    }


    /*
    id	17
login	"Slava"
avatar	"D9upSSzWZUT1T9Gsc6H7SkhZX5FJh6.jpg"
subscriptions	0
subscribers	0
     */

    // unSCROLL

}


/**

export const createDesk = (deskContent = "mainRandom") => {
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});
    if (deskContent === "mainRandom") {
        changeLocation("/main","main");
        getMainPins();
        setScroll(getMainPins);
    } else if (deskContent === "follows") {
        changeLocation("/follows","follows");
        getSubPins();
        setScroll(getSubPins);
    }

    setSearch();

};
*/


/**
 * setInfoDesk
 * set some info, used for errors msg
 * @return {void}
 */
function setInfoDesk(message) {
    const info = document.getElementById('main_page_info');
    info.innerHTML = message;
}
