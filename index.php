<?php

$URL = [];
if (isset($_GET["url"]) && !empty($_GET["url"])) {
  $URL = explode("/", $_GET["url"]);
}
if (isset($URL[0]) && $URL[0] == "store") {
  require_once "./store.php";
} else {

  $messages = [];

  require_once "./connection.php";
  $con = get_connection();

  try {
    $stmt = $con->prepare("SELECT * FROM messages");
    $stmt->execute([]);
    if ($stmt->rowCount() > 0) {
      $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // echo '<pre>';
    // print_r($messages);
    // echo '</pre>';
    // exit();
  } catch (PDOException $e) {
    echo 'faild to connect' . $e->getMessage();
  }
?>

  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SaBox Chat | Demo</title>
    <link rel="stylesheet" href="./style.css" />
  </head>

  <body>
    <div class="container">
      <h1 class="mt-5">Sa-Box</h1>
      <p class="lead"><b>it has two styles at the moment (fixed, static)</b></p>
      <hr />

      <h3 class="mt-5">Static chat integrated with gemini pro</h3>
      <div id="mycustomchat"></div>
      <div id="mycustomchat1"></div>
      <hr />
      <h3 class="mt-5 mb-5">Fixed style is on the right bottom corner</h3>
    </div>

    <script>
      let chatContext = JSON.parse(`<?= json_encode($messages) ?>`);
    </script>
    <script type="importmap">
      {
        "imports": {
          "@google/generative-ai": "https://esm.run/@google/generative-ai",
          "@sabox": "./sa-box.js",
          "jquery": "http://code.jquery.com/jquery-1.11.3.min.js"
        }
      }
    </script>
    <!-- <script type="module" src="./sa-box.js"></script> -->
    <script type="module" src="./index.js"></script>
  </body>

  </html>
<?php
}
?>