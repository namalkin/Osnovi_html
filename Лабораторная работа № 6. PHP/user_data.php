<?php
header('Content-Type: application/json');

$type = $_SERVER['REQUEST_METHOD'];
$errors = [];
$user_online = $_GET['nickname'];

$file_json = 'json/data.json';
$ok_data = json_decode(file_get_contents($file_json), true);
$user_i = null;

foreach ($ok_data as $index => $user) {
    if ($user['nickname'] === $user_online) {
        $user_i = $index;
        break;
    }
}

if ($user_i !== null) {
    $user_obj_aplic = $ok_data[$user_i]['applications'];

    echo json_encode([
        'data' => $user_obj_aplic,
        'type' => $type,
        'status' => 200,
        'endpoint' => $_SERVER['REQUEST_URI']
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'data' => [],
        'type' => $type,
        'status' => 400,
        'errors' => ["Пользователь с никнеймом $userNickname не найден"],
        'endpoint' => $_SERVER['REQUEST_URI']
    ], JSON_UNESCAPED_UNICODE);
}
