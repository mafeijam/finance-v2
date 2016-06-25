<?php

require 'Yahoo.php';

$y = new YahooFinanceHK;
$code = file('stock.txt', FILE_IGNORE_NEW_LINES);
asort($code);
$favorite = file('favorite.txt', FILE_IGNORE_NEW_LINES);
asort($favorite);
$data = [];
$data['f'] = array_values($favorite);

switch ($_GET['action']) {
   case 'all':
      $data['all'] = $y->get($code);
      break;

   case 'add':
      $add = $_GET['code'];
      if (!in_array($add, $code)) {
         array_push($code, $add);
         file_put_contents('stock.txt', implode(PHP_EOL, $code));
      }
      break;

   case 'remove':
      $id = $_GET['id'];
      if (in_array($id, $code)) {
         $code = array_values(array_diff($code, [$id]));
         file_put_contents('stock.txt', implode(PHP_EOL, $code));
      }
      break;

   case 'refresh':
      $y->setFields(['price', 'change', 'percent'])->setInfo('l1c1p2');
      $data['all'] = isset($_GET['id']) ? $y->get($_GET['id'])[0] : array_combine($code, $y->get($code));
      break;

   case 'favorite':
      $id = $_GET['id'];

      if (isset($id)) {
         if (in_array($id, $favorite)) {
            $favorite = array_values(array_diff($favorite, [$id]));
         } else {
            array_push($favorite, $id);
         }
         file_put_contents('favorite.txt', implode(PHP_EOL, $favorite));
      }

      $data['f'] = array_values($favorite);
      break;

   case 'list':
      $data['l'] = array_values($code);
      break;

   case 'edit-list':
      $list = explode(',', $_GET['list']);
      asort($list);
      file_put_contents('stock.txt', implode(PHP_EOL, $list));
      break;
}

echo json_encode($data);