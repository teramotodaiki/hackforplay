<?php

/**
 * template class
 */
class Template extends stdClass
{
  public static $mypagePrefix = "/m/?id=";
  public static $playstagePrefix = "/s/?id=";

  public static function UserLink($user, $target_blank = true)
  {
    ?>
    <a href="<?php echo self::$mypagePrefix . $user['ID']; ?>" target="_blank">
      <span><?php echo $user['Nickname']; ?></span>
      <?php if ($target_blank): ?>
        <span class="glyphicon glyphicon-new-window"></span>
      <?php endif; ?>
    </a>
  <?php
  }

  public static function StageLink($stage, $target_blank = true)
  {
    ?>
    <a href="/s/?id=<?php echo self::$playstagePrefix . $stage['ID']; ?>" target="_blank">
      <span><?php echo $stage['Title']; ?></span>
      <?php if ($target_blank): ?>
        <span class="glyphicon glyphicon-new-window"></span>
      <?php endif; ?>
    </a>
    <?php
  }
}

?>
