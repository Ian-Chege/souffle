<?php

/* ── Check PostgreSQL ── */
$pg_connected = false;
$pg_version   = '—';
$pg_latency   = '—';

try {
  $start = microtime(true);
  $pdo   = new PDO("pgsql:host=127.0.0.1;port=5432;dbname=postgres", get_current_user(), '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  ]);
  $pg_latency   = round((microtime(true) - $start) * 1000, 1) . ' ms';
  $raw          = $pdo->query("SELECT version()")->fetchColumn();
  $pg_version   = 'PostgreSQL ' . explode(' ', $raw)[1];
  $pg_connected = true;
} catch (PDOException $e) {
  $pg_version = $e->getMessage();
}

/* ── PHP info ── */
$php_version  = 'PHP ' . PHP_VERSION;
$php_sapi     = php_sapi_name();          // how PHP is being served
$php_os       = PHP_OS;

/* ── Herd / Web server ── */
$server_software = $_SERVER['SERVER_SOFTWARE'] ?? 'Herd (PHP built-in)';
$server_host     = $_SERVER['HTTP_HOST']        ?? 'localhost';
$server_protocol = $_SERVER['SERVER_PROTOCOL']  ?? 'HTTP/1.1';

/* ── Uptime check ── */
$now = date('D, d M Y  H:i:s');

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Stack Status</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #0f0f13;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 3rem 1.5rem;
    }

    /* ── Page header ── */
    .page-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .page-header .eyebrow {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #4f46e5;
      margin-bottom: 0.5rem;
    }

    .page-header h1 {
      font-size: 1.9rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.4rem;
    }

    .page-header .time {
      font-size: 0.8rem;
      color: #475569;
    }

    /* ── Overall banner ── */
    .banner {
      max-width: 760px;
      margin: 0 auto 2rem;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .banner.all-ok  { background: #052e16; border: 1px solid #166534; color: #4ade80; }
    .banner.has-err { background: #2d0a0a; border: 1px solid #7f1d1d; color: #f87171; }

    .banner .dot {
      width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    }
    .banner.all-ok  .dot { background: #4ade80; box-shadow: 0 0 8px #4ade80; }
    .banner.has-err .dot { background: #f87171; box-shadow: 0 0 8px #f87171; }

    /* ── Grid ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      max-width: 760px;
      margin: 0 auto 1.5rem;
    }

    /* ── Service card ── */
    .service-card {
      background: #18181f;
      border: 1px solid #27272f;
      border-radius: 16px;
      overflow: hidden;
    }

    .card-top {
      padding: 1.3rem 1.4rem 1rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .service-icon {
      width: 44px; height: 44px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
    }

    .icon-blue   { background: #1e1b4b; }
    .icon-green  { background: #052e16; }
    .icon-purple { background: #2e1065; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.7rem;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .badge-ok  { background: #052e16; color: #4ade80; border: 1px solid #166534; }
    .badge-err { background: #2d0a0a; color: #f87171; border: 1px solid #7f1d1d; }

    .badge-dot {
      width: 6px; height: 6px; border-radius: 50%;
    }
    .badge-ok  .badge-dot { background: #4ade80; }
    .badge-err .badge-dot { background: #f87171; }

    .card-body { padding: 0 1.4rem 1.4rem; }

    .service-name {
      font-size: 1rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.2rem;
    }

    .service-version {
      font-size: 0.78rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .card-divider {
      height: 1px;
      background: #27272f;
      margin-bottom: 1rem;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      margin-bottom: 0.5rem;
    }
    .meta-row:last-child { margin-bottom: 0; }

    .meta-key   { color: #475569; }
    .meta-value { color: #cbd5e1; font-weight: 500; font-family: monospace; font-size: 0.76rem; }

    /* ── Detail table ── */
    .detail-table {
      max-width: 760px;
      margin: 0 auto;
      background: #18181f;
      border: 1px solid #27272f;
      border-radius: 16px;
      overflow: hidden;
    }

    .detail-table-header {
      padding: 1rem 1.4rem;
      border-bottom: 1px solid #27272f;
      font-size: 0.78rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.4rem;
      border-bottom: 1px solid #1e1e27;
      font-size: 0.85rem;
    }
    .detail-row:last-child { border-bottom: none; }

    .detail-key   { color: #64748b; }
    .detail-value { color: #e2e8f0; font-weight: 500; font-family: monospace; font-size: 0.82rem; }

    /* ── Footer ── */
    .footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.75rem;
      color: #334155;
    }
  </style>
</head>
<body>

<?php $all_ok = $pg_connected; ?>

<!-- ── Header ── -->
<div class="page-header">
  <div class="eyebrow">Local Environment</div>
  <h1>Stack Status</h1>
  <div class="time"><?= $now ?></div>
</div>

<!-- ── Banner ── -->
<div class="banner <?= $all_ok ? 'all-ok' : 'has-err' ?>">
  <span class="dot"></span>
  <?= $all_ok
    ? 'All systems operational — Herd, PostgreSQL, and PHP are running.'
    : 'One or more services need attention. Check PostgreSQL in DBngin.' ?>
</div>

<!-- ── Service cards ── -->
<div class="grid">

  <!-- Herd -->
  <div class="service-card">
    <div class="card-top">
      <div class="service-icon icon-blue">🌐</div>
      <span class="status-badge badge-ok">
        <span class="badge-dot"></span> Running
      </span>
    </div>
    <div class="card-body">
      <div class="service-name">Laravel Herd</div>
      <div class="service-version">Web Server</div>
      <div class="card-divider"></div>
      <div class="meta-row">
        <span class="meta-key">Host</span>
        <span class="meta-value"><?= htmlspecialchars($server_host) ?></span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Protocol</span>
        <span class="meta-value"><?= htmlspecialchars($server_protocol) ?></span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Role</span>
        <span class="meta-value">Apache equivalent</span>
      </div>
    </div>
  </div>

  <!-- PostgreSQL -->
  <div class="service-card">
    <div class="card-top">
      <div class="service-icon icon-green">🐘</div>
      <span class="status-badge <?= $pg_connected ? 'badge-ok' : 'badge-err' ?>">
        <span class="badge-dot"></span>
        <?= $pg_connected ? 'Running' : 'Offline' ?>
      </span>
    </div>
    <div class="card-body">
      <div class="service-name">PostgreSQL 17</div>
      <div class="service-version"><?= $pg_connected ? htmlspecialchars($pg_version) : 'Not connected' ?></div>
      <div class="card-divider"></div>
      <div class="meta-row">
        <span class="meta-key">Host</span>
        <span class="meta-value">127.0.0.1:5432</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Latency</span>
        <span class="meta-value"><?= $pg_latency ?></span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Role</span>
        <span class="meta-value">MySQL equivalent</span>
      </div>
    </div>
  </div>

  <!-- PHP -->
  <div class="service-card">
    <div class="card-top">
      <div class="service-icon icon-purple">🐘</div>
      <span class="status-badge badge-ok">
        <span class="badge-dot"></span> Running
      </span>
    </div>
    <div class="card-body">
      <div class="service-name">PHP</div>
      <div class="service-version"><?= htmlspecialchars($php_version) ?></div>
      <div class="card-divider"></div>
      <div class="meta-row">
        <span class="meta-key">SAPI</span>
        <span class="meta-value"><?= htmlspecialchars($php_sapi) ?></span>
      </div>
      <div class="meta-row">
        <span class="meta-key">OS</span>
        <span class="meta-value"><?= htmlspecialchars($php_os) ?></span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Max memory</span>
        <span class="meta-value"><?= ini_get('memory_limit') ?></span>
      </div>
    </div>
  </div>

</div>

<!-- ── Environment detail ── -->
<div class="detail-table">
  <div class="detail-table-header">Environment Details</div>
  <div class="detail-row">
    <span class="detail-key">Server host</span>
    <span class="detail-value"><?= htmlspecialchars($server_host) ?></span>
  </div>
  <div class="detail-row">
    <span class="detail-key">PHP version</span>
    <span class="detail-value"><?= PHP_VERSION ?></span>
  </div>
  <div class="detail-row">
    <span class="detail-key">PostgreSQL version</span>
    <span class="detail-value"><?= $pg_connected ? htmlspecialchars($pg_version) : 'Unavailable' ?></span>
  </div>
  <div class="detail-row">
    <span class="detail-key">DB latency</span>
    <span class="detail-value"><?= $pg_latency ?></span>
  </div>
  <div class="detail-row">
    <span class="detail-key">Document root</span>
    <span class="detail-value"><?= htmlspecialchars($_SERVER['DOCUMENT_ROOT'] ?? '—') ?></span>
  </div>
  <div class="detail-row">
    <span class="detail-key">PHP extensions</span>
    <span class="detail-value">pdo_pgsql, pdo, json, mbstring</span>
  </div>
</div>

<div class="footer">my-project.test &nbsp;&middot;&nbsp; <?= $now ?></div>

</body>
</html>
