<?php

define('DB_HOST', '127.0.0.1');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', get_current_user());
define('DB_PASS', '');

$connected = false;
$message   = '';
$version   = '';
$latency   = 0;

try {
  $start = microtime(true);
  $dsn   = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
  $pdo   = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  $latency   = round((microtime(true) - $start) * 1000, 1);
  $version   = $pdo->query("SELECT version()")->fetchColumn();
  $connected = true;
} catch (PDOException $e) {
  $message = $e->getMessage();
}

$pg_version = $connected ? explode(' ', $version)[1] : '—';

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DB Connection Test</title>
  <style>
    body {
      font-family: monospace;
      font-size: 14px;
      background: #fff;
      color: #222;
      padding: 2rem;
      max-width: 480px;
    }

    h2 {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 1.2rem;
      border-bottom: 1px solid #ccc;
      padding-bottom: 0.4rem;
    }

    .status {
      margin-bottom: 1.4rem;
      font-size: 14px;
    }

    .ok  { color: green; }
    .err { color: red; }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1.4rem;
    }

    td {
      padding: 4px 0;
      vertical-align: top;
    }

    td:first-child {
      color: #666;
      width: 90px;
    }

    .error-msg {
      background: #fff3f3;
      border: 1px solid #f5c6c6;
      padding: 0.7rem;
      color: red;
      margin-bottom: 1rem;
      word-break: break-word;
    }

    .fixes {
      color: #555;
      padding-left: 1rem;
      line-height: 1.9;
    }

    .footer {
      color: #aaa;
      font-size: 12px;
      border-top: 1px solid #eee;
      padding-top: 0.6rem;
    }
  </style>
</head>
<body>

  <h2>DB Connection Test</h2>

  <div class="status">
    Status: <span class="<?= $connected ? 'ok' : 'err' ?>">
      <?= $connected ? '✓ connected' : '✗ failed' ?>
    </span>
  </div>

  <?php if ($connected): ?>

    <table>
      <tr><td>host</td><td><?= DB_HOST ?>:<?= DB_PORT ?></td></tr>
      <tr><td>database</td><td><?= DB_NAME ?></td></tr>
      <tr><td>user</td><td><?= DB_USER ?></td></tr>
      <tr><td>version</td><td>PostgreSQL <?= htmlspecialchars($pg_version) ?></td></tr>
      <tr><td>latency</td><td><?= $latency ?> ms</td></tr>
    </table>

  <?php else: ?>

    <div class="error-msg"><?= htmlspecialchars($message) ?></div>

    <ul class="fixes">
      <li>Start postgresql in DBngin (green dot)</li>
      <li>Username must match your macOS username</li>
      <li>Leave password empty (DBngin default)</li>
    </ul>

  <?php endif; ?>

  <div class="footer">
    <?= date('Y-m-d H:i:s') ?>
  </div>

</body>
</html>
