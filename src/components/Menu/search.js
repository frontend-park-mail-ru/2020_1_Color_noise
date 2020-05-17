import searchDateDetailsTemplate from "./searchDateDetails.pug";
import {default as CurrentDesk} from "../Desk/CurrentDesk";
import {clearColumns, setScroll, unSetScroll, showPins} from "../Desk/Desk";
import FetchModule from "../Network/Network";
import {serverLocate} from "../../utils/constants";
import findUserTemplate from "../Desk/findUser.pug";
import Router from "../../utils/router";
import {addCard} from "../Card/Card";
import DeskTemplate from "../Desk/desk.pug";
import findIcon from "../../images/find.svg";




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


    // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
    const root = document.getElementById('content');
    root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});


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
                setInfoDesk("Ошибка сервера");
            } else {
                if (result.body.length === 0) {
                    if (isUserSearch) {
                        setInfoDesk("Пользователи не найдены");
                    } else {
                        setInfoDesk("Пины не найдены");
                    }
                    return;
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
                Router.go("/profile", "Profile", element)
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


export function setDateBtns(){

    // помещаем в синглтон значение checkbox и ставим действие при смене состояния
    const searchReverseCheckbox = document.getElementById("search_reverse_checkbox")
    CurrentDesk.State.searchReverseCheckbox = 0;
    console.log("CurrentDesk.State.searchReverseCheckbox:", CurrentDesk.State.searchReverseCheckbox)
    searchReverseCheckbox.addEventListener("click", evt => {

        if (CurrentDesk.State.searchReverseCheckbox === 0) {
            CurrentDesk.State.searchReverseCheckbox = 1
        } else {
            CurrentDesk.State.searchReverseCheckbox = 0
        }

        console.log("изменение состояния checkbox:", CurrentDesk.State.searchReverseCheckbox)
        let columns = document.getElementById('columns');
        if (columns !== null) {
            clearColumns()
        }
        CurrentDesk.State.numberOfPins = 0;
    })



    // если выбрали пользователя и зашли а дату то переключаем на пины(по дате только пины выводятся)
    const selectSearch = document.getElementById("select_search")
    if (selectSearch.options[selectSearch.selectedIndex].text === "Пользователь") {
        selectSearch.selectedIndex = 1;
    }


    const searchPopular = document.getElementById("search_popular")
    searchPopular.addEventListener("click", evt=>{

        console.log("searchPopular")
        // mb create desk
        unSetScroll();

        //clearColumns(); не надо - мы очищаем через отрисовку новых колонок
        // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
        const root = document.getElementById('content');
        root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});
        CurrentDesk.State.numberOfPins = 0;

        getPopularPinsOrUsers();
        setScroll(getPopularPinsOrUsers);
        getPopularPinsOrUsers();

    })


    const searchMostComments = document.getElementById("search_most_comments")
    searchMostComments.addEventListener("click", evt=>{
        console.log(" searchMostComments")
        // mb create desk
        unSetScroll();

        //clearColumns(); не надо - мы очищаем через отрисовку новых колонок
        // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
        const root = document.getElementById('content');
        root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});
        CurrentDesk.State.numberOfPins = 0;

        getMostCommentPins();
        setScroll(getMostCommentPins);
        getMostCommentPins();

    })


    const searchDay = document.getElementById("search_day")
    searchDay.addEventListener("click", evt=>{

        console.log("hot day")

        // mb create desk
        unSetScroll();

        //clearColumns(); не надо - мы очищаем через отрисовку новых колонок
        // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
        const root = document.getElementById('content');
        root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});
        CurrentDesk.State.numberOfPins = 0;

        getDayPinsOrUsers();
        setScroll(getDayPinsOrUsers);
        getDayPinsOrUsers();

    })

    const searchWeek = document.getElementById("search_week")
    searchWeek.addEventListener("click", evt=>{
        console.log("hot week")

        // mb create desk
        unSetScroll();

        //clearColumns(); не надо - мы очищаем через отрисовку новых колонок
        // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
        const root = document.getElementById('content');
        root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});
        CurrentDesk.State.numberOfPins = 0;

        getWeekPinsOrUsers();
        setScroll(getWeekPinsOrUsers);
        getWeekPinsOrUsers();
    })


    const searchMonth = document.getElementById("search_month")
    searchMonth.addEventListener("click", evt=>{
        console.log("hot month")

        // mb create desk
        unSetScroll();

        //clearColumns(); не надо - мы очищаем через отрисовку новых колонок
        // необходимо создать заголовку под пины (теперь поиск может быть вызван откуда угодно)
        const root = document.getElementById('content');
        root.innerHTML = DeskTemplate({image : serverLocate +"/"+ findIcon});
        CurrentDesk.State.numberOfPins = 0;

        getMonthPinsOrUsers();
        setScroll(getMonthPinsOrUsers);
        getMonthPinsOrUsers();

    })

}



/**
 * setSearch
 * set action for search
 * @return {void}
 */
export function setSearch() {

    setDeleteBtnsIfSearchUser();

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


    setDateBtns();
}


function setDeleteBtnsIfSearchUser() {

    console.log("delete all buttons! (user selected)")
    const selectSearch = document.getElementById("select_search")
    selectSearch.addEventListener("change", evt=>{
        if (selectSearch.options[selectSearch.selectedIndex].text === "Пользователь") {
            console.log("setDeleteBtnsIfSearchUser: тут надо скрыть функции для пинов")
            CurrentDesk.State.searchObj = "user"
            hideMostCommentsBtn();

        }

        if (selectSearch.options[selectSearch.selectedIndex].text === "Пины") {
            console.log("setDeleteBtnsIfSearchUser: тут надо назначить действия на появляющийся фильтры для пинов")
            CurrentDesk.State.searchObj = "pin"
            showMostCommentsBtn();
        }
    })
}


function hideMostCommentsBtn() {
    const searchMostComments = document.getElementById("search_most_comments")
    searchMostComments.hidden = true;

}

function showMostCommentsBtn() {
    const searchMostComments = document.getElementById("search_most_comments")
    searchMostComments.hidden = false;
}



function getPopularPinsOrUsers() {

    let reverse = "&desc=false"
    if (CurrentDesk.State.searchReverseCheckbox === 1){
        reverse = "&desc=true"
    }

    FetchModule.fetchRequest({ url: serverLocate + '/api/search?what=' + CurrentDesk.State.searchObj
            + '&most=popular' + "&start=" + ( CurrentDesk.State.numberOfPins )
            + '&limit=15' + reverse, method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("PopularPins:", result);
            if (result.body.length === 0) {
                console.log("не было получего новых популярных пинов")
                setInfoDesk("Ничего не найдено среди популярных");
                return;
            }
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_Popular", error);
            if (CurrentDesk.State.searchObj === "user") {
                setInfoDesk("Что-то пошло не так с популярными пользователями");
            } else {
                setInfoDesk("Что-то пошло не так с популярными пинами");
            }

        });
}

function getMostCommentPins() {

    let reverse = "&desc=false"
    if (CurrentDesk.State.searchReverseCheckbox === 1){
        reverse = "&desc=true"
    }

    FetchModule.fetchRequest({ url: serverLocate + '/api/search?what=pin&most=comment' + "&start=" + ( CurrentDesk.State.numberOfPins )
            + '&limit=15' + reverse, method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("MostCommentPins:", result);
            if (result.body.length === 0) {
                console.log("не было получего новых обсуждаемых пинов")
                setInfoDesk("Ничего не найдено среди обсуждаемого");
                return;
            }
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_Comment", error);
            setInfoDesk("Что-то пошло не так с самыми обсуждаемыми пинами");
        });

}




function getDayPinsOrUsers() {

    let reverse = "&desc=false"
    if (CurrentDesk.State.searchReverseCheckbox === 1){
        reverse = "&desc=true"
    }

    FetchModule.fetchRequest({ url: serverLocate + '/api/search?what=' + CurrentDesk.State.searchObj
            + '&date=day' + "&start=" + ( CurrentDesk.State.numberOfPins )
            + '&limit=15' + reverse, method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("day pins:", result);
            if (result.body.length === 0) {
                console.log("не было получего новых пинов дня")
                setInfoDesk("Ничего не найдено за день");
                return;
            }
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_day pins", error);
            if (CurrentDesk.State.searchObj === "user") {
                setInfoDesk("Что-то пошло не так с пользователями, который регистрировались за последний день");
            } else {
                setInfoDesk("Что-то пошло не так с пинами за день");
            }
        });

}

function getWeekPinsOrUsers() {

    let reverse = "&desc=false"
    if (CurrentDesk.State.searchReverseCheckbox === 1){
        reverse = "&desc=true"
    }

    FetchModule.fetchRequest({ url: serverLocate + '/api/search?what=' + CurrentDesk.State.searchObj
            + '&date=week' + "&start=" + ( CurrentDesk.State.numberOfPins )
            + '&limit=15' + reverse, method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("week pins:", result);
            if (result.body.length === 0) {
                console.log("не было получего новых пинов недели")
                setInfoDesk("Ничего не найдено за неделю");
                return;
            }
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_week pins", error);
            if (CurrentDesk.State.searchObj === "user") {
                setInfoDesk("Что-то пошло не так с пользователями, который регистрировались за последнюю неделю");
            } else {
                setInfoDesk("Что-то пошло не так с пинами за неделю");
            }
        });

}


function getMonthPinsOrUsers() {

    let reverse = "&desc=false"
    if (CurrentDesk.State.searchReverseCheckbox === 1){
        reverse = "&desc=true"
    }

    FetchModule.fetchRequest({ url: serverLocate + '/api/search?what=' + CurrentDesk.State.searchObj
            + '&date=month' + "&start=" + ( CurrentDesk.State.numberOfPins )
            + '&limit=15' + reverse, method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("month pins:", result);
            if (result.body.length === 0) {
                console.log("не было получего новых пинов месяца")
                setInfoDesk("Ничего не найдено за месяц");
                return;
            }
            showPins(result.body)
        })
        .catch(function(error) {
            console.log("ERR_month pins", error);
            if (CurrentDesk.State.searchObj === "user") {
                setInfoDesk("Что-то пошло не так с пользователями, который регистрировались за последний месяц");
            } else {
                setInfoDesk("Что-то пошло не так с пинами за месяц");
            }
        });
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
