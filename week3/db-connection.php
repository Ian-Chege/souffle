<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Database Connection Script</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #f0f2f5; color: #333; padding: 2rem; }
    h1   { text-align: center; color: #4f46e5; margin-bottom: 2rem; }
    section {
      background: white; border-radius: 10px; padding: 1.5rem 2rem;
      margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    }
    h2   { color: #4f46e5; font-size: 1.1rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.4rem; margin-bottom: 1rem; }
    pre  { background: #1e1e2e; color: #cdd6f4; padding: 1rem; border-radius: 6px; font-size: 0.88rem; overflow-x: auto; margin-bottom: 0.8rem; line-height: 1.6; }
    .label  { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 0.3rem; }
    .output { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 0.7rem 1rem; border-radius: 0 6px 6px 0; font-size: 0.95rem; line-height: 1.7; }
    .error  { background: #fef2f2; border-left: 4px solid #ef4444; padding: 0.7rem 1rem; border-radius: 0 6px 6px 0; font-size: 0.95rem; color: #b91c1c; }
    table   { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.9rem; }
    th, td  { text-align: left; padding: 0.5rem 0.8rem; border: 1px solid #e5e7eb; }
    th      { background: #f9fafb; font-weight: 700; }
    tr:nth-child(even) { background: #f9fafb; }
    .badge  { display: inline-block; padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; }
    .green  { background: #dcfce7; color: #16a34a; }
    .red    { background: #fee2e2; color: #b91c1c; }
  </style>
</head>
<body>

<h1>Database Connection Script</h1>

<?php

/* ══════════════════════════════════════════════
   CONFIG — adjust these to match your setup
   DBngin default: host 127.0.0.1, port 5432,
   user = your macOS username, password = empty
   ══════════════════════════════════════════════ */
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');        // default DBngin database
define('DB_USER', get_current_user()); // auto-detects your macOS username
define('DB_PASS', '');                // DBngin default = no password


/* ══════════════════════════════════════════════
   1. CONNECT WITH PDO
   ══════════════════════════════════════════════ */
?>
<section>
  <h2>1. Connect with PDO</h2>
  <pre>
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'your_mac_username');
define('DB_PASS', '');              // DBngin default = empty

$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;

$pdo = new PDO($dsn, DB_USER, DB_PASS, [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw exceptions on errors
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // return rows as arrays
]);
</pre>

  <?php
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
  ?>

  <div class="label">Status</div>
  <?php if ($pdo): ?>
    <div class="output">
      <span class="badge green">Connected</span>
      &nbsp; Successfully connected to PostgreSQL at <strong><?= DB_HOST ?>:<?= DB_PORT ?></strong>
      &nbsp;|&nbsp; Database: <strong><?= DB_NAME ?></strong>
      &nbsp;|&nbsp; User: <strong><?= DB_USER ?></strong>
    </div>
  <?php else: ?>
    <div class="error">
      <span class="badge red">Failed</span> &nbsp; <?= htmlspecialchars($connectError) ?>
      <br><br>
      <strong>Common fixes:</strong><br>
      &bull; Make sure postgresql@17 is <strong>running</strong> in DBngin (green dot)<br>
      &bull; Check the username — DBngin uses your <strong>macOS username</strong> by default<br>
      &bull; Leave the password empty (DBngin has no password by default)
    </div>
  <?php endif; ?>
</section>


<?php if ($pdo): ?>

<!-- ══════════════════════════════════════════
     2. RUN A SIMPLE QUERY
     ══════════════════════════════════════════ -->
<section>
  <h2>2. Run a Simple Query</h2>
  <pre>
// query() — for SELECT with no user input
$stmt = $pdo->query("SELECT version()");
$row  = $stmt->fetch();
echo $row['version'];
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      $stmt = $pdo->query("SELECT version()");
      $row  = $stmt->fetch();
      echo htmlspecialchars($row['version']);
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     3. CREATE A TABLE
     ══════════════════════════════════════════ -->
<section>
  <h2>3. Create a Table</h2>
  <pre>
$pdo->exec("
  CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
");
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      try {
        $pdo->exec("
          CREATE TABLE IF NOT EXISTS users (
            id         SERIAL PRIMARY KEY,
            name       VARCHAR(100) NOT NULL,
            email      VARCHAR(150) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          )
        ");
        echo '<span class="badge green">OK</span> &nbsp; Table <strong>users</strong> is ready.';
      } catch (PDOException $e) {
        echo '<span class="badge red">Error</span> &nbsp;' . htmlspecialchars($e->getMessage());
      }
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     4. INSERT WITH PREPARED STATEMENT
     ══════════════════════════════════════════ -->
<section>
  <h2>4. Insert with Prepared Statement</h2>
  <pre>
// Always use prepared statements — never put variables directly in SQL
$sql  = "INSERT INTO users (name, email) VALUES (:name, :email)
         ON CONFLICT (email) DO NOTHING";

$stmt = $pdo->prepare($sql);
$stmt->execute([':name' => 'Ian', ':email' => 'ian@example.com']);
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      try {
        $sql  = "INSERT INTO users (name, email) VALUES (:name, :email) ON CONFLICT (email) DO NOTHING";
        $stmt = $pdo->prepare($sql);

        $rows = [
          [':name' => 'Ian',   ':email' => 'ian@example.com'],
          [':name' => 'Alice', ':email' => 'alice@example.com'],
          [':name' => 'Bob',   ':email' => 'bob@example.com'],
        ];

        foreach ($rows as $row) {
          $stmt->execute($row);
        }

        echo '<span class="badge green">OK</span> &nbsp; Inserted 3 rows (skips duplicates on re-run).';
      } catch (PDOException $e) {
        echo '<span class="badge red">Error</span> &nbsp;' . htmlspecialchars($e->getMessage());
      }
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     5. SELECT — FETCH ALL ROWS
     ══════════════════════════════════════════ -->
<section>
  <h2>5. Select — Fetch All Rows</h2>
  <pre>
$stmt = $pdo->query("SELECT * FROM users ORDER BY id");
$users = $stmt->fetchAll();   // returns array of associative arrays

foreach ($users as $user) {
  echo $user['id'] . " — " . $user['name'] . " — " . $user['email'];
}
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      $stmt  = $pdo->query("SELECT * FROM users ORDER BY id");
      $users = $stmt->fetchAll();

      if ($users) {
        echo '<table>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Created At</th></tr>';
        foreach ($users as $u) {
          echo "<tr>
            <td>{$u['id']}</td>
            <td>" . htmlspecialchars($u['name'])  . "</td>
            <td>" . htmlspecialchars($u['email']) . "</td>
            <td>{$u['created_at']}</td>
          </tr>";
        }
        echo '</table>';
      } else {
        echo 'No rows found.';
      }
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     6. SELECT ONE ROW BY VALUE
     ══════════════════════════════════════════ -->
<section>
  <h2>6. Select One Row by Value</h2>
  <pre>
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute([':email' => 'ian@example.com']);
$user = $stmt->fetch();      // fetch() returns one row, or false if not found

if ($user) {
  echo "Found: " . $user['name'];
}
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
      $stmt->execute([':email' => 'ian@example.com']);
      $user = $stmt->fetch();

      if ($user) {
        echo "Found: <strong>" . htmlspecialchars($user['name']) . "</strong>"
           . " &nbsp;|&nbsp; Email: " . htmlspecialchars($user['email'])
           . " &nbsp;|&nbsp; ID: " . $user['id'];
      } else {
        echo "No user found.";
      }
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     7. UPDATE A ROW
     ══════════════════════════════════════════ -->
<section>
  <h2>7. Update a Row</h2>
  <pre>
$stmt = $pdo->prepare("UPDATE users SET name = :name WHERE email = :email");
$stmt->execute([':name' => 'Ian Updated', ':email' => 'ian@example.com']);

echo $stmt->rowCount() . " row(s) updated.";
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      $stmt = $pdo->prepare("UPDATE users SET name = :name WHERE email = :email");
      $stmt->execute([':name' => 'Ian Updated', ':email' => 'ian@example.com']);
      echo '<span class="badge green">OK</span> &nbsp; ' . $stmt->rowCount() . " row(s) updated.";
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     8. TRANSACTIONS
     ══════════════════════════════════════════ -->
<section>
  <h2>8. Transactions (all-or-nothing)</h2>
  <pre>
try {
  $pdo->beginTransaction();

  $pdo->prepare("UPDATE users SET name = :n WHERE email = :e")
      ->execute([':n' => 'Alice Tx', ':e' => 'alice@example.com']);

  // If anything here throws, the catch block rolls it all back
  $pdo->commit();
  echo "Transaction committed.";

} catch (PDOException $e) {
  $pdo->rollBack();
  echo "Rolled back: " . $e->getMessage();
}
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      try {
        $pdo->beginTransaction();

        $pdo->prepare("UPDATE users SET name = :n WHERE email = :e")
            ->execute([':n' => 'Alice Tx', ':e' => 'alice@example.com']);

        $pdo->commit();
        echo '<span class="badge green">Committed</span> &nbsp; Transaction completed successfully.';
      } catch (PDOException $e) {
        $pdo->rollBack();
        echo '<span class="badge red">Rolled back</span> &nbsp;' . htmlspecialchars($e->getMessage());
      }
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     9. DELETE A ROW
     ══════════════════════════════════════════ -->
<section>
  <h2>9. Delete</h2>
  <pre>
// Delete is just like insert/update — use a prepared statement
$stmt = $pdo->prepare("DELETE FROM users WHERE email = :email");
$stmt->execute([':email' => 'bob@example.com']);
echo $stmt->rowCount() . " row(s) deleted.";
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      $stmt = $pdo->prepare("DELETE FROM users WHERE email = :email");
      $stmt->execute([':email' => 'bob@example.com']);
      echo '<span class="badge green">OK</span> &nbsp; ' . $stmt->rowCount() . " row(s) deleted.";
    ?>
  </div>
</section>


<!-- ══════════════════════════════════════════
     10. CLOSE THE CONNECTION
     ══════════════════════════════════════════ -->
<section>
  <h2>10. Close the Connection</h2>
  <pre>
// PDO closes the connection automatically when the script ends.
// To close it early, just set the variable to null.
$pdo = null;
  </pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      $pdo = null;
      echo '<span class="badge green">Closed</span> &nbsp; Connection released. $pdo is now null.';
    ?>
  </div>
</section>

<?php endif; ?>

</body>
</html>
