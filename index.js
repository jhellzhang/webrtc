const express = require("express");
const fs = require("fs");
var app = require("express")();
var http = require("http").createServer(app);
let sslOptions = {
    key: fs.readFileSync("./key/privkey.key"),
    cert: fs.readFileSync("./key/cacert.pem")
};
const https = require("https").createServer(sslOptions, app);
var io = require("socket.io")(https);

https.listen(3000, () => {
    console.log("listening on 3000");
});
app.use("/static", express.static("./static/"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
app.get('/music', (req, res) => {
    res.sendFile(__dirname + '/music.html');
})
app.get('/webrtc', (req, res) => {
    res.sendFile(__dirname + '/webrtc.html');
})
app.get('/photo', (req, res) => {
    res.sendFile(__dirname + '/photo.html')
})
app.get('/static', (req, res) => {
    res.readdir(__dirname + '/static');
})

io.on("connect", (socket => {
    socket.join(socket.id);
    console.log("user connected ", socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnect ", socket.id);
        socket.broadcast.emit("user disconnect", socket.id);
    });
    socket.on("chat message", (msg) => {
        console.log("message  ", msg);
        socket.broadcast.emit("chat_message", msg);
    });
    socket.on("new user greet", (data) => {
        console.log(socket.id + "  greet  " + data.msg);
        socket.broadcast.emit("need connect", { sender: socket.id, msg: data });
    });
    socket.on("ok we connect", (data) => {
        io.to(data.receiver).emit("ok we connect", { sender: data.sender })
    });
    socket.on("sdp", (data) => {
        console.log('sdp');
        console.log(data.description);
        socket.to(data.to).emit('sdp', { description: data.description, sender: data.sender });
    });
    socket.on("ice candidates", (data) => {
        console.log("ice candidates");
        console.log(data);
        socket.to(data.to).emit("ice candidates", { candidate: data.candidate, sender: data.sender });

    });
}))
// http.listen(3000,()=>{
//     console.log("listening on 3000");
// });
