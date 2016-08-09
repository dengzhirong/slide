/**
 * [滑动手势]
 * @param  {[type]} defaultOptions [description]
 *    defaultOptions的属性值如下：
 *        element
 *        limit
 *        touchstart(e)
 *        touchmove(moveDistance.x, moveDistance.y)
 *        touchend(gesture, moveDistance)
 */
function getGesture(defaultOptions) {
    var options = $.extend({
        element: $(document),
        limit: 100
    }, defaultOptions);
    var touchstartPosition = {},
        touchsEndPosition = {},
        touchmovePosition = {},
        moveDistance = {};

    var mousedownPosition = {},
        mousemovePosition = {},
        mouseupPosition = {},
        mousemoveDistance = {};

    var isPC = true;

    options.element.addEventListener("touchstart", function(e) {
        e.preventDefault();
        var touches = e.touches ? e.touches[0] : e;
        if(!e.touches) {
            isPC = true;
        } else {
            isPC = false;
        }
        touchstartPosition = {
            x : touches.pageX,
            y : touches.pageY
        };
        // console.log(touchstartPosition);
        if(typeof options.touchstart == "function") {
            options.touchstart(e);
        }
    });

    options.element.addEventListener("touchmove", function(e) {
        e.preventDefault();
        var touches = e.touches ? e.touches[0] : e;
        touchmovePosition = {
            x : touches.pageX,
            y : touches.pageY
        };
        // console.log("move");
        moveDistance = {
            x : touchmovePosition.x - touchstartPosition.x,
            y : touchmovePosition.y - touchstartPosition.y
        };
        // console.log(touchstartPosition);
        if(typeof options.touchmove == "function") {
            options.touchmove(moveDistance.x, moveDistance.y);
        }
    });

    options.element.addEventListener("touchend", function(e) {
        e.preventDefault();
        var distance = {};
        var gesture = {};
        var changedTouches = e.changedTouches ? e.changedTouches[0] : e;
        touchsEndPosition = {
            x : changedTouches.pageX,
            y : changedTouches.pageY
        };
        distance = {
            x: touchsEndPosition.x - touchstartPosition.x,
            y: touchsEndPosition.y - touchstartPosition.y
        };
        if(Math.abs(distance.x) >= options.limit) {
            gesture.x = (distance.x > 0) ? "right" : "left";
        } else {
            gesture.x = "";
        }
        if(Math.abs(distance.y) >= options.limit) {
            gesture.y = (distance.y > 0) ? "down" : "up";
        } else {
            gesture.y = "";
        }
        if(typeof options.touchend == "function") {
            options.touchend(gesture, moveDistance);
        }
    });
    if(isPC) {
        var isMouseDown = false;
        options.element.addEventListener("mousedown", function(e) {
            // e.preventDefault();
            isMouseDown = true;
            if(!e.touches) {
                isPC = true;
            } else {
                isPC = false;
            }
            mousedownPosition = getMouse(e);
            if(typeof options.touchstart == "function") {
                options.touchstart(e);
            }
        });

        options.element.addEventListener("mousemove", function(e) {
            if(isMouseDown) {
                e.preventDefault();
                mousemovePosition = getMouse(e);
                // console.log("move");
                mousemoveDistance = {
                    x : mousemovePosition.x - mousedownPosition.x,
                    y : mousemovePosition.y - mousedownPosition.y
                };
                // console.log(mousemoveDistance);
                if(typeof options.touchmove == "function") {
                    options.touchmove(mousemoveDistance.x, mousemoveDistance.y);
                }
            }
        });

        options.element.addEventListener("mouseup", function(e) {
            if(isMouseDown) {
                e.preventDefault();
                var distance = {};
                var gesture = {};
                mouseupPosition = getMouse(e);
                distance = {
                    x: mouseupPosition.x - mousedownPosition.x,
                    y: mouseupPosition.y - mousedownPosition.y
                };
                if(Math.abs(distance.x) >= options.limit) {
                    gesture.x = (distance.x > 0) ? "right" : "left";
                } else {
                    gesture.x = "";
                }
                if(Math.abs(distance.y) >= options.limit) {
                    gesture.y = (distance.y > 0) ? "down" : "up";
                } else {
                    gesture.y = "";
                }
                if(typeof options.touchend == "function") {
                    options.touchend(gesture, moveDistance);
                }


                isMouseDown = false;
            }
        });
    }

    function getMouse(event) {
        var event = event || window.event;
        var mouse = {};
        var x, y;
        if(event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageX;
        } else if(event.clientX || event.clientY) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            x = event.clientX + scrollLeft;
            y = event.clientY + scrollTop;
        }
        mouse.x = x;
        mouse.y = y;
        return mouse;
    }
}