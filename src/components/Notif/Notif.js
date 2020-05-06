import notifPageTemplate from './notif.pug';
import notifItemTemplate from './notifItem.pug';
import {setInfoPage} from "../Modal/modal";
import {serverLocate} from "../../utils/constants";

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
            const template = notifItemTemplate({ notifText : item.message,
                notifLink : "/user/" + item.user.id, avatarImage : serverLocate + '/' + item.user.avatar });
            notifBlock.insertAdjacentHTML('beforeend', template);
        });
    } else {
        setInfoPage('У Вас пока нет уведомлений');
    }
};