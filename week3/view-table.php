<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Table Viewer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body { font-family: sans-serif; background: #f0f2f5; color: #333; display: flex; min-height: 100vh; }

    /* ── Sidebar ── */
    aside {
      width: 230px;
      min-height: 100vh;
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 1.5rem 1rem;
      flex-shrink: 0;
    }

    aside h2 { font-size: 0.75rem; text-transform: uppercase; color: #6c7086; margin-bottom: 0.8rem; letter-spacing: 0.08em; }

    .db-info { font-size: 0.8rem; color: #a6adc8; margin-bottom: 1.5rem; line-height: 1.6; }

    .table-link {
      display: block;
      padding: 0.5rem 0.8rem;
      border-radius: 6px;
      color: #cdd6f4;
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
      transition: background 0.15s;
    }

    .table-link:hover    { background: #313244; }
    .table-link.active   { background: #4f46e5; color: white; }
    .table-link span     { font-size: 0.75rem; color: #6c7086; float: right; }
    .table-link.active span { color: #c4b5fd; }

    .no-tables { font-size: 0.85rem; color: #6c7086; padding: 0.5rem; }

    /* ── Main ── */
    main { flex: 1; padding: 2rem; overflow-x: auto; }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    h1 { color: #4f46e5; font-size: 1.4rem; }

    .meta { font-size: 0.85rem; color: #6b7280; }

    .badge {
      display: inline-block; padding: 0.15rem 0.6rem;
      border-radius: 99px; font-size: 0.78rem; font-weight: 600;
    }
    .green { background: #dcfce7; color: #16a34a; }
    .red   { background: #fee2e2; color: #b91c1c; }
    .blue  { background: #ede9fe; color: #4f46e5; }

    /* ── Table ── */
    .card {
      background: white; border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07); overflow: hidden;
    }

    .card-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex; align-items: center; gap: 0.7rem;
    }

    .card-header h2 { font-size: 1rem; color: #111; }

    .table-wrap { overflow-x: auto; }

    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }

    thead th {
      background: #f9fafb; text-align: left;
      padding: 0.6rem 1rem; font-weight: 700; color: #374151;
      border-bottom: 2px solid #e5e7eb; white-space: nowrap;
    }

    tbody td {
      padding: 0.6rem 1rem; border-bottom: 1px solid #f3f4f6;
      color: #374151; white-space: nowrap;
    }

    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f9fafb; }

    .null-val { color: #9ca3af; font-style: italic; }

    /* ── Empty / error states ── */
    .empty { padding: 2rem; text-align: center; color: #9ca3af; font-size: 0.95rem; }

    .error-box {
      background: #fef2f2; border-left: 4px solid #ef4444;
      padding: 1rem 1.5rem; border-radius: 0 8px 8px 0;
      color: #b91c1c; font-size: 0.9rem; line-height: 1.7;
    }

    /* ── Structure tab ── */
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }

    .tab {
      padding: 0.35rem 0.9rem; border-radius: 6px; font-size: 0.85rem;
      font-weight: 600; cursor: pointer; border: 2px solid transparent;
      text-decoration: none; color: #6b7280;
    }

    .tab.active   { background: #4f46e5; color: white; }
    .tab:not(.active):hover { background: #e5e7eb; }
  </style>
</head>
<body>

<?php

/* ── Connection ─────────────────────────────────────── */
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', get_current_user());
define('DB_PASS', '');

$pdo = null;
$connectError = null;

try {
  $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
  $pdo = new PDO($dsn, DB_USER, DB_PASS, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (PDOException $e) {
  $connectError = $e->getMessage();
}

/* ── Get all user-created tables ────────────────────── */
$tables = [];
if ($pdo) {
  $stmt = $pdo->query("
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type   = 'BASE TABLE'
    ORDER BY table_name
  ");
  $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
}

/* ── Active table & view from URL params ────────────── */
$activeTable = $_GET['table'] ?? ($tables[0] ?? null);
$activeView  = $_GET['view']  ?? 'data';   // 'data' or 'structure'

// Whitelist: only allow table names that actually exist
if ($activeTable && !in_array($activeTable, $tables, true)) {
  $activeTable = null;
}

/* ── Row counts per table ───────────────────────────── */
$rowCounts = [];
foreach ($tables as $t) {
  $stmt = $pdo->query("SELECT COUNT(*) FROM " . quote_identifier($t));
  $rowCounts[$t] = $stmt->fetchColumn();
}

/* helper: escape identifier safely */
function quote_identifier(string $name): string {
  return '"' . str_replace('"', '""', $name) . '"';
}

?>

<!-- ── Sidebar ──────────────────────────────────────── -->
<aside>
  <h2>Database</h2>
  <div class="db-info">
    <strong><?= DB_NAME ?></strong><br>
    <?= DB_HOST ?>:<?= DB_PORT ?><br>
    user: <?= DB_USER ?>
  </div>

  <h2>Tables</h2>

  <?php if (!$pdo): ?>
    <div class="no-tables">Could not connect.</div>
  <?php elseif (!$tables): ?>
    <div class="no-tables">No tables found.</div>
  <?php else: ?>
    <?php foreach ($tables as $t): ?>
      <a href="?table=<?= urlencode($t) ?>&view=<?= $activeView ?>"
         class="table-link <?= $t === $activeTable ? 'active' : '' ?>">
        <?= htmlspecialchars($t) ?>
        <span><?= $rowCounts[$t] ?></span>
      </a>
    <?php endforeach; ?>
  <?php endif; ?>
</aside>

<!-- ── Main ─────────────────────────────────────────── -->
<main>

  <?php if ($connectError): ?>

    <div class="top-bar"><h1>Table Viewer</h1></div>
    <div class="error-box">
      <strong><span class="badge red">Connection Failed</span></strong><br><br>
      <?= htmlspecialchars($connectError) ?><br><br>
      <strong>Check:</strong><br>
      &bull; PostgreSQL@17 is running in DBngin (green dot)<br>
      &bull; Username matches your macOS username<br>
      &bull; Password is empty (DBngin default)
    </div>

  <?php elseif (!$activeTable): ?>

    <div class="top-bar"><h1>Table Viewer</h1></div>
    <div class="card">
      <div class="empty">No tables yet. Create one and it will appear in the sidebar.</div>
    </div>

  <?php else: ?>

    <!-- Top bar -->
    <div class="top-bar">
      <h1><?= htmlspecialchars($activeTable) ?></h1>
      <span class="meta">
        <span class="badge blue"><?= $rowCounts[$activeTable] ?> rows</span>
        &nbsp; PostgreSQL <?= htmlspecialchars($pdo->query("SELECT version()")->fetchColumn()) ?>
      </span>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <a href="?table=<?= urlencode($activeTable) ?>&view=data"
         class="tab <?= $activeView === 'data' ? 'active' : '' ?>">Data</a>
      <a href="?table=<?= urlencode($activeTable) ?>&view=structure"
         class="tab <?= $activeView === 'structure' ? 'active' : '' ?>">Structure</a>
    </div>

    <?php if ($activeView === 'data'): ?>

      <!-- ── DATA VIEW ── -->
      <?php
        $escaped = quote_identifier($activeTable);
        $rows    = $pdo->query("SELECT * FROM $escaped ORDER BY 1 LIMIT 200")->fetchAll();
        $cols    = $rows ? array_keys($rows[0]) : [];
      ?>

      <div class="card">
        <?php if (!$rows): ?>
          <div class="empty">This table is empty.</div>
        <?php else: ?>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><?php foreach ($cols as $c): ?><th><?= htmlspecialchars($c) ?></th><?php endforeach; ?></tr>
              </thead>
              <tbody>
                <?php foreach ($rows as $row): ?>
                  <tr>
                    <?php foreach ($row as $val): ?>
                      <td>
                        <?php if ($val === null): ?>
                          <span class="null-val">NULL</span>
                        <?php else: ?>
                          <?= htmlspecialchars((string)$val) ?>
                        <?php endif; ?>
                      </td>
                    <?php endforeach; ?>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        <?php endif; ?>
      </div>

    <?php else: ?>

      <!-- ── STRUCTURE VIEW ── -->
      <?php
        $structStmt = $pdo->prepare("
          SELECT column_name, data_type, character_maximum_length,
                 is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name   = :table
          ORDER BY ordinal_position
        ");
        $structStmt->execute([':table' => $activeTable]);
        $columns = $structStmt->fetchAll();
      ?>

      <div class="card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Max Length</th>
                <th>Nullable</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($columns as $col): ?>
                <tr>
                  <td><strong><?= htmlspecialchars($col['column_name']) ?></strong></td>
                  <td><?= htmlspecialchars($col['data_type']) ?></td>
                  <td><?= $col['character_maximum_length'] ?? '<span class="null-val">—</span>' ?></td>
                  <td>
                    <?php if ($col['is_nullable'] === 'YES'): ?>
                      <span class="badge green">YES</span>
                    <?php else: ?>
                      <span class="badge red">NO</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <?php if ($col['column_default']): ?>
                      <code><?= htmlspecialchars($col['column_default']) ?></code>
                    <?php else: ?>
                      <span class="null-val">—</span>
                    <?php endif; ?>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>

    <?php endif; ?>

  <?php endif; ?>

</main>

</body>
</html>
