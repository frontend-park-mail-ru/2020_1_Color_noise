import ChatsTemplate from "../components/Profile/chats.pug";
import {unSetScroll} from "../components/Desk/Desk.js";



function getSomething() {


    var socket = new WebSocket("ws://localhost:8000/echo");

    socket.onopen = function () {
        console.log("Status: Connected\n");
    };


    socket.onmessage = function (e) {
        console.log("Server: " + e.data + "\n");
    };


    function send(msg) {
        console.log("send webSocket:", msg)
        socket.send(msg);
    }


    const btn = document.getElementById("sendBtn")
    btn.addEventListener('click', (evt)=> {
        send(" msg from front")
    })

    
}


export function CreateChatView() {
    unSetScroll();
    document.title = "Chats";
    const chats = ChatsTemplate();
    const content = document.getElementById('content');
    content.innerHTML = chats;




    getSomething();





}