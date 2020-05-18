import FetchModule from "../components/Network/Network";
import { setInfoContent } from "../components/Modal/modal";
import { serverLocate } from "../utils/constants";
import Router from "../utils/router";

export const createLogoutView = (state) => {
    FetchModule.fetchRequest({
        url: serverLocate + '/api/auth', method: 'delete',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            Router.go("/","Main");
            const loginPart = document.getElementById('loginPart');
            loginPart.dispatchEvent(new Event('reg'));
        } else {
            setInfoContent('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        setInfoContent('Ошибка отправки запроса');
    });
};