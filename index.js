
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
//连接sql
// var sql = require('mysql');
// var connection = sql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'login'
// });
// connection.connect();


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
app.get('/video', (req, res) => {
    res.sendFile(__dirname + '/video.html')
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
    // //sql 相关
    // socket.on("sql request",(data)=>{
    //     if (data.sql_type=='add'){
    //         sql_request = 'insert into login username='+data.username +' and password='+data.password+';';
    //         connection.query(sql_request,function(error,results, fields){
    //             if(error) throw error;

    //         });
    //     } else if (data.sql_type == 'login'){
    //         sql_request = 'select * from username = ' + data.username +' and password='+ data.password +';';
    //         connection.query()
    //     }

    // });
}))
// http.listen(3000,()=>{
//     console.log("listening on 3000");
// });
