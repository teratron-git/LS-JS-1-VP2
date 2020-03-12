function initApp() {
    let sendMessageButton = document.querySelector('.main-conversationPanel-message_button');
    var sendMessageInput = document.querySelector('.main-conversationPanel-message_input');
    let chat = document.querySelector('.main-conversationPanel-chat');
    let userPanel = document.querySelector('.main-userPanel');
    let logInBtn = document.querySelector('.popup-form__btn');
    let authWindow = document.querySelector('.overlay');
    let socket = new WebSocket('ws://localhost:8080');
    let clientData;
    let logInName = document.querySelector('#name').value;
    let logInNick = document.querySelector('#nick').value;

    function logIn() {
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
        logInName = document.querySelector('#name').value;
        logInNick = document.querySelector('#nick').value;
        if (logInName != '' && logInNick != '') {
            logIn();
            // console.log(clientData);
            // sendMessage();
            authWindow.style.display = 'none';
        }
    });


    function addMessage(message) {
        console.log('Сообщение1:', message);
        message = JSON.parse(message);
        console.log('Сообщение2:', message);


        if (Array.isArray(message)) {
            let obj;
            message.forEach((obj) => {
                createUserItem(obj);
            });
        } else {
            createUserItem(message);
        }

        function createUserItem(obj) {
            if (obj.action == 'messageAct') {
                console.log('Сообщение:', obj);

                let userItem = document.createElement('div');
                let iconItem = document.createElement('div');
                let nameItem = document.createElement('div');
                let messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                if (obj.name != clientData.name) {
                    userItem.style.textAlign = 'left';
                }
                messageItem.innerHTML = `${obj.message}  <i style="color: #aaaaaa">[${getTime()}]</i>`;


                userItem.className = 'user-item-chat';
                iconItem.className = 'icon-item-chat';
                nameItem.className = 'name-item-chat';

                nameItem.textContent = obj.name;

                userItem.appendChild(iconItem);
                userItem.appendChild(nameItem);
                userItem.appendChild(messageItem);

                chat.appendChild(userItem);
                chat.scrollTop = chat.scrollHeight;
            }

            if (obj.action == 'logInAct') {
                console.log('Юзер:', obj);
                //clientData = obj;

                let userItem = document.createElement('div');
                let iconItem = document.createElement('div');
                let nameItem = document.createElement('div');


                userItem.className = 'user-item';
                iconItem.className = 'icon-item';
                nameItem.className = 'name-item';

                nameItem.textContent = obj.name;

                userItem.appendChild(iconItem);
                userItem.appendChild(nameItem);
                userPanel.appendChild(userItem);
            }

            if (obj.action == 'currentUserAct') {
                clientData = obj;
                let currentUserPlace = document.querySelector('.currentUserPlace');
                let currentItem = document.querySelector('#name-item-cur');

                currentItem.textContent = obj.name;
                currentUserPlace.style.display = 'block';

            }

            if (obj.amount) {
                console.log('Кол-во онлайн:', obj);

                let amount = document.querySelector('.amount');
                amount.textContent = `ВСЕ ПОЛЬЗОВАТЕЛИ [${obj.amount}]:`;
            }

            if (obj.action == 'delAct') {
                console.log('Ушел оффлайн:', obj);

                let userItem = document.querySelectorAll('.user-item');
                let nameItem = document.querySelectorAll('.name-item');
                let userPanel = document.querySelector('.main-userPanel');


                for (let i = 0; i < userPanel.children.length; i++) {
                    if (userItem[i].textContent == obj.name) {
                        userPanel.removeChild(userItem[i]);
                    }
                }

            }
        }
    }


    socket.onmessage = function (e) {
        console.log("Получили с сервера", e.data);
        addMessage(e.data);
    };

    function sendMessage() {
        if (sendMessageInput.value != '') {
            clientData.message = sendMessageInput.value;
            clientData.action = 'messageAct';


            socket.send(JSON.stringify(clientData));
            console.log(JSON.stringify(clientData));
            sendMessageInput.value = '';
        } else {
            alert('Отправлять пустое сообщение плохая идея :)');
        }



    }

    sendMessageButton.addEventListener('mousedown', sendMessage);
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

function getTime() {
    let date = new Date(),
        hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours(),
        minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes(),
        currentTime = `${hours}:${minutes}`;

    return currentTime;
}

window.onload = initApp;