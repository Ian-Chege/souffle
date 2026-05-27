<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PHP Syntax Practice</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #f0f2f5; color: #333; padding: 2rem; }
    h1   { text-align: center; margin-bottom: 2rem; color: #4f46e5; }
    section {
      background: white;
      border-radius: 10px;
      padding: 1.5rem 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    }
    h2   { color: #4f46e5; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.4rem; }
    pre  { background: #1e1e2e; color: #cdd6f4; padding: 1rem; border-radius: 6px; font-size: 0.9rem; overflow-x: auto; margin-bottom: 0.8rem; }
    .output { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 0.6rem 1rem; border-radius: 0 6px 6px 0; font-size: 0.95rem; }
    .label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 0.3rem; }
  </style>
</head>
<body>

<h1>PHP Syntax Practice</h1>

<?php


/* ══════════════════════════════════════════════
   1. VARIABLES & DATA TYPES
   ══════════════════════════════════════════════ */
$name    = "Ian";           // string
$age     = 23;              // integer
$price   = 9.99;            // float
$isReady = true;            // boolean
$nothing = null;            // null
?>

<section>
  <h2>1. Variables &amp; Data Types</h2>
  <pre>
$name    = "Ian";       // string
$age     = 23;          // integer
$price   = 9.99;        // float
$isReady = true;        // boolean
$nothing = null;        // null</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo "Name: $name <br>";
      echo "Age: $age <br>";
      echo "Price: $price <br>";
      echo "Ready: " . ($isReady ? 'Yes' : 'No') . " <br>";
      echo "Nothing: " . var_export($nothing, true);
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   2. STRINGS
   ══════════════════════════════════════════════ */
$firstName = "Ian";
$lastName  = "Doe";
$full      = $firstName . " " . $lastName;   // concatenation
$upper     = strtoupper($full);
$length    = strlen($full);
$replaced  = str_replace("Doe", "Smith", $full);
?>

<section>
  <h2>2. Strings</h2>
  <pre>
$full     = $firstName . " " . $lastName;  // concatenation
$upper    = strtoupper($full);
$length   = strlen($full);
$replaced = str_replace("Doe", "Smith", $full);</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo "Full: $full <br>";
      echo "Upper: $upper <br>";
      echo "Length: $length characters<br>";
      echo "Replaced: $replaced";
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   3. ARRAYS
   ══════════════════════════════════════════════ */
// Indexed array
$fruits = ["Apple", "Banana", "Cherry"];

// Associative array (key => value)
$person = [
  "name" => "Ian",
  "age"  => 23,
  "city" => "Nairobi",
];
?>

<section>
  <h2>3. Arrays</h2>
  <pre>
// Indexed
$fruits = ["Apple", "Banana", "Cherry"];

// Associative (key => value)
$person = ["name" => "Ian", "age" => 23, "city" => "Nairobi"];</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo "First fruit: " . $fruits[0] . "<br>";
      echo "Total fruits: " . count($fruits) . "<br>";
      echo "Person name: " . $person["name"] . "<br>";
      echo "City: " . $person["city"];
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   4. IF / ELSE / ELSEIF
   ══════════════════════════════════════════════ */
$score = 75;

if ($score >= 80) {
  $grade = "A";
} elseif ($score >= 60) {
  $grade = "B";
} else {
  $grade = "C";
}
?>

<section>
  <h2>4. If / Else / Elseif</h2>
  <pre>
$score = 75;

if ($score >= 80) {
  $grade = "A";
} elseif ($score >= 60) {
  $grade = "B";
} else {
  $grade = "C";
}</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php echo "Score: $score → Grade: $grade"; ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   5. LOOPS
   ══════════════════════════════════════════════ */
// for loop
$forResult = [];
for ($i = 1; $i <= 5; $i++) {
  $forResult[] = $i;
}

// foreach loop over array
$foreachResult = [];
foreach ($fruits as $fruit) {
  $foreachResult[] = $fruit;
}

// while loop
$whileResult = [];
$n = 1;
while ($n <= 3) {
  $whileResult[] = $n;
  $n++;
}
?>

<section>
  <h2>5. Loops</h2>
  <pre>
// for
for ($i = 1; $i <= 5; $i++) { … }

// foreach
foreach ($fruits as $fruit) { … }

// while
while ($n <= 3) { $n++; }</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo "for:     " . implode(", ", $forResult) . "<br>";
      echo "foreach: " . implode(", ", $foreachResult) . "<br>";
      echo "while:   " . implode(", ", $whileResult);
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   6. FUNCTIONS
   ══════════════════════════════════════════════ */
function greet(string $name, int $age): string {
  return "Hi $name, you are $age years old!";
}

function add(int $a, int $b): int {
  return $a + $b;
}

// Arrow function (short, anonymous)
$double = fn($x) => $x * 2;
?>

<section>
  <h2>6. Functions</h2>
  <pre>
function greet(string $name, int $age): string {
  return "Hi $name, you are $age years old!";
}

function add(int $a, int $b): int {
  return $a + $b;
}

$double = fn($x) => $x * 2;  // arrow function</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo greet($name, $age) . "<br>";
      echo "add(4, 7) = " . add(4, 7) . "<br>";
      echo "double(6) = " . $double(6);
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   7. CLASSES & OBJECTS
   ══════════════════════════════════════════════ */
class Animal {
  public string $name;
  private int $legs;

  public function __construct(string $name, int $legs) {
    $this->name = $name;
    $this->legs = $legs;
  }

  public function describe(): string {
    return "{$this->name} has {$this->legs} legs.";
  }
}

class Dog extends Animal {
  public function speak(): string {
    return "{$this->name} says: Woof!";
  }
}

$dog = new Dog("Rex", 4);
?>

<section>
  <h2>7. Classes &amp; Objects</h2>
  <pre>
class Animal {
  public string $name;
  private int $legs;

  public function __construct(string $name, int $legs) {
    $this->name = $name;
    $this->legs = $legs;
  }

  public function describe(): string {
    return "{$this->name} has {$this->legs} legs.";
  }
}

class Dog extends Animal {
  public function speak(): string {
    return "{$this->name} says: Woof!";
  }
}

$dog = new Dog("Rex", 4);</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo $dog->describe() . "<br>";
      echo $dog->speak();
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   8. MATCH EXPRESSION (PHP 8+)
   ══════════════════════════════════════════════ */
$day = "Mon";

$fullDay = match($day) {
  "Mon"  => "Monday",
  "Tue"  => "Tuesday",
  "Wed"  => "Wednesday",
  default => "Unknown day",
};
?>

<section>
  <h2>8. Match Expression (PHP 8+)</h2>
  <pre>
$day = "Mon";

$fullDay = match($day) {
  "Mon"  => "Monday",
  "Tue"  => "Tuesday",
  "Wed"  => "Wednesday",
  default => "Unknown day",
};</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php echo "$day → $fullDay"; ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   9. ARRAY FUNCTIONS
   ══════════════════════════════════════════════ */
$numbers  = [3, 1, 4, 1, 5, 9, 2, 6];
$evens    = array_filter($numbers, fn($n) => $n % 2 === 0);
$doubled  = array_map(fn($n) => $n * 2, $numbers);
$sum      = array_sum($numbers);
sort($numbers);
?>

<section>
  <h2>9. Array Functions</h2>
  <pre>
$numbers = [3, 1, 4, 1, 5, 9, 2, 6];

$evens   = array_filter($numbers, fn($n) => $n % 2 === 0);
$doubled = array_map(fn($n) => $n * 2, $numbers);
$sum     = array_sum($numbers);
sort($numbers);</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo "Evens:   " . implode(", ", $evens) . "<br>";
      echo "Doubled: " . implode(", ", $doubled) . "<br>";
      echo "Sum:     $sum<br>";
      echo "Sorted:  " . implode(", ", $numbers);
    ?>
  </div>
</section>


<?php
/* ══════════════════════════════════════════════
   10. NULL SAFE & TERNARY OPERATORS
   ══════════════════════════════════════════════ */
$user  = null;
$label = $user ?? "Guest";            // null coalescing
$short = ($age >= 18) ? "Adult" : "Minor";  // ternary
// $city = $user?->getCity();         // null safe operator (would be null)
?>

<section>
  <h2>10. Null Coalescing &amp; Ternary</h2>
  <pre>
$user  = null;
$label = $user ?? "Guest";            // null coalescing → "Guest"
$short = ($age >= 18) ? "Adult" : "Minor";  // ternary
$city  = $user?->getCity();           // null safe → null, no error</pre>
  <div class="label">Output</div>
  <div class="output">
    <?php
      echo "Label: $label <br>";
      echo "Age check: $short";
    ?>
  </div>
</section>

</body>
</html>
