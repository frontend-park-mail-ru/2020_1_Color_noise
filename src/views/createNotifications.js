import FetchModule from "../components/Network/Network.js";
import {serverLocate} from "../utils/constants.js";
import {createPageNotif} from "../components/Notif/Notif";
import {setInfoContent} from "../components/Modal/modal";

export const createNotificationsView = () => {
    FetchModule.fetchRequest({
        url:serverLocate + '/api/notifications?start=0&limit=9999',
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            createPageNotif(result.body);
        } else {
            setInfoContent('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        setInfoContent('Ошибка отправки запроса');
    });
};