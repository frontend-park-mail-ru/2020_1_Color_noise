import {default as CurrentUser} from '../../utils/userDataSingl.js';
import FetchModule from './Network.js'
import {serverLocate} from '../../utils/constants.js'
import {default as Router} from "../../utils/router.js"


/**
 *  Use logic FetchModule and work with promises
 *   common requests
 */
export class Requests {
    /**
     *  set userData and call createFunction after
     * @return {boolean}
     */
    static getUserProfile(needPush = true) {
        return FetchModule.fetchRequest({url: serverLocate + '/api/user', method: 'get'})
            .then((res) => res.ok ? res : Promise.reject(res))
            .then( (response) =>
                response.json(),
            )
            .then((result) => {
                if (result.status === 401) {
                    Router.go( window.location.pathname, document.title, null, needPush);
                    //Router.go("/", "Zinterest", null, true);
                    return false;
                } else {
                    setDataUser(result.body);
                    Router.go(window.location.pathname, document.title, null, needPush);
                    return true;
                }
            })
            .catch((error) => {
                console.log("getUserProfile ERROR:", error);
                return false;
            });
    }
};

export const setDataUser = (user) => {
    CurrentUser.Data.id = user.id;
    CurrentUser.Data.login = user.login;
    CurrentUser.Data.email = user.email;
    CurrentUser.Data.about = user.about;
    CurrentUser.Data.avatarPath = user.avatar;
    CurrentUser.Data.subscribers = user.subscribers;
    CurrentUser.Data.subscriptions = user.subscriptions;
    CurrentUser.Data.token = document.cookie["csrf_token"];
    console.log("MY CurrentUser.Data.token:", CurrentUser.Data.token);
};