$(document).ready(function() {
	$("#Rotator").rotator2({
		itemsSelector: '.RotatorItem',
		prev: '#RotatorPrevLink',
		next: '#RotatorNextLink',
		blocksPerScreen: 1,
		blocksChangePerPage: 1,
		keyboardNavigation: true
	});
});