import PinTemplate from "./pin.pug";
import "./pin.css"
import { FetchModule  } from '../Network/Network.js'
import { serverLocate } from '../../utils/constants.js'
import {default as CurrentUser} from '../../utils/userDataSingl.js';
import { validateCreateBoard, validateAddPinComment } from '../Validation/Validation.js'
import { createPinComments } from '../Comment/Comment.js'


/**
 * addPinOnBoard
 * Сохраняет пин (информация о пине в target) на доску с id = boardId
 *  @param {map} target объект, который хранит информацию о пине
 *  @param {string} boardId
 * @return {void}
 */
function addPinOnBoard(target, boardId) {

    FetchModule.fetchRequest({
        url: serverLocate + '/api/pin', method: 'post', body: {
            name: target.name,
            description: target.about,
            board_id: boardId,
            image: target.image // send src NOT REAL IMG
            // @todo зачем отправлять изображение, если оно уже есть на сервере
            // изображение весит примерно 90% запроса
        }
    })
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 200)
                throw Error("not 200: /api/pin" + CurrentUser.Data.id);

            // можно отобразить доску куда он добавился
            // но мне кажется лучше просто вернуть пользователя к пину

        })

        .catch((error) => {
            console.log('Что-то пошло не так с добавлением пина на доску:', error);
            showAddPinMsg('Что-то пошло не так с добавлением пина на доску', "savePinMsg");
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

        })

        .catch((error) => {
            // todo add field on save form
            console.log("Ошибка получения досок пользователя:", error);

            // @todo copy to real work and delete it here
            // fake work here
            // copy this after api finished
            let jsonAns = [{name:"boardName1", id: 1}, {name:"boardName2", id: 2},
                {name:"boardName3", id: 3}, {name:"boardName4", id: 4}];

            jsonAns.forEach((item) => {
                let board = document.createElement('option');
                board.className = "boardName";
                board.innerText = item.name;
                board.id = 'boardID:' + item.id; // not use id like [1,2,3,4...] !
                chooseBoards.append(board);
            });

            const saveSelectedPinBtn = document.getElementById("saveSelectedPinBtn");
            saveSelectedPinBtn.addEventListener('click', (evt) => {
                // board id after 8 symbols 'boardID:'
                const boardId = chooseBoards.options[chooseBoards.selectedIndex].id.slice(8,
                    chooseBoards.options[chooseBoards.selectedIndex].id.length);
                addPinOnBoard(target, boardId);
            });
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

                if (jsonAns.status !== 200)
                    throw Error("not 200: /api/board");

                const boardId = jsonAns.id;

                addPinOnBoard(target, boardId)

            })

            .catch( (error) => {
                showAddPinMsg("Ошибка создания доски", "createBoardMsg");
                console.log('Что-то пошло не так с созданием доски');
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
        const SavePinForm = document.getElementsByClassName("SavePinForm")[0];
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
                pin_id: PinId,
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
                // @todo add check json.status === 200

                createPinComments(PinId);
                showAddPinMsg("Ваш комменатрий добавлен", "addCommentMsg");
            })

            .catch((error) => {
                showAddPinMsg("Ошибка добавления комментария", "addCommentMsg");
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

    const pin = PinTemplate({image:target.src, PinId: target.id, pinName: "My pin name",
    pinMeta:"some meta info (date or author or ...)"});
    const content = document.getElementById('content');
    content.innerHTML = pin;
    content.className = "commentsSection";
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