const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

let user;

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(data) {
        user = {
            name: 'пустое имя',
            nick: 'пустой ник',
            message: 'пустое сообщение',
            avatar: 'пустой аватар',
            action: 'пустое действие'
        };

        data = JSON.parse(data);
        // console.log(data);
        // console.log(data.name);
        // console.log(data.nick);
        // console.log(data.message);
        // console.log(data.avatar);
        // console.log(data.action);

        user = {
            name: data.name,
            nick: data.nick,
            message: data.message,
            avatar: data.avatar,
            action: data.action
        };
        console.log('===', user, '===');


        wss.clients.forEach(function each(client) {

            if (client.readyState === WebSocket.OPEN) {
                if (user.action == 'logInAct') {
                    user = JSON.stringify(user);
                    client.send(user);
                    console.log('logInAct', data);
                } else {
                    user = JSON.stringify(user);
                    //client.send(`${user.name} (${user.nick}): ${user.message}, ${user.avatar}, ${user.action}`);
                    client.send(user);
                    console.log('elseAct', user);
                }


            }
        });
    });
});

function createUser(name) {

}