$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});

$('.form-datetime').datetimepicker({
    format: "yyyy-mm-dd hh:ii",
    todayBtn:  1,
    startDate: new Date(),
    autoclose: 1,
    todayHighlight: 1,
    pickerPosition: "bottom-right",
    minuteStep: 15,
});

$('.delete-button').click(function(evt){
    evt.preventDefault();
    var popup = $('#popup');
    if(popup.length == 0) {
        $('body').append('<div id="popup" class="modal fade" role="dialog"/>');
        popup = $('#popup');
    }
    $.get(
        this.href,
        {},
        function(resp, status, xhr) {
            popup.html(resp);
            popup.modal();
        }
    );
});

$(function() {
    $('.date-form').change(function() {
        var delta = $(this).closest('td').find('.timedelta')
        $.post(
            $(this).closest('form').attr('action'),
            {due: this.value}
        )
        .done( function() {
            updateDelta()
            $(delta).effect("highlight", {color: '#58FA58'}, 2000)
        })
        .fail( function() {
            var error_popup = $('#error_popup');
            if(error_popup.length == 0) {
                $('body').append('<div id="error_popup" class="modal fade" role="dialog"/>');
                    error_popup = $('#error_popup');
            }
            $.get(
                "/error/",
                {},
                function(resp, status, xhr) {
                    error_popup.html(resp);
                    error_popup.modal();
                }
            );
        });
    });

    function updateDelta() {
        $('.duedate').each(function(i, form) {
            var due = $(form).find('.date-form').val()
            var delta = $(form).find('.timedelta')
            delta.text(moment(due, "YYYY-MM-DD HH:mm").fromNow())
            delta.attr("data-original-title", due)
            delta.tooltip({placement: 'left'})
        })
    }
    function scheduleUpdateDelta() {
        updateDelta();
        setTimeout(scheduleUpdateDelta, 20000);
    }
    function scheduleUpdate() {
    }
    scheduleUpdateDelta()
});

$(function() {
    $('#searchMails').keyup(function() {
        var key = $(this).val()
        var regex = new RegExp(key, 'i')
        $('.mailTableRow').each( function() {
            var subject = $(this).find('.subject').text()
            if (subject.search(regex) < 0) {
                $(this).hide()
            }
            else {
                $(this).show()
            }
        })
    })
});
