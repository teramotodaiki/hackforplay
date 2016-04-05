<?php
/**
 * /src/?author={AuthorName}&sub={SubName}
 * Put resource data with Content-Type
*/

require_once '../preload.php';

$author = filter_input(INPUT_GET, 'author') or die('invalid-author-name');
$sub = filter_input(INPUT_GET, 'sub') or die('invalid-sub-name');

$stmt = $dbh->prepare('SELECT "ContentType","Data" FROM "Resource" WHERE "AuthorName"=:author AND "SubName"=:sub');
$stmt->bindValue(':author', $author, PDO::PARAM_STR);
$stmt->bindValue(':sub', $sub, PDO::PARAM_STR);
$stmt->execute();

$resource = $stmt->fetch(PDO::FETCH_ASSOC) or die('resource-not-found');

header("Content-Type: {$resource['ContentType']}");
echo $resource['Data'];

?>
