$(document).ready(function(){
    $.ajaxSetup({ cache : false});

    function buttonShow(origin, btnFrom1, btnFrom2, btnshow){
      $(origin).on('click', function(){
        if($(btnFrom1).is(':visible') || $(btnFrom2).is(':visible')){
          $(btnFrom1).hide()
          $(btnFrom2).hide()
          $(btnshow).show()
        }
      });
    }

    buttonShow('#jne', '#check-tiki', '#check-pos', '#check-jne')
    buttonShow('#tiki', '#check-jne', '#check-pos', '#check-tiki')
    buttonShow('#pos', '#check-jne', '#check-tiki', '#check-pos')

    
    function afterElemet(service, shortService, costService, dateTime){
      return '<div class="cost-box text-center"><div class="fw-bold">' + service + ' ( ' + shortService + ' )</div><div class="fw-bold">Rp ' + costService + '</div><div class="fw-bold">' + dateTime + ' hari</div></div>'
    }

    function delay(callback, ms) {
        var timer = 0;
        return function() {
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function () {
            callback.apply(context, args);
          }, ms || 0);
        };
      }

    $('#origin').on('input', function(){
      $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1))

      if($(this).val() == ''){
        $('#list-data').css('display', 'none')
        $('#list-data div').remove()
      }
    })

    $('#destination').on('input', function(){
      $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1))

      if($(this).val() == ''){
        $('#list-data1').css('display', 'none')
        $('#list-data1 div').remove()
      }
    })

    $('#destination').keyup(delay(function (e){
      $('#list-data1').html()

      if($(this).val() != ''){
        if (e.keyCode == 13) {
          $.ajax({
            url     : "http://localhost:8080/api/allcity",
            method  : "GET",
            beforeSend: function(){
              $('#loading1').css('display', 'block')
            },
          }).done(function(data){
              $('#loading1').css('display', 'none')
  
              var searchField = $('#destination').val();
              var expression = new RegExp(searchField, "i");
  
              $.each(data.results, function(key, value){
                if(value.city_name.search(expression) != -1){
                  $('#list-data1').css('display', 'block')
                  $('#list-data1').append('<div id="id-' + value.city_id + '">' + value.type + ' ' + value.city_name + '</div>')

                  $('#id-' + value.city_id).click(function(){
                    $('#destination-hidden').val(value.city_id)
                    $('#destination').val(value.type + ' ' + value.city_name)

                    $('#list-data1').css('display', 'none')
                    $('#list-data1 div').remove()
                  })
                }
              })
          }).fail(function(){
            console.log('error')
          });

          $('#list-data1').css('display', 'none')
          $('#list-data1 div').remove()
        }
      }

  }, 1000))

    $('#origin').keyup(delay(function (e){
        $('#list-data').html()

        if($(this).val() != ''){
          if (e.keyCode == 13) {
            $.ajax({
              url     : "http://localhost:8080/api/allcity",
              method  : "GET",
              beforeSend: function(){
                $('#loading').css('display', 'block')
              },
            }).done(function(data){
                $('#loading').css('display', 'none')
    
                var searchField = $('#origin').val();
                var expression = new RegExp(searchField, "i");
    
                $.each(data.results, function(key, value){
                  if(value.city_name.search(expression) != -1){
                    $('#list-data').css('display', 'block')
                    $('#list-data').append('<div id="id-' + value.city_id + '">' + value.type + ' ' + value.city_name + '</div>')

                    $('#id-' + value.city_id).click(function(){
                      $('#origin-hidden').val(value.city_id)
                      $('#origin').val(value.type + ' ' + value.city_name)

                      $('#list-data').css('display', 'none')
                      $('#list-data div').remove()
                    })
                  }
                })
            }).fail(function(){
              console.log('error')
            });

            $('#list-data').css('display', 'none')
            $('#list-data div').remove()
          }
        }

    }, 1000))

    function countCostAPI(idElement, url){

      $(idElement).click(function(e){

        switch(idElement){
          case '#check-jne':
            $('#val-resultBox').text('Result JNE')
          break;
          case '#check-tiki':
            $('#val-resultBox').text('Result TIKI')
          break;
          case '#check-pos':
            $('#val-resultBox').text('Result POS')
          break;
          default:
            console.log('Bukan Tombol nya!');
        }
  
        var origin = $('#origin-hidden').val()
        var destination = $('#destination-hidden').val()
        var weight = $('#berat-barang').val()
  
        if($('#result-box').is(':visible')){
          $('#result-box').slideUp()
        }
  
        $('#result-box').slideDown()
  
        $.ajax({
            url: url +'?origin=' + origin + '&destination=' + destination + '&weight=' + weight,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            beforeSend: function(){
              $('[id="result-loading"]').show()
            }
        }).done(function(data){
            $('[id="result-loading"]').hide()
  
            var resultNameCity = $('#result-name-city')
            var resultProvience = $('#result-province') 
            var postCode  = $('#result-postal-code')
  
            var resultNameCity1 = $('#result-name-city1')
            var resultProvience1 = $('#result-province1') 
            var postCode1  = $('#result-postal-code1')
  
            var serviceBox = $('#pembatas')
  
            resultNameCity.text('Dari Kota : ' + data.origin_details.type + ' ' + data.origin_details.city_name)
            resultProvience.text('Provinsi : ' + data.origin_details.province)
            postCode.text('Kode Pos : ' + data.origin_details.postal_code)
  
            resultNameCity1.text('Ke Kota : ' + data.destination_details.type + ' ' + data.destination_details.city_name)
            resultProvience1.text('Provinsi : ' + data.destination_details.province)
            postCode1.text('Kode Pos : ' + + data.destination_details.postal_code)
  
            $('.cost-box div').remove()
            $('.cost-box').remove()
  
            for (let i = 0; i < data.results[0].costs.length; i++) {
  
              var startMoney = data.results[0].costs[i].cost[0].value
  
              var reverse = startMoney.toString().split('').reverse().join(''),
                  ribuan = reverse.match(/\d{1,3}/g),
                  ribuan	= ribuan.join('.').split('').reverse().join('')
  
              serviceBox.after(afterElemet(data.results[0].costs[i].description, data.results[0].costs[i].service, ribuan, data.results[0].costs[i].cost[0].etd))
  
              console.log(data.results[0].costs[i]);
              
            }
  
  
        });
        
        e.preventDefault()
      })
    }

    countCostAPI('#check-jne', 'http://localhost:8080/api/costjne')
    countCostAPI('#check-tiki', 'http://localhost:8080/api/costtiki')
    countCostAPI('#check-pos', 'http://localhost:8080/api/costpos')

});




