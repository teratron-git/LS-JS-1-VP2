const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

let client;
let message;
let usersOnline = [];
let usersOffline = [];
let clients = [];
let messages = [];
let amountOnline = {
    amount: 0
};

function createNewUser(data) {
    data = JSON.parse(data);
    let user;

    if (data.action == 'logInAct' || data.action == 'delAct' || data.action == 'currentUserAct' || data.action == 'messageAct') {
        let isOldUser = false;

        if (usersOffline != '') {
            for (let userItem of usersOffline) {
                if (userItem.name == data.name) {
                    user = userItem;
                    if (user.action == 'delAct') {
                        user.action = 'logInAct';
                        usersOnline.push(user);
                    }
                    if (user.action == 'currentUserAct') {
                        user.action = 'logInAct';
                    }
                    isOldUser = true;
                    break;
                } else {
                    isOldUser = false;
                }
            }
        } else {
            user = {
                name: data.name || '',
                nick: data.nick || '',
                message: data.message || '',
                avatar: data.avatar || '',
                action: data.action || ''
            };

            usersOnline.push(user);
            usersOffline.push(user);
            isOldUser = true;
        }

        if (!isOldUser) {
            user = {
                name: data.name || '',
                nick: data.nick || '',
                message: data.message || '',
                avatar: data.avatar || '',
                action: data.action || ''
            };

            usersOnline.push(user);
            usersOffline.push(user);
        }
    }

    if (data.action == 'messageAct') {
        user = {
            name: data.name || '',
            nick: data.nick || '',
            message: data.message || '',
            avatar: data.avatar || '',
            action: data.action || ''
        };
    }

    return user;
}

wss.on('connection', function connection(ws) {


    let user;
    ws.on('message', function incoming(data) {
        // data = JSON.parse(data);
        // console.log(data);
        // console.log(data.name);
        // console.log(data.nick);
        // console.log(data.message);
        // console.log(data.avatar);
        // console.log(data.action);

        // if (users == '') {
        //     user = {
        //         name: data.name || '',
        //         nick: data.nick || '',
        //         message: data.message || '',
        //         avatar: data.avatar || '',
        //         action: data.action || '',
        //         status: 'online'
        //     };
        //     console.log("ПЕРВЫЙ");
        // } else if (user.name != data.name) {
        //     user = {
        //         name: data.name || '',
        //         nick: data.nick || '',
        //         message: data.message || '',
        //         avatar: data.avatar || '',
        //         action: data.action || '',
        //         status: 'online'
        //     };
        //     console.log("НОВЫЙ");
        // } else {
        //     console.log("СТАРЫЙ");
        // }
        user = createNewUser(data);



        // if (user.action == 'logInAct') {

        //     users.push(user);
        //     // clients.push(client);
        //clients[user.name] = ws;
        //     messages[user.name] = user.message;
        //console.log("ТЕКУЩИЙ КЛИЕНТ:", clients[user.name], "\n");
        // }

        // if (user.action == 'messageAct') {
        //     messages.push(user.message);
        // }

        console.log("Все юзеры:", usersOffline, "\n");
        //console.log("Все клиенты:", clients, "\n");
        //console.log("Все сообщения:", messages, "\n");



        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {


                if (user.action == 'logInAct') {
                    amountOnline.amount = usersOnline.length;
                    let usersParsed = JSON.stringify(amountOnline);
                    client.send(usersParsed);

                    if (usersOnline != '') {
                        if (client == ws) {
                            user.action = 'currentUserAct';
                            let usersParsed = JSON.stringify(user);
                            client.send(usersParsed);
                            user.action = 'logInAct';

                            usersParsed = JSON.stringify(usersOnline);
                            client.send(usersParsed);
                        } else {
                            let usersParsed = JSON.stringify(user);
                            client.send(usersParsed);
                        }
                    } else {
                        let usersParsed = JSON.stringify(user);
                        client.send(usersParsed);
                    }
                }

                if (user.action == 'messageAct') {

                    //user.action = 'currentAct';
                    console.log("currentName:", user.name, "\n");
                    console.log("currentAct:", user.action, "\n");
                    let usersParsed = JSON.stringify(user);
                    client.send(usersParsed);

                }


                // usersOnline.forEach((item)=>{
                //     if (user.name==item.name) {
                //         let usersParsed = JSON.stringify(user);
                //         client.send(usersParsed);
                //     }
                // })



                // console.log('======');
                // console.log("Все юзеры:", users);
                // console.log('======');

                // console.log('======');
                // console.log("Все сообщения:", messages);
                // console.log('======');

                // if (user.action == 'logInAct' && user.status == 'online') {
                //     let usersParsed = JSON.stringify(users);
                //     client.send(usersParsed);

                //     // user = JSON.stringify(user);
                //     // client.send(user);
                //     // console.log('logInAct', user);

                // } else {
                //     // user = JSON.stringify(user);
                //     // //client.send(`${user.name} (${user.nick}): ${user.message}, ${user.avatar}, ${user.action}`);
                //     // client.send(user);
                //     // console.log('elseAct', user);
                // }



            }
        });
    });

    ws.on('close', function close(e) {

        //console.log('Сеанс закрыт', ws);
        //console.log("Все юзеры:", users, "\n");
        console.log("Все сообщения:", messages, "\n");
        //console.log("Все клиенты ДО:", clients, "\n");
        //user = JSON.parse(user);

        // for (let userItem of users) {
        //     if (user.name == userItem.name)
        //         userItem.status = 'offline';
        // }

        //console.log("Все юзеры ОФФ:", users, "\n");
        //console.log("Один юзер:", user, "\n");
        //console.log("ТЕКУЩИЙ СТУТУС:", users[user.status], "\n");
        //console.log("ТЕКУЩИЙ КЛИЕНТ:", clients[user.name], "\n");
        //delete clients[user.name];
        //delete usersOnline[user.name];
        //console.log("Все клиенты ПОСЛЕ удаления:", clients, "\n");
        console.log("Один юзер:", user, "\n");


        wss.clients.forEach(function each(client) {

            user.action = 'delAct';
            let usersParsed = JSON.stringify(user);
            client.send(usersParsed);

            usersOnline.forEach((item, i) => {
                if (item.name == user.name) {
                    console.log("i:", i, "\n");
                    console.log("юзеры ДО:", usersOnline, "\n");
                    let deleted = usersOnline.splice(i, 1);
                    console.log("юзеры ПОСЛЕ:", usersOnline, "\n");
                    console.log("УДАЛИЛИ:", deleted, "\n");
                    //break;
                }
            });
            amountOnline.amount = usersOnline.length;
            usersParsed = JSON.stringify(amountOnline);
            client.send(usersParsed);
        });
        //console.log("wss.clients:", wss.clients, "\n");

        if (wss.clients.size == 0) {
            user.action = 'delAct';

            let deleted = usersOnline.splice(0, 1);
            console.log("юзеры ПОСЛЕ:", usersOnline, "\n");
            console.log("УДАЛИЛИ:", deleted, "\n");

        }

        console.log("Кто онлайн:", usersOnline, "\n");
        console.log("Полный список юзеров:", usersOffline, "\n");

    });

    console.log("---------------------------------", "\n");
    //console.log('Коннекшн', ws);
});