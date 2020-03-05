let sendMessageButton = document.querySelector('.main-conversationPanel-message_button');
var sendMessageInput = document.querySelector('.main-conversationPanel-message_input');
let chat = document.querySelector('.main-conversationPanel-chat');
let socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('message', e => {
    console.log(e.data);
    addMessage(e.data);
});

function addMessage(message) {
    console.log('Сообщение:', message);
    let messageItem = document.create('div');
    messageItem.className = 'message-item';
    messageItem.textContent = message;

    chat.appendChild(messageItem);
    chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
    socket.send(sendMessageInput.value);
    console.log(sendMessageInput.value);
    sendMessageInput.value = '';

}

socket.onopen = function () {
    alert("Соединение установлено.");
};

socket.onclose = function (event) {
    if (event.wasClean) {
        alert('Соединение закрыто чисто');
    } else {
        alert('Обрыв соединения'); // например, "убит" процесс сервера
    }
    alert('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function (event) {
    alert("Получены данные " + event.data);
};

socket.onerror = function (error) {
    alert("Ошибка " + error.message);
};
console.log(sendMessageButton, chat, sendMessageInput);
sendMessageButton.addEventListener('click', sendMessage);

console.log(document.querySelector('.main'));