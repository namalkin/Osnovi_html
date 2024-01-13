this.userLogin = {};

if (localStorage.getItem('userSession')) {
    this.userLogin = JSON.parse(localStorage.getItem('userSession'));
    fetchData("user_data", this.userLogin.nickname);
}

function add_other_check() {
    $("#otherInput").css("display", $("#other").prop("checked") ? "block" : "none");
}

function start_account() {
    this.userLogin = JSON.parse(localStorage.getItem('userSession'));
    $("#reg")[0].value = "добавить заявку";
    $("#come")[0].value = "Выход";
    $(".form_select").html(`
    <div class="form_table">
        <div class="user_info">
            <div class="circle_ava">
                <div class="text">${this.userLogin.nickname}</div>
            </div>
            <div class="plan_text">Поданные заявки</div>
            <div class="acc">мой аккаунт</div>
        </div>
    </div>
    `);
    $('.okey_table').empty();
    var tableHead = $('<thead>').append(
        $('<tr>').append(
            $('<th>', { text: '№' }),
            $('<th>', { text: 'Фильм' }),
            $('<th>', { text: 'Жанр' }),
            $('<th>', { text: 'Описание' }),
            $('<th>', { text: 'Трейлер' }),
            $('<th>', { text: 'Ссылка на чат' }),
            $('<th>', { text: 'Дата' })
        )
    );
    var tableBody = $('<tbody>');

    $.each(this.userLogin.applications, function (index, film) {
        var genresString = film.genres.join(', ');

        var row = $('<tr>').append(
            $('<td>', { text: film.number }),
            $('<td>', { text: film.title }),
            $('<td>', { text: genresString }),
            $('<td>', { text: film.description }),
            $('<td>').append($('<a>', { href: film.trailer, text: 'Смотреть трейлер' })),
            $('<td>').append($('<a>', { href: film.chatLink, text: 'Чат' })),
            $('<td>', { text: new Date(film.date).toLocaleString('ru-RU') })
        );

        tableBody.append(row);
    });

    var filmTable = $('<table>', { class: 'film_table' }).append(tableHead, tableBody);
    var tableDiv = $('<div>', { class: 'table' }).append(filmTable);
    var genresUser = this.userLogin.genres.join(', ');
    $(".okey_table").append(tableDiv);
    $(".acc").click(function (event) {
        this.userLogin = JSON.parse(localStorage.getItem('userSession'));
        var new_modal = $("<article>").html(`
        <div class="container">
            <div class="modal_okno">
                <div class="head_modal">
                    <div class="name_okno">Namalkin</div>
                    <div class="close">&times;</div>
                </div>
                <div class="modal_data">
                    <div class="modal_ob">
                        <div><p>Имя</p></div>
                        <div><p>${this.userLogin.name}</p></div>
                    </div>
                    <div class="modal_ob">
                        <div><p>Почта</p></div>
                        <div><p>${this.userLogin.email}</p></div>
                    </div>
                    <div class="modal_ob">
                        <div><p>Возраст</p></div>
                        <div><p>${this.userLogin.age}</p></div>
                    </div>
                    <div class="modal_ob">
                        <div><p>Страна</p></div>
                        <div><p>${this.userLogin.country}</p></div>
                    </div>
                    <div class="modal_ob">
                        <div><p>Любимые жанры</p></div>
                        <div><p>${genresUser}</p></div>
                    </div>

                </div>
            </div>
        </div>
        `);
        $("header").before(new_modal);
        $(".close").click(function (event) {
            $("article").remove();
        });
    });
}


$("#come").click(function (event) {
    if (localStorage.getItem('userSession')) {
        this.userLogin = {};
        localStorage.removeItem('userSession');
    }
    if ($(".form_come").hasClass("form_come")) {
        let mesg = jsonUP();
        console.log(mesg);
        send_Ajax("login_server", jsonUP(), function (response) {
            console.log(response);
            if (response.status == 400) {
                style_valid(response.errors)
            } else {
                this.userLogin = response.data;
                localStorage.setItem('userSession', JSON.stringify(response.data));
                fetchData("user_data", this.userLogin.nickname);
            }
        });
    } else {
        $(".form_select").html(`
        <div class="form_come">
            <div class="form_block">
                <label for="nick_name">@Никнейм или emal@:</label>
                <input type="text" name="nick_name" id="nick_name" placeholder="Namalkin">
                </div>
                </div>
                <div class="form_come">
            <div class="form_block">
                <label for="pass_word">Пароль:</label>
                <input type="password" name="pass_word" id="pass_word">
            </div>
        </div>`);
        $(".okey_table").html(``);
        $("#reg")[0].value = "Зарегистрироваться";
        $("#come")[0].value = "Войти";
        $("#reg").css("outline", "none");
        $("#come").css("outline", "auto");
    }
});

$("#reg").click(function (event) {
    if (localStorage.getItem('userSession')) {
        console.log("привА");
        this.userLogin = JSON.parse(localStorage.getItem('userSession'));
        var new_modal = $("<article>").html(`
        <div class="container">
            <div class="modal_okno">
                <form method="post" id="form_who" onsubmit="return false">
                <div class="head_modal">
                    <div class="name_okno">${this.userLogin.nickname}</div>
                    <div class="name_apl">Заявка</div>
                    <div class="close">&times;</div>
                </div>
                <div class="modal_data">
                    <div class="form_select">
                        <div class="input_select">
                            
                            <input type="text" id="nicklogin" name="nicklogin" disabled style="display: none;" value="${this.userLogin.nickname}">
                        
                            <div class="form_block">
                                <label for="title">Фильм:</label>
                                <input type="text" name="title" id="title" placeholder="Тачки 2">
                            </div>

                            <div class="form_block">
                                <label for="description">Описание:</label>
                                <input type="text" name="description" id="description" placeholder="Молния МакКуин и его друг Мэтр отправляются в международное путешествие — когда МакКуин получает шанс участвовать в соревнованиях для самых быстрых машин в мире, Мировом Гран-При. Этапы этих престижных гонок заведут друзей в Токио, на набережные Парижа, на побережье Италии, и на улицы туманного Лондона.">
                            </div>

                            <div class="form_block">
                                <label for="trailer">Ссылка на трейлер:</label>
                                <input type="text" name="trailer" id="trailer" placeholder="https://youtu.be/c1tziDrXXkM">
                            </div>

                            <div class="form_block">
                                <label for="chatLink">Ссылка на чат:</label>
                                <input type="text" name="chatLink" id="chatLink" placeholder="https://t.me/+KnTez22xhJwzYjEy">
                            </div>

                            <div class="form_block">
                                <label for="date">Дата просмотра</label>
                                <input type="datetime-local" name="date" id="date">
                            </div>
                        </div>

                        <div class="check_select">
                            <div class="form_block">
                                <fieldset>
                                    <legend>Выберите жанр:</legend>
                                </fieldset>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="form_block flxwrap">
                    <input type="submit" id="new_reg" value="Создать">
                </div>
            </div>
            </form>
            <div class="err_mess"></div>
        </div>
        `);
        $("header").before(new_modal);
        $(".close").click(function (event) {
            $("article").remove();
        });

        var genres = {
            "Драма": "drama",
            "Комедия": "comedy",
            "Триллер": "thriller",
            "Приключения": "adventure",
            "Фэнтези": "fantasy",
            "Романтика": "romance",
            "Документальный": "documentary",
            "Ужасы": "horror",
            "Детектив": "detective",
            "Мелодрама": "melodrama"
        };

        var genreFieldset = $("fieldset");
        $.each(genres, function (rus, eng) {
            var checkbox = $("<input>").attr({
                type: "checkbox",
                id: eng,
                name: eng
            }).addClass("genre_checkbox");
            var label = $("<label>").attr("for", eng).append(checkbox).append(rus);
            genreFieldset.append(label);
        });
        var otherCheckbox = $("<input>").attr({
            type: "checkbox",
            id: "other"
        }).change(add_other_check);
        var otherLabel = $("<label>").attr("for", "other").append(otherCheckbox).append("Другое");
        var otherInput = $("<div>").attr("id", "otherInput").css("display", "none");
        otherInput.append($("<label>").attr("for", "other_Genre").addClass("osn_label").text("Напишите другой жанр:"));
        otherInput.append($("<input>").attr({
            type: "text", id: "other_Genre", name: "other_Genre"
        }));
        $("#reg").css("outline", "auto");
        $("#come").css("outline", "none");
        genreFieldset.append(otherLabel, otherInput);
        $("#new_reg").click(function (event) {
            send_Ajax("reg_applications", jsonUP(), function (response) {
                console.log(response);
                if (response.status == 400) {
                    style_valid(response.errors);
                    if (response.who) {
                        $('.err_mess').text(response.who);
                    } else {
                        $('.err_mess').empty();
                    }
                } else {
                    console.log(response.status);
                    $("article").remove();
                    fetchData("user_data", this.userLogin.nickname);
                }
            });
        })
        return;
    }
    if ($(".input_select").hasClass("input_select")) {
        let mesg = jsonUP();
        console.log(mesg);
        send_Ajax("reg_server", jsonUP(), function (response) {
            console.log(response);
            if (response.status == 400) {
                style_valid(response.errors)
            } else {
                console.log(response.status);
                $("#come").click();
            }
        });
    } else {
        $(".form_select").html(`
        <div class="form_select">

            <div class="input_select">
                <div class="form_block">
                    <label for="name">Имя и Фамилия:</label>
                    <input type="text" name="name" id="name">
                </div>

                <div class="form_block">
                    <label for="nickname">@Никнейм:</label>
                    <input type="text" name="nickname" id="nickname" placeholder="Namalkin">
                </div>

                <div class="form_block">
                    <label for="password">Пароль:</label>
                    <input type="password" name="password" id="password">
                </div>

                <div class="form_block">
                    <label for="email">@почта:</label>
                    <input type="email" name="email" id="email" placeholder="blablabla@gmail.com">
                </div>

                <div class="form_block">
                    <label for="country">Страна проживания:</label>
                    <select name="country" id="country">
                        <option value="">Выберите страну</option>
                    </select>
                </div>

                <div class="form_block">
                    <label for="age">Возраст:</label>
                    <input type="number" name="age" id="age">
                </div>
            </div>

            <div class="check_select">
                <div class="form_block">
                    <fieldset>
                        <legend>Любимый жанр:</legend>
                    </fieldset>
                </div>
            </div>
        </div>`);
        var countries = ["Россия", "Америка", "США", "Украина", "Германия", "Беларусь", "Польша", "ОАЭ", "Австрия", "Китай", "Япония", "Корея"];

        var countrySelect = $("#country");
        $.each(countries, function (index, country) {
            countrySelect.append($("<option>").val(country).text(country));
        });

        var genres = {
            "Драма": "drama",
            "Комедия": "comedy",
            "Триллер": "thriller",
            "Приключения": "adventure",
            "Фэнтези": "fantasy",
            "Романтика": "romance",
            "Документальный": "documentary",
            "Ужасы": "horror",
            "Детектив": "detective",
            "Мелодрама": "melodrama"
        };

        var genreFieldset = $("fieldset");
        $.each(genres, function (rus, eng) {
            var checkbox = $("<input>").attr({
                type: "checkbox",
                id: eng,
                name: eng
            }).addClass("genre_checkbox");
            var label = $("<label>").attr("for", eng).append(checkbox).append(rus);
            genreFieldset.append(label);
        });
        var otherCheckbox = $("<input>").attr({ type: "checkbox", id: "other" }).change(add_other_check);
        var otherLabel = $("<label>").attr("for", "other").append(otherCheckbox).append("Другое");
        var otherInput = $("<div>").attr("id", "otherInput").css("display", "none");
        otherInput.append($("<label>").attr("for", "other_Genre").addClass("osn_label").text("Напишите другой жанр:"));
        otherInput.append($("<input>").attr({
            type: "text", id: "other_Genre", name: "other_Genre"
        }));
        $("#reg").css("outline", "auto");
        $("#come").css("outline", "none");
        genreFieldset.append(otherLabel, otherInput);
    }
});

function jsonUP() {
    let formData = {};
    let form = $('#form_who');
    let elements = form[0].elements;
    for (let i = 0; i < elements.length; i++) {
        let item = elements[i];
        if (item.name && item.value.trim() !== '') {
            if (item.type === "checkbox" && item.checked) {
                formData[item.name] = item.value;
            } else if (item.type !== "checkbox") {
                formData[item.name] = item.value;
            }
        }
    }
    let jsonData = JSON.stringify(formData);
    return jsonData;
}

function send_Ajax(url, data, callback) {
    $.ajax({
        type: "POST",
        url: "https://nanomalkin.ru/laba6/" + url + ".php",
        dataType: 'json',
        data: { jsonData: data },
        success: function (response) {
            callback(response);
        },
        error: function (error) {
            console.error("Ошибка при выполнении AJAX-запроса:", error);
        }
    });
    console.clear();
}

function style_valid(data) {
    let keys_err = Object.keys(data);
    document.querySelectorAll("span").forEach(el => {
        el.remove();
    });
    document.querySelectorAll('.err').forEach(l => {
        l.className = "";
    });
    keys_err.forEach(el => {
        if (document.querySelector(`input[id=${el}]`)) {
            document.querySelector(`input[id=${el}]`).className = "err";
        } else {
            document.querySelector(`select[id=${el}]`).className = "err";
        }
        let span_valid = document.createElement("span");
        span_valid.textContent = " " + data[el];
        document.querySelector(`label[for='${el}']`).appendChild(span_valid);
    });
}

async function fetchData(url, usernick) {
    try {
        const data = await $.ajax({
            url: "https://nanomalkin.ru/laba6/" + url + ".php?nickname=" + usernick,
            method: 'GET',
            dataType: 'json'
        });
        this.userLogin.applications = data.data;
        localStorage.setItem('userSession', JSON.stringify(this.userLogin));
        console.log(data);
        start_account();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}