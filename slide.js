
var slide = {};
slide.init = function(element) {
    new Slide(element);
};
/**
 * [Slide 生成器]
 * @param {[jquery dom]} element [slide盒子元素，jQuery DOM类型]
 */
function Slide(element) {
    var slideBox = element, // slide最外层盒子
        slideList = slideBox.find("[data-slide='list']"), // item包裹容器
        slideItems = slideBox.find("[data-slide='item']"), // items
        slideItemLength = slideItems.length, // items数量
        curIndex = 0; // 当前显示的item索引

    // 生成上下切换按钮
    var prevBtn = $("<span></span>").attr("data-slide", "prev");
    var nextBtn = $("<span></span>").attr("data-slide", "next");
    slideBox.append(prevBtn).append(nextBtn);

    // 初始化slide的样式
    slideBox.attr("data-slide", "slide");

    // 初始化slide-item的宽高
    var slideBoxWidth = slideBox.width(),
        slideBoxHeight = slideBox.height();
    slideItems.each(function(index, element) {
        $(element).width(slideBoxWidth);
        $(element).height(slideBoxHeight);
    });

    // 初始化slide-list的宽度
    var slideListWidth = slideItemLength * slideBoxWidth;
    slideList.width(slideListWidth);

    // 检查是否显示上下页按钮
    checkPrevNextShow();

    // 上下页切换动画
    $(slideBox).delegate('[data-slide="prev"]', "click touchstart", function(e) {
        e.stopPropagation();
        switchToPrev();
    });
    $(slideBox).delegate('[data-slide="next"]', "click touchstart", function(e) {
        e.stopPropagation();
        switchToNext();
    });

    // 手势切换动画
    getGesture({
        element: $(element)[0],
        limit: 30,
        touchend: function(gesture, moveDistance) {
            if(gesture.x == "left") {
                switchToNext();
            } else if(gesture.x == "right") {
                switchToPrev();
            } else {
                switchToCur();
            }
        },
        touchmove: function(disX) {
            touchMoveSlide(curIndex, disX);
        }
    });

    // 检查是否显示上下页按钮
    function checkPrevNextShow() {
        if(curIndex <= 0) {
            slideBox.find('[data-slide="prev"]').css("display", "none");
        } else if(curIndex >= slideItemLength - 1) {
            slideBox.find('[data-slide="next"]').css("display", "none");
        } else {
            slideBox.find('[data-slide="prev"]').css("display", "block");
            slideBox.find('[data-slide="next"]').css("display", "block");
        }
    }

    // 切换到下一张
    function switchToNext() {
        if(curIndex < slideItemLength - 1) {
            curIndex++;
        } else {
            // curIndex = 0;
        }
        switchSlide(curIndex);
    }

    // 切换到上一张
    function switchToPrev() {
        if(curIndex > 0) {
            curIndex--;
        } else {
            // curIndex = slideItemLength - 1;
        }
        switchSlide(curIndex);
    }

    // 切换到当前页
    function switchToCur() {
        switchSlide(curIndex);
    }

    /**
     * [switchSlide 上下页切换动画]
     * @param  {[int]} index [当前显示的item索引]
     */
    function switchSlide(index) {
        // 水平方向的偏移量
        var translateX = -1 * index * slideBoxWidth;
        slideList.css({
            "left": translateX
            /*"transform": "translateX(" + translateX + "px)",
            "-moz-transform": "translateX(" + translateX + "px)",
            "-o-transform": "translateX(" + translateX + "px)",
            "-webkit-transform": "translateX(" + translateX + "px)"*/
        });
        checkPrevNextShow();
    }

    /**
     * [touchMoveSlide 上下页拖拽动画]
     * @param  {[type]} index [当前显示的item索引]
     * @param  {[type]} disX  [水平偏移量]
     */
    function touchMoveSlide(index, disX) {
        // 水平方向的偏移量
        var translateX = 0;
        if((index <= 0 && disX > 0) || (index >= slideItemLength - 1 && disX < 0) ) {
            // 最后一页不允许左拖，第一页不允许右拖
            translateX = -1 * index * slideBoxWidth;
        } else {
            translateX = -1 * index * slideBoxWidth + disX;
        }
        slideList.css({
            "left": translateX
            // "transform": "translateX(" + translateX + "px)"
        });
    }
}