var TuckArmsController = (function() {
  var _ros;
  var _client;

  function init(ros, tuck_arms_action_name) {
    _ros = ros;
    _client = new ROSLIB.ActionClient({
      ros: _ros,
      serverName: tuck_arms_action_name,
      actionName: 'pr2_common_action_msgs/TuckArmsAction'
    });
  }

  function tuckArms(left, right) {
    var goal = new ROSLIB.Goal({
      actionClient: _client,
      goalMessage: {
        tuck_left: left,
        tuck_right: right
      }
    });
    goal.send();
  }

  return {
    init: init,
    tuckArms: tuckArms,
  };
})();
