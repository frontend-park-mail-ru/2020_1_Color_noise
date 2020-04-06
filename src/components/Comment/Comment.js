import {FetchModule} from "../Network/Network.js";
import {serverLocate} from "../../utils/constants.js";
import CommentTemplate from "./comment.pug";

import '../Comment/comment.css'

import {default as CurrentComments} from './CurrentComments.js';



/*
 Можно отобразить фальшивые комментарии для проверки работоспособности
 до завершения работ по API Go сервера

const fakeComments = [{id:1, pin_id:1, user_id:666, comment:" nice pic, bro  nice pic, bro  nice pic," +
        " bro  nice pic, bro  nice pic, bro  nice pic, bro  nice pic, bro  nice pic, bro  nice pic, bro ", created_at:'time???'},
    {id:2, pin_id:1, user_id:3, comment:" bad bad bad  bad bad bad  bad bad bad  bad bad bad ", created_at:'time???'},
    {id:3, pin_id:1, user_id:2, comment:"some comment text... some comment text... some comment text... some" +
            " comment text... some comment text... some comment text... some comment text... some comment text... ", created_at:'time???'}];

const maxFakeRequestNumber = 1;
let fakeRequestNumber = 0;
const fakeCommentAuthorInfo = {login:"Alex Sirmais", avatar:"fakeImages/28.jpeg", about:"some alex info", subscribers:10, subscriptions:10};
 */


/**
 * showComment
 *  Показывает комментарий
 *  Для того чтобы показать комментарий надо получить аватарку и логин того, кто написал коммент
 *  Выполянется для каждого комментария
 * @param {map} comment
 * @return {void}
 */
export function showComment(comment) {

    //console.log("LOAD DATA FOR COMMENT:", comment);

    FetchModule.fetchRequest({url:serverLocate + '/api/user/'+ comment.user_id, method:'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
                return response.json();
            }
        )
        .then((responseJson) => {
            //todo replace last responseJson.body => Promise.reject(responseJson) (delete this fake output)
            return responseJson.status !== 404 ? responseJson.body : responseJson.body //Promise.reject(responseJson);
        })
        .then((commentAuthorInfo) => {

            const OnePinComments =  document.getElementById("OnePinComments");

            const oneComment = document.createElement('div');
            const AvatarClass = " avtarId" + comment.user_id;
            oneComment.innerHTML += CommentTemplate({commentText:comment.comment, commentAuthorAvatar: serverLocate +
                    '/' + commentAuthorInfo.avatar, authorLogin:commentAuthorInfo.login, userAvatarClass:AvatarClass});
            oneComment.className = "one_comment";
            OnePinComments.append(oneComment);

            // используем класс а не id тк у одного пользователя может быть много комментов
            const avatarImg = document.getElementsByClassName(AvatarClass);
            for (let i = 0; i < avatarImg.length; i++) {
                avatarImg[i].addEventListener('click', (evt) => {

                    // avatar click code
                    console.log("avatar click  user:", commentAuthorInfo.login, "   user ID:", comment.user_id)
                })
            }

        })

        .catch(function(error) {
            console.log('Что-то пошло не так с загрузкой инфой комментатора:', error);
            showErrorPinPage('Что-то пошло не так с загрузкой инфой комментатора', "addCommentMsg");
        });


}

/**
 * commentsRequest
 * Получаем комментарии пина
 * Для каждого вызываем showComment() чтобы получить необхожимую инфу
 * @return {void}
 */
// @todo remove FAKE comments and fix scroll
function commentsRequest() {

    console.log("START:", (CurrentComments.State.numberOfComments + 1));

    //if (CurrentComments.State.isGetAll)
    //   return;
    let num = (CurrentComments.State.numberOfComments + 1).toString();

    FetchModule.fetchRequest({url: serverLocate + '/api/comment/pin/' + CurrentComments.State.pinId
            + '?start=' + num +'&limit=50', method: 'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
                return response.json();
            }
        )
        .then((commentsArr) => {

            if (commentsArr.status !== 200) {
                showErrorPinPage("Сервер вернул не 200 при запросе коментов", "addCommentMsg");
                return;
            }
            commentsArr = commentsArr.body;


            // set timeout 5 sec for check new comments OR not check every 5 sec ?
            if (commentsArr.length === 0) {
                //CurrentComments.State.timeOut = 5000;
                CurrentComments.State.isGetAll = true;
            }
            CurrentComments.State.numberOfComments += commentsArr.length;
            commentsArr.forEach((item) => {
                showComment(item)
            });
            // show comments or not have comments
            const commentsTitle = document.getElementsByClassName("comments_title")[0];
            commentsTitle.innerText =  (CurrentComments.State.numberOfComments === 0) ?
                "У пина еще нет комментариев" : commentsTitle.innerText = "Комментарии"
        })

        .catch( (error) => {
            console.log('Что-то пошло не так с загрузкой комментариев:', error);
            showErrorPinPage('Что-то пошло не так с загрузкой комментариев:', "addCommentMsg");
        });
}


/**
 *  scroll
 *  call commentsRequest
 *  remove event and reSet it after 1 second for protect from many requests
 *
 * @return {void}
 */
// todo fix scroll (this case: call for every moving)
function scroll() {
    let content = document.getElementById('one_pin_comments');
    let contentHeight = content.offsetHeight;
    let yOffset       = window.pageYOffset;
    let window_height = window.innerHeight;
    let y             = yOffset + window_height;
    if(y >= contentHeight) {
        commentsRequest();
        window.removeEventListener("scroll", scroll);
        setTimeout(() => { window.addEventListener("scroll", scroll)}, CurrentComments.State.timeOut);
    }
}

/**
 *  createPinComments
 *  Запрашивает комментарии для пина
 *  Хранит текущее состояние комментариев в синглтоне CurrentComments
 *  @param {int} pinId
 *  @return {void}
 */
export function createPinComments(pinId) {

    CurrentComments.State.pinId = pinId;
    CurrentComments.State.numberOfComments = 0;
    //CurrentComments.State.isGetAll = false;
    commentsRequest();

    // todo fix comments scroll
    //let comments = document.getElementById('OnePinComments');
    //comments.addEventListener("scroll", scroll)

}

/**
 * showErrorPinPage
 *  @param {string} msg
 * @return {void}
 */
function showErrorPinPage(msg = "Что-то пошло не так с загрузкой комментариев") {
    const OnePinComments =  document.getElementById("OnePinComments");
    OnePinComments.innerText = msg;
}