var TouchInterface = (function() {
  function setMoveForward(f) { 
    _base_forward_button.data('callback', f);
  }
  function setMoveBackward(f) {
    _base_backward_button.data('callback', f);
  }
  function setMoveLeft(f) {
    _base_left_button.data('callback', f);
  }
  function setMoveRight(f) {
    _base_right_button.data('callback', f);
  }
  function setRotateClockwise(f) {
    _base_cw_button.data('callback', f);
  }
  function setRotateCounterClockwise(f) {
    _base_ccw_button.data('callback', f);
  }
  function setHeadUp(f) {
    _head_up_button.data('callback', f);
  }
  function setHeadDown(f) {
    _head_down_button.data('callback', f);
  }
  function setHeadLeft(f) {
    _head_left_button.data('callback', f);
  }
  function setHeadRight(f) {
    _head_right_button.data('callback', f);
  }
  function setTuckArms(f) {
    _tuck_arms_button.data('callback', f);
  }

  var _base_forward_button;
  var _base_backward_button;
  var _base_left_button;
  var _base_right_button;
  var _base_cw_button;
  var _base_ccw_button;
  var _head_up_button;
  var _head_down_button;
  var _head_left_button;
  var _head_right_button;
  var _tuck_arms_button;
  var _timer;
  var _interval = 100;

  function _applyAll(f) {
    f(_base_forward_button);
    f(_base_backward_button);
    f(_base_left_button);
    f(_base_right_button);
    f(_base_cw_button);
    f(_base_ccw_button);
    f(_head_up_button);
    f(_head_down_button);
    f(_head_left_button);
    f(_head_right_button);
    f(_tuck_arms_button);
  }

  function _handleButtonPress(button) {
    if (!button.hasClass('pressed')) {
      clearInterval(_timer);
      return;
    }
    button.data('callback')();
  }

  function init() {
    _base_forward_button = $('#base_forward');
    _base_backward_button = $('#base_backward');
    _base_left_button = $('#base_left');
    _base_right_button = $('#base_right');
    _base_cw_button = $('#base_cw');
    _base_ccw_button = $('#base_ccw');
    _head_up_button = $('#head_up');
    _head_down_button = $('#head_down');
    _head_left_button = $('#head_left');
    _head_right_button = $('#head_right');
    _tuck_arms_button = $('#tuck_arms');

    _applyAll(function(button) {
      button.data('pressed', false);
    });
    _applyAll(function(button) {
      button.bind('touchstart mousedown', function() {
        button.addClass('pressed');
        // In case the timer is not cleared before reassigning,
        // clear before reassignment, otherwise it could infinite loop.
        clearInterval(_timer);
        _timer = setInterval(function() {
          _handleButtonPress(button);
        }, _interval);
      });
      button.bind('touchend mouseup', function() {
        clearInterval(_timer);
        button.removeClass('pressed');
      });
    });
  }

  return {
    init: init,
    setMoveForward: setMoveForward,
    setMoveBackward: setMoveBackward,
    setMoveLeft: setMoveLeft,
    setMoveRight: setMoveRight,
    setRotateClockwise: setRotateClockwise,
    setRotateCounterClockwise: setRotateCounterClockwise,
    setHeadUp: setHeadUp,
    setHeadDown: setHeadDown,
    setHeadLeft: setHeadLeft,
    setHeadRight: setHeadRight,
    setTuckArms: setTuckArms,
  };
})();
