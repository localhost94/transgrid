<?php
session_name("transformatikaDLMI2012");
session_start();
include '../../t.config.php';
include '../../classes/t.transformatika.class.php';
$T = new Transformatika();
$dblink = $T->dbConnect($__DATABASE_HOST, $__DATABASE_USER, $__DATABASE_PASS, $__DATABASE_NAME);
if (!$dblink){
    exit('Error. Could not connect to database server. Please contact your system administrator.');
}
if(!isset($_SESSION['user_id'])){
    exit('You must login to access this page');
}
switch(@$_GET['action']){
    case 'load':
        $offset = ($_POST['page'] - 1) * $_POST['limit'];
        $arr_field = explode(',',$_POST['field']);
        $additionalSQL = array();
        foreach($arr_field as $key){
            $additionalSQL[] = ' '.$key.' LIKE \'%'.$_POST['keyword'].'%\' ';
        }
        $where = ' AND ('.implode(' OR ',$additionalSQL).') ';
        $data = $T->dbRecordList($_POST['table'],$_POST['field'],' WHERE '.$_POST['status_field'].' != \'d\' '.$where,'','',$offset.','.$_POST['limit'],$_POST['primary_key']);
        echo json_encode($data);
        break;
    case 'edit':
//        $_POST['edit_by'] = $_SESSION['user_id'];
//        $_POST['edit_date'] = date('Y-m-d H:i:s');
        $exe = $T->dbUpdate($_GET['table'], $_POST,'WHERE '.$_GET['primary_key'].' = \''.$_POST[$_GET['primary_key']].'\'');
        if($exe){
            echo 'success';
        }else{
            echo 'error';
        }
        break;
    case 'addnew':
//        $_POST['entry_by'] = $_SESSION['user_id'];
//        $_POST['entry_date'] = date('Y-m-d H:i:s');
        $_POST[$_GET['primary_key']] = $T->getId();
        $exe = $T->dbInsert($_GET['table'], $_POST);
        if($exe){
            echo 'success';
        }else{
            echo 'error';
        }
        break;
    case 'delete':
        $datas[$_GET['status_field']] = 'd';
        $exe = $T->dbUpdate($_GET['table'], $datas,'WHERE  '.$_GET['primary_key'].' = \''.$_POST[$_GET['primary_key']].'\'');
        if($exe){
            echo 'success';
        }else{
            echo 'error';
        }
        break;
}

?>
