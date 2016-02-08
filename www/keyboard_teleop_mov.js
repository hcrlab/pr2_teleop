/**
 * @author Russell Toris - rctoris@wpi.edu
 */

var KEYBOARDTELEOP = KEYBOARDTELEOP || {
  REVISION : '2'
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * Manages connection to the server and all interactions with ROS.
 *
 * Emits the following events:
 *   * 'change' - emitted with a change in speed occurs
 *
 * @constructor
 * @param options - possible keys include:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the Twist topic to publish to, like '/cmd_vel'
 *   * throttle (optional) - a constant throttle for the speed
 */
KEYBOARDTELEOP.Teleop = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var topic = options.topic || '/cmd_vel';

  // linear x and y movement and angular z movement
  var x = 0;
  var y = 0;
  var z = 0;

  var point_x = 10;
  var point_y = 0;
  var point_z = 0;

  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : topic,
    messageType : 'geometry_msgs/Twist'
  });

  







  var head_controller = new ROSLIB.ActionClient({
    ros : ros,
    serverName : '/head_traj_controller/point_head_action',
    actionName : 'pr2_controllers_msgs/PointHeadAction'
    //timeout : 
  });

  // var head_goal = new ROSLIB.Goal({
  //   actionClient : head_controller,
  //   goalMessage : {
  //     target : {
  //       header : {
  //         frame_id : 'base_link'
  //       },
  //       point : {
  //         x : 3.0,
  //         y : 3.0,
  //         z : 3.0
  //       }
  //     },
  //     pointing_frame : "high_def_frame",
  //     min_duration : '0.5',
  //     max_velocity : 1.0
  //   }
  // });
  // head_goal.send();

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });










  // sets up a key listener on the page used for keyboard teleoperation
  var handleKey = function(keyCode, keyDown) {
    // used to check for changes in speed
    var oldX = x;
    var oldY = y;
    var oldZ = z;

    var old_point_x = point_x;
    var old_point_y = point_y;
    var old_point_z = point_z;

    // check which key was pressed
    switch (keyCode) {
      case 81: //Q key
        // turn left
        z = 1;
        break;
      case 87: //W key
        // up
        x = 0.5;
        break;
      case 87: //up arrow
        // up
        x = 0.5;
        break;
      case 69: //E key
        // turn right
        z = -1;
        break;
      case 83: //S key
        // down
        x = -0.5;
        break;
      case 40: //down arrow
        // down
        x = -0.5;
        break;
      case 68: //D key 
        // strafe right
        y = -0.5;
        break;
      case 39: //right arrow 
        // strafe right
        y = -0.5;
        break;
      case 65: //A key
        // strafe left
        y = 0.5;
        break;
      case 37: //left arrow
        // strafe left
        y = 0.5;
        break;



      //Keys for head movement
      
      case 73: //I key
        point_z++;
        break;
      case 74: //J key
        point_y++;
        break;
      case 75: //K key
        point_z--;
        break;
      case 76: //L key
        point_y--;
        break;
      
    }

    // publish the command
    var twist = new ROSLIB.Message({
      angular : {
        x : 0,
        y : 0,
        z : z
      },
      linear : {
        x : x,
        y : y,
        z : z
      }
    });
    cmdVel.publish(twist);



    var head_goal = new ROSLIB.Goal({
      actionClient : head_controller,
      goalMessage : {
        target : {
          header : {
            frame_id : 'base_link'
          },
          point : {
            x : point_x,
            y : point_y,
            z : point_z
          }
        },
        pointing_frame : "high_def_frame",
        min_duration : '0.5',
        max_velocity : 1.0
      }
    });
    


    // check for changes
    if (oldX !== x || oldY !== y || oldZ !== z) { //add conditions for head pointing changed
      that.emit('change', twist);
    }

    // check for changes
    if (old_point_x !== point_x || old_point_y !== point_y || old_point_z !== point_z) { //add conditions for head pointing changed
      head_goal.send();
    }
  };

  // handle the key
  var body = document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', function(e) {
    handleKey(e.keyCode, true);
  }, false);
  body.addEventListener('keyup', function(e) {
    handleKey(e.keyCode, false);
  }, false);
};
KEYBOARDTELEOP.Teleop.prototype.__proto__ = EventEmitter2.prototype;
