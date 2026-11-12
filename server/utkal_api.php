<?php
/**
 * Utkal Udaya proxy API
 * Upload to: /myclimate/app/beneficiary/api/utkal_api.php
 * Also upload api_config.php (from api_config.example.php) in the same folder.
 *
 * GET ?action=weather&lat=21.49&lon=83.98
 * GET ?action=forecast&lat=21.49&lon=83.98
 * GET ?action=news&q=Odisha%20agriculture
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$configPath = __DIR__ . '/api_config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'api_config.php missing. Copy api_config.example.php to api_config.php and set keys.',
    ]);
    exit;
}

require $configPath;

function respond_error($code, $message) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
}

function http_get_json($url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $body = curl_exec($ch);
    $errno = curl_errno($ch);
    $error = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($errno) {
        respond_error(502, 'Upstream request failed: ' . $error);
    }

    $decoded = json_decode($body, true);
    if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
        respond_error(502, 'Invalid JSON from upstream');
    }

    http_response_code($status > 0 ? $status : 200);
    echo json_encode($decoded);
    exit;
}

$action = isset($_GET['action']) ? strtolower(trim($_GET['action'])) : '';

if ($action === 'weather' || $action === 'forecast') {
    if (!defined('OPENWEATHER_API_KEY') || OPENWEATHER_API_KEY === '' || strpos(OPENWEATHER_API_KEY, 'YOUR_') === 0) {
        respond_error(500, 'OpenWeather API key not configured');
    }

    $lat = isset($_GET['lat']) ? trim($_GET['lat']) : '';
    $lon = isset($_GET['lon']) ? trim($_GET['lon']) : '';

    if ($lat === '' || $lon === '' || !is_numeric($lat) || !is_numeric($lon)) {
        respond_error(400, 'lat and lon are required numbers');
    }

    $latF = (float) $lat;
    $lonF = (float) $lon;
    if ($latF < -90 || $latF > 90 || $lonF < -180 || $lonF > 180) {
        respond_error(400, 'lat/lon out of range');
    }

    $path = $action === 'forecast' ? 'forecast' : 'weather';
    $url = sprintf(
        'https://api.openweathermap.org/data/2.5/%s?lat=%s&lon=%s&appid=%s&units=metric',
        $path,
        rawurlencode((string) $latF),
        rawurlencode((string) $lonF),
        rawurlencode(OPENWEATHER_API_KEY)
    );
    http_get_json($url);
}

if ($action === 'news') {
    if (!defined('NEWSDATA_API_KEY') || NEWSDATA_API_KEY === '' || strpos(NEWSDATA_API_KEY, 'YOUR_') === 0) {
        respond_error(500, 'NewsData API key not configured');
    }

    $q = isset($_GET['q']) ? trim($_GET['q']) : 'Odisha agriculture';
    if ($q === '') {
        $q = 'Odisha agriculture';
    }
    if (strlen($q) > 200) {
        respond_error(400, 'q is too long');
    }

    $url = 'https://newsdata.io/api/1/latest?apikey=' . rawurlencode(NEWSDATA_API_KEY)
        . '&q=' . rawurlencode($q);
    http_get_json($url);
}

respond_error(400, 'Unknown action. Use weather, forecast, or news.');
