import NotifTemplate from "../components/Profile/notifications.pug";
import {FetchModule} from "../components/Network/Network.js";
import {serverLocate} from "../utils/constants.js";

function createNotif(notifiArr) {
    const nitifSection =  document.getElementById("nitifSection");

    for (let i = 0; i < notifiArr.length; i++) {

        const oneNifitic = document.createElement('div');
        oneNifitic.innerText = notifiArr[i].message;
        oneNifitic.className = "one_nitif";
        nitifSection.append(oneNifitic);
    }
}

export function createNotificationsView() {
    const notif = NotifTemplate();
    const content = document.getElementById('content');
    content.innerHTML = notif;
    FetchModule.fetchRequest({url: serverLocate + '/api/notifications?start=1&limit=50', method: 'get', })
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
                return response.json();
            },
        )
        .then((result) => {

            if (result.status === 200) {

                console.log("BODY:", result.body);

                createNotif(result.body);

            } else {
                throw "bad notifi status code ";
            }
        })
        .catch(function(error) {
            console.log('bad notifi:', error.toString());
        });
}