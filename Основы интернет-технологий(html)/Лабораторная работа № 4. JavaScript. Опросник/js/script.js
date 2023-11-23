class LabaTest{
    constructor() {
        this.articles = [];
        this.final_answers = [[],[],[],[],[],[],[],[],[],[]];
        this.answer_page = 0;
        this.random_ans = false;
        this.random_opt = false;
        this.last_ok_div = null;
        this.header_menu();
        this.loadJSON();
    }  

    header_menu(){
        this.head_add_start = document.createElement('header');
        this.head_add_start.className = 'menu'
        this.head_add_start.innerHTML = `
        <div class="container">
        <h1>ЛАБОРАТОРНАЯ РАБОТА №4</h1>
        <p>Предмет «Биология». Тестирование по теме «Эволюция живой природы».</p>
        <div id="quiz-container"></div>
        <div class="setting">
            <input type="text" placeholder="Введите имя" name="username">
            <div class="setmenu">
                <div class="stolb">
                    <label for="quest">
                        <input type="checkbox" name="question" id="quest">
                        <span class="lab">Перемешать вопросы</span>
                    </label>
                    <label for="answ">
                        <input type="checkbox" name="answer" id="answ">
                        <span class="lab">Перемешать ответы</span>
                    </label>
                </div>
                <div class="stolb">
                        <input type="time" value="00:00" id="timeInput">
                </div>
            </div>
        </div>
        <button id="start-btn">Начать тест</button>
        `;
        document.body.appendChild(this.head_add_start);
        this.load_start();
    }

    header_start(){
        this.name_user = document.querySelector("header.menu input[type=text]");
        this.timeInput = document.getElementById("timeInput");
        if (this.name_user.value.trim() == '') this.name_user.style.border="1px red solid";
        else this.name_user.style.border="none";
        if (this.timeInput.value == '00:00') this.timeInput.style.border="1px red solid";
        else this.timeInput.style.border="none";

        if ((this.name_user.value.trim() == '') || (this.timeInput.value == '00:00')) {
            this.btnGO.textContent = "Начать тест (ДАННЫЕ НЕ ЗАПОЛНЕНЫ)";
            return;
        }
        document.querySelector("header.menu").remove();
        this.loadJSON();
        this.load_test();
        testing.startTimer();
    }

    startTimer() {
        let timeArray = this.timeInput.value.split(":");
        let h = parseInt(timeArray[0]);
        let min = parseInt(timeArray[1]);

        let sec = h * 3600 + min * 60;

        this.timerInterval = setInterval(() => {
            let h_remaining = Math.floor(sec / 3600);
            let min_remaining = Math.floor((sec % 3600) / 60);
            let sec_remaining = sec % 60;
            let h_view = h_remaining < 10 ? "0" + h_remaining : h_remaining;
            let min_view = min_remaining < 10 ? "0" + min_remaining : min_remaining;
            let sec_view = sec_remaining < 10 ? "0" + sec_remaining : sec_remaining;

            document.getElementById("timer").innerText = "[" + h_view + ":" + min_view + ":" + sec_view + "]";

            if (sec <= 0) {
                clearInterval(this.timerInterval);
                this.end_ok();
            } else sec--;
        }, 1000);
    }

    load_start(){
        document.getElementById('quest').addEventListener('change', (el) => {
            if (el.target.checked) this.random_ans = true;
            else el.random_ans = false;
        });
        document.getElementById('answ').addEventListener('change', (el) => {
            if (el.target.checked) this.random_opt = true;
            else el.random_opt = false;
        });
        this.btnGO = document.getElementById('start-btn');
        this.btnGO.addEventListener('click',() => {
                this.header_start();
        });
    }
    
    
    header_tablo_end(){
        this.head_add_end = document.createElement('header');
        this.head_add_end.className = 'tablo';
        this.head_add_end.innerHTML = `
        <div class="container">
            <table class="chessboard">
              </table>
    
             <div class="end_result">
                <div class="name_compare">Малков</div>
                <div class="bal_compare">9 баллов</div>
                <div class="like_compare">
                    <div class="plus">
                        <img src="img/check.png" width="10" alt="">
                    <span>4</span></div>
                    <div class="minus"><span>6</span>
                        <img src="img/cross.png" width="10" alt="">
                    </div>
                </div>
                <a class="start_compare" href="">в начало</a>
                </div>
                </div>
                `;
                document.body.appendChild(this.head_add_end);
                // <a class="rate_compare" href="">рейтинг</a>
        this.tablo_generate(); 
    }

    random_array_answer(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    random_array_option(array) {
        for (let i = 0; i < array.length; i++) {
            if (Array.isArray(array[i].options)) {
                array[i].options = this.random_array_answer(array[i].options);
            } else {
                array[i].options = [array[i].options]; 
            }
        }
        return array;
    }

    async loadJSON() {
        try {
            let response = await fetch('js/questions.json');
            let data = await response.json();
            for (let i = 0; i < data[0].result.test.length; i++) {
                this.articles[i] = data[0].result.test[i];
            }       

            //Перемешать ответы
            if (this.random_opt)
            this.articles = this.random_array_option(this.articles);
        
            //Перемешать вопросы
            if (this.random_ans)
                this.articles = this.random_array_answer(this.articles);

            if (this.head_add) {
                this.generate();
            }        
        } catch (error) {
            console.error('Ошибка загрузки файла .json:', error);
        }
    }
    
    load_test(){
        this.head_add = document.createElement('header');
        this.head_add.className = 'test'
        this.head_add.innerHTML = `
        <div class="container">
            <div class="end_test">завершить тест -></div>
            <div class="head_opros">
                <div class="pre_contain">
                    <span class="txt_answ"></span>
                </div>
                <div class="pre_contain">
                    <span class="txt_quest"></span>
                </div>
            </div>
            <div class="bottom_opros">
                <div class="oki"></div>
                <time id="timer">[00:00:00]</time>
            </div>
        </div>
        `;
        document.body.appendChild(this.head_add);
        this.text_q = document.querySelector("span.txt_quest");
        this.text_a = document.querySelector("span.txt_answ");
        this.generate_class = document.querySelector(".oki");
        this.end_btn = document.querySelector(".end_test");
    }

    set_answers() {
        let checked_inputs = document.querySelectorAll("input:checked");
        let checked_options = document.querySelectorAll("#userAnswer option:checked");
        let text_input = document.querySelector(".txt_input");
        let answers = [];
        checked_inputs.forEach(input => {
            answers.push(input.labels[0].innerText.trim());
        });
        if (checked_options.length > 0 && checked_options[0].textContent !== "Выберите ответ")
            answers.push(checked_options[0].textContent);
        if (text_input && text_input.value.trim() !== "")
            answers.push(text_input.value.trim());
        this.final_answers[this.answer_page] = answers;
    }

    get_answers(k) {
        let saved = this.final_answers[k];
        if (saved.length > 0) {
            saved.forEach(saved => {
                let checkboxes = document.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(checkbox => {
                    if (checkbox.labels[0].innerText.trim() === saved)
                        checkbox.checked = true;
                });
                let radios = document.querySelectorAll("input[type='radio']");
                radios.forEach(radio => {
                    if (radio.labels[0].innerText.trim() === saved)
                        radio.checked = true;
                });
                let options = document.querySelectorAll("#userAnswer option");
                options.forEach(option => {
                    if (option.textContent === saved)
                        option.selected = true;
                });
                let text_input = document.querySelector(".txt_input");
                if (text_input) text_input.value = saved;
            });
        }
    }
    
    ok_btn(k){
        this.set_answers(); // Сохраняем текущие ответы перед переходом на другую позицию.
        
        if (this.last_ok_div && this.final_answers[this.answer_page][0]!=null) {
            this.last_ok_div.style.backgroundColor = 'green';
        }
        this.answer_page = k;

        this.text_q.textContent = "";
        this.text_a.textContent = this.articles[k].question;
        if (this.articles[k].image) {
            this.text_a.innerHTML += `<img src="${this.articles[k].image}" class="answer_img" alt="">`;
        }
    
        let type_input_ans = this.articles[k].type_ans;
        let ans_txt = "";
        let a = ["a", "b", "c", "d"];  
        if (type_input_ans == "radio" || type_input_ans == "checkbox") {
            ans_txt = `<div class="input_test">`;
            for (let i = 0; i < a.length; i++) {
                ans_txt += `
                    <label for="${a[i]}">
                        <input type="${type_input_ans}" name="ohs" id="${a[i]}">
                        <span class="lab">${this.articles[k].options[i]}</span>
                    </label>`;
            }
            ans_txt += `</div>`;
        } else if (type_input_ans == "text") {
            ans_txt = `<input type="text" class="txt_input" id="userAnswer" placeholder="Напишите ответ">`;
        } else if (type_input_ans == "select") {
            ans_txt = `<select name="ohs" id="userAnswer">`;
            ans_txt += `<option selected disabled>Выберите ответ</option>`;
            for (let i = 0; i < a.length; i++) {
                ans_txt += `<option value="${a[i]}">${this.articles[k].options[i]}</option>`;
            }
            ans_txt += `</select>`;
        }
    
        this.text_q.innerHTML += ans_txt;
        this.get_answers(k);
    }
    
    generate(){
        this.generate_class.innerHTML = '';
        this.articles.forEach((texti, i) => {
            let ok_Div = document.createElement('div');
            ok_Div.className = 'ok';
            ok_Div.innerHTML = `[${i + 1}]`;
            ok_Div.addEventListener("click", () => {
                if (this.last_ok_div) this.last_ok_div.style.backgroundColor = 'red';
                ok_Div.style.backgroundColor = 'orange';
                this.ok_btn(i);
                this.last_ok_div = ok_Div;
            });
            this.generate_class.appendChild(ok_Div);
        });
        
        this.last_ok_div = document.querySelector("div.ok");
        this.last_ok_div.style.backgroundColor='orange';
        
        this.ok_btn(0);
        this.end_btn.addEventListener("click", () => this.end_ok());
    }

    end_ok(){
        this.set_answers();
        clearInterval(this.timerInterval);
        this.head_add.remove();
        this.header_tablo_end();
    }

    sraven(ar1,ar2){
        if (typeof ar2 == 'string') {
            let k = ar1[0]+"";
            if (k.toLowerCase() == ar2.toLowerCase()) return 1;
            ar2 = ar2.split();
        }
        ar1.sort();
        ar2.sort();
        if (JSON.stringify(ar1)==JSON.stringify(ar2)) return 1;
        let TOPar = ar1.length > ar2.length ? ar1 : ar2;
        let BOTar = ar1.length > ar2.length ? ar2 : ar1;
        // Перебираем элементы из маленького массива
        for (let i = 0; i < BOTar.length; i++) 
            if (TOPar.includes(BOTar[i])) return 0.5;
        return 0;
    }

    tablo_generate(){
        console.log(this.final_answers);
        this.tb = document.querySelector(".chessboard");
        this.bales = 0;
        this.bales_0 = 0;
        this.bales_1 = 0;
        let form_tb = `
        <tr>
            <td>№</td>
            <td>Вопрос</td>
            <td>Ваш ответ</td>
            <td>Верный ответ</td>
            <td>Балл</td>
        </tr>
        `;
        for (let i = 0; i < testing.articles.length; i++) {
            let resOK = this.sraven(this.final_answers[i], this.articles[i].answerTrue);
            this.bales+=resOK;
            let klas_res = '';
            if (resOK==1) {
                klas_res = "suc";
                this.bales_1++;
            }
            else {
                klas_res = "err";
                this.bales_0++;
            }
            let my_answ = "";
            if (this.final_answers[i].length!=[]) my_answ = this.final_answers[i];
            else my_answ = "ответ не дан";

            form_tb += `
            <tr class="${klas_res}">
                <td>${i+1}</td>
                <td>${this.articles[i].question}</td>
                <td>${my_answ}</td>
                <td>${this.articles[i].answerTrue}</td>
                <td>${this.sraven(this.final_answers[i], this.articles[i].answerTrue)}</td>
            </tr>
            `;
        }
        document.querySelector(".plus span").textContent=this.bales_1;
        document.querySelector(".minus span").textContent=this.bales_0;
        document.querySelector(".bal_compare").textContent=this.bales+" баллов";
        document.querySelector(".name_compare").textContent=this.name_user.value.trim();
        this.tb.innerHTML = form_tb;
    }
};

const testing = new LabaTest();
