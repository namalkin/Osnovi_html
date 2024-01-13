<?php

header('Content-Type: application/json');

$jsonData = $_POST['jsonData'];
$type = $_SERVER['REQUEST_METHOD'];
$errors = [];
$data = json_decode($jsonData, true);

$obj_input = ['name', 'nickname', 'password', 'email', 'country', 'age'];
foreach ($obj_input as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        $errors[$field] = "не заполнено!";
    }
}

if (strlen($data['password']) < 6) {
    $errors['password'] = "Минимум 6 символов!";
}

if (!is_numeric($data['age']) || $data['age'] <= 0 || $data['age'] >= 100) {
    $errors['age'] = "Введите корректный возраст";
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = "Введите корректный email";
}

$file_json = 'json/data.json';

$ok_data = json_decode(file_get_contents($file_json), true);
foreach ($ok_data as $user_nick) {
    if ($user_nick['nickname'] === $data['nickname']) {
        $errors['nickname'] = "nickname существует";
    }
    if ($user_nick['email'] === $data['email']) {
        $errors['email'] = "email существует";
    }
}

if (!empty($errors)) {
    echo json_encode([
        'data' => [],
        'type' => $type,
        'status' => 400,
        'errors' => $errors,
        'endpoint' => $_SERVER['REQUEST_URI']
    ], JSON_UNESCAPED_UNICODE);
} else {

    $new_data = [
        'name' => $data['name'],
        'nickname' => $data['nickname'],
        'password' => $data['password'],
        'email' => $data['email'],
        'country' => $data['country'],
        'age' => $data['age'],
        'genres' => [],
        "applications" => []
    ];

    $genresik = [
        "drama" => "Драма",
        "comedy" => "Комедия",
        "thriller" => "Триллер",
        "adventure" => "Приключения",
        "fantasy" => "Фэнтези",
        "romance" => "Романтика",
        "documentary" => "Документальный",
        "horror" => "Ужасы",
        "detective" => "Детектив",
        "melodrama" => "Мелодрама"
    ];

    foreach ($genresik as $genreKey => $genreName) {
        if (isset($data[$genreKey]) && $data[$genreKey] === "on") {
            $new_data['genres'][] = $genreName;
        }
    }

    if (isset($data['otherGenre']) && !empty($data['otherGenre'])) {
        $new_data['genres'][] = $data['otherGenre'];
    }

    $ok_data[] = $new_data;

    file_put_contents($file_json, json_encode($ok_data, JSON_UNESCAPED_UNICODE));

    echo json_encode([
        'data' => $new_data,
        'type' => $type,
        'status' => 200,
        'endpoint' => $_SERVER['REQUEST_URI']
    ], JSON_UNESCAPED_UNICODE);
}
