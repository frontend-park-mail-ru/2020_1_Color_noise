import {default as CurrentUser} from '../../utils/userDataSingl.js';
import FetchModule from './Network.js'
import {serverLocate} from '../../utils/constants.js'
import {default as Router} from "../../utils/router.js"
import {showInfoModal} from "../Modal/modal";
import {createMenu} from "../Menu/Menu"


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

                //console.log("USER REQUEST:", result)

                if (result.status === 401) {
                    //Router.go("/", "Zinterest", null, needPush);
                    createMenu(false);
                    Router.go("/", "Zinterest", null, true);

                } else {
                    setDataUser(result.body);
                    createMenu(true);
                    let url = window.location.pathname;
                    Router.go(url, "", null, needPush);
                }
            })

            .catch((error) => {
                console.log("getUserProfile ERROR:", error);
                return false;
            });
    }

}

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