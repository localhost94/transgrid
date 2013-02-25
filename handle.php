<?php

session_name("transformatikaDLMI2012");
session_start();
include '../../t.config.php';
include '../../classes/t.transformatika.class.php';
$T = new Transformatika();
$dblink = $T->dbConnect($__DATABASE_HOST, $__DATABASE_USER, $__DATABASE_PASS, $__DATABASE_NAME);
if (!$dblink) {
    exit('Error. Could not connect to database server. Please contact your system administrator.');
}
if (!isset($_SESSION['user_id'])) {
    exit('You must login to access this page');
}

switch (@$_GET['action']) {
    case 'load':
        $offset = ($_POST['page'] - 1) * $_POST['limit'];
        $arr_field = explode(',', $_POST['field']);
        $additionalSQL = array();
        foreach ($arr_field as $key) {
            $additionalSQL[] = ' ' . $key . ' LIKE \'%' . $_POST['keyword'] . '%\' ';
        }
        if ($_POST['status_field'] == '') {
            $where = 'WHERE ' . implode(' OR ', $additionalSQL);
        } else {
            $where = ' WHERE ' . $_POST['status_field'] . ' != \'d\' AND  (' . implode(' OR ', $additionalSQL) . ') ';
        }
        if ($_POST['sortable'] == 'false' || empty($_POST['sortable'])) {
            $orderBy = $_POST['primary_key'];
        } else {
            $orderBy = $_POST['order_field'];
        }
        $data = $T->dbRecordList($_POST['table'], $_POST['field'], $where, '', '', $offset . ',' . $_POST['limit'], $orderBy);
        echo json_encode($data);
        break;
    case 'edit':
//        $_POST['edit_by'] = $_SESSION['user_id'];
//        $_POST['edit_date'] = date('Y-m-d H:i:s');
        $exe = $T->dbUpdate($_GET['table'], $_POST, 'WHERE ' . $_GET['primary_key'] . ' = \'' . $_POST[$_GET['primary_key']] . '\'');
        if ($exe) {
            echo 'success';
        } else {
            echo 'error';
        }
        break;
    case 'addnew':
//        $_POST['entry_by'] = $_SESSION['user_id'];
//        $_POST['entry_date'] = date('Y-m-d H:i:s');
        $_POST[$_GET['primary_key']] = $T->getId();
        if ($_GET['sortable'] == 'true') {
            $cek = $T->dbQuery("SELECT MAX(" . $_GET['order_field'] . ") AS maks FROM " . $_GET['table']);
            $maks = $T->dbResult($cek, 0, 'maks');
            $_POST[$_GET['order_field']] = (int) $maks + 1;
        }

        $exe = $T->dbInsert($_GET['table'], $_POST);
        if ($exe) {
            echo 'success';
        } else {
            echo 'error';
        }
        break;
    case 'delete':
        $datas[$_GET['status_field']] = 'd';
        $exe = $T->dbUpdate($_GET['table'], $datas, 'WHERE  ' . $_GET['primary_key'] . ' = \'' . $_POST[$_GET['primary_key']] . '\'');
        if ($exe) {
            echo 'success';
        } else {
            echo 'error';
        }
        break;
    case 'reorder':
        $array = $_POST['reCord'];
        $page = $_POST['page'];
        $limit = $_POST['limit'];
        foreach ($array as $key => $val) {
            if ($page == 1) {
                $reOrder = (int) ($key + 1);
            } else {
                $reOrder = (int) ($key + ((int) (($page - 1) * $limit) + 1));
            }
            $exe = $T->dbQuery("UPDATE " . $_GET['table'] . " SET " . $_GET['order_field'] . " = '" . $reOrder . "' WHERE " . $_GET['primary_key'] . " = '" . $val . "'");
        }
        break;
}
?>
