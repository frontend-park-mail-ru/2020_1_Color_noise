import FetchModule from "../components/Network/Network";
import { createPageUser } from "../components/User/CreateUser";
import { setInfoContent } from "../components/Modal/modal";
import { serverLocate } from "../utils/constants";

export const createUserView = (state) => {
    FetchModule.fetchRequest({
        url:serverLocate + '/api/user/' + state.id,
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            createPageUser(result.body);
        } else {
            setInfoContent('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        setInfoContent('Ошибка отправки запроса');
    });
};