<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $channel['ChName']; ?></title>
    <?php require_once '../library.php' ?>
    <style>
    body {
      background-color: rgba(0, 0, 0, 1.0);
    }
    header {
      background-color: rgba(255, 255, 255, 0.5);
      padding: 4px 0px 2px 0px;
    }
    .flex-container {
      display: flex;
      justify-content: center;
      align-items: baseline;
      width: 100%;
    }
    .flex-container>* {
      flex: 0 0 auto;
      padding: 0px 10px;
      margin: 0;
    }
    .cast-frame-wrapper {
      margin: 0 auto;

      background-color: black;
    }
    .cast-frame-wrapper iframe {
      width: 100%;
      height: 100%;
    }
    </style>
  </head>
  <body>
    <?php require_once '../analyticstracking.php' ?>
    <script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js" type="text/javascript"></script>
  	<script src="https://www.youtube.com/iframe_api" type="text/javascript"></script>
    <script type="text/javascript">
    window.channelInfo = {
      id: <?php echo $channel['ID']; ?>,
      type: "project",
      token: "<?php echo $channel['ProjectToken']; ?>",
      script_id: "<?php echo $channel['ScriptID']; ?>",
      update: "<?php echo $channel['Updated']; ?>"

    };
    </script>
    <script src="view.js" charset="utf-8"></script>
    <script src="../s/openExternal.js" charset="utf-8"></script>
    <header class="affix flex-container">
      <span class="relative-DisplayName"><?php echo $channel['ChName']; ?></span>
      <span class="text-muted hidden-xs"><?php echo $channel['TeamName']; ?></span>
      <span>
        <a href="/m/?id=<?php echo $user['ID']; ?>" class="relative-Nickname" target="_blank">
          <?php echo $user['Nickname']; ?>
        </a> is casting now.
      </span>
      <a href="javascript:void(0)" class="refresh-on-click update">
        <span class="glyphicon glyphicon-refresh"></span>
      </a>
      <label for="cast-auto-reload">
        <input type="checkbox" id="cast-auto-reload" value=""> auto
      </label>
      <span data-toggle="modal" data-target="#codeModal">
        <span class="glyphicon glyphicon-file"></span>
      </span>
    </header>
  	<div class="modal fade" id="codeModal" tabindex="-1" role="dialog">
  		<div class="modal-dialog modal-lg">
  			<div class="modal-content">
  	    		<div class="modal-header">
  			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  		    	</div>
  			    <div class="modal-body">
  			    	<pre class="overflow-auto"><code></code></pre>
  			    </div>
  	    		<div class="modal-footer">
  	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
  	    		</div>
  			</div>
  		</div>
  	</div>
    <div class="cast-frame-wrapper">
    </div>
    <div class="container-open-external affix"></div>
  </body>
</html>
