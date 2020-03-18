import {default as CurrentUser} from '../../utils/userDataSingl.js';
import {createMainPage} from  '../../views/createMainPage.js'
import {FetchModule} from './Network.js'
import { serverLocate } from '../../utils/constants.js'

/**
 *  Use logic FetchModule and work with promises
 *   common requests
 */
export class Requests {
    /**
     *  set userData and call createFunction after
     *
     * @param {function} createFunction - create some SPA page
     * @return {void}
     */
    static getUserProfile(createFunction = createMainPage) {
        FetchModule.fetchRequest( {url: serverLocate + '/profile', method: 'get'})
            .then((res) => res.ok ? res : Promise.reject(res))
            .then( (response) =>
                response.json(),
            )
            .then((response) => response.status === 200 ? response : Promise.reject(response) )
            .then( (result) => {
                CurrentUser.Data.id = result.body.id;
                CurrentUser.Data.login = result.body.login;
                CurrentUser.Data.email = result.body.email;
                CurrentUser.Data.about = result.body.about;
                CurrentUser.Data.avatarPath = result.body.avatar;
                // @todo add set CurrentUser.Data.token
                console.log("Network::user login from getUserProfile():",CurrentUser.Data.login); // @todo delete this debug
                if (createFunction != null)
                    createFunction();
            })
            .catch((error) => {
                console.log(error); //@todo check and show err
                createMainPage(); // @todo добавить какой-то параметр в createMainPage чтоб понимать
                // рисовать станицу для авторизованного или нет
            });
    }
}