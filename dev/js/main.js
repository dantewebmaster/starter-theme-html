$(document).ready(function () {
	$("#show-labels").on("mouseover", function() {
		$("#events-labels").removeClass("hidden");
	});
	$("#events-labels").on("mouseleave", function () {
		$("#events-labels").addClass("hidden");
	});
});
