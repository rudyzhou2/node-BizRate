$(document).ready(function(){

  $('.upload-btn').on('click', function(){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
  });

  $('#upload-input').on('change', function(){
    var uploadInput = $('#upload-input');

    if(uploadInput.val() != ''){
        var formData = new FormData();
        formData.append('upload', uploadInput[0].files[0]);

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
              $('#upload-input').val('');
            },

            xhr: function(){
              var xhr = new XMLHttpRequest();

              xhr.upload.addEventListener('progress', function(e){
                if(e.lengthComputable){
                    var uploadPct = e.loaded / e.total;
                    uploadPct = (uploadPct * 100);

                    $('.progress-bar').text(uploadPct+'%');
                    $('.progress-bar').width(uploadPct+'%');

                    if(uploadPct === 100){
                        $('.progress-bar').text('Completed');
                        $('#completed').text('Image Uploaded');
                    }
                }
              }, false);
              return xhr;
        }
    })
  }
})
})
