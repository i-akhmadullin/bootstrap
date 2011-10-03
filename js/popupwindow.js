function ClosePopup(){
	$overlay.hide();
	$popupwindow.hide();
	return false;
}

function ShowPopup(url) {
	var obj = $(this);
	if (obj.attr('href')) {
		url = obj.attr('href');
	}
	if (!url) {
		return false;
	}
	$overlay.show();
	$(document).keyup(function(e) { //test this
		if (e.keyCode == 27) { ClosePopup(); } // close popup on esc
	});
	$("html").click(function(e) {
		ClosePopup();
	});
	$('.Popup').click(function(event) {
		event.stopPropagation();
	});
	/*$.ajax({
		url: url,
		type: "GET",
		dataType: 'html',
		error: function () {
			$("#HideBlock").hide();
		},
		success: function (html) {
			$("#PopupContent").html(html); //PopupWindow
			$("#PopupWindow form").submit(SubmitForm);
			$("#PopupWindow").show();
		}
	});*/
	$popupwindow.show();
	return false;
}

function SubmitForm(){
	if ($(this).hasClass("NotClickable")) {
		return false;
	}
	var form = $(this);
	form.addClass("NotClickable");
	data = form.serializeArray();
	$.ajax({
		url: form.attr('action'),
		type: "POST",
		dataType: 'json',
		data: data,
		error: function () {
			form.removeClass("NotClickable");
			alert("Ошибочка закралась.");
		},
		success: function (data) {
			form.removeClass("NotClickable");
			form.find('span.errors').remove();
			if (data && data.errors) {
                $("ul.messages").detach();
				for (var item in data.errors) {
					tag = '<span class="errors">' + data.errors[item] + '</span>';
					if (item == 'captcha') {
						item = 'captcha_0';
					}
					form.find("#id_" + item).parent().parent().find(".FormError").append(tag);
				}
				form.find("a[href=#refresh]").click();
				return false;
			}
			else {
				ShowPopup(form.attr('action'));
			}
		}
	});
	return false;
}

var $overlay, $popupwindow;

$(function () {
	$('.RightMargin').after(
		$overlay	= $('<div class="HideBlock" id="HideBlock" style="display: none;">&nbsp;</div>'),
		$popupwindow = $('<div class="PopupWindow" id="PopupWindow" style="display: none;"></div>')
		/*loading	= $('<div></div>'),*/
	);
	$popupwindow.append(
		'<div class="PopupWindowInner">' +
			'<div class="PopupWindowTR">' +
				'<div class="Popup">' +
					'<div class="d-shadow">' +
						'<div class="d-shadow-wrap">' +
							'<a class="PopupWindowClose" id="PopupWindowClose">Закрыть</a>' +
							'<div class="d-sh-cn d-sh-tl">&nbsp;</div>' +
							'<div class="d-sh-cn d-sh-tr">&nbsp;</div>' +
							'<div class="PopupContent" id="PopupContent">Попап</div>' +
							'<div class="FormSend" id="FormSend">' +
								'<a href="#">Отправить заказ</a>' +
							'</div>' +
						'</div>' +
						'<div class="d-sh-cn d-sh-bl">&nbsp;</div>' +
						'<div class="d-sh-cn d-sh-br">&nbsp;</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>');
	$("#PopupWindowClose").click(ClosePopup);
	$(".ShowPopup").live('click', ShowPopup);
});