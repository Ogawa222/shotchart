'use strict';

let canvas = document.getElementById("can");
let context = canvas.getContext('2d');

// 座標データのjson取得用
let record = [];

//履歴を保管する配列
const history = [];
//初期状態の保管
history.push(context.getImageData(0,0,canvas.width,canvas.height));

//Form要素を取得する
var form = document.forms.recordForm;   
//ファイルが読み込まれた時の処理
form.recordFile.addEventListener('change', function(e) {
    //ここにファイル取得処理を書く
    var result = e.target.files[0];
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
    //読み込んだファイルの中身を取得する
    reader.readAsText( result );
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {
        //JSON形式に変換する   
        record = csvToJson(reader.result, { header : 1, columnName : ['player', 'x_axis', 'y_axis','shot_mode'] });
        console.log(record);
        show(record);
    });
});

// csvをjsonに変換する（要復習）
function csvToJson(csvStr, userOptions) {
    if (typeof csvStr !== 'string') return null;
 
    var options = { header : 0, columnName : [], ignoreBlankLine : true };
 
    if (userOptions) {
        if (userOptions.header) options.header = userOptions.header;
        if (userOptions.columnName) options.columnName = userOptions.columnName;
    }
 
    var rows = csvStr.split('\n');
    var json = [], line = [], row = '', data = {};
    var i, len, j, len2;
 
    for (i = 0, len = rows.length; i < len; i++) {
        if ((i + 1) <= options.header) continue;
        if (options.ignoreBlankLine && rows[i] === '') continue;
 
        line = rows[i].split(',');
 
        if (options.columnName.length > 0) {
            data = {};
            for (j = 0, len2 = options.columnName.length; j < len2; j++) {
                if (typeof line[j] !== 'undefined') {
                    row = line[j];
                    row = row.replace(/^"(.+)?"$/, '$1');
                } else {
                    row = null;
                }
 
                data[options.columnName[j]] = row;
            }
            json.push(data);
        } else {
            json.push(line);
        }
    }
 
    return json;
};

show(record);
// 画面に座標を再表示する
function show(record){
    $.each(record, function(index, value) {
        var player = value['player'];
        var x = value['x_axis'];
        var y = value['y_axis'];
        var mode = value['shot_mode'];
        var option = $('input[name="player"]:checked').val();
        console.log(player);
        console.log(option);
        if(option === "all"){
            drawShot(player,x,y,mode);
        }else{
            if(option === player){
                drawShot(player,x,y,mode);
            }
        }
    })
}

function drawShot(player,x,y,mode){
    var circle = new Path2D();
    circle.arc(x,y,2,0,2*Math.PI);

    if(mode==="success"){
        context.fillStyle = 'rgb(0,0,255)';//塗りつぶしの色は青
    }else{
        context.fillStyle = 'rgb(255,0,0)';//塗りつぶしの色は赤
    }
    context.fill(circle);

    context.font = "15px serif";
    context.fillText(player,x,y-3);
}

var checkOption = document.getElementsByName('player');   
checkOption.forEach(function(e) {
    e.addEventListener("click", function() {
        let id;
        id = history[0];
        context.putImageData(id,0,0);
        show(record);
    });
});