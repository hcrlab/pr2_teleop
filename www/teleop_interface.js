"use strict";

/**
 * Setup all GUI elements when the page is loaded.
 */
(function() {
  function init() {
    // Create the main viewer.
    var viewer = new MJPEGCANVAS.MultiStreamViewer({
      divID : 'mjpeg',
      host : 'localhost',
      width : 640,
      height : 480,
      topics : [ '/wide_stereo/left/image_color', '/l_forearm_cam/image_color', '/r_forearm_cam/image_color' ],
      labels : [ 'Robot View', 'Left Arm View', 'Right Arm View' ]
    });

    // Connecting to ROS.
    var ros = new ROSLIB.Ros({
      url : 'ws://localhost:9090'
    });

    // Initialize the driving teleop.
    var teleop = new KEYBOARDTELEOP.Teleop({
      ros : ros,
      topic : '/base_controller/command'
    });
  }

  window.onload = init;
}) ();