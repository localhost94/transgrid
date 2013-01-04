<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
session_name("transformatikaDLMI2012");
session_start();
// Database Class 
include '../t.config.php';
include '../classes/t.transformatika.class.php';
$Tdb = new Transformatika;
$dblink = $Tdb->dbConnect($__DATABASE_HOST, $__DATABASE_USER, $__DATABASE_PASS, $__DATABASE_NAME);
if (!$dblink){
    exit('Error. Could not connect to database server. Please contact your system administrator.');
}

// Lain lain
$TCONF['base_url']  = 'http://localhost/dlmi/';
$TCONF['path']      = 'libs/TransGrid/';