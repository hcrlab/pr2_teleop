var HeadController = (function() {
  var _ros;
  var _point_hor_angle = 0;
  var _point_vert_angle = 0;
  var _head_client;

  function init(ros, head_action_name) {
    _ros = ros;
    _head_client = new ROSLIB.ActionClient({
      ros: _ros,
      serverName: head_action_name,
      actionName: 'pr2_controllers_msgs/PointHeadAction'
    });
  }

  function sendGoal(horizontal_angle, vertical_angle) {
    var head_goal = new ROSLIB.Goal({
      actionClient : _head_client,
      goalMessage: {
        target: {
          header: {
            frame_id: 'base_link'
          },
          point: {
            x: (10 * Math.cos(horizontal_angle)),
            y: (10 * Math.sin(horizontal_angle)),
            z: (10 * Math.sin(vertical_angle))
          }
        },
        pointing_frame: 'high_def_frame',
        min_duration: '0.5',
        max_velocity: 1.0
      }
    });
    head_goal.send();
  }

  function lookUp() {
    _point_vert_angle += (Math.PI / 36);
    if (_point_vert_angle > Math.PI / 6) {
      _point_vert_angle = Math.PI / 6;
    }
    sendGoal(_point_hor_angle, _point_vert_angle);
  }

  function lookLeft() {
    _point_hor_angle += (Math.PI / 36);
    if (_point_hor_angle > Math.PI * 0.75) {
      _point_hor_angle = Math.PI * 0.75;
    }
    sendGoal(_point_hor_angle, _point_vert_angle);
  }

  function lookDown() {
    _point_vert_angle -= (Math.PI / 36);
    if (_point_vert_angle < -Math.PI / 2) {
      _point_vert_angle = -Math.PI / 2;
    }
    sendGoal(_point_hor_angle, _point_vert_angle);
  }

  function lookRight() {
    _point_hor_angle -= (Math.PI / 36);
    if (_point_hor_angle < -Math.PI * 0.75) {
      _point_hor_angle = -Math.PI * 0.75;
    }
    sendGoal(_point_hor_angle, _point_vert_angle);
  }

  return {
    init: init,
    sendGoal: sendGoal,
    lookUp: lookUp,
    lookDown: lookDown,
    lookLeft: lookLeft,
    lookRight: lookRight
  };
})();
