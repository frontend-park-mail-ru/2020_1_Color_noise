import FetchModule from "../components/Network/Network";
import { createProfile } from "../components/Profile/Profile";
import { serverLocate } from "../utils/constants";
import { unSetScroll } from "../components/Desk/Desk.js";
import Router from "../utils/router";
import {createOfflinePage} from "../components/OfflinePage/OfflinePage";

export function createProfileView(state) {
    unSetScroll();
    FetchModule.fetchRequest({ url:serverLocate + '/api/user', method: 'get', body: null })
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
                return response.json();
            }
        )
        .then((result) => {
            if (result.status === 200) {
                console.log("!!!2state:", state)
                if (state == null) {
                    createProfile()
                } else {
                    createProfile(state.id, state);
                }

            }
            else {
                //createAutorization();
            }
        })
        .catch(function(error) {
            console.log("CRETE PROFILE ERR:", error.toString());

        });
}