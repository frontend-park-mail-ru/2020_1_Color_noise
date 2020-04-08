import ChatsTemplate from "../components/Profile/chats.pug";


export function CreateChatView() {
    document.title = "Chats";
    const chats = ChatsTemplate();
    const content = document.getElementById('content');
    content.innerHTML = chats;
}