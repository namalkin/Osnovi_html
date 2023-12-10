$(document).ready(function () {
    $(".valid").css('display','none');
    var boxx = $("#box");
    var box_Width = boxx.width()-20;
    var box_Height = boxx.height()-20;

    function moveObjects() {
        $(".circle").each(function () {
            var XX, YY;
            var obj = $(this).offset();
            var black_get = $("#black").offset();

            if (obj.left+20 > black_get.left && 
                obj.left < black_get.left + 100 &&
                obj.top+20 > black_get.top && 
                obj.top < black_get.top + 50) {
                XX = box_Width-20 + $(this).data("dx");
                YY = 0 + $(this).data("dy");
            }else{
                XX = $(this).position().left + $(this).data("dx");
                YY = $(this).position().top + $(this).data("dy");
            }
            if (XX > box_Width || XX < 0) {
                XX = XX < 0 ? 0 : box_Width;
                $(this).data("dx", -$(this).data("dx"));
            }
            if (YY > box_Height || YY < 0) {
                YY = YY < 0 ? 0 : box_Height;
                $(this).data("dy", -$(this).data("dy"));
            }

            $(this).animate({
                left: XX,
                top: YY
            }, {
                duration: 1,
                easing: "linear"
            });

        });
    }

    function ADDCircle() {
        var $circle = $("<div class='circle'></div>");
        $circle.data("dx", (Math.random() * 2 - 1) * 15);
        $circle.data("dy", (Math.random() * 2 - 1) * 15);
        $circle.css({
            left: Math.random() * (box_Width),
            top: Math.random() * (box_Height)
        });
        $circle.appendTo("#circle_container");
    }

    $("#start").click(function () {
        var num = parseInt($("#num").val());
        $("#circle_container").empty();

        if (isNaN(num)) {
            // Сообщение
            $(".valid").css('display','block');
            $("#message").text("Пожалуйста ну вы же не ввели ничего :(");
            return;
        }else  $(".valid").css('display','none');
        
        $('html, body').animate({
            scrollTop: $("#box").offset().top
        }, 500);
        
        for (var i = 0; i < num; i++) ADDCircle();
        

    });
    setInterval(moveObjects, 20);
});