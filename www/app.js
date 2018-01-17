var Pr2TeleopApp = (function() {
  var _ros;

  // Given the name of a topic, returns the stream URL for web_video_server.
  function _streamUrl(topic) {
    return window.location.protocol + '//' + window.location.hostname + ':9998/streams/' + topic + '.webm?enc=webm&bitrate=250000&framerate=15';
  }

  // Initializes the teleop app.
  function init(base_controller, head_controller, tuck_arms_controller, touch_interface) {
    var websocketUrl = (function() {
      var hostname = window.location.hostname;
      var protocol = 'ws:';
      if (window.location.protocol == 'https:') {
        protocol = 'wss:'
      }
      return protocol + '//' + hostname + ':9090';
    })();
    _ros = new ROSLIB.Ros({
      url: websocketUrl
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
    headimage.attr('src', _streamUrl('head_mount_kinect/rgb/image_rect_color'));
    
    base_controller.init(_ros, '/base_controller/command');
    head_controller.init(_ros, '/head_traj_controller/point_head_action');
    head_controller.sendGoal(0, 0);
    tuck_arms_controller.init(_ros, '/tuck_arms');
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

    touch_interface.setTuckArms(function() {
      tuck_arms_controller.tuckArms(true, true);
    });
  }

  return {
    init: init,
  };
})()
