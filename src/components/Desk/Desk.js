import {addCard} from '../Card/Card';
import DeskTemplate from './desk.pug';
import './desk.css';

import {FetchModule} from '../Network/Network.js'
import {serverLocate} from '../../utils/constants.js'
import {default as CurrentDesk} from './CurrentDesk.js';

const isDeBug = true;
/*
   use fake Pins and fake sub pins(one img)
   locate: public/fakeImages/[name of pin]
   if you check work, u need create "fakeImages" dir in "public"
   and add img with arr names
   WARNING! fakePins Arrays not have limits check!
 */
const fakePinsArr = ['1.jpeg', '2.jpg', '3.jpeg', '4.jpeg', '5.jpg',
    '6.jpg', '7.jpg', '8.jpeg', '9.jpg', '10.jpg'
    , '11.jpeg', '12.jpg', '13.jpeg', '14.jpg' , '15.jpg', '16.jpg',
    '17.jpg', '21.jpeg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpeg', '28.jpeg', '29.jpg'];

const fakePinsArrSub = ['1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg',
    '1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg','1.jpeg',
    '1.jpeg','1.jpeg','1.jpeg','1.jpeg'];

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
            console.log("PINS:", result.pins);
            showPins(result.pins)
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
            console.log("PINS:", result.pins);
            showPins(result.pins)
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
 * @param {[string]} pinsArr - array of pins file names
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
        addCard('fakeImages/' + item, columnArr[0].id ); // @todo fakeImages only on deBug mod !!!
    });
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
export function unSetScroll(getSomePinsFuncInPut) {
    //console.log("unset:", getSomePinsFuncInPut);
    CurrentDesk.State.numberOfPins = 0;
    CurrentDesk.getSomePinsFunc = getSomePinsFuncInPut;
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
 * createDesk
 * create main desk (random content)
 *
 * @return {void}
 */
export const createDesk = () => {
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate();
    getMainPins();
    setScroll(getMainPins);
};

/**
 * setInfoDesk
 * set some info, used for errors msg
 * @return {void}
 */
function setInfoDesk(message) {
    const info = document.getElementById('content');
    info.innerHTML = message;
}
