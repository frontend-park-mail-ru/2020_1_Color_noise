import notifPageTemplate from './notif.pug';
import notifItemTemplate from './notifItem.pug';
import {setInfoPage} from "../Modal/modal";
import {serverLocate} from "../../utils/constants";
import Router from "../../utils/router";

export const createPageNotif = (notifs) => {
    const template = notifPageTemplate();

    const content = document.getElementById('content');
    content.innerHTML = template;

    addNotifItems(notifs);
};

const addNotifItems = (notifs) => {
    if (notifs.length) {
        const notifBlock = document.getElementById('notifBlock');
        notifBlock.innerHTML = '';

        notifs.forEach((item) => {
            let count = 0;
            const template = notifItemTemplate({ notifText : item.message,
                notifLink : "/user/" + item.user.id,
                notifAttrId : 'notif_' + count + '_' + item.user.id,
                avatarImage : serverLocate + '/' + item.user.avatar });
            notifBlock.insertAdjacentHTML('beforeend', template);

            const notif = document.getElementById('notif_' + count + '_' + item.user.id);
            notif.addEventListener('click', goUser);
            count++;
        });
    } else {
        setInfoPage('У Вас пока нет уведомлений');
    }
};

const goUser = (evt) => {
    evt.preventDefault();
    const userID = evt.currentTarget.getAttribute('id').split('_', 3)[2];
    Router.go("/user/" + userID,"User");
};