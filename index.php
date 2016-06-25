<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title>quotes</title>
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.1.8/semantic.min.css">
   <link rel="stylesheet" href="https://cdn.datatables.net/1.10.12/css/dataTables.semanticui.min.css">
   <link rel="stylesheet" href="main.css">
   <script src="https://use.fontawesome.com/b19c0c0ce2.js"></script>
</head>
<body>

   <div id="edit-list-modal" class="ui modal">
      <div class="header">stock list</div>
      <div class="content">
         <div class="ui form">
            <textarea style="resize: none;" rows="20"></textarea>
         </div>

      </div>
      <div class="actions">
         <div class="ui red button deny">Cancel</div>
         <div class="ui green button approve">Save</div>
      </div>
   </div>

   <div id="edit-column-modal" class="ui modal">
      <div class="header">hide column</div>
      <div class="content ui divided very relaxed large list">

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="name" data-col="2">
            <label>name</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="open" data-col="6">
            <label>open</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="close" data-col="7">
            <label>close</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="low" data-col="8">
            <label>low</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="high" data-col="9">
            <label>high</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="52wlow" data-col="10">
            <label>52w low</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="52whigh" data-col="11">
            <label>52w high</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="50avg" data-col="12">
            <label>50d avg</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="200avg" data-col="13">
            <label>200d avg</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="mkt" data-col="17">
            <label>Mkt cap. (B)</label>
         </div>

         <div class="ui toggle checkbox item">
            <input type="checkbox" value="chart" data-col="18">
            <label>chart</label>
         </div>

      </div>
   </div>

   <div class="ui container-xl">

      <div class="ui form">
         <div class="fields">
            <div class="field">
               <input id="add-code" type="text">
            </div>
            <div class="field">
               <div id="add-btn" class="ui blue button">
                  <i class="fa fa-plus" aria-hidden="true" style="margin-right: 5px"></i> add
               </div>
            </div>
            <div class="field">
               <div id="refresh-all" class="ui green button">
                  <i class="fa fa-refresh" aria-hidden="true" style="margin-right: 5px"></i> refresh
               </div>
            </div>

            <div class="field">
               <div id="edit-list" class="ui teal button">
                  <i class="fa fa-list" aria-hidden="true" style="margin-right: 5px"></i> edit list
               </div>
            </div>

            <div class="field">
               <div id="setting" class="ui olive button">
                  <i class="fa fa-sliders" aria-hidden="true" style="margin-right: 5px"></i> setting
               </div>
            </div>

            <div class="field">
               <a href="https://github.com/mafeijam/finance-v2" target="_blank">
                  <div class="ui red button">
                     <i class="fa fa-code" aria-hidden="true" style="margin-right: 5px"></i> get code
                  </div>
               </a>
            </div>

         </div>
      </div>

      <table id="dt" class="ui table">
         <div id="table-loader" class="ui large loader"></div>
         <thead>
            <tr>
               <th><i class="fa fa-star fa" aria-hidden="true"></i></th>
               <th>symbol</th>
               <th>name</th>
               <th>price</th>
               <th>change</th>
               <th>percent</th>
               <th>open</th>
               <th>close</th>
               <th>low</th>
               <th>high</th>
               <th>52w low</th>
               <th>52w high</th>
               <th>50d avg</th>
               <th>200d avg</th>
               <th>PE</th>
               <th>yield</th>
               <th>divdend</th>
               <th>Mkt cap (B)</th>
               <th>chart</th>
               <th>action</th>
            </tr>
         </thead>
      </table>
      <div id="last-update"></div>

   </div>

   <div class="overlay">
      <img class="chart">
   </div>

   <script src="//code.jquery.com/jquery-1.12.3.js"></script>
   <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
   <script src="https://cdn.datatables.net/1.10.12/js/dataTables.semanticui.min.js"></script>
   <script src="https://cdn.jsdelivr.net/semantic-ui/2.1.8/semantic.min.js"></script>
   <script src="main.js"></script>
</body>
</html>