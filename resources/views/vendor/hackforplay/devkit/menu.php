<?php

// Fetch kit stages
$stmt	= $dbh->prepare('SELECT "ID","Title","Thumbnail" FROM "Stage" WHERE "SourceID" IS NULL');
$stmt->execute();

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <style>
    .flex-container {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
    }
    .flex-item {
      flex: 0 0 20%;
      padding: 10px 0px;
    }
    .thumbnail {
      width: 100%;
    }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <?php while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) : ?>
        <div class="flex-item">
          <img class="thumbnail" src="<?php echo $row['Thumbnail']; ?>" alt="NoImage" />
          <a href="/devkit/?id=<?php echo $row['ID']; ?>"><?php echo $row['Title']; ?></a>
        </div>
      <?php endwhile; ?>
    </div>
  </body>
</html>
