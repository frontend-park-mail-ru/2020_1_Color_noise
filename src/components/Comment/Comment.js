import FetchModule from "../../components/Network/Network.js";
import {serverLocate} from "../../utils/constants.js";
import CommentTemplate from "./comment.pug";

import {default as CurrentComments} from './CurrentComments.js';
import {default as Router} from "../../utils/router.js"





/**
 * showComment
 *  Показывает комментарий
 *  Для того чтобы показать комментарий надо получить аватарку и логин того, кто написал коммент
 *  Выполянется для каждого комментария
 * @param {map} comment
 * @return {void}
 */
export function showComment(comment) {

    if (CurrentComments.State.commentsMap[comment.id]) {
        return
    }
    CurrentComments.State.commentsMap[comment.id] = true


    //console.log("LOAD DATA FOR COMMENT:", comment);
    const OnePinComments =  document.getElementById("OnePinComments");


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


            const oneComment = document.createElement('div');
            const AvatarClass = " avtarId" + comment.user_id;
            oneComment.innerHTML += CommentTemplate({commentText:comment.comment, commentAuthorAvatar: serverLocate +
                    '/' + commentAuthorInfo.avatar, authorLogin:commentAuthorInfo.login, userAvatarClass:AvatarClass});
            oneComment.className = "one_comment";
            OnePinComments.append(oneComment);

            // используем класс а не id тк у одного пользователя может быть много комментов
            const avatarImg = oneComment.getElementsByClassName(AvatarClass);
                avatarImg[0].addEventListener('click', (evt) => {
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
                            const User = [];
                            User.avatarPath = commentAuthorInfo.avatar;
                            User.login = commentAuthorInfo.login;
                            User.id = comment.user_id;
                            Router.go("/user/" + comment.user_id,"User");
                        })
                    // avatar click code
                    //console.log("avatar click  user:", commentAuthorInfo.login, "   user ID:", comment.user_id)
                });

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

    CurrentComments.State.commentsMap = {}

    //console.log("START:", (CurrentComments.State.numberOfComments + 1));

    //if (CurrentComments.State.isGetAll)
    //   return;
    let num = (CurrentComments.State.numberOfComments).toString();

    FetchModule.fetchRequest({url: serverLocate + '/api/comment/pin/' + CurrentComments.State.pinId
            + '?start=' + num +'&limit=100', method: 'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
                return response.json();
            }
        )
        .then((commentsArr) => {

            if (commentsArr.status === 404) {
                showErrorPinPage("Сервер вернул 404 при запросе коментов", "addCommentMsg");
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