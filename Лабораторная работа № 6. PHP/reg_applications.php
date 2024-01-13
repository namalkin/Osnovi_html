<?php
header('Content-Type: application/json');
$jsonData = $_POST['jsonData'];
$type = $_SERVER['REQUEST_METHOD'];
$errors = [];
$data = json_decode($jsonData, true);
$user_online = $data['nicklogin'];
$user_i = null;
$kkey = null;

$obj_apl = ['title', 'description', 'trailer', 'chatLink', 'date'];
foreach ($obj_apl as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        $errors[$field] = "не заполнено!";
    }
}

if (mb_strlen($data['title'], 'UTF-8') > 100) {
    $errors['title'] = "Символов надо меньше 100.";
}

if (!filter_var($data['chatLink'], FILTER_VALIDATE_URL)) {
    $errors['chatLink'] = "Некорректная ссылка";
}

if (!filter_var($data['trailer'], FILTER_VALIDATE_URL)) {
    $errors['trailer'] = "Некорректная ссылка";
}


$file_json = 'json/data.json';
$currentData = json_decode(file_get_contents($file_json), true);
foreach ($currentData as $index => $user) {
    if ($user['nickname'] === $user_online) {
        $user_i = $index;
        break;
    }
}

foreach ($currentData[$user_i]['applications'] as $key => $value) {
    if (
        $value['title'] === $data['title'] || $value['description'] === $data['description'] ||
        $value['trailer'] === $data['trailer'] || $value['chatLink'] === $data['chatLink'] || $value['date'] === $data['date']
    ) {
        $kkey = $value['number'];
        break;
    }
}

if (!empty($errors) || $kkey !== null) {
    echo json_encode([
        'data' => [],
        'type' => $type,
        'who' => $kkey === null ? null : "Уже оформлена под №$kkey",
        'status' => 400,
        'errors' => $errors,
        'endpoint' => $_SERVER['REQUEST_URI']
    ], JSON_UNESCAPED_UNICODE);
} else {
    $add_applic = [
        'title' => $data['title'],
        'genres' => [],
        'description' => $data['description'],
        'trailer' => $data['trailer'],
        'chatLink' => $data['chatLink'],
        'date' => $data['date']
    ];

    $genreMapping = [
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

    foreach ($genreMapping as $genreKey => $genreName) {
        if (isset($data[$genreKey]) && $data[$genreKey] === "on") {
            $add_applic['genres'][] = $genreName;
        }
    }

    if (isset($data['otherGenre']) && !empty($data['otherGenre'])) {
        $add_applic['genres'][] = $data['otherGenre'];
    }


    if ($user_i !== null) {

        $cout_num = count($currentData[$user_i]['applications']) > 0
            ? end($currentData[$user_i]['applications'])['number'] : 0;

        $add_applic['number'] = $cout_num + 1;
        $currentData[$user_i]['applications'][] = $add_applic;
        file_put_contents($file_json, json_encode($currentData, JSON_UNESCAPED_UNICODE));

        echo json_encode([
            'data' => $add_applic,
            'type' => $type,
            'status' => 200,
            'endpoint' => $_SERVER['REQUEST_URI']
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'data' => [],
            'type' => $type,
            'status' => 400,
            'errors' => ["Пользователь с никнеймом $user_online не найден"],
            'endpoint' => $_SERVER['REQUEST_URI']
        ], JSON_UNESCAPED_UNICODE);
    }
}
