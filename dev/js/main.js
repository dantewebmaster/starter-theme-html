var theDate = new Date();

$(function () {
    $('.date').html(theDate.getDate() + ' do ' + theDate.getMonth() + ' de ' + theDate.getFullYear());
});
