function addToCart(el, html) {
    var cart = $('#basketInfo').offset();
    var img = el.parents('tr').find('img:first');
    if (!img.length) {
        img = el.parents('#content').find('.mainPic img');
    }
    var img_pos = img.position();
    var new_img = img.clone(true).insertAfter(img).css({ position: 'absolute', zIndex: '1000', left: img_pos.left, top: img_pos.top })
    .stop(1, 1).animate({
        width: img.width() * 1.5,
        height: img.height() * 1.5,
        top: img_pos.top - ((img.height() * 0.5) / 2),
        left: img_pos.left - ((img.width() * 0.5) / 2)
    }, 'fast', function() {
        new_img.animate({
            top: cart.top + 10,
            left: cart.left + 23,
            width: 0,
            height: 0
        }, 'slow', function() {
            $(this).remove();
        });
    });
};