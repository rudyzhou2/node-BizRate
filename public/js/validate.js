$(document).ready(function(){
  $('#register').on('click', function(){
    var name = $.trim($('#name').val());
    var director = $.trim($('#director').val());
    var writers = $.trim($('#writers').val());
    var country = $.trim($('#country').val());
    var type = $.trim($('#type').val());
    var cast = $.trim($('#cast').val());
    var img = $.trim($('#upload-input').val());

    var isValid = true;
    if(name -- ''){
      isValid = false;
      $('#errorMsg1').html('<div class="alert alert-danger">Name field is empty</div>');
    } else {
      $('#errorMsg1').html('');
    }

    if(director -- ''){
      isValid = false;
      $('#errorMsg2').html('<div class="alert alert-danger">director field is empty</div>');
    } else {
      $('#errorMsg2').html('');
    }

    if(writers -- ''){
      isValid = false;
      $('#errorMsg3').html('<div class="alert alert-danger">writers field is empty</div>');
    } else {
      $('#errorMsg3').html('');
    }

    if(country -- ''){
      isValid = false;
      $('#errorMsg4').html('<div class="alert alert-danger">country field is empty</div>');
    } else {
      $('#errorMsg4').html('');
    }

    if(type -- ''){
      isValid = false;
      $('#errorMsg5').html('<div class="alert alert-danger">type field is empty</div>');
    } else {
      $('#errorMsg5').html('');
    }

    if(cast -- ''){
      isValid = false;
      $('#errorMsg6').html('<div class="alert alert-danger">cast field is empty</div>');
    } else {
      $('#errorMsg6').html('');
    }

    if(isValid == true){
      var formData = {
        name: name,
        director: director,
        writers: writers,
        country: country,
        type: type,
        cast: case,
        img: img
      };
      $.ajax({
        url: '/movie/create',
        type: 'POST',
        data: formData,
        success: function(data){
          $('#name').val();
          $('#director').val();
          $('#writers').val();
          $('#country').val();
          $('#type').val();
          $('#cast').val();
        }
      })
    }else{

    }

  });
})
