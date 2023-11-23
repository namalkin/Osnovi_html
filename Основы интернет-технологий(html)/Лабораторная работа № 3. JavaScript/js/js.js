let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let message = document.querySelector("#message");
let score = [];
let session_name = '';
let s = 2;
var restart = false;
function restarting() {
    session_name = '';
    randomNumber = Math.floor(Math.random() * 100) + 1;
    document.querySelector("#text_mess").placeholder = "Напиши сюда своё имя";
    document.querySelector('#btn').value = "Начать игру";
    message.textContent="Сначала введи своё имя";
    document.querySelector("#score").textContent = 0;
    document.querySelector("#text_mess").value="";
}

function start_game(){
    if (restart) {
        restarting();   
        restart = false;
    }
    if (document.querySelector("#text_mess").value.trim()!='') {
        if (session_name.trim()!='') {
            checkGuess(session_name);
        }else{
            session_name = document.querySelector("#text_mess").value;
            start_game();
        }   
    }
}

function checkGuess(names) {
    let userTxt = document.querySelector("#text_mess").value;
    document.querySelector('#btn').value = "Попробовать угадать";
    if (isNaN(userTxt) || userTxt < 1 || userTxt > 100) {
        message.textContent = "Пожалуйста, введите число от 1 до 100.";
        document.querySelector("#text_mess").value="";
        document.querySelector("#text_mess").placeholder="Впиши число от 1 до 100";
    } else {
        attempts++;
        document.querySelector("#score").textContent = attempts;
        if (userTxt*1 === randomNumber) {
            message.textContent = `
            ПОЗДРАВЛЯЮ с угадыванием ${randomNumber} с ${attempts} попытки!`;
            score[score.length]={
                name:names,
                what:randomNumber,
                numbs:attempts
            };
            score_table();
            attempts = 0;
            document.querySelector('#btn').value = "Начать заного";
            restart = true;
        } else if (userTxt < randomNumber) {
            message.innerHTML = '<b class="bole">БОЛЬШЕ</b>';
        } else {
            message.innerHTML = '<b class="mene">МЕНЬШЕ<b>';
        }
    }
}

function score_table() {
    tble = document.querySelector("table");
    tble.innerHTML=`
        <tr>
            <th>#</th>
            <th>Участник</th>
            <th>Загаданное число</th>
            <th>Попыток</th>
        </tr>`;
    for (let i = 0; i < score.length; i++) {
        tble.innerHTML+=`
        <tr>
            <td>${i+1}</td>
            <td>${score[i].name}</td>
            <td>${score[i].what}</td>
            <td>${score[i].numbs}</td>
        </tr>
        `;   
    }
}

score_table();