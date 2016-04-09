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

  public static function RejectModal($reasons)
  {
    ?>
  	<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog">
  		<div class="modal-dialog">
  			<div class="modal-content">
  	    		<div class="modal-header">
  			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  	    			<h4>リジェクトする理由</h4>
  		    	</div>
  			    <div class="modal-body">
  			    	<form>
                <?php foreach ($reasons as $key => $value): ?>
                <div class="checkbox">
                  <label>
                    <input type="checkbox" value="<?php echo $value['ID']; ?>">
                    <span><?php echo $value['Message']; ?></span>
                  </label>
                </div>
                <?php endforeach; ?>
  							<textarea name="notice" rows="8" cols="40" placeholder="A notice to stage author"></textarea>
  			    		<button type="submit" class="btn btn-danger btn-lg btn-block" >リジェクト</button>
  			    	</form>
  			    </div>
  	    		<div class="modal-footer">
  	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
  	    		</div>
  			</div>
  		</div>
  	</div>
    <?php
  }

}

?>
