import searchDateDetailsTemplate from "./searchDateDetails.pug";
import {default as CurrentDesk} from "../Desk/CurrentDesk";
import {clearColumns, setScroll, unSetScroll, showPins, getUserPins} from "../Desk/Desk";
import FetchModule from "../Network/Network";
import {serverLocate} from "../../utils/constants";
import findUserTemplate from "../Desk/findUser.pug";
import Router from "../../utils/router";
import {addCard} from "../Card/Card";
import DeskTemplate from "../Desk/desk.pug";
import findIcon from "../../images/find.svg";



// подготовим url для поиска и установим скрол
function searchEvent() {

    // обнуляем предыдущие варианты и если надо строим каркас для пинов
    unSetScroll();
    // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});
    CurrentDesk.State.numberOfPins = 0;


    const searchMainInput = document.getElementById("search_main_input")
    const searchValue = searchMainInput.value


    /*
    Поиск: /api/search?what=value1&description=value2&start=value3&
    limit=value4&date=day/week/month&false&desc=true/false&most=popular/comment
     (value1 - что ищем user, pin, board; value2 - описание, start - c какой позиции загружать,
      limit - сколько заагружать)
     */


    let searchUrl = serverLocate + "/api/search?what=" + CurrentDesk.State.searchObj + "&description=" +
        searchValue

    if (CurrentDesk.State.searchTime !== null) {
        searchUrl += "&date=" + CurrentDesk.State.searchTime
    }

    if (CurrentDesk.State.searchFilter !== null) {
        searchUrl += "&most=" + CurrentDesk.State.searchFilter
    }

    if (CurrentDesk.State.searchOrderDesc === 0) {
        searchUrl += "&desc=false"
    } else {
        searchUrl += "&desc=true"
    }

    CurrentDesk.State.searchUrl = searchUrl
    getSearchFilter();

    setTimeout(() => {
        setScroll(getSearchFilter)
    }, 1000);

}




function getSearchFilter() {

    const limit = 15

    let searchUrl = CurrentDesk.State.searchUrl

    searchUrl += "&start=" + CurrentDesk.State.numberOfPins + "&limit=" + limit

    FetchModule.fetchRequest({url: searchUrl, method:'get'})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {


            CurrentDesk.State.SearchIsActiv = true

            if (result.status !== 200) {
                setInfoDesk("Ошибка сервера");
            } else {


                if (result.body.length === 0) {
                    if (CurrentDesk.State.searchObj === "user") {
                        setInfoDesk("Пользователи не найдены");
                    } else {
                        setInfoDesk("Пины не найдены");
                    }
                    return;
                }
                if (CurrentDesk.State.searchObj === "user") {
                    console.log("show users:", result.body)
                    showUserSearch(result.body)
                } else {
                    getInfoForShowing(result.body);
                }
            }
        })
        .catch( (error) => {
            console.log("ERR_SEARCH: search url:", searchUrl)
            console.log("ERR_SEARCH: err:", error);
            setInfoDesk("Что-то пошло не так с поиском");
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
                Router.go("/user/" + element.id,"User", element, true );
            })

        })
    }
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


function setSelectedVars() {
    
    // Выбор объекта поиска
    const searchSelectedObj = document.getElementById("search_selected_obj")

    const classIfSelected = "chat_filter_selected"

    const searchSelectPinVars = document.getElementById("search_select_pin_vars")
    const searchSelectUserVars = document.getElementById("search_select_user_vars")

    searchSelectPinVars.classList.add(classIfSelected) // начальное значение


    // заранее чтоб скрывать при выборе юзера
    const searchDay = document.getElementById("search_day")
    const searchWeek = document.getElementById("search_week")
    const searchMonth = document.getElementById("search_month")
    const searchAllTime = document.getElementById("search_all_time")
    const searchFilterTimeTitle = document.getElementById("search_filter_time_title")


    const searchFilterMostTitle = document.getElementById("search_filter_most_title")
    const searchPopular = document.getElementById("search_popular")
    const searchMostComments = document.getElementById("search_most_comments")
    const searchDefault = document.getElementById("search_default")

    const searchFilterOrderTitle = document.getElementById("search_filter_order_title")
    const searchOrderNorm = document.getElementById("search_order_norm")
    const searchOrderReverse = document.getElementById("search_order_reverse")



    searchSelectPinVars.addEventListener("click", (evt)=>{
        evt.preventDefault();
        console.log(" searchSelectedObj.innerText = \"Пин\"")
        //searchSelectedObj.innerText = "Пин"
        CurrentDesk.State.searchObj = "pin"

        searchSelectUserVars.classList.remove(classIfSelected) // что будет если удалить класс которого не было
        searchSelectPinVars.classList.add(classIfSelected)

        const searchMostComments = document.getElementById("search_most_comments")
        searchMostComments.style.display = "block"

        // показываем свойства для пина
        searchFilterTimeTitle.style.display = "block"
        searchDay.style.display = "block"
        searchWeek.style.display = "block"
        searchMonth.style.display = "block"
        searchAllTime.style.display = "block"

        //
        searchFilterMostTitle.style.display = "block"
        searchPopular.style.display = "block"
        searchMostComments.style.display = "block"
        searchDefault.style.display = "block"

        //
        searchFilterOrderTitle.style.display = "block"
        searchOrderNorm.style.display = "block"
        searchOrderReverse.style.display = "block"


    })

    searchSelectUserVars.addEventListener("click", evt=>{
        evt.preventDefault();
        console.log("searchSelectedObj.innerText = \"Пользователь\"")
        //searchSelectedObj.innerText = "Пользователь"
        CurrentDesk.State.searchObj = "user"

        searchSelectPinVars.classList.remove(classIfSelected) // что будет если удалить класс которого не было
        searchSelectUserVars.classList.add(classIfSelected)

        // строем самые комментируемые
        const searchMostComments = document.getElementById("search_most_comments")
        searchMostComments.style.display = "none"
        if (CurrentDesk.State.searchFilter === "comment") {
            //searchSelectedFilter.innerText = "По умолчанию"
            CurrentDesk.State.searchFilter = null
        }

        // скрываем время для пользователя
        searchDay.style.display = "none"
        searchWeek.style.display = "none"
        searchMonth.style.display = "none"
        searchAllTime.style.display = "none"
        searchFilterTimeTitle.style.display = "none"

        //
        searchFilterMostTitle.style.display = "none"
        searchPopular.style.display = "none"
        searchMostComments.style.display = "none"
        searchDefault.style.display = "none"

        //
        searchFilterOrderTitle.style.display = "none"
        searchOrderNorm.style.display = "none"
        searchOrderReverse.style.display = "none"

    })



    //Выбор параметра поиска (популярные или комментируемые) если не выбоано то

    searchDefault.classList.add(classIfSelected) // начальное значение

    searchPopular.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedFilter.innerText = "Популярные"
        searchMostComments.classList.remove(classIfSelected)
        searchDefault.classList.remove(classIfSelected)
        searchPopular.classList.add(classIfSelected)

        CurrentDesk.State.searchFilter = "popular"

    })


    searchMostComments.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedFilter.innerText = "Комментируемые"
        searchPopular.classList.remove(classIfSelected)
        searchDefault.classList.remove(classIfSelected)
        searchMostComments.classList.add(classIfSelected)

        CurrentDesk.State.searchFilter = "comment"
    })


    searchDefault.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedFilter.innerText = "По умолчанию"
        searchMostComments.classList.remove(classIfSelected)
        searchPopular.classList.remove(classIfSelected)
        searchDefault.classList.add(classIfSelected)

        CurrentDesk.State.searchFilter = null
    })



    // выбор времени поиска

    searchAllTime.classList.add(classIfSelected) // начальное состояние

    searchDay.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedTime.innerText = "За день"
        searchWeek.classList.remove(classIfSelected)
        searchMonth.classList.remove(classIfSelected)
        searchAllTime.classList.remove(classIfSelected)
        searchDay.classList.add(classIfSelected)

        CurrentDesk.State.searchTime = "day"

    })

    searchWeek.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedTime.innerText = "За неделю"
        searchDay.classList.remove(classIfSelected)
        searchMonth.classList.remove(classIfSelected)
        searchAllTime.classList.remove(classIfSelected)
        searchWeek.classList.add(classIfSelected)

        CurrentDesk.State.searchTime = "week"

    })

    searchMonth.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedTime.innerText = "За месяц"
        searchDay.classList.remove(classIfSelected)
        searchWeek.classList.remove(classIfSelected)
        searchAllTime.classList.remove(classIfSelected)
        searchMonth.classList.add(classIfSelected)

        CurrentDesk.State.searchTime = "month"
    })

    searchAllTime.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedTime.innerText = "За все время"
        searchDay.classList.remove(classIfSelected)
        searchWeek.classList.remove(classIfSelected)
        searchMonth.classList.remove(classIfSelected)
        searchAllTime.classList.add(classIfSelected)

        CurrentDesk.State.searchTime = null
    })



    // выбор порядка


    searchOrderNorm.classList.add(classIfSelected)

    searchOrderNorm.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedOrder.innerText = "Обычный порядок"
        searchOrderReverse.classList.remove(classIfSelected)
        searchOrderNorm.classList.add(classIfSelected)

        CurrentDesk.State.searchOrderDesc = 0
    })


    searchOrderReverse.addEventListener("click", evt=>{
        evt.preventDefault();
        //searchSelectedOrder.innerText = "Обратный порядок"
        searchOrderNorm.classList.remove(classIfSelected)
        searchOrderReverse.classList.add(classIfSelected)

        CurrentDesk.State.searchOrderDesc = 1
    })


}




export function setDateBtns(){

    setSelectedVars();

    // добавить что при изменении какого либо параметра запрос идет заново

}



/**
 * setSearch
 * set action for search
 * @return {void}
 */
export function setSearch() {

    console.log("set search!")

    const searchImg = document.getElementById("search_main_img");
    const searchInput = document.getElementById("search_main_input");

    searchImg.addEventListener('click', (evt) => {
        searchEvent()
    })

    searchInput.addEventListener('keypress',  (e) =>{

        if (e.key === 'Enter') {

            if (CurrentDesk.State.SearchIsActiv) {
                CurrentDesk.State.SearchIsActiv = false
            searchEvent()
            }

        }


    });


    setDateBtns();
}







/**
 * setInfoDesk
 * set some info, used for errors msg
 * @return {void}
 */
// копия из desk.js
function setInfoDesk(message) {
    const info = document.getElementById('main_page_info');
    info.innerHTML = message;
}
