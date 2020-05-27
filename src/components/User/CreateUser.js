import userPageTemplate from './user.pug';
import userIconsTemplate from './userIcons.pug';
import alienButtonsTemplate from './alienButtons.pug';

import settingsImage from "../../images/user/settingsIcon.svg";
import plusImage from "../../images/user/plusPinIcon.svg";
import logoutImage from "../../images/user/logoutIcon.svg";
import pinDefaultSmall from "../../images/pinDefaultSmall.jpg";
import CurrentUser from "../../utils/userDataSingl";
import {serverLocate} from "../../utils/constants";
import {showChooseModal} from "../Modal/modal";
import Router from "../../utils/router";
import deskItemTemplate from "./deskItem.pug";
import followBlockTemplate from "./followBlock.pug";
import FetchModule from "../Network/Network";
import {showFollowersModal, showFollowingModal, setInfoPage} from "../Modal/modal";
import backBtn from "../../images/backBtn.svg";

export const createPageUser = (userInfo) => {
    const template = userPageTemplate({
        backBtn : backBtn,
        avatarImage : serverLocate + '/' + userInfo.avatar,
        login : userInfo.login,
        pinsLink : '/pins/user/' + userInfo.id,
        userID : userInfo.id
    });

    const content = document.getElementById('content');
    content.innerHTML = template;

    addFollowBlock(userInfo.subscribers, userInfo.subscriptions, userInfo.id);

    if (userInfo.id === CurrentUser.Data.id) {
        addUserIcons();
    } else {
        FetchModule.fetchRequest({
            url:serverLocate + '/api/user/following/' + userInfo.id + "/status",
            method: 'get',
        }).then((res) => {
            return res.ok ? res : Promise.reject(res);
        }).then((response) => {
            return response.json();
        }).then((result) => {
            if (result.status === 201) {
                addAlienButtons(userInfo, result.body.is_followed);
            } else {
                //setInfoContent('Ошибка обработки запроса');
            }
        }).catch(function(error) {
            //setInfoContent('Ошибка отправки запроса');
        });
    }

    const allUserPinsLink = document.getElementById('allUserPinsLink');
    allUserPinsLink.addEventListener('click', goAllUserPins);
    getDeskItems(userInfo.id);

    const backProfileLink = document.getElementById('backProfileLink');
    backProfileLink.addEventListener('click', goBack);
};

const goBack = () => {
    window.history.back();
};

const addFollowBlock = (followers, followings, userID) => {
    const followTemplate = followBlockTemplate({
        userFollowers : 'Подписчики: ' + followers, numFollowers : followers,
        userFollowing : 'Подписки: ' + followings, numFollowings : followings,
        userID : userID
    });

    const followBlock = document.getElementById('followBlock');
    followBlock.innerHTML = followTemplate;

    if (followers > 0) {
        const followersModal = document.getElementById('followersModal');
        followersModal.addEventListener('click', showFollowersModal);
        followersModal.style.cursor = 'pointer';
    }

    if (followings > 0) {
        const followingModal = document.getElementById('followingModal');
        followingModal.addEventListener('click', showFollowingModal);
        followingModal.style.cursor = 'pointer';
    }
};

const addUserIcons = () => {
    const template = userIconsTemplate({
        settingsImage : settingsImage,
        plusImage : plusImage, logoutImage : logoutImage
    });

    const content = document.getElementById('userThirdPart');
    content.innerHTML = template;

    const settingsLink  = document.getElementById('settingsLink');
    settingsLink.addEventListener('click', goSettings);

    const addNew2Modal  = document.getElementById('addNew2Modal');
    addNew2Modal.addEventListener('click', showChooseModal);

    const logoutLink  = document.getElementById('logoutLink');
    logoutLink.addEventListener('click', goLogout);

    const deskBlock = document.getElementById('deskBlock');
    deskBlock.setAttribute('mine', "");
    deskBlock.addEventListener('newDesk', addOneDesk);

    const subsUserLink = document.getElementById('subsUserLink');
    subsUserLink.addEventListener('click', goSubs);
};

const addOneDesk = (evt) => {
    const deskBlock = document.getElementById('deskBlock');

    const template = deskItemTemplate({ deskNameText : evt.detail.nameDesk,
        deskLink : '/desk/' + evt.detail.idDesk, deskAttrId : 'desk_' + evt.detail.idDesk,
        lastPinImg : serverLocate + '/' + "images/pinDefault.jpg" });
    deskBlock.insertAdjacentHTML('beforeend', template);

    const desk = document.getElementById('desk_' + evt.detail.idDesk);
    desk.addEventListener('click', goDesk);
};

const addAlienButtons = (userInfo, isFollow) => {
    const template = alienButtonsTemplate({
        userChatsLink : '/chats/user/' + userInfo.id,
        userID : userInfo.id,
        isFollow: isFollow
    });

    const content = document.getElementById('userThirdPart');
    content.innerHTML = template;

    const userChatsLink = document.getElementById('userChatsLink');
    userChatsLink.addEventListener('click', goChatsUser);

    const followingUser = document.getElementById('followingUser');
    followingUser.addEventListener('click', followUser);

    if (isFollow === 'true') {
        followingUser.value = 'Отписаться';
    }
};

const followUser = (evt) => {
    const userID = evt.currentTarget.getAttribute('user_id');
    const btnTarget = evt.currentTarget;
    if (btnTarget.getAttribute('is_follow') === 'true') {
        FetchModule.fetchRequest({
            url:serverLocate + '/api/user/following/' + userID,
            method: 'delete',
        }).then((res) => {
            return res.ok ? res : Promise.reject(res);
        }).then((response) => {
            return response.json();
        }).then((result) => {
            if (result.status === 200) {
                btnTarget.value = 'Подписаться';
                btnTarget.setAttribute('is_follow', 'false');
                const followersModal = document.getElementById('followersModal');
                const followingModal = document.getElementById('followingModal');
                addFollowBlock(Number(followersModal.getAttribute('num')) - 1,
                    followingModal.getAttribute('num'), userID);
            } else if (result.status !== 400) {
                setInfoPage('Ошибка обработки запроса');
            }
        }).catch(function(error) {
            setInfoPage('Ошибка отправки запроса');
        });
    } else {
        FetchModule.fetchRequest({
            url:serverLocate + '/api/user/following/' + userID,
            method: 'post',
        }).then((res) => {
            return res.ok ? res : Promise.reject(res);
        }).then((response) => {
            return response.json();
        }).then((result) => {
            if (result.status === 201) {
                btnTarget.value = 'Отписаться';
                btnTarget.setAttribute('is_follow', 'true');
                const followersModal = document.getElementById('followersModal');
                const followingModal = document.getElementById('followingModal');
                addFollowBlock(Number(followersModal.getAttribute('num')) + 1,
                    followingModal.getAttribute('num'), userID);
            } else if (result.status !== 400) {
                setInfoPage('Ошибка обработки запроса');
            }
        }).catch(function(error) {
            setInfoPage('Ошибка отправки запроса');
        });
    }
    ///api/user/following/' + user_id
    //evt.currentTarget.getAttribute('user_id')
};

const goChatsUser = (evt) => {
    evt.preventDefault();
    Router.go("/chats/user/" + evt.currentTarget.getAttribute('user_id'),"Settings");
};

const goSettings = (evt) => {
    evt.preventDefault();
    Router.go("/settings","Settings");
};

const goLogout = (evt) => {
    evt.preventDefault();
    Router.go("/logout","Logout");
};

const getDeskItems = (id) => {
    FetchModule.fetchRequest({
        url:serverLocate + '/api/board/user/' + id + "?start=0&limit=9999",
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            addDeskItems(result.body);
        } else {
            //setInfoContent('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        //setInfoContent('Ошибка отправки запроса');
    });
};

const addDeskItems = (desks) => {
    if (desks.length) {
        const deskBlock = document.getElementById('deskBlock');
        deskBlock.innerHTML = '';

        desks.forEach((item) => {
            if (item.last_pin.image === undefined) {
                item.last_pin.image = pinDefaultSmall;
            } else {
                item.last_pin.image = '/' + item.last_pin.image;
            }

            const template = deskItemTemplate({ deskNameText : item.name,
                deskLink : '/desk/' + item.id, deskAttrId : 'desk_' + item.id,
                lastPinImg : serverLocate + item.last_pin.image });
            deskBlock.insertAdjacentHTML('beforeend', template);

            const desk = document.getElementById('desk_' + item.id);
            desk.addEventListener('click', goDesk);
        });
    }
};

const goDesk = (evt) => {
    evt.preventDefault();
    const deskID = evt.currentTarget.getAttribute('id').split('_', 2)[1];
    Router.go("/desk/" + deskID,"Desk", {id:"not null"}, true);
};

const goAllUserPins = (evt) => {
    evt.preventDefault();
    Router.go("/pins/user/" + evt.currentTarget.getAttribute('user_id'),"Settings");
};

const goSubs = (evt) => {
    evt.preventDefault();
    Router.go("/subs","Subscriptions");
};