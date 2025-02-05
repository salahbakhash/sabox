<?php


include_once "./connection.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // storing a message
  if (isset($_POST["message"]) && !empty($_POST["message"])) {

    $con = get_connection();
    $message = json_decode($_POST["message"]);
    $message = [
      ":user" => filter_var($message->user, FILTER_SANITIZE_NUMBER_INT),
      ":text" => filter_var($message->msg, FILTER_SANITIZE_SPECIAL_CHARS)
    ];

    $stmt = $con->prepare("INSERT INTO messages (user_id, message) VALUES (:user, :text)");
    $result = $stmt->execute($message);

    echo json_encode($result);
  }
} else {
  // get request => getting the context of the chat

  $con = get_connection();

  $stmt = $con->prepare("SELECT * FROM messages");
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $history = [];

    foreach ($data as $value) {
      $history[] = [
        "user" => $value["user_id"],
        "text" => $value["message"],
      ];
    }
    echo json_encode($history);
  } else {
    echo json_encode(false);
  }
}
