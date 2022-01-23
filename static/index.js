


const localVideoElm = document.getElementById("local-video");
var localStream = null;
// STUN TURN 服务器配置
const iceServer = {
    "iceServers": [{
        "url": "stun:stun.l.google.com:19302"
    }, {
        "url": "turn:numb.viagenie.ca",
        "username": "webrtc@live.com",
        "credential": "muazkh"
    }]
}

function getUserMedia(constraints, onSuccess, onError) {
    let promise;
    if (navigator.mediaDevices.getUserMedia) {
        promise = navigator.mediaDevices.getUserMedia(constraints).then(onSuccess);
    }

}
function canGetUserMediaUse() {
    return !!(navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)
}
function InitCamera() {
    if (canGetUserMediaUse()) {
        getUserMedia({
            video: true,
            audio: true
        }, function (stream) {
            localStream = stream;
            localVideoElm.srcObject = localStream;
            // $(localVideoElm).width(800);
        }, function (error) {
            console.log("访问媒体失败", error.name, error.message);
        })
    } else {
        alert("浏览器不兼容");
    }
}



$('document').ready(() => {
    InitCamera();

    // if(true){
    //     getUserMedia({video:true,audio:true},(stream)=>{
    //         localVideoElm.srcObject = stream;

    //     },(error)=>{
    //         console.log("访问媒体失败，",error.name,error.message);
    //     })
    // }

});

//peerconnection
var pc = [];

function StartCall(partername, createOffer) {
    pc[partername] = new RTCPeerConnection(iceServer);
    if (localStream) {
        localStream.getTracks().forEach((track) => {
            pc[partername].addTrack(track, localStream);
        });

    } else {
        if (canGetUserMediaUse()) {
            getUserMedia({
                video: true,
                audio: true
            }, function (stream) {
                localStream = stream;
                localVideoElm.srcObject = localStream;
                // $(localVideoElm).width(800);
            }, function (error) {
                console.log("访问媒体失败", error.name, error.message);
            })
        } else {
            alert("浏览器不兼容");
        }
    }
    if (createOffer) {
        pc[partername].onnegotiationneeded = () => {
            pc[partername].createOffer().then((offer) => {
                return pc[partername].setLocalDescription(offer);
            }).then(() => {
                socket.emit('sdp', {
                    type: 'video-offer',
                    description: pc[partername].localDescription,
                    to: partername,
                    sender: socket.id
                })
            })

        }


    }
    pc[partername].onicecandidate = ({ candidate }) => {
        socket.emit('ice candidates', {
            candidate: candidate,
            to: partername,
            sender: socket.id
        })
    };
    pc[partername].ontrack = (ev) => {
        let str = ev.streams[0];
        if (document.getElementById(String(partername) + '-video')) {
            document.getElementById(String(partername) + '-video').srcObject = str;
        } else {
            let newVideo = document.createElement('video');
            newVideo.id = String(partername) + '-video';
            newVideo.autoplay = true;
            // newVideo.controls = true;
            newVideo.width = 320;
            newVideo.height = 240;
            newVideo.className = 'remote-video';
            newVideo.srcObject = str;

            document.getElementById('videos').appendChild(newVideo);
        }
    }
}
//  前端页面与服务器在相同的域名下，url可以省略相当于socket = io(window.location) = io('https:jhell.cn')
var socket = io();
socket.on("connect", () => {
    console.log('connect', socket.id);
    pc.push(socket.id);
    $("#user-id").text("本地ID：" + socket.id);
    socket.emit("new user greet", { msg: "hello world", sender: socket.id });


})
// socket.on("connect_error",(error)=>{
//     console.log('连接失败：',error);
// })
socket.on('ok we connect', (data) => {
    console.log(data);
    let li = $('<li></li>').text(data.sender).attr('user-id', data.sender);
    $("#user-list").append(li);
    let button = $('<button class="call">通话</button>');
    button.appendTo(li);
    $(button).click(function () {
        console.log($(this).parent().attr('user-id'));
        StartCall($(this).parent().attr('user-id'), true);
    })
})

socket.on("need connect", (data) => {
    console.log(data);
    let li = $('<li></li>').text(data.sender).attr('user-id', data.sender);
    $("#user-list").append(li);
    let button = $('<button class="call">通话</button>');
    button.appendTo(li);
    $(button).click(function () {
        console.log($(this).parent().attr('user-id'));
        StartCall($(this).parent().attr('user-id'), true);
    })
    socket.emit('ok we connect', { receiver: data.sender, sender: socket.id });
})

socket.on('ice candidates', (data) => {
    console.log('ice candidates', data.candidate);
    if (data.candidate) {
        var candidate = new RTCIceCandidate(data.candidate);
        pc[data.sender].addIceCandidate(candidate).catch();
    }
})

socket.on('sdp', (data) => {
    if (data.description.type == 'offer') {

        StartCall(data.sender, false);
        let desc = new RTCSessionDescription(data.description);
        pc[data.sender].setRemoteDescription(desc).then(() => {
            pc[data.sender].createAnswer().then((answer) => {
                return pc[data.sender].setLocalDescription(answer);
            }).then(() => {
                socket.emit('sdp', {
                    type: 'video-answer',
                    description: pc[data.sender].localDescription,
                    to: data.sender,
                    sender: socket.id
                })
            })
        })
    } else if (data.description.type == 'answer') {
        pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description));
    }
})

socket.on("user disconnect", (socket_id) => {
    console.log('disconnect：' + socket_id);
    $('#user-list li[user-id="' + socket_id + '"]').remove();
    $('#videos video[id="' + socket_id + '-video"]').remove();

})
$('form').submit(function (e) {
    e.preventDefault();
    let val = $('#send').val()
    socket.emit("chat message", socket.id + ':  ' + val);
    $('#send').val('');
    let li = $('<div><span></span></li>').text('local: ' + val).attr('class', "atalk");
    $('#words').append(li);
    return false;
})
socket.on("chat_message", function (msg) {
    let li = $('<div><span></span></li>').text(msg).attr('class', "btalk");
    $('#words').append(li);
})