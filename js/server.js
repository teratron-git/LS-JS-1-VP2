const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

let client;
let message;
let users = [];
let clients = [];
let messages = [];

wss.on('connection', function connection(ws) {

    let user;
    ws.on('message', function incoming(data) {
        data = JSON.parse(data);
        // console.log(data);
        // console.log(data.name);
        // console.log(data.nick);
        // console.log(data.message);
        // console.log(data.avatar);
        // console.log(data.action);

        if (users == '') {
            user = {
                name: data.name || '',
                nick: data.nick || '',
                message: data.message || '',
                avatar: data.avatar || '',
                action: data.action || '',
                status: 'online'
            };
            console.log("ПЕРВЫЙ");
        } else if (user.name != data.name) {
            user = {
                name: data.name || '',
                nick: data.nick || '',
                message: data.message || '',
                avatar: data.avatar || '',
                action: data.action || '',
                status: 'online'
            };
            console.log("НОВЫЙ");
        } else {
            console.log("СТАРЫЙ");
        }




        if (user.action == 'logInAct') {

            users.push(user);
            // clients.push(client);
            clients[user.name] = ws;
            messages[user.name] = user.message;
            //console.log("ТЕКУЩИЙ КЛИЕНТ:", clients[user.name], "\n");
        }

        if (user.action == 'messageAct') {
            messages.push(user.message);
        }

        console.log("Все юзеры:", users, "\n");
        //console.log("Все клиенты:", clients, "\n");
        console.log("Все сообщения:", messages, "\n");



        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {

                // console.log('======');
                // console.log("Все юзеры:", users);
                // console.log('======');

                // console.log('======');
                // console.log("Все сообщения:", messages);
                // console.log('======');

                if (user.action == 'logInAct' && user.status == 'online') {
                    let usersParsed = JSON.stringify(users);
                    client.send(usersParsed);

                    // user = JSON.stringify(user);
                    // client.send(user);
                    // console.log('logInAct', user);

                } else {
                    // user = JSON.stringify(user);
                    // //client.send(`${user.name} (${user.nick}): ${user.message}, ${user.avatar}, ${user.action}`);
                    // client.send(user);
                    // console.log('elseAct', user);
                }



            }
        });
    });

    ws.on('close', function close(e) {

        //console.log('Сеанс закрыт', ws);
        console.log("Все юзеры:", users, "\n");
        console.log("Все сообщения:", messages, "\n");
        //console.log("Все клиенты ДО:", clients, "\n");
        //user = JSON.parse(user);

        for (let userItem of users) {
            if (user.name == userItem.name)
                userItem.status = 'offline';
        }

        console.log("Все юзеры ОФФ:", users, "\n");
        console.log("Один юзер:", user, "\n");
        console.log("ТЕКУЩИЙ СТУТУС:", users[user.status], "\n");
        //console.log("ТЕКУЩИЙ КЛИЕНТ:", clients[user.name], "\n");
        delete clients[user.name];
        console.log("Все клиенты ПОСЛЕ удаления:", clients, "\n");

    });

    console.log("---------------------------------", "\n");
    //console.log('Коннекшн', ws);
});