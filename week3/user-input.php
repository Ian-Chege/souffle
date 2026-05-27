<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body { font-family: sans-serif; background: #f0f2f5; display: flex; min-height: 100vh; }

    /* ── Sidebar ── */
    aside {
      width: 220px; background: #1e1e2e; color: #cdd6f4;
      display: flex; flex-direction: column;
      padding: 1.5rem 1rem; gap: 0.3rem; flex-shrink: 0;
    }

    .app-name { font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 1.2rem; padding: 0 0.5rem; }

    .nav-link {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.6rem 0.8rem; border-radius: 8px;
      text-decoration: none; color: #a6adc8; font-size: 0.9rem;
      transition: background 0.15s, color 0.15s;
    }
    .nav-link:hover  { background: #313244; color: #cdd6f4; }
    .nav-link.active { background: #4f46e5; color: white; }
    .nav-link .icon  { font-size: 1rem; width: 1.2rem; text-align: center; }

    .nav-divider { height: 1px; background: #313244; margin: 0.6rem 0; }

    /* ── Main ── */
    main { flex: 1; padding: 2rem; max-width: 780px; }

    .page-title { font-size: 1.4rem; font-weight: 700; color: #111; margin-bottom: 0.3rem; }
    .page-sub   { color: #6b7280; font-size: 0.9rem; margin-bottom: 1.8rem; }

    /* ── Cards ── */
    .card {
      background: white; border-radius: 12px;
      padding: 1.5rem; margin-bottom: 1.2rem;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07);
    }

    .card-title { font-weight: 700; color: #111; margin-bottom: 1rem; font-size: 0.95rem; }

    /* ── Form elements ── */
    .field { margin-bottom: 1rem; }
    .field:last-child { margin-bottom: 0; }

    label { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.3rem; }

    input[type=text], input[type=email], input[type=password],
    input[type=number], select, textarea {
      width: 100%; padding: 0.6rem 0.85rem;
      border: 2px solid #e5e7eb; border-radius: 8px;
      font-size: 0.93rem; outline: none; color: #111;
      transition: border-color 0.2s;
      background: #fafafa;
    }
    input:focus, select:focus, textarea:focus { border-color: #4f46e5; background: white; }
    input.err, select.err, textarea.err { border-color: #ef4444; }
    textarea { resize: vertical; min-height: 90px; }

    .row { display: flex; gap: 1rem; }
    .row .field { flex: 1; }

    .btn {
      padding: 0.6rem 1.4rem; border: none; border-radius: 8px;
      font-size: 0.93rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-primary  { background: #4f46e5; color: white; }
    .btn-danger   { background: #ef4444; color: white; }
    .btn-ghost    { background: #f3f4f6; color: #374151; }

    /* ── Alerts ── */
    .alert {
      padding: 0.75rem 1rem; border-radius: 8px;
      font-size: 0.9rem; margin-bottom: 1.2rem; line-height: 1.6;
    }
    .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
    .alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
    .alert-info    { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }

    /* ── Profile avatar ── */
    .avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: #4f46e5; color: white; font-size: 1.6rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem;
    }

    /* ── Search results ── */
    .result-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6;
    }
    .result-item:last-child { border-bottom: none; }
    .result-item .name { font-weight: 600; font-size: 0.93rem; }
    .result-item .meta { font-size: 0.8rem; color: #6b7280; }
    .badge { display: inline-block; padding: 0.15rem 0.55rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; }
    .badge-blue   { background: #ede9fe; color: #4f46e5; }
    .badge-green  { background: #dcfce7; color: #16a34a; }
    .badge-red    { background: #fee2e2; color: #b91c1c; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }

    /* ── Notes ── */
    .note-item {
      padding: 0.9rem 1rem; border-radius: 8px;
      background: #fafafa; border: 1px solid #e5e7eb;
      margin-bottom: 0.7rem; position: relative;
    }
    .note-item .note-text { font-size: 0.9rem; color: #374151; line-height: 1.5; }
    .note-item .note-meta { font-size: 0.75rem; color: #9ca3af; margin-top: 0.4rem; }
    .note-delete { position: absolute; top: 0.7rem; right: 0.8rem; background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 1rem; }
    .note-delete:hover { color: #ef4444; }

    /* ── Settings toggles ── */
    .setting-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.85rem 0; border-bottom: 1px solid #f3f4f6;
    }
    .setting-row:last-child { border-bottom: none; }
    .setting-label { font-size: 0.9rem; font-weight: 600; color: #111; }
    .setting-desc  { font-size: 0.8rem; color: #6b7280; margin-top: 0.15rem; }

    .toggle-wrap { position: relative; }
    .toggle-wrap input[type=checkbox] { display: none; }
    .toggle {
      display: block; width: 44px; height: 24px;
      background: #e5e7eb; border-radius: 99px; cursor: pointer;
      transition: background 0.2s; position: relative;
    }
    .toggle::after {
      content: ''; position: absolute; width: 18px; height: 18px;
      background: white; border-radius: 50%; top: 3px; left: 3px;
      transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle-wrap input:checked + .toggle { background: #4f46e5; }
    .toggle-wrap input:checked + .toggle::after { left: 23px; }

    /* ── Server info table ── */
    .info-table { width: 100%; font-size: 0.88rem; }
    .info-table td { padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    .info-table td:first-child { color: #6b7280; width: 160px; white-space: nowrap; }
    .info-table td:last-child  { color: #111; font-weight: 500; word-break: break-all; }
    .info-table tr:last-child td { border-bottom: none; }
  </style>
</head>
<body>

<?php
/* ── Helpers ── */
function safe(string $v): string {
  return htmlspecialchars(strip_tags($v), ENT_QUOTES, 'UTF-8');
}
function input(string $key, string $default = ''): string {
  return trim($_POST[$key] ?? $_GET[$key] ?? $default);
}
function isPost(): bool {
  return $_SERVER['REQUEST_METHOD'] === 'POST';
}

/* ── Active page ── */
$page = $_GET['page'] ?? 'profile';
$allowed_pages = ['profile', 'search', 'notes', 'settings', 'request'];
if (!in_array($page, $allowed_pages)) $page = 'profile';

/* ══════════════════════
   HANDLE POST ACTIONS
   ══════════════════════ */

$errors  = [];
$success = '';

/* -- Profile save -- */
if (isPost() && input('action') === 'save_profile') {
  $name  = input('name');
  $email = input('email');
  $bio   = input('bio');
  $role  = input('role');

  if ($name === '')                                 $errors[] = 'Name is required.';
  if (!filter_var($email, FILTER_VALIDATE_EMAIL))   $errors[] = 'Enter a valid email address.';

  if (!$errors) {
    $_SESSION['profile'] = compact('name', 'email', 'bio', 'role');
    $success = 'Profile saved!';
  }
}

/* -- Add note -- */
if (isPost() && input('action') === 'add_note') {
  $note = input('note');
  if ($note === '') {
    $errors[] = 'Note cannot be empty.';
  } else {
    $_SESSION['notes'][] = ['text' => $note, 'time' => date('H:i')];
    $success = 'Note added.';
  }
}

/* -- Delete note -- */
if (isPost() && input('action') === 'delete_note') {
  $idx = (int) input('idx');
  unset($_SESSION['notes'][$idx]);
  $_SESSION['notes'] = array_values($_SESSION['notes'] ?? []);
}

/* -- Settings save -- */
if (isPost() && input('action') === 'save_settings') {
  $_SESSION['settings'] = [
    'notifications' => isset($_POST['notifications']),
    'dark_mode'     => isset($_POST['dark_mode']),
    'newsletter'    => isset($_POST['newsletter']),
    'language'      => input('language'),
    'timezone'      => input('timezone'),
  ];
  $success = 'Settings saved!';
}

/* -- Shorthand refs -- */
$profile  = $_SESSION['profile']  ?? [];
$notes    = $_SESSION['notes']    ?? [];
$settings = $_SESSION['settings'] ?? [];
?>

<!-- ══ SIDEBAR ══════════════════════════════ -->
<aside>
  <div class="app-name">MyApp</div>

  <a href="?page=profile"  class="nav-link <?= $page === 'profile'  ? 'active' : '' ?>"><span class="icon">👤</span> Profile</a>
  <a href="?page=search"   class="nav-link <?= $page === 'search'   ? 'active' : '' ?>"><span class="icon">🔍</span> Search</a>
  <a href="?page=notes"    class="nav-link <?= $page === 'notes'    ? 'active' : '' ?>"><span class="icon">📝</span> Notes <span style="margin-left:auto;background:#313244;padding:0.1rem 0.45rem;border-radius:99px;font-size:0.75rem;"><?= count($notes) ?></span></a>

  <div class="nav-divider"></div>

  <a href="?page=settings" class="nav-link <?= $page === 'settings' ? 'active' : '' ?>"><span class="icon">⚙️</span> Settings</a>
  <a href="?page=request"  class="nav-link <?= $page === 'request'  ? 'active' : '' ?>"><span class="icon">🌐</span> Request Info</a>
</aside>

<!-- ══ MAIN ═════════════════════════════════ -->
<main>

<?php if ($errors): ?>
  <div class="alert alert-error">
    <?php foreach ($errors as $e) echo '&#x2022; ' . safe($e) . '<br>'; ?>
  </div>
<?php endif; ?>

<?php if ($success): ?>
  <div class="alert alert-success">&#x2713; <?= safe($success) ?></div>
<?php endif; ?>


<?php /* ══════════════════════════════
          PAGE: PROFILE
          ══════════════════════════════ */ if ($page === 'profile'): ?>

  <div class="page-title">Your Profile</div>
  <div class="page-sub">This data is saved to your session and persists across pages.</div>

  <?php if ($profile): ?>
    <div class="card" style="display:flex;align-items:center;gap:1.2rem;">
      <div class="avatar"><?= strtoupper(mb_substr($profile['name'], 0, 1)) ?></div>
      <div>
        <div style="font-weight:700;font-size:1.1rem;"><?= safe($profile['name']) ?></div>
        <div style="color:#6b7280;font-size:0.88rem;"><?= safe($profile['email']) ?></div>
        <div style="margin-top:0.3rem;"><span class="badge badge-blue"><?= safe($profile['role']) ?></span></div>
      </div>
    </div>
  <?php endif; ?>

  <div class="card">
    <div class="card-title">Edit Profile</div>
    <form method="POST" action="?page=profile">
      <input type="hidden" name="action" value="save_profile" />
      <div class="row">
        <div class="field">
          <label>Full Name</label>
          <input type="text" name="name" value="<?= safe($profile['name'] ?? input('name')) ?>" placeholder="Ian Doe" class="<?= in_array('Name is required.', $errors) ? 'err' : '' ?>" />
        </div>
        <div class="field">
          <label>Role</label>
          <select name="role">
            <?php foreach (['Developer', 'Designer', 'Manager', 'Student'] as $r): ?>
              <option value="<?= $r ?>" <?= ($profile['role'] ?? '') === $r ? 'selected' : '' ?>><?= $r ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" name="email" value="<?= safe($profile['email'] ?? input('email')) ?>" placeholder="ian@example.com" class="<?= in_array('Enter a valid email address.', $errors) ? 'err' : '' ?>" />
      </div>
      <div class="field">
        <label>Bio</label>
        <textarea name="bio" placeholder="Tell us a little about yourself..."><?= safe($profile['bio'] ?? input('bio')) ?></textarea>
      </div>
      <button class="btn btn-primary" type="submit">Save Profile</button>
    </form>
  </div>


<?php /* ══════════════════════════════
          PAGE: SEARCH
          ══════════════════════════════ */ elseif ($page === 'search'): ?>

  <div class="page-title">Search</div>
  <div class="page-sub">Uses GET so results are shareable via URL.</div>

  <?php
    $q    = safe(trim($_GET['q'] ?? ''));
    $role = $_GET['role'] ?? 'all';
    $allowed_roles = ['all', 'Developer', 'Designer', 'Manager', 'Student'];
    if (!in_array($role, $allowed_roles)) $role = 'all';

    $all_users = [
      ['name' => 'Ian Doe',     'email' => 'ian@example.com',   'role' => 'Developer'],
      ['name' => 'Alice Smith', 'email' => 'alice@example.com', 'role' => 'Designer'],
      ['name' => 'Bob Johnson', 'email' => 'bob@example.com',   'role' => 'Manager'],
      ['name' => 'Clara Wren',  'email' => 'clara@example.com', 'role' => 'Developer'],
      ['name' => 'Dan Mbeki',   'email' => 'dan@example.com',   'role' => 'Student'],
      ['name' => 'Eva Njeri',   'email' => 'eva@example.com',   'role' => 'Designer'],
    ];

    $results = array_filter($all_users, function($u) use ($q, $role) {
      $matchQ    = $q === '' || stripos($u['name'], $q) !== false || stripos($u['email'], $q) !== false;
      $matchRole = $role === 'all' || $u['role'] === $role;
      return $matchQ && $matchRole;
    });

    $role_colors = ['Developer' => 'badge-blue', 'Designer' => 'badge-green', 'Manager' => 'badge-yellow', 'Student' => 'badge-red'];
  ?>

  <div class="card">
    <form method="GET" action="?page=search" style="display:flex;gap:0.8rem;align-items:flex-end;">
      <input type="hidden" name="page" value="search" />
      <div class="field" style="flex:1;margin:0;">
        <label>Search users</label>
        <input type="text" name="q" value="<?= $q ?>" placeholder="Name or email…" />
      </div>
      <div class="field" style="width:140px;margin:0;">
        <label>Role</label>
        <select name="role">
          <?php foreach ($allowed_roles as $r): ?>
            <option value="<?= $r ?>" <?= $role === $r ? 'selected' : '' ?>><?= $r === 'all' ? 'All roles' : $r ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <button class="btn btn-primary" type="submit" style="white-space:nowrap;">Search</button>
    </form>
  </div>

  <div class="card">
    <div class="card-title"><?= count($results) ?> result<?= count($results) !== 1 ? 's' : '' ?></div>
    <?php if ($results): ?>
      <?php foreach ($results as $u): ?>
        <div class="result-item">
          <div>
            <div class="name"><?= safe($u['name']) ?></div>
            <div class="meta"><?= safe($u['email']) ?></div>
          </div>
          <span class="badge <?= $role_colors[$u['role']] ?>"><?= $u['role'] ?></span>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <div style="color:#9ca3af;font-size:0.9rem;padding:1rem 0;">No users match your search.</div>
    <?php endif; ?>
  </div>


<?php /* ══════════════════════════════
          PAGE: NOTES
          ══════════════════════════════ */ elseif ($page === 'notes'): ?>

  <div class="page-title">Notes</div>
  <div class="page-sub">Saved in <code>$_SESSION</code> — they survive page reloads.</div>

  <div class="card">
    <form method="POST" action="?page=notes">
      <input type="hidden" name="action" value="add_note" />
      <div class="field">
        <label>New note</label>
        <textarea name="note" placeholder="Write something…" style="min-height:70px;"></textarea>
      </div>
      <button class="btn btn-primary" type="submit">Add Note</button>
    </form>
  </div>

  <?php if ($notes): ?>
    <div class="card">
      <div class="card-title">Your notes</div>
      <?php foreach ($notes as $i => $note): ?>
        <div class="note-item">
          <div class="note-text"><?= safe($note['text']) ?></div>
          <div class="note-meta">Saved at <?= $note['time'] ?></div>
          <form method="POST" action="?page=notes" style="display:inline;">
            <input type="hidden" name="action" value="delete_note" />
            <input type="hidden" name="idx"    value="<?= $i ?>" />
            <button class="note-delete" type="submit" title="Delete">&#x2715;</button>
          </form>
        </div>
      <?php endforeach; ?>
    </div>
  <?php else: ?>
    <div class="card" style="color:#9ca3af;text-align:center;padding:2rem;">No notes yet. Add one above.</div>
  <?php endif; ?>


<?php /* ══════════════════════════════
          PAGE: SETTINGS
          ══════════════════════════════ */ elseif ($page === 'settings'): ?>

  <div class="page-title">Settings</div>
  <div class="page-sub">Checkboxes, selects, and toggles — all saved to session.</div>

  <div class="card">
    <form method="POST" action="?page=settings">
      <input type="hidden" name="action" value="save_settings" />

      <div class="setting-row">
        <div>
          <div class="setting-label">Notifications</div>
          <div class="setting-desc">Receive in-app notifications</div>
        </div>
        <label class="toggle-wrap">
          <input type="checkbox" name="notifications" <?= !empty($settings['notifications']) ? 'checked' : '' ?> />
          <span class="toggle"></span>
        </label>
      </div>

      <div class="setting-row">
        <div>
          <div class="setting-label">Dark Mode</div>
          <div class="setting-desc">Switch to a darker theme</div>
        </div>
        <label class="toggle-wrap">
          <input type="checkbox" name="dark_mode" <?= !empty($settings['dark_mode']) ? 'checked' : '' ?> />
          <span class="toggle"></span>
        </label>
      </div>

      <div class="setting-row">
        <div>
          <div class="setting-label">Newsletter</div>
          <div class="setting-desc">Receive weekly digest emails</div>
        </div>
        <label class="toggle-wrap">
          <input type="checkbox" name="newsletter" <?= !empty($settings['newsletter']) ? 'checked' : '' ?> />
          <span class="toggle"></span>
        </label>
      </div>

      <div class="setting-row">
        <div style="flex:1;">
          <div class="setting-label">Language</div>
          <div class="setting-desc">App display language</div>
        </div>
        <select name="language" style="width:180px;">
          <?php foreach (['English', 'French', 'Spanish', 'Swahili'] as $lang): ?>
            <option <?= ($settings['language'] ?? 'English') === $lang ? 'selected' : '' ?>><?= $lang ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="setting-row">
        <div style="flex:1;">
          <div class="setting-label">Timezone</div>
          <div class="setting-desc">Your local timezone</div>
        </div>
        <select name="timezone" style="width:180px;">
          <?php foreach (['Africa/Nairobi', 'UTC', 'America/New_York', 'Europe/London'] as $tz): ?>
            <option <?= ($settings['timezone'] ?? 'Africa/Nairobi') === $tz ? 'selected' : '' ?>><?= $tz ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div style="margin-top:1.2rem;">
        <button class="btn btn-primary" type="submit">Save Settings</button>
      </div>
    </form>
  </div>

  <?php if ($settings): ?>
    <div class="card">
      <div class="card-title">Saved settings</div>
      <table class="info-table">
        <tr><td>Notifications</td><td><?= $settings['notifications'] ? '<span class="badge badge-green">On</span>' : '<span class="badge badge-red">Off</span>' ?></td></tr>
        <tr><td>Dark Mode</td>    <td><?= $settings['dark_mode']     ? '<span class="badge badge-green">On</span>' : '<span class="badge badge-red">Off</span>' ?></td></tr>
        <tr><td>Newsletter</td>   <td><?= $settings['newsletter']    ? '<span class="badge badge-green">On</span>' : '<span class="badge badge-red">Off</span>' ?></td></tr>
        <tr><td>Language</td>     <td><?= safe($settings['language']  ?? '—') ?></td></tr>
        <tr><td>Timezone</td>     <td><?= safe($settings['timezone']  ?? '—') ?></td></tr>
      </table>
    </div>
  <?php endif; ?>


<?php /* ══════════════════════════════
          PAGE: REQUEST INFO
          ══════════════════════════════ */ elseif ($page === 'request'): ?>

  <div class="page-title">Request Info</div>
  <div class="page-sub">Live data from <code>$_SERVER</code>, <code>$_GET</code>, and <code>$_SESSION</code>.</div>

  <div class="card">
    <div class="card-title">$_SERVER</div>
    <table class="info-table">
      <?php
        $keys = ['REQUEST_METHOD','REQUEST_URI','HTTP_HOST','REMOTE_ADDR','SERVER_PROTOCOL','HTTP_USER_AGENT'];
        foreach ($keys as $k) {
          echo "<tr><td>$k</td><td>" . safe($_SERVER[$k] ?? '—') . "</td></tr>";
        }
      ?>
    </table>
  </div>

  <div class="card">
    <div class="card-title">$_GET params on this page</div>
    <?php if ($_GET): ?>
      <table class="info-table">
        <?php foreach ($_GET as $k => $v): ?>
          <tr><td><?= safe($k) ?></td><td><?= safe(is_array($v) ? implode(', ', $v) : $v) ?></td></tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <div style="color:#9ca3af;font-size:0.88rem;">None — try adding <code>?foo=bar</code> to the URL.</div>
    <?php endif; ?>
  </div>

  <div class="card">
    <div class="card-title">$_SESSION</div>
    <?php if ($_SESSION): ?>
      <table class="info-table">
        <?php foreach ($_SESSION as $k => $v): ?>
          <tr>
            <td><?= safe($k) ?></td>
            <td><?= safe(is_array($v) ? json_encode($v) : (string)$v) ?></td>
          </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <div style="color:#9ca3af;font-size:0.88rem;">Session is empty — save a profile or note first.</div>
    <?php endif; ?>
  </div>

<?php endif; ?>

</main>

</body>
</html>
