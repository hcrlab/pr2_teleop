var Pr2TeleopApp = (function() {
  var _ros;

  // Given the name of a topic, returns the stream URL for web_video_server.
  function _streamUrl(topic) {
    var l = new URL(window.location.href);
    l.port = 8080;
    l.pathname = "stream";
    l.search= "topic=" + topic;
    return l.href;
  }

  function _updateHeadImage() {
    var headimage = $('#headimage');

    // Scale the image to fit inside the document at a 4:3 aspect ratio.
    var docwidth = $(window).width();
    var docheight = $(window).height();
    if (docwidth / docheight > 4/3) {
      headimage.attr('height', (docheight-5));
      headimage.attr('width', (docheight-5) * 4/3);
    } else {
      headimage.attr('height', (docwidth-5) * 3/4);
      headimage.attr('width', (docwidth-5));
    }
  }

  // Initializes the teleop app.
  function init(base_controller, head_controller, touch_interface) {
    $.get('/get_websocket_url', function(websocket_url) {
      _ros = new ROSLIB.Ros({
        url: websocket_url
      });
      _ros.on('connection', function() {
        console.log('Connected to websocket server.');
      });
      _ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
      });
      _ros.on('close', function() {
        console.log('Connection to websocket server closed.');
      });

      var headimage = $('#headimage');
      headimage.attr('src', _streamUrl('/wide_stereo/right/image_rect_color'));
      _updateHeadImage();
      $(window).resize(_updateHeadImage);
      
      base_controller.init(_ros, '/base_controller/command');
      head_controller.init(_ros, '/head_traj_controller/point_head_action');
      touch_interface.init();

      touch_interface.setMoveForward(base_controller.moveForward);
      touch_interface.setMoveBackward(base_controller.moveBackward);
      touch_interface.setMoveLeft(base_controller.moveLeft);
      touch_interface.setMoveRight(base_controller.moveRight);
      touch_interface.setRotateClockwise(base_controller.rotateClockwise);
      touch_interface.setRotateCounterClockwise(base_controller.rotateCounterClockwise);
      touch_interface.setHeadUp(head_controller.lookUp);
      touch_interface.setHeadDown(head_controller.lookDown);
      touch_interface.setHeadLeft(head_controller.lookLeft);
      touch_interface.setHeadRight(head_controller.lookRight);
    });
  }

  return {
    init: init,
  };
})()
