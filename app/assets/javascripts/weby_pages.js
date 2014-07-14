//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require tables
//= require_self

var WEBY = {};

// Mostrar mensagem para erros, no retorno do ajax
FlashMsg = {
   notify: function(status){
      //TODO algumas requisições ajax, retornam 500, mesmo quando OK
      //if([403,500].indexOf(status)>-1){
      if(status == 403){
         //flash = $(document.createElement('div'));
         //$('#content').prepend(flash);
         //flash.addClass('alert alert-error notify');
         //flash.text(status==403 ?'Acesso Negado':status==500 ?'Erro no servidor':'');
         //flash.append('<a class="close" data-dismiss="alert" href="#">×</a>');
         //flash.append(status==403 ?'Acesso Negado':'');
         $('<div class="modal">'+
             '<div class="modal-header"><h3>Acesso Negado</h3></div>'+
             '<div class="modal-body">'+
             '<div class="alert alert-error">Você não possui permissão para esta ação</div></div>'+
             '<div class="modal-footer"><a class="btn btn-primary" data-dismiss="modal">OK</a></div>'+
             '</div>').modal('show');
      }
   }
}

function addToSelect(selectId, text){
   var new_cat = prompt(text), option = new Option(new_cat);
   if(!new_cat) return;
   $(selectId).append(option);
   $(option).attr('selected', true);
}

$(document).ready(function() {
  // Ajax indicator
  $('body').append($('<div class="panel panel-default hide" id="loading-modal" style="z-index: 66060; position: fixed;"><div class="panel-body"><img src="/assets/loading-bar.gif"/></div></div>'));
  $(document).ajaxSend(function(ev, jqXHR, options){
    if(options.files){
      return;
    }
    var panel = $('#loading-modal');
    panel.css("top", ($(window).height() / 2) - (53 / 2));
    panel.css("left", ($(window).width() / 2) - (192 / 2));
    //Do not use the .modal() function. If there is another modal it generates anomalous behaviour
    panel.removeClass('hide');
  }).ajaxComplete(function(evt,xhr){
    $('#loading-modal').addClass('hide');
    FlashMsg.notify(xhr.status);
  });

  $(document).on('change', '.pagination select', function(){
   //window.location = $(this).find('option:selected').data('url');
   $.getScript($(this).find('option:selected').data('url'));
  });

  $(window).scroll(function(){
     var w=$(this);
     var pos = w.scrollTop()/($(document).height()-w.height());
     if(pos > .8){
       loadMoreSites();
     }
  });

  $('.switch').click(function(){
     var swi = $(this);
     $('.switch-panel').toggle('fast');
     var text = swi.data('switchtext') || swi.text();
     swi.data('switchtext', swi.text());
     swi.text(text);
  });

  var hash = location.hash
    , hashPieces = hash.split('?')
    , activeTab = $('[href=' + hashPieces[0] + ']');
  activeTab && activeTab.tab('show');
});

function loadMoreSites(){
  if($('.next-load')[0]){
    loader = $('.next-load').remove();
    $.get(loader.data('url'), function(data){
      if($(data).is('#sites')){
        $('#sites').append($(data).html());
      }
    });
  }
  return false;
}

function loadMoreNotifications(){
   if($('.next-load-notifications')[0]){
       loader = $('.next-load-notifications');
       $.get(loader.data('url'), function(data){
           $('.load-more').html(null);
           $(data).each(function(){
              if($(this).is('table')){
                $('table.notifications').append($(this).find('tbody > tr'));
              }else if($(this).is('.load-more')){
                $('.load-more').html(this);
              }
           });
       });
   }
   return false;
}
