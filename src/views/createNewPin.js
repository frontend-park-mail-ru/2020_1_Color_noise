import FetchModule from "../components/Network/Network";
import { createPageNewPin } from "../components/CreatePin/CreatePin";
import { setInfoContent } from "../components/Modal/modal";
import { serverLocate } from "../utils/constants";
import CurrentUser from "../utils/userDataSingl";

export const createNewPinView = (state) => {
    FetchModule.fetchRequest({
            url:serverLocate + '/api/board/user/' + CurrentUser.Data.id + "?start=0&limit=9999",
            method: 'get',
        }).then((res) => {
            return res.ok ? res : Promise.reject(res);
        }).then((response) => {
            return response.json();
        }).then((result) => {
            if (result.status === 200) {
                createPageNewPin(result.body);
            } else {
                setInfoContent('Ошибка обработки запроса');
            }
        }).catch(function(error) {
            setInfoContent('Ошибка отправки запроса');
        });
};