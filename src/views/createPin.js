import FetchModule from "../components/Network/Network";
import {serverLocate} from "../utils/constants";
import {createPagePin} from "../components/Pin/Pin";
import {setInfoContent} from "../components/Modal/modal";

export const createPinView = (state) => {
    FetchModule.fetchRequest({
        url:serverLocate + '/api/pin/' + state.id,
        method: 'get',
    }).then((res) => {
        return res.ok ? res : Promise.reject(res);
    }).then((response) => {
        return response.json();
    }).then((result) => {
        if (result.status === 200) {
            createPagePin(result.body);
        } else {
            setInfoContent('Ошибка обработки запроса');
        }
    }).catch(function(error) {
        setInfoContent('Ошибка отправки запроса');
    });
};