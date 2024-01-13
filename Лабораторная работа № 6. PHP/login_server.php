<?php

header('Content-Type: application/json');

$jsonData = $_POST['jsonData'];
$data = json_decode($jsonData, true);
$type = $_SERVER['REQUEST_METHOD'];
$errors = [];

if ($type !== 'POST') {
    $errors['type'] = "Некорректный тип запроса.";
} else {
    if (!isset($data['nick_name']) || !isset($data['pass_word']))  {
        if (!isset($data['nick_name'])) {
            $errors['nick_name'] = "не ввели";
        }
        if (!isset($data['pass_word'])) {
            $errors['pass_word'] = "не корректно";
        }
    } else {
        $file_json = 'json/data.json';

        $users_data = json_decode(file_get_contents($file_json), true);

        $obj_user = null;

        foreach ($users_data as $user_data) {
            if ((strcasecmp($user_data['nickname'], $data['nick_name']) === 0 || strcasecmp($user_data['email'], $data['nick_name']) === 0) && $user_data['password'] === $data['pass_word']) {
                $obj_user = [
                    'name' => $user_data['name'],
                    'nickname' => $user_data['nickname'],
                    'email' => $user_data['email'],
                    'country' => $user_data['country'],
                    'age' => $user_data['age'],
                    'genres' => $user_data['genres'],
                    'applications' => $user_data['applications'],
                ];
                break;
            }
        }

        if ($obj_user) {
            echo json_encode([
                'data' => $obj_user,
                'type' => $type,
                'status' => 200,
                'message' => 'Успешный вход',
                'endpoint' => $_SERVER['REQUEST_URI']
            ], JSON_UNESCAPED_UNICODE);
        } else {
            $errors['nick_name'] = "нет пользователя";
            $errors['pass_word'] = "не верный пароль";
        }
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
}
