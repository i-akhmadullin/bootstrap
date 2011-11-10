function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function deserialize(str) {
    var href = str,
        last_index = href.lastIndexOf("?"),
        result = {};
    if (last_index > -1) {
        href = href.substr(last_index + 1);
    }
    var data = href.split("&")
    for (var i = 0; i < data.length; i++) {
        if (!data[i]) continue;
        var pair = decodeURIComponent(data[i]).split("=");
        if (pair.length != 2) continue;
        var _name = pair[0];
        var value = pair[1];
        result[_name] = value;
    }
    return result;
}
$.ajaxSetup({
	cache: false,
	type: 'POST',
	dataType: 'html',
	beforeSend: function(xhr, settings) {
		if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
			xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		}
	}
});

$(document).ready(function() {
	$("#Rotator").rotator({
		'items': '.RotatorItem',
		'prev': '#RotatorPrevLink',
		'next': '#RotatorNextLink',
		'visibleCount': 1,
		'changeCount': 1,
		//'hashPrefix': "slide",
		//'autoPlay': true,
		//'easing': "easeOutQuad",
		'keyboardNavigation': true
	});
});