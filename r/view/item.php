<?php // print one item
$id		= $item['id'];
$path	= $item['path'];
$title 	= $item['title'];
$count	= $item['playcount'];
$attr 	= in_array($id, $cleared) ? "h4p_item-cleared" : "";
?>
<a href="/s?id=<?php echo $id; ?>" title="<?php echo $title; ?>" target="_blank">
	<div class="col-md-<?php echo $size; ?> col-xs-<?php echo $size; ?> h4p_item <?php echo $attr ?>">
		<div class="h4p_item-thumbnail">
			<span class="h4p_item-src">/s/<?php echo $path; ?>thumb.png</span>
		</div>
		<div class="h4p_item-title">
			<h4><?php echo $title; ?></h4>
		</div>
		<div class="h4p_item-footer">
			プレイ回数：<b><?php echo $count."回"; ?></b>
		</div>
	</div>
</a>