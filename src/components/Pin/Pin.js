import PinTemplate from "./pin.pug";
import FetchModule from '../Network/Network.js'
import { serverLocate } from '../../utils/constants.js'
import { default as CurrentUser } from '../../utils/userDataSingl.js';
import { validateCreateBoard, validateAddPinComment } from '../../utils/validation.js'
import { createPinComments } from '../Comment/Comment.js'
import { default as Router} from "../../utils/router.js"
import {default as CurrentComments} from "../Comment/CurrentComments.js";
import { showComment } from '../Comment/Comment'
import { unSetScroll } from "../Desk/Desk";

import linkImage1 from '../../images/share/whatsapp.svg'
import linkImage2 from '../../images/share/twitter.svg'
import linkImage3 from '../../images/share/facebook.svg'

/**
 * addPinOnBoard
 * Сохраняет пин (информация о пине в target) на доску с id = boardId
 *  @param {map} target объект, который хранит информацию о пине
 *  @param {string} boardId
 * @return {void}
 */
function addPinOnBoard(target, boardId) {
    FetchModule.fetchRequest({
        url: serverLocate + '/api/pin/saving/' + target.id, method: 'post', body: {
            board_id: Number(boardId),
        }
    })
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 201) {
                throw Error("not 200: api/pin/saving/" + target.id);
            }

            showAddPinMsg('Пин добавлен на доску', "savePinMsg");

        })

        .catch((error) => {
            console.log('Что-то пошло не так с добавлением пина на доску:', error);
            showAddPinMsg('Ошибка сохранения пина', "savePinMsg");
        });

}

/**
 * getUserBoards
 *  получает доски пользователя и добавляет их в выорочное меню
 *  вешает событие на кнопку - добавить пин к выбранной доске // @todo сделать отдельную функцию
 * @param {map} target объект, который хранит информацию о пине
 * @return {void}
 */
// @todo replace real and fake work in catch(error) section
function getUserBoards(target) {

    const chooseBoards = document.getElementById("chooseBoardsSelect");

    FetchModule.fetchRequestSendImage({url:serverLocate + '/api/board/user/' + CurrentUser.Data.id,
        method: 'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 200)
                throw Error("not 200: /api/board/user/name/" + CurrentUser.Data.id);

            jsonAns = jsonAns.body;

            // real work here
            jsonAns.forEach((item) => {
                let board = document.createElement('option');
                board.className = "boardName";
                board.innerText = item.name;
                board.id = 'boardID:' + item.id;
                chooseBoards.append(board);
            });

            const saveSelectedPinBtn = document.getElementById("saveSelectedPinBtn");
            saveSelectedPinBtn.addEventListener('click', (evt) => {
                // board id after 8 symbols 'boardID:'
                const boardId = chooseBoards.options[chooseBoards.selectedIndex].id.slice(8,
                    chooseBoards.options[chooseBoards.selectedIndex].id.length);
                addPinOnBoard(target, boardId);
            });


        })

        .catch((error) => {
            // todo add field on save form
            console.log("Ошибка получения досок пользователя:", error);

            // @todo copy to real work and delete it here
            // fake work here
            // copy this after api finished
            let jsonAns = [{name:"boardName1", id: 1}, {name:"boardName2", id: 2},
                {name:"boardName3", id: 3}, {name:"boardName4", id: 4}];


        });
}


/**
 * setCreateNewBoardRequest
 * Делает запрос на создание новой доски
 * Потом делает запрос на добавления текущего пина в созданную доску
 * @param {map} target объект, который хранит информацию о пине
 * @return {void}
 */
function setCreateNewBoardRequest(target) {

    const savePinNameBoard = document.getElementById("savePinNameBoard");
    const savePinAboutBoard = document.getElementById("savePinAboutBoard");
    const createNewBoardBtn = document.getElementById("createNewBoardBtn");

    createNewBoardBtn.addEventListener('click', (evt)=> {

        // validation name and description
        if (!validateCreateBoard(savePinNameBoard.value, savePinAboutBoard.value)) {
            showAddPinMsg("Имя доски должно быть от 5 до 64 символов", "createBoardMsg");
            return;
        }

        FetchModule.fetchRequest({url: serverLocate + '/api/board', method:'post', body:{
                name:savePinNameBoard.value,
                description:savePinAboutBoard.value,
            }})

            .then((response) => {
                return response.ok ? response : Promise.reject(response);
            })
            .then((response) => {
                    return response.json();
                }
            )
            .then((jsonAns) => {

                if (jsonAns.status !== 201)
                    throw Error("not 200: /api/board");

                const boardId = jsonAns.body.id;

                addPinOnBoard(target, boardId)

            })

            .catch( (error) => {
                showAddPinMsg("Ошибка создания доски", "createBoardMsg");
                console.log('Что-то пошло не так с созданием доски :', error);
            });

    });

}

/**
 * setSavePinBtn
 * Вызов получаения досок пользователя getUserBoards(); внутри getUserBoards() вешается действие на кнопку добавления
 * Вызов  setCreateNewBoardRequest(); внутри setCreateNewBoardRequest() вешается действие на кнопку создания
 * Вешает действие (показать форму сохранения) на кнопку "сохранить" на странице пина
 * @param {map} target объект, который хранит информацию о пине
 * @return {void}
 */
function setSavePinBtn(target) {

    getUserBoards(target);
    setCreateNewBoardRequest(target);

    const savePinBtn = document.getElementById("savePinBtn");
    savePinBtn.addEventListener('click', (evt) => {

        const darkLayer = document.createElement('div');
        darkLayer.id = 'shadow';
        document.body.appendChild(darkLayer);

        const showBlock = document.getElementById('savePinForm');
        showBlock.style.display = 'block';
        const SavePinForm = document.getElementsByClassName("save_pin_form")[0];
        SavePinForm.style.display = 'block';

        darkLayer.onclick = () => {
            darkLayer.parentNode.removeChild(darkLayer);
            showBlock.style.display = 'none';
            return false;
        };

    })
}


/**
 * showFullImage
 * функция показа всего изображения
 * @return {void}
 */
function showFullImage() {
    const darkLayer = document.createElement('div');
    darkLayer.id = 'shadow';
    document.body.appendChild(darkLayer);

    const showBlock = document.getElementById('popupWin');
    showBlock.style.display = 'block';

    darkLayer.onclick = () => {
        darkLayer.parentNode.removeChild(darkLayer);
        showBlock.style.display = 'none';
        return false;
    };

    showBlock.onclick = () => {
        darkLayer.parentNode.removeChild(darkLayer);
        showBlock.style.display = 'none';
        return false;
    };
}

/**
 * setShowFullPinImage
 * устанавливает функцию показа при нажатии на кнопку
 * @return {void}
 */
function setShowFullPinImage(PinId) {
    const image = document.getElementById(PinId);
    image.addEventListener('click', (evt) => {
        showFullImage();
    })
}


/**
 * setAddPinComment
 * запрос на добавление комментария
 * потом запрос на все комментарии (чтобы отобразить 1 новый, мы запросим все комменты еще раз)
 * @param {int} PinId
 * @return {void}
 */
function setAddPinComment(PinId) {

    const addCommentInput = document.getElementById("addCommentInput");
    const addCommentBtn = document.getElementById("addCommentBtn");

    addCommentBtn.addEventListener('click', (evt) => {

        const commentText = addCommentInput.value.trim();
        if (!validateAddPinComment(commentText)) {
            showAddPinMsg("Длина комментария от 3 до 64", "addCommentMsg");
            return;
        }

        FetchModule.fetchRequest({url:serverLocate + '/api/comment', method:'post', body: {
                pin_id: Number(PinId),
                comment: commentText,
            }})
            .then((response) => {
            return response.ok ? response : Promise.reject(response);
            })
            .then((response) => {
                return response.json();
            })
            .then((jsonAns) => {
                console.log("ADD comment ANs:", jsonAns);

                if (jsonAns.status !== 201) {
                    throw Error("status is no 201")
               }

                //createPinComments(PinId);
                // no created_at and no commentID
                const myComment = {
                    pin_id:PinId,
                    user_id: CurrentUser.Data.id,
                    comment:commentText
                };

                showComment(myComment);
                CurrentComments.State.numberOfComments += 1;
                const commentsTitle = document.getElementsByClassName("comments_title")[0];
                commentsTitle.innerText =  commentsTitle.innerText = "Комментарии";
                showAddPinMsg("Ваш комменатрий добавлен", "addCommentMsg");

            })

            .catch((error) => {
                showAddPinMsg("Ошибка добавления, авторизируйтесь", "addCommentMsg");
            });
    })
}

/**
 * createPinPage
 * создает страницу пина
 * Вызывает функции, которые вешают события
 * @param {map} target объект, который хранит информацию о пине
 * @return {void}
 */
export function createPinPage(target) {


    document.title = "Pin " + target.name;
    const pin = PinTemplate({image:  serverLocate + "/" + target.image, PinId: target.id, pinName: target.name,
    pinMeta:target.about,
        link1 : 'https://web.whatsapp.com/send?text=Взгляните на это… 👀 https://zinterest.ru/pin/' + target.id,
        link2 : 'http://twitter.com/share?text=Взгляните на это… 👀 https://zinterest.ru/pin/' + target.id,
        link3 : 'http://www.facebook.com/sharer.php?s=100&p[url]=https://zinterest.ru/pin/' + target.id,
        linkImage1 : linkImage1, linkImage2 : linkImage2, linkImage3 : linkImage3
    });
    const content = document.getElementById('content');
    content.innerHTML = pin;
    content.className = "comments_section";



    createPinComments(target.id);
    setAddPinComment(target.id);
    setShowFullPinImage(target.id);
    setSavePinBtn(target);
}

/**
 * showAddPinMsg
 * вывод сообщения
 * @param {string} msg - сообщение, которое отрисовать
 * @param {string} elementId - куда отрисовать
 * @return {void}
 */
function showAddPinMsg(msg, elementId) {
    const addCommentMsg = document.getElementById(elementId);
    addCommentMsg.innerText = msg;
}


/**
 * createPinPageFromRequest
 * далает запрос для получаения инфомрации о пине и вызывает функцию отрисовки
 * @param {string} pinId - pin id
 * @return {void}
 */
export function createPinPageFromRequest(pinId) {

    //console.log("requst data for pin;");
    unSetScroll();

    FetchModule.fetchRequest({url:serverLocate + '/api/pin/' + pinId, method:'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            console.log("createPinPageFromRequest ANS:", jsonAns);

            if (jsonAns.status === 401) {
                alert("Авторизуйтесь в профиле чтобы посмотреть пин");
                Router.go("/main", "Main");
                return;
            }

            if (jsonAns.status !== 200) {
                throw Error("status is no 200 or 401")
            }
            const target = jsonAns.body;
            target.about = target.description; // rename late
            //console.log("Получил данные для пина строю страницу")
            createPinPage(target); // нужно ли тут менять на роутер? (ради архитектуры - все через роутер)
            // если поменять на роутер получим лишнюю перерисовку и запросы при правильной работе

        })

        .catch((error) => {
            console.log("Ошибка createPinPageFromRequest():" + error.toString());
        });


}