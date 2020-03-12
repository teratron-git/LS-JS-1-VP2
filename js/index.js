let clientData;
let socket = new WebSocket('ws://localhost:8080');
let currName;

function initApp() {
    let sendMessageButton = document.querySelector('.main-conversationPanel-message_button');
    let sendMessageInput = document.querySelector('.main-conversationPanel-message_input');
    let chat = document.querySelector('.main-conversationPanel-chat');
    let userPanel = document.querySelector('.main-userPanel');
    let logInBtn = document.querySelector('.popup-form__btn');
    let authWindow = document.querySelector('.overlay');
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

        return clientData;
    }

    logInBtn.addEventListener('click', e => {
        logInName = document.querySelector('#name').value;
        logInNick = document.querySelector('#nick').value;
        if (logInName != '' && logInNick != '') {
            logIn();
            authWindow.style.display = 'none';
        } else {
            alert('Все поля должны быть заполнены!');
        }
    });

    function addMessage(message) {
        message = JSON.parse(message);
        if (Array.isArray(message)) {
            message.forEach((obj) => {
                createUserItem(obj);
            });
        } else {
            createUserItem(message);
        }

        function createUserItem(obj) {
            if (obj.action == 'messageAct') {
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
                if (obj.avatar != '') {
                    iconItem.style.backgroundImage = `url(${obj.avatar})`;
                }
            }

            if (obj.action == 'logInAct') {
                let userItem = document.createElement('div');
                let iconItem = document.createElement('div');
                let nameItem = document.createElement('div');

                userItem.className = 'user-item';
                iconItem.className = 'icon-item';
                nameItem.className = 'name-item';
                nameItem.textContent = obj.name;
                if (obj.avatar != '') {
                    iconItem.style.backgroundImage = `url(${obj.avatar})`;
                }

                userItem.appendChild(iconItem);
                userItem.appendChild(nameItem);
                userPanel.appendChild(userItem);

                let currentItemName = document.querySelector('#name-item-cur');
                let currentAvaName = document.querySelector('#currentAvaName');

                if (obj.name == currentItemName.textContent) {
                    currentAvaName.textContent = obj.name;
                }
            }

            if (obj.action == 'currentUserAct') {
                clientData = obj;
                currName = obj.name;

                let currentUserPlace = document.querySelector('.currentUserPlace');
                let currentItemName = document.querySelector('#name-item-cur');
                let currentItemIcon = document.querySelector('#icon-item-cur');

                currentItemName.textContent = obj.name;
                currentUserPlace.style.display = 'block';
                if (obj.avatar != '') {
                    currentItemIcon.style.backgroundImage = `url(${obj.avatar})`;
                }
            }

            if (obj.action == 'avatarAct') {
                let currentItemName = document.querySelector('#name-item-cur');
                let itemName = document.querySelectorAll('.name-item');
                let currentItemIcon = document.querySelector('#icon-item-cur');

                for (let i = 0; i < itemName.length; i++) {
                    if (itemName[i].textContent == obj.name) {
                        itemName[i].previousElementSibling.style.backgroundImage = `url(${obj.avatar})`;
                    }
                }
                let currentAva = document.querySelector('#currentAva');
                let currentAvaName = document.querySelector('#currentAvaName');
                if (obj.name == currentItemName.textContent) {
                    currentItemIcon.style.backgroundImage = `url(${obj.avatar})`;
                    currentAva.style.backgroundImage = `url(${obj.avatar})`;
                    currentAvaName.textContent = obj.name;
                }

                if (obj.avatar != '') {
                    let allAvatars = document.querySelectorAll('.icon-item-chat');
                    let nameItem = document.querySelectorAll('.name-item-chat');

                    if (allAvatars) {
                        for (let i = 0; i < allAvatars.length; i++) {
                            if (obj.name == nameItem[i].textContent) {
                                nameItem[i].previousElementSibling.style.backgroundImage = `url(${obj.avatar})`;
                            }
                        }
                    }
                }
            }

            if (obj.amount) {
                let amount = document.querySelector('.amount');
                amount.textContent = `ВСЕ ПОЛЬЗОВАТЕЛИ [${obj.amount}]:`;
            }

            if (obj.action == 'delAct') {
                let userItem = document.querySelectorAll('.user-item');
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
        addMessage(e.data);
    };

    function sendMessage() {
        if (sendMessageInput.value != '') {
            clientData.message = sendMessageInput.value;
            clientData.action = 'messageAct';
            socket.send(JSON.stringify(clientData));
            sendMessageInput.value = '';
        } else {
            alert('Отправлять пустое сообщение плохая идея :)');
        }
    }

    sendMessageButton.addEventListener('mousedown', sendMessage);
    sendMessageInput.addEventListener('change', sendMessage);

    socket.onclose = function (event) {
        if (event.wasClean) {
            alert('Соединение закрыто чисто');
        } else {
            alert('Обрыв соединения'); // например, "убит" процесс сервера
        }
        alert('Код: ' + event.code + ' причина: ' + event.reason);
    };

    socket.onerror = function (error) {
        alert("Ошибка " + error.message);
    };
}

encodeImageFileAsURL = function (element) {
    let avatarWindow = document.querySelector('.overlay-foto');
    let avatarResultWindow = document.querySelector('.overlay-foto-result');
    let avatarResultWindowIcon = document.querySelector('#avatar-icon');
    let avaSaveButton = document.querySelector('#ava-save');
    let file = element.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
        avatarResultWindowIcon.style.backgroundImage = `url(${reader.result})`;
        avatarWindow.style.display = 'none';
        avatarResultWindow.style.display = 'block';

        avaSaveButton.addEventListener('click', () => {
            clientData = {
                name: currName,
                avatar: reader.result,
                action: 'avatarAct'
            };

            socket.send(JSON.stringify(clientData));
            avatarResultWindow.style.display = 'none';
        });
    };
    reader.readAsDataURL(file);
};

function getTime() {
    let date = new Date(),
        hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours(),
        minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes(),
        currentTime = `${hours}:${minutes}`;

    return currentTime;
}

window.onload = initApp;