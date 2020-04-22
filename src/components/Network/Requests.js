import {default as CurrentUser} from '../../utils/userDataSingl.js';
import {FetchModule} from './Network.js'
import { serverLocate } from '../../utils/constants.js'
import { default as Router} from "../../utils/router.js"

/**
 *  Use logic FetchModule and work with promises
 *   common requests
 */
export class Requests {
    /**
     *  set userData and call createFunction after
     *
     * @return {void}
     */
    static getUserProfile(needPush = true) {
        FetchModule.fetchRequest({url: serverLocate + '/api/user', method: 'get'})
            .then((res) => res.ok ? res : Promise.reject(res))
            .then( (response) =>
                response.json(),
            )
            .then((result) => {
                if (result.status === 401) {
                    Router.go("/main", "Main", null, needPush);
                    //Router.go("/authorizationOrRegistration", "AuthorizationOrRegistration");
                    return;
                }
                CurrentUser.Data.id = result.body.id;
                CurrentUser.Data.login = result.body.login;
                CurrentUser.Data.email = result.body.email;
                CurrentUser.Data.about = result.body.about;
                CurrentUser.Data.avatarPath = result.body.avatar;
                CurrentUser.Data.subscribers = result.body.subscribers;
                CurrentUser.Data.subscriptions = result.body.subscriptions;
                CurrentUser.Data.token = document.cookie["csrf_token"];

                console.log("MY CurrentUser.Data.token:", CurrentUser.Data.token);
                let url = window.location.pathname;

                // чтоб перенаправляло после регистрации
                // (CurrentUser.Data.login !== "null") -> чтобы неаторизованных оставляло на регистрации или авторизации
                if (CurrentUser.Data.login !== "null"  && (url === "/registration" || url === "/authorization") ) {
                    url = "/main";
                }

                Router.go(url, "", null, needPush);
            })
            .catch((error) => {
                console.log("getUserProfile ERROR:", error);
            });
    }
}