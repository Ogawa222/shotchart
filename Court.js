'use strict';

let canvas = document.getElementById("can");
let context = canvas.getContext('2d');
// 増加時は1、減少時は-1
let change = 1;

//履歴を保管する配列
const history = [];
//座標データのjson
const record = [];
//初期状態の保管
history.push(context.getImageData(0,0,canvas.width,canvas.height));
//cancelボタン押下で履歴取得
$('#cancel').click(function(e){
    let id;
    if(change === 1){
        history.pop();
        id = history.pop();
        context.putImageData(id,0,0);
        record.pop();
        console.log(record);
        change = -1;
    }else if(history.length > 1){
        id = history.pop();
        context.putImageData(id,0,0);
        record.pop();
        console.log(record);
        change = -1
    }else if(history.length === 1){
        id = history[0];
        context.putImageData(id,0,0);
        record.pop();
        console.log(record);
        change = -1;
    }
})

$('#clear').click(function(e){
    while(history.length > 1){
        history.pop();
    }
    let id = history[0];
    context.putImageData(id,0,0);
})



function onClick(e){
    //var x = e.clientX - canvas.offsetLeft; スクロール時にずれる
    //var y = e.clientY - canvas.offsetTop;　スクロール時にずれる
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    drawShot(x,y,1,1);
}

function drawShot(x,y){
    var circle = new Path2D();
    circle.arc(x,y,2,0,2*Math.PI);
    var mode = $('input[name="mode"]:checked').val();

    if(mode==="success"){
        context.fillStyle = 'rgb(0,0,255)';//塗りつぶしの色は青
    }else{
        context.fillStyle = 'rgb(255,0,0)';//塗りつぶしの色は赤
    }
    context.fill(circle);

    var playerNumber = $('input[name="player"]:checked').val();
    context.font = "15px serif";
    context.fillText(playerNumber,x,y-3);

    //履歴取得
    history.push(context.getImageData(0,0,canvas.width,canvas.height));
    change = 1;
    //座標登録
    record.push({player:playerNumber,x_axis:x,y_axis:y,shot_mode:mode});
    console.log(record);
}

// イベントリスナーを補足すると。その要素内で発生したイベントを補足できる
canvas.addEventListener('click', onClick, false);

