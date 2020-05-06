import { default as CurrentUser } from '../../utils/userDataSingl.js';
import FetchModule from './Network.js'
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
                    Router.go("/", "Zinterest", null, needPush);
                    throw new Error("No auth");
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

                Router.go(url, "", null, needPush);
                return true;
            }).catch((error) => {
                console.log("getUserProfile ERROR:", error);
                return false;
            });
    }
}