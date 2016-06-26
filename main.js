var favorite = '<i class="favorite fa fa-star fa-lg" aria-hidden="true" style="color: #F7D94C;"><span style="font-size: 0;">0</span></i>'
var notFavorite = '<i class="favorite fa fa-star-o fa-lg" aria-hidden="true""><span style="font-size: 0;">1</span></i>'

var dt = $('#dt').DataTable({
   ajax: {
      url: 'api.php?action=all',
      dataSrc: function(data) {
         $.each(data.all, function(k, v){
            var id = v.symbol.replace(/^0+|.hk/g, '')
            var title = `<div style='text-align: center;'><strong>info</strong></div>`
            var info = `${title}<a class='popup-link' href='https://hk.finance.yahoo.com/q?s=${id}&ql=1' target='_blank'>Yahoo</a> | ` +
                       `<a class='popup-link' href='https://www.google.com.hk/finance?q=${v.symbol}' target='_blank'>Google</a>`

            v.favorite = $.inArray(id, data.f) != '-1' ? favorite : notFavorite
            v.mktCap = v.mktCap.replace(/B$/, '').replace(/^N\/A$/, '-')
            v.PE = v.PE.replace(/^N\/A$/, '-')
            v.yield = v.yield.replace(/^N\/A$/, '-')
            v.chart = '<img class="chart-s" src="https://chart.finance.yahoo.com/z?s='+v.symbol+'&t=my&z=l">'
            v.action = '<i class="refresh fa fa-refresh fa-lg" aria-hidden="true" style="margin-right: 10px;"></i>' +
                       '<i class="remove fa fa-minus-circle fa-lg" aria-hidden="true" style="margin-right: 10px;"></i>' +
                       `<i class="show-more fa fa-info fa-lg" aria-hidden="true" data-html="${info}"></i>`
         })

         return data.all
      }
   },
   columns: [
      {data: 'favorite', className: 'sort', searchable: false},
      {data: 'symbol', className: 'sort'},
      {data: 'name', className: 'sort'},
      {data: 'price', className: 'price', searchable: false, orderable: false},
      {data: 'change', searchable: false, orderable: false},
      {data: 'percent', className: 'sort', searchable: false},
      {data: 'open', searchable: false, orderable: false},
      {data: 'close', searchable: false, orderable: false},
      {data: 'low', searchable: false, orderable: false},
      {data: 'high', searchable: false, orderable: false},
      {data: '52wLow', searchable: false, orderable: false},
      {data: '52wHigh', searchable: false, orderable: false},
      {data: '50dAvg', searchable: false, orderable: false},
      {data: '200dAvg', searchable: false, orderable: false},
      {data: 'PE', className: 'sort', searchable: false, type: 'num'},
      {data: 'yield', className: 'yield sort', searchable: false, type: 'num'},
      {data: 'dividend', searchable: false, orderable: false},
      {data: 'mktCap', className: 'sort', searchable: false, type: 'num'},
      {data: 'chart', searchable: false, orderable: false, width: '75px'},
      {data: 'action', searchable: false, orderable: false, width: '90px'},
   ],
   //lengthMenu: [[10, 50, 100, -1], [10, 50, 100, 'ALL']],
   //pageLength: -1,
   paging: false,
   lengthChange: false,
   info: false,
   scrollY: '685px',
   scrollCollapse: true,
   createdRow: function(row, data, index) {
      var change = $(row).children().eq(4)
      var percent = change.next()

      setColor(data.change, change, percent)

      var id = data.symbol.replace(/^0+|.hk/g, '')
      $(row).attr('data-id', id)
      if ($(row).find('i').hasClass('fa-star')) {
         $(row).css('background', '#FFFFFB')
      }
   },
   drawCallback: function(s) {
      setTimeout(function(){
         $('#add-btn').removeClass('loading')
      }, 300)

      setTimeout(function(){
        $('#table-loader').removeClass('active')
      }, 300)

      init()
      setLastUpdate()
   },
   initComplete: function(s, j) {
      init()
      setLastUpdate()
      var col = JSON.parse(localStorage.getItem('col')) || []
      hideColumn(col)
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
   if (e.keyCode == 13 && $(this).val().trim()) {
      $('#add-btn').click()
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
      var da = d.all
      if (old != da.price) {
         var effect = old > da.price ? 'down' : 'up'

         setColumnsAnimate(tr, effect)
         updatePrice(da, price, change, percent, td)
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
      getHSI()
   }, 300000)
}

$('#refresh-all').click(function(){
   $(this).addClass('loading')
   var that = $(this)
   getHSI()
   $.getJSON('api.php', {action: 'refresh'}).done(function(d){
      $('#dt tbody tr').each(function(k, v){
         var tr = $(v)
         var td = tr.children('td')
         var price = dt.cell(td.eq(3))
         var change = dt.cell(td.eq(4))
         var percent = dt.cell(td.eq(5))
         var old = price.data()
         var id = tr.data('id')

         var da = d.all

         if (old != da[id].price) {
            var effect = old > da[id].price ? 'down' : 'up'

            setColumnsAnimate(tr, effect)
            updatePrice(da[id], price, change, percent, td)
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
      text.val(String(d.l).replace(/,/g, "\n"))
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

$('#setting').click(function(){
   var col = JSON.parse(localStorage.getItem('col')) || []

   $('#edit-column-modal')
   .modal({
      inverted: true,
      blurring: true,
      autofocus: false
   })
   .modal('show')

   hideColumn(col)

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

   $('.show-more').popup({
      position: 'top center',
      variation: 'inverted',
      hoverable: true,
      delay: {
         hide: 500
      }
   })

   $('.overlay').click(function(){
      $(this).fadeOut()
   })

   $('img').click(function(){
      $('.overlay').fadeIn().children('img').attr('src', $(this).attr('src')).css('display', 'flex')
   })
}

getHSI()

function getHSI(refresh) {
   $.getJSON('api.php', {action: 'hsi'}).done(function(d){
      var color = '#828282'
      var arrow = '<i class="fa fa-arrow-up" aria-hidden="true"></i>'
      if (d[1] > 0) {
         color = '#227D51'
      } else if (d[1] < 0) {
         color = '#CB1B45'
         arrow = '<i class="fa fa-arrow-down" aria-hidden="true"></i>'
      }

      $('#hsi').find('.price').html(arrow + ' ' +d[0])

      var change = $('#hsi').find('.change')

      change.css('color', color).text(' ('+d[1]+' | ')
      change.next().css('color', color).text(d[2]+')')
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

function hideColumn(col) {
   $('#edit-column-modal').find('.checkbox').each(function(k, v){
      $(v).checkbox({
         onChecked: function(){
            dt.column($(this).data('col')).visible(false)

            if ($.inArray($(this).val(), col) == '-1') {
               col.push($(this).val())
               localStorage.setItem('col', JSON.stringify(col))
            }
         },
         onUnchecked: function(){
            dt.column($(this).data('col')).visible(true)
            var i = col.indexOf($(this).val())
            col.splice(i, 1)
            localStorage.setItem('col', JSON.stringify(col))
         }
      })

      if ($.inArray($(v).children('input').val(), col) != '-1') {
         $(v).checkbox('check')
      }
   })
}