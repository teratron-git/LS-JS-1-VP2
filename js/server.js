const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8080
});
let usersOnline = [];
let usersOffline = [];
let amountOnline = {
    amount: 0
};

function createNewUser(data) {
    data = JSON.parse(data);
    let user;

    if (data.action == 'logInAct' || data.action == 'delAct' || data.action == 'currentUserAct' || data.action == 'messageAct' || data.action == 'avatarAct') {
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
                        data.avatar = user.avatar;
                    }
                    if (user.avatar != data.avatar && data.avatar != '') {
                        user.avatar = data.avatar;
                    } else {
                        data.avatar = user.avatar;
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

    if (data.action == 'avatarAct') {
        user = {
            name: data.name || '',
            avatar: data.avatar || '',
            action: 'avatarAct'
        };
    }

    return user;
}

wss.on('connection', function connection(ws) {
    let user;

    ws.on('message', function incoming(data) {
        user = createNewUser(data);
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
                    let usersParsed = JSON.stringify(user);

                    client.send(usersParsed);
                }

                if (user.action == 'avatarAct') {
                    let usersParsed = JSON.stringify(user);

                    client.send(usersParsed);
                }
            }
        });
    });

    ws.on('close', function close(e) {
        wss.clients.forEach(function each(client) {
            user.action = 'delAct';
            let usersParsed = JSON.stringify(user);

            client.send(usersParsed);
            usersOnline.forEach((item, i) => {
                if (item.name == user.name) {
                    usersOnline.splice(i, 1);
                }
            });

            usersOffline.forEach((item, i) => {
                if (item.name == user.name) {
                    item.action = user.action;
                }
            });

            amountOnline.amount = usersOnline.length;
            usersParsed = JSON.stringify(amountOnline);
            client.send(usersParsed);
        });

        if (wss.clients.size == 0) {
            if (user) {
                user.action = 'delAct';
                usersOnline.splice(0, 1);
                usersOffline.forEach((item, i) => {
                    if (item.name == user.name) {
                        item.action = user.action;
                    }
                });
            }
        }
    });
});