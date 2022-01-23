//////////////////////////////////////////
//音乐播放

var play = document.getElementById('play');
var pause = document.getElementById('pause');   
var audio = document.getElementById("audio");//播放器


// 播放
play.onclick = function(){
    if(audio.paused){
        audio.play();
    }
}

// 暂停
pause.onclick = function(){
    if(audio.played){
        audio.pause();
    }
}
