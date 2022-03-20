//////////////////////////////////////////
//音乐播放

var play = document.getElementById('play');
var pause = document.getElementById('pause');
var audio = document.getElementById("audio");//播放器


// 播放
play.onclick = function () {
    if (audio.paused) {
        var music_name = document.getElementById('music_name').value;
        document.getElementById("audio").src = './static/music/' + music_name;
        console.log("play music:" + music_name);
        var music_play
        audio.play();
    }
}

// 暂停
pause.onclick = function () {
    if (audio.played) {
        audio.pause();
    }
}
