var BaseController = (function() {
  var _ros;
  var _linear_speed = 0.5; // meters / second
  var _angular_speed = 0.75; // radians / second
  var _cmd_vel;

  function init(ros, base_topic) {
    _ros = ros;
    _cmd_vel = new ROSLIB.Topic({
      ros: _ros,
      name: base_topic,
      messageType: 'geometry_msgs/Twist'
    });
  }

  function sendTwist(dx, dy, dr) {
    var twist = new ROSLIB.Message({
      angular: {
        x: 0,
        y: 0,
        z: dr
      },
      linear: {
        x: dx,
        y: dy,
        z: 0
      }
    });
    _cmd_vel.publish(twist);
  }

  function moveForward() {
    sendTwist(_linear_speed, 0, 0);
  }

  function moveLeft() {
    sendTwist(0, _linear_speed, 0);
  }

  function moveRight() {
    sendTwist(0, -_linear_speed, 0);
  }

  function moveBackward() {
    sendTwist(-_linear_speed, 0, 0);
  }

  function rotateClockwise() {
    sendTwist(0, 0, -_angular_speed);
  }

  function rotateCounterClockwise() {
    sendTwist(0, 0, _angular_speed);
  }

  function setLinearSpeed(speed) {
    _linear_speed = speed;
  }

  function setAngularSpeed(speed) {
    _angular_speed = speed;
  }

  return {
    init: init,
    sendTwist: sendTwist,
    moveForward: moveForward,
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveBackward: moveBackward,
    rotateClockwise: rotateClockwise,
    rotateCounterClockwise: rotateCounterClockwise,
    setLinearSpeed: setLinearSpeed,
    setAngularSpeed: setAngularSpeed
  };
})();
