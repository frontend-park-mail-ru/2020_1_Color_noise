import pinTemplate from "./pin.pug";
import commentItemTemplate from './commentItem.pug';
import shareImage from "../../images/pin/shareIcon.svg";
import sendImage from "../../images/pin/sendIcon.svg";
import {serverLocate} from "../../utils/constants";
import Router from "../../utils/router";
import FetchModule from "../Network/Network";
import CurrentUser from "../../utils/userDataSingl";
import {savePinModal, showLoginModal, showSavePinModal, showShareModal} from "../Modal/modal";
import backBtn from "../../images/backBtn.svg";

export const createPagePin = (pin) => {
    const template = pinTemplate({
        backBtn : backBtn,
        pinImage : serverLocate + '/' + pin.image,
        shareImage : shareImage,
        pinID : pin.id,
        namePin : pin.name,
        descPin : pin.description,
        avatarImage : serverLocate + '/' + pin.user.avatar,
        authorName : pin.user.login,
        authorLink : '/user/' + pin.user.id,
        userID: pin.user.id,
        sendImage : sendImage
    });

    const content = document.getElementById('content');
    content.innerHTML = template;

    FetchModule.fetchRequest({
        url:serverLocate + '/api/comment/pin/' + pin.id + '?start=0&limit=9999',
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            addCommentItems(result.body);
        } else {
            //setInfoContent('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        //setInfoContent('Ошибка отправки запроса');
    });

    const sendComment = document.getElementById('sendComment');
    sendComment.addEventListener('click', sendCommentFunc);

    const commentUser = document.getElementById('commentUser');
    commentUser.addEventListener('keypress', sendCommentFuncKey);

    const sharePinModal = document.getElementById('sharePinModal');
    sharePinModal.addEventListener('click', showShareModal);

    const saveBtnModal = document.getElementById('saveBtnModal');
    saveBtnModal.addEventListener('click', savePin);

    const backProfileLink = document.getElementById('backProfileLink');
    backProfileLink.addEventListener('click', goBack);

    const authorLink = document.getElementById('authorLink');
    authorLink.addEventListener('click', goAuthor);
};

const savePin = () => {
    if (CurrentUser.Data.id === -1)  {
        showLoginModal();
    } else {
        showSavePinModal();
    }
};

const goBack = () => {
    window.history.back();
};

const goAuthor = (evt) => {
    evt.preventDefault();
    const userID = evt.currentTarget.getAttribute('user_id');
    Router.go("/user/" + userID,"User");
};

const sendCommentFuncKey = (evt) => {
    if (evt.key === 'Enter') {
        let evtFunc = {};
        evtFunc.currentTarget = document.getElementById('sendComment');
        sendCommentFunc(evtFunc);
    }
};

const sendCommentFunc = (evt) => {
    if (CurrentUser.Data.id === -1)  {
        showLoginModal();
        return;
    }
    const commentUser = document.getElementById('commentUser');

    if (commentUser.value.length > 0) {
        const pinID = evt.currentTarget.getAttribute('pin_id');
        const commentBlock = document.getElementById('commentBlock');
        const comments = document.getElementsByClassName('comment_item');
        FetchModule.fetchRequest({
            url:serverLocate + '/api/comment',
            method: 'post',
            body: {
                pin_id : Number(pinID),
                comment : commentUser.value
            }
        }).then((res) => {
            return res.ok ? res : Promise.reject(res);
        }).then((response) => {
            return response.json();
        }).then((result) => {
            if (result.status === 201) {
                let item = {};
                item.comment = commentUser.value;
                item.user = { };
                item.user.id = CurrentUser.Data.id;
                item.user.avatar = CurrentUser.Data.avatarPath;
                item.user.login =  CurrentUser.Data.login;

                commentUser.value = '';
                addComment(commentBlock, item, comments.length);
                commentBlock.scrollTo( 0, commentBlock.scrollHeight );
            } else {
                //setInfoContent('Ошибка обработки запроса');
            }
        }).catch(function(error) {
            //setInfoContent('Ошибка отправки запроса');
        });
    }
};

const addCommentItems = (comments) => {
    if (comments.length) {
        const commentBlock = document.getElementById('commentBlock');
        commentBlock.innerHTML = '';
        let count = 0;
        comments.forEach((item) => {
            addComment(commentBlock, item, count);
            count++;
        });
    }
    const commentBlock = document.getElementById('commentBlock');
    commentBlock.scrollTo(0, commentBlock.scrollHeight);
};

const addComment = (commentBlock, item, count) => {
    const template = commentItemTemplate({ commentText : item.comment,
        commentLink : "/user/" + item.user.id,
        commentAttrId : 'comment_' + count + '_' + item.user.id,
        commentAttrId2 : 'commentNick_' + count + '_' + item.user.id,
        avatarImage : serverLocate + '/' + item.user.avatar,
        authorName : item.user.login
    });
    commentBlock.insertAdjacentHTML('beforeend', template);

    const comment = document.getElementById('comment_' + count + '_' + item.user.id);
    comment.addEventListener('click', goUser);

    const comment_nick = document.getElementById('commentNick_' + count + '_' + item.user.id);
    comment_nick.addEventListener('click', goUser);
};

const goUser = (evt) => {
    evt.preventDefault();
    const userID = evt.currentTarget.getAttribute('id').split('_', 3)[2];
    Router.go("/user/" + userID,"User");
};