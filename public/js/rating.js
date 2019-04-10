$(document).ready(function() {
  var clickedVal = 0;
  $('#1_star').hover(function(){

    // $('#2_star').attr('src','/images/star_off.png');
    // $('#3_star').attr('src','/images/star_off.png');
    // $('#4_star').attr('src','/images/star_off.png');
    // $('#5_star').attr('src','/images/star_off.png');
    $('#showTitle').html('Bad');
  });

  $('#2_star').hover(function(){
    $('#showTitle').html('Poor');
  });

  $('#3_star').hover(function(){
    $('#showTitle').html('Fair');
  });

  $('#4_star').hover(function(){
    $('#showTitle').html('Good');
  });

  $('#5_star').hover(function(){
    $('#showTitle').html('Excellent');
  });

  $('#1_star').on('click', function() {
    clickedVal = 1;
    $('#1_star').attr('src', '/images/star_on.png');
    $('#2_star').attr('src', '/images/star_off.png');
    $('#3_star').attr('src', '/images/star_off.png');
    $('#4_star').attr('src', '/images/star_off.png');
    $('#5_star').attr('src', '/images/star_off.png');
    console.log(clickedVal);
  });

  $('#2_star').on('click', function() {
    $('#1_star').attr('src', '/images/star_on.png');
    $('#2_star').attr('src', '/images/star_on.png');
    $('#3_star').attr('src', '/images/star_off.png');
    $('#4_star').attr('src', '/images/star_off.png');
    $('#5_star').attr('src', '/images/star_off.png');
    clickedVal = 2;
    console.log(clickedVal);
  });

  $('#3_star').on('click', function() {
    clickedVal = 3;
    $('#1_star').attr('src', '/images/star_on.png');
    $('#2_star').attr('src', '/images/star_on.png');
    $('#3_star').attr('src', '/images/star_on.png');
    $('#4_star').attr('src', '/images/star_off.png');
    $('#5_star').attr('src', '/images/star_off.png');
    console.log(clickedVal);
  });

  $('#4_star').on('click', function() {
    clickedVal = 4;
    $('#1_star').attr('src', '/images/star_on.png');
    $('#2_star').attr('src', '/images/star_on.png');
    $('#3_star').attr('src', '/images/star_on.png');
    $('#4_star').attr('src', '/images/star_on.png');
    $('#5_star').attr('src', '/images/star_off.png');
    console.log(clickedVal);
  });

  $('#5_star').on('click', function() {
    clickedVal = 5;
    $('#1_star').attr('src', '/images/star_on.png');
    $('#2_star').attr('src', '/images/star_on.png');
    $('#3_star').attr('src', '/images/star_on.png');
    $('#4_star').attr('src', '/images/star_on.png');
    $('#5_star').attr('src', '/images/star_on.png');
    console.log(clickedVal);
  });

  $('#rate').on('click', function() {
    var review = $('#review').val();
    var sender = $('#name').val();
    var id = $('#id').val();

    var valid = true;

    if(clickedVal == 0 || clickedVal > 5){
      valid = false;
      $('#error').html('<div class="alert alert-dnger">Please give a valid rating and review before you submit</div>');
    } else {
      $('#error').html('');
    }

    if(valid == true){
      $.ajax({
        url: '/review/' + id,
        type: 'POST',
        data: {
          clickedVal: clickedVal,
          review: review,
          sender: sender,
        },
        success: function(data){
          $('#review').val();
          $('#sender').val();
          $('#id').val();
        }
      })
    } else {
      return false;
    }
  })
});
