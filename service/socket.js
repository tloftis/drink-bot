const socketIo = require('socket.io');

function removeRef(item, array){
    return (array || []).some((currentItem, index)=>{
        if(item === currentItem){
            array.splice(index, 1);
            return true;
        }
    });
}

class Sockets {
    constructor (server) {
        let _this = this;
        _this.io = socketIo(server);
        _this.sockets = [];

        _this.io.on('connection', function (socket) {
            socket.emit('init', 'Connected to the server!');

            socket.on('disconnect', function () {
                removeRef(socket, _this.sockets);
            });

            socket.on('message', (msg)=>{
                _this.sendAll(msg, 'message');
            });

            _this.sockets.push(socket);
        });
    }
    async initalize () {
        let _this = this;
    }
    sendAll (msg, channel){
        this.sockets.forEach(socket=>{
            socket.emit(channel, msg || {});
        });
        return true;
    }

}

module.exports = Sockets;
