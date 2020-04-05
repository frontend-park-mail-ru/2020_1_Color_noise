import {addCard} from '../Card/Card';
import DeskTemplate from './desk.pug';
import './desk.css';

import {FetchModule} from '../Network/Network.js'
import {serverLocate} from '../../utils/constants.js'
import {default as CurrentDesk} from './CurrentDesk.js';
import findIcon from "../../images/find.svg"


const isDeBug = false;
/*
   use fake Pins and fake sub pins(one img)
   locate: public/fakeImages/[name of pin]
   if you check work, u need create "fakeImages" dir in "public"
   and add img with arr names
   WARNING! fakePins Arrays not have limits check!
 */
// [{id: 1, src:'1.jpeg'} ];
/*
const fakePinsArr = [{id: 1, src:'1.jpeg'}, {id: 2, src:'2.jpg'}, {id: 3, src:'3.jpeg'}, {id: 4, src:'4.jpeg'},
    {id: 5, src:'5.jpg'}, {id: 6, src:'6.jpg'}, {id: 7, src:'7.jpg'}, {id: 8, src:'8.jpeg'}, {id: 9, src:'9.jpg'},
    {id: 10, src:'10.jpg'}, {id: 11, src:'11.jpeg'}, {id: 12, src:'12.jpg'}, {id: 13, src:'13.jpeg'},
    {id: 14, src:'14.jpg'}, {id: 15, src:'15.jpg'}, {id: 16, src:'16.jpg'}, {id: 17, src:'17.jpg'},
    {id: 21, src:'21.jpeg'}, {id: 22, src:'22.jpg'}, {id: 23, src:'23.jpg'}, {id: 24, src:'24.jpg'},
    {id: 25, src:'25.jpg'}, {id: 26, src:'26.jpeg'}, {id: 28, src:'28.jpeg'}, {id: 29, src:'29.jpg'}];

const fakePinsArrSub = [{id: 1, src:'1.jpeg'},{id: 2, src:'1.jpeg'},{id: 3, src:'1.jpeg'},{id: 4, src:'1.jpeg'},
    {id: 5, src:'1.jpeg'},{id: 6, src:'1.jpeg'},{id: 7, src:'1.jpeg'},{id: 8, src:'1.jpeg'}, {id: 9, src:'1.jpeg'},
    {id: 10, src:'1.jpeg'},{id: 11, src:'1.jpeg'},{id: 12, src:'1.jpeg'}, {id: 13, src:'1.jpeg'},{id: 14, src:'1.jpeg'},
    {id: 15, src:'1.jpeg'},{id: 16, src:'1.jpeg'},{id: 17, src:'1.jpeg'},{id: 18, src:'1.jpeg'}, {id: 19, src:'1.jpeg'},
    {id: 20, src:'1.jpeg'},{id: 21, src:'1.jpeg'},{id: 22, src:'1.jpeg'}];

const fakePinIdArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
*/

/**
 *  getMainPins
 *  fetch request and call showPins(result of request)
 *  @return {void}
 */
export function getMainPins() {

    FetchModule.fetchRequest({ url: serverLocate + '/api/list?start=' + ( CurrentDesk.State.numberOfPins + 1 )
            + '&limit=10', method:'get', body:null})
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
            if (isDeBug) {
                showPins(fakePinsArr);
                return;
            }
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
            + '&limit=10', method:'get',})
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
            console.log("ERR_SUB", error);
            if (isDeBug) {
                showPins(fakePinsArrSub);
                return;
            }
            setInfoDesk("Что-то пошло не так с подписками");
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
    let columnArr = [];
    for (let i=1; i < 5; i++) {
        columnArr[i-1] = document.getElementById('column' + i.toString());
    }
    const sortColumnArr = () => {
        columnArr.sort((a, b) => {
            if (a.clientHeight === b.clientHeight) {
                return a.clientHeight > b.clientHeight ? 1 : a.clientHeight < b.clientHeight ? -1 : 0;
            }
            return a.clientHeight > b.clientHeight ? 1 : -1;
        });
    };
    pinsArr.forEach((item) => {
        sortColumnArr();
        addCard(item, columnArr[0].id ); // @todo fakeImages only on deBug mod !!!
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
    let columnArr = [];
    for (let i=1; i < 5; i++) {
        columnArr[i-1] = document.getElementById('column' + i.toString());
    }
    const sortColumnArr = () => {
        columnArr.sort((a, b) => {
            if (a.clientHeight === b.clientHeight) {
                return a.clientHeight > b.clientHeight ? 1 : a.clientHeight < b.clientHeight ? -1 : 0;
            }
            return a.clientHeight > b.clientHeight ? 1 : -1;
        });
    };
    sortColumnArr();
    addCard(onePin, columnArr[0].id );
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
        if(y >= contentHeight) {
            CurrentDesk.getSomePinsFunc();
            window.removeEventListener("scroll", scroll);
            setTimeout(() => { window.addEventListener("scroll", scroll)}, 1000);
        }
}

/**
 *  setScroll
 *  set event scroll
 *
 * @return {void}
 */
export function setScroll(getSomePinsFuncInPut) {
    //console.log("set:", getSomePinsFuncInPut);
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
    for (let i = 1; i < 5; i++) {
       document.getElementById('column' + i.toString()).innerHTML = '';
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

    pinIdArr.forEach((item) => {

        FetchModule.fetchRequest({url:serverLocate + "/api/pin/" + item, method:'get'})
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

                    if (isDeBug) {
                        showOnePin({id: 5, src:'5.jpg'});
                    } else {
                        showOnePin(result.body);
                    }

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
function setSearch() {

    const searchImg = document.getElementById("search_main_img");
    const searchInput = document.getElementById("search_main_input");

    searchImg.addEventListener('click', (evt) => {

        const searchValue = searchInput.value.trim();
        const searchObj = "pin";
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

                    if (isDeBug) {
                        getInfoForShowing(fakePinIdArr);
                    } else {
                        if (result.body.length === 0) {
                            setInfoDesk("Ничего не найдено");
                        }
                        getInfoForShowing(result.body);
                    }
                }
            })
            .catch( (error) => {
                console.log("ERR_SEARCH_PIN:", error);
                if (isDeBug) {
                    getInfoForShowing(fakePinIdArr);
                    return;
                }
                setInfoDesk("Что-то пошло не так с поиском пинов");
            });

    })
}


/**
 * createDesk
 * create main desk (random content)
 * @param {string} deskContent follows or mainRandom
 * @return {void}
 */
export const createDesk = (deskContent) => {
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : findIcon});
    if (deskContent === "mainRandom") {
        getMainPins();
        setScroll(getMainPins);
    } else if (deskContent === "follows") {
        getSubPins();
        setScroll(getSubPins);
    }

    setSearch();

};

/**
 * setInfoDesk
 * set some info, used for errors msg
 * @return {void}
 */
function setInfoDesk(message) {
    const info = document.getElementById('main_page_info');
    info.innerHTML = message;
}
