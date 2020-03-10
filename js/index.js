function initApp() {
    let sendMessageButton = document.querySelector('.main-conversationPanel-message_button');
    var sendMessageInput = document.querySelector('.main-conversationPanel-message_input');
    let chat = document.querySelector('.main-conversationPanel-chat');
    let userPanel = document.querySelector('.main-userPanel');
    let logInBtn = document.querySelector('.popup-form__btn');
    let authWindow = document.querySelector('.overlay');
    let socket = new WebSocket('ws://localhost:8080');
    let clientData;

    function logIn() {
        let logInName = document.querySelector('#name').value;
        let logInNick = document.querySelector('#nick').value;

        clientData = {
            name: logInName,
            nick: logInNick,
            message: '',
            avatar: '',
            action: 'logInAct'
        };
        socket.send(JSON.stringify(clientData));
        console.log('отправили на сервер залогиненного клиента', clientData);
        return clientData;
    }

    logInBtn.addEventListener('click', e => {
        console.log('Нажата');
        logIn();
        // console.log(clientData);
        // sendMessage();
        authWindow.style.display = 'none';

    });

    function addMessage(message) {
        message = JSON.parse(message);
        if (message.action == 'messageAct') {
            console.log('Сообщение:', message);


            let messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.textContent = `${message.name} (${message.nick}): ${message.message}, ${message.avatar}, ${message.action}`;

            chat.appendChild(messageItem);
            chat.scrollTop = chat.scrollHeight;
        }

        if (message.action == 'logInAct') {
            console.log('Юзер:', message);
            clientData = message;

            let userItem = document.createElement('div');
            let iconItem = document.createElement('div');
            let nameItem = document.createElement('div');


            userItem.className = 'user-item';
            iconItem.className = 'icon-item';
            nameItem.className = 'name-item';

            nameItem.textContent = message.name;

            userItem.appendChild(iconItem);
            userItem.appendChild(nameItem);
            userPanel.appendChild(userItem);
        }

    }


    socket.onmessage = function (e) {
        console.log(e.data);
        addMessage(e.data);
    };

    function sendMessage() {

        clientData.message = sendMessageInput.value;
        clientData.action = 'messageAct';


        socket.send(JSON.stringify(clientData));
        console.log(JSON.stringify(clientData));
        sendMessageInput.value = '';


    }

    sendMessageButton.addEventListener('click', sendMessage);
    sendMessageInput.addEventListener('change', sendMessage);




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