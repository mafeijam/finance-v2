$.getJSON('api.php', {action: 'favorite'}).done(function(f){
   localStorage.setItem('f', f)
})

var favorite = '<i class="favorite fa fa-star fa-lg" aria-hidden="true" style="color: #F7D94C;"><span style="font-size: 0;">0</span></i>'
var notFavorite = '<i class="favorite fa fa-star-o fa-lg" aria-hidden="true""><span style="font-size: 0;">1</span></i>'

var dt = $('#dt').DataTable({
   ajax: {
      url: 'api.php?action=all',
      dataSrc: function(data) {
         var f = localStorage.getItem('f').split(',')

         $.each(data, function(k, v){
            var id = v.symbol.replace(/^0+|.hk/g, '')
            v.favorite = $.inArray(id, f) != '-1' ? favorite : notFavorite
            v.mktCap = v.mktCap.replace(/B$/, '').replace(/^N\/A$/, '-')
            v.PE = v.PE.replace(/^N\/A$/, '-')
            v.yield = v.yield.replace(/^N\/A$/, '-')
            v.chart = '<img class="chart-s" src="https://chart.finance.yahoo.com/z?s='+v.symbol+'&t=my&z=l">'
            v.action = '<i class="refresh fa fa-refresh fa-lg" aria-hidden="true" style="margin-right: 10px;"></i>' +
                       '<i class="remove fa fa-minus-circle fa-lg" aria-hidden="true"></i>'
         })
         return data
      }
   },
   columns: [
      {data: 'favorite', searchable: false},
      {data: 'symbol'},
      {data: 'name'},
      {data: 'price', className: 'price', searchable: false, orderable: false},
      {data: 'change', searchable: false, orderable: false},
      {data: 'percent', searchable: false},
      {data: 'open', searchable: false, orderable: false},
      {data: 'close', searchable: false, orderable: false},
      {data: 'low', searchable: false, orderable: false},
      {data: 'high', searchable: false, orderable: false},
      {data: '52wLow', searchable: false, orderable: false},
      {data: '52wHigh', searchable: false, orderable: false},
      {data: '50dAvg', searchable: false, orderable: false},
      {data: '200dAvg', searchable: false, orderable: false},
      {data: 'PE', searchable: false, type: 'num'},
      {data: 'yield', className: 'yield', searchable: false, type: 'num'},
      {data: 'dividend', searchable: false, orderable: false},
      {data: 'mktCap', searchable: false, type: 'num'},
      {data: 'chart', searchable: false, orderable: false, width: '75px'},
      {data: 'action', searchable: false, orderable: false},
   ],
   //lengthMenu: [[10, 50, 100, -1], [10, 50, 100, 'ALL']],
   //pageLength: -1,
   paging: false,
   lengthChange: false,
   scrollY: '685px',
   scrollCollapse: true,
   createdRow: function(row, data, index) {
      var change = $(row).children().eq(4)
      var percent = change.next()

      setColor(data.change, change, percent)

      var id = data.symbol.replace(/^0+|.hk/g, '')
      $(row).attr('data-id', id)
   },
   drawCallback: function(s) {
      setTimeout(function(){
         $('#add-btn').removeClass('loading')
      }, 500)

      setTimeout(function(){
        $('#table-loader').removeClass('active')
      }, 500)

      init()
      setLastUpdate()
   },
   initComplete: function(s, j) {
      init()
      setLastUpdate()
   }
})

$('#add-btn').click(function(){
   if ($('#add-code').val().trim()) {
      $('#table-loader').addClass('active')
      $(this).addClass('loading')
      $.get('api.php', {action: 'add', code: $('#add-code').val()}).done(function(d){
         dt.ajax.reload()
         $('#add-code').val('')
      })
   }
})

$('#add-code').keydown(function(e){
   var code = $(this).val()
   if (e.keyCode == 13 && code.trim()) {
      $('#table-loader').addClass('active')
      $('#add-btn').addClass('loading')
      $.get('api.php', {action: 'add', code: code}).done(function(d){
         dt.ajax.reload()
         $('#add-code').val('')
      })
   }
})

$('#dt tbody').on('click', '.favorite', function(){
   var id = $(this).parents('tr').data('id')
   $('#table-loader').addClass('active')
   $.getJSON('api.php', {action: 'favorite', id: id}).done(function(f){
      localStorage.setItem('f', f)
      dt.ajax.reload()
   })

   if ($(this).hasClass('fa-star')) {
      dt.cell($(this).parents('td')).data(notFavorite)
   } else {
      dt.cell($(this).parents('td')).data(favorite)
   }

   $(this).off('click')
})

$('#dt tbody').on('click', '.refresh', function(){
   var tr = $(this).parents('tr')
   var td = tr.children('td')
   var price = dt.cell(td.eq(3))
   var change = dt.cell(td.eq(4))
   var percent = dt.cell(td.eq(5))
   var old = price.data()

   $(this).addClass('rotate')
   $(this).on('animationend', function(){
      $(this).removeClass('rotate')
   }).bind(this)

   $.getJSON('api.php', {action: 'refresh', id: tr.data('id')}).done(function(d){
      if (old != d.price) {
         var effect = old > d.price ? 'down' : 'up'

         setColumnsAnimate(tr, effect)
         updatePrice(d, price, change, percent, td)

         /*setTimeout(function(){
            setColor(d.change, td.eq(4), td.eq(5))
            price.data(d.price)
            change.data(d.change)
            percent.data(d.percent)
         }, 150)*/
      }
   })
   $(this).off('click')
})

$('#dt tbody').on('click', '.remove', function(){
   var id = $(this).parents('tr').data('id')
   $(this).parents('tr').fadeOut(500)
   $.get('api.php', {action: 'remove', id: id}).done(function(d){
      dt.ajax.reload()
   })
})

var date = new Date()

if ($.inArray(date.getDay(), [1, 2, 3, 4, 5]) != '-1') {
   setInterval(function(){
      $('#refresh-all').click()
   }, 300000)
}

$('#refresh-all').click(function(){
   $(this).addClass('loading')
   var that = $(this)
   $.getJSON('api.php', {action: 'refresh'}).done(function(d){
      $('#dt tbody tr').each(function(k, v){
         var tr = $(v)
         var td = tr.children('td')
         var price = dt.cell(td.eq(3))
         var change = dt.cell(td.eq(4))
         var percent = dt.cell(td.eq(5))
         var old = price.data()
         var id = tr.data('id')

         if (old != d[id].price) {
            var effect = old > d[id].price ? 'down' : 'up'

            setColumnsAnimate(tr, effect)
            updatePrice(d[id], price, change, percent, td)

            /*setTimeout(function(){
               setColor(d[id].change, td.eq(4), td.eq(5))
               price.data(d[id].price)
               change.data(d[id].change)
               percent.data(d[id].percent)
            }, 150)*/
         }

         if (k+1 == $('#dt tbody tr').length) {
            that.removeClass('loading')
            setLastUpdate()
         }
      })
   })
})

$('#edit-list').click(function(){
   var list = $('#edit-list-modal')
   var text = list.find('textarea')
   $.getJSON('api.php', {action: 'list'}).done(function(d){
      text.val(String(d).replace(/,/g, "\n"))
   })

   list
   .modal({
      inverted: true,
      blurring: true,
      onApprove: function() {
         $('#table-loader').addClass('active')
         $.get('api.php', {action: 'edit-list', list: text.val().replace(/\n/g, ",")}).done(function(){
            dt.ajax.reload()
         })
      }
   })
   .modal('show')
})

function init() {
   $('.refresh').popup({
      position: 'top center',
      content: 'refresh',
      variation: 'inverted'
   })

   $('.remove').popup({
      position: 'top center',
      content: 'remove',
      variation: 'inverted'
   })

   $('.overlay').click(function(){
      $(this).fadeOut()
   })

   $('img').click(function(){
      $('.overlay').fadeIn().children('img').attr('src', $(this).attr('src')).css('display', 'flex')
   })
}

function setColor(value, el1, el2) {
   if (value > 0) {
      el1.css('color', '#227D51')
      el2.css('color', '#227D51')
   } else if (value < 0) {
      el1.css('color', '#CB1B45')
      el2.css('color', '#CB1B45')
   } else {
      el1.css('color', '#828282')
      el2.css('color', '#828282')
   }
}

function setLastUpdate() {
   var d = new Date()
   var m = String(d.getMinutes())

   if (m.length == 1) {
      m = '0'+m
   }

   var lastupdate = d.getHours() + ':' + m

   $('#last-update').html('last update at <strong>'+lastupdate+'</strong>')
}

function updatePrice(data, el1, el2, el3, td) {
   setTimeout(function(){
      setColor(data.change, td.eq(4), td.eq(5))
      el1.data(data.price)
      el2.data(data.change)
      el3.data(data.percent)
   }, 150)
}

function setColumnsAnimate(tr, effect) {
   tr.addClass(effect)
   tr.on('animationend', function(){
      tr.removeClass('down up')
   })
}