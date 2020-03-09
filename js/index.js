function initApp() {
    let sendMessageButton = document.querySelector('.main-conversationPanel-message_button');
    var sendMessageInput = document.querySelector('.main-conversationPanel-message_input');
    let chat = document.querySelector('.main-conversationPanel-chat');
    let logInBtn = document.querySelector('.popup-form__btn');
    let authWindow = document.querySelector('.overlay');
    let socket = new WebSocket('ws://localhost:8080');
    let clientData;

    function logIn() {
        let logInName = document.querySelector('#name').value;
        let logInNick = document.querySelector('#nick').value;

        let client = {
            name: logInName,
            nick: logInNick
        };
        return client;
    }

    logInBtn.addEventListener('click', e => {
        console.log('Нажата');
        clientData = logIn();
        console.log(clientData);
        authWindow.style.display = 'none';

    });

    function addMessage(message) {
        console.log('Сообщение:', message);
        let messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.textContent = message;

        chat.appendChild(messageItem);
        chat.scrollTop = chat.scrollHeight;
    }

    socket.addEventListener('message', e => {
        console.log(e.data);
        addMessage(e.data);
    });

    function sendMessage() {
        clientData.message = sendMessageInput.value;

        socket.send(JSON.stringify(clientData));
        console.log(JSON.stringify(clientData));
        sendMessageInput.value = '';
    }

    sendMessageButton.addEventListener('click', sendMessage);



    socket.onopen = function () {
        //alert("Соединение установлено.");
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            alert('Соединение закрыто чисто');
        } else {
            alert('Обрыв соединения'); // например, "убит" процесс сервера
        }
        alert('Код: ' + event.code + ' причина: ' + event.reason);
    };

    // socket.onmessage = function (event) {
    //     alert("Получены данные " + event.data);
    // };

    socket.onerror = function (error) {
        alert("Ошибка " + error.message);
    };



}


window.onload = initApp;