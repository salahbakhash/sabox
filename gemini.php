<?php

header('Content-Type: application/json');

// Validate the request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method Not Allowed']);
  exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);
$data = $data["message"];

// Validate the input
if (!isset($data) || !is_string($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid input']);
  exit;
}

// Your Gemini API key (keep this secure)
$geminiApiKey = 'AIzaSyA8CxPIZxSt3Wbz-PAV8WWM4dlesJyxKls';

// Gemini API endpoint
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$geminiApiKey";

// Prepare the request payload
$payload = [
  'contents' => [
    [
      'role' => 'user',
      'parts' => [
        [
          'text' => $data,
        ],
      ],
    ],
  ],
];

// Initialize cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

// Execute the request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Handle the response
if ($httpCode === 200) {
  $responseData = json_decode($response, true);
  if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    echo json_encode(['text' => $responseData['candidates'][0]['content']['parts'][0]['text']]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from Gemini API']);
  }
} else {
  http_response_code($httpCode);
  echo json_encode(['error' => 'Failed to process the request: ' . $response]);
}
