<?php
$mainTitle = 'SHE SETTING / Causative Agents';
include 'modules/setting/t.setting.leftmenu.php';
include 't.header.php';
include 'libs/TransGrid/transgrid.php';
$Grid = new TransGrid();

$CONF['table']          = 't_she_ar_causative_conf';
$CONF['editable']       = true;
$CONF['field']          = array('id_data','causative_name','causative_name2','enable_type','causative_status');
$CONF['primary_key']    = 'id_data';
$CONF['limit']          = 15;
$CONF['custom_edit']    = true;
$CONF['sortable']       = true;
$CONF['order_field']    = 'orderby';
$CONF['edit_field']     = json_encode(array(
                            array(
                            'causative_name'=> $T->createInputText('causative_name','','style="width:98%"'),
                            'causative_name2'=> $T->createInputText('causative_name2','','style="width:98%"'),
                            'enable_type'=> $T->createInputSelect($__YES_NO,'enable_type','','style="width:98%"'),
                            'causative_status'=> $T->createInputSelect($__STATUS,'causative_status','','style="width:98%"')
                                )
                        ));
$CONF['custom_insert']  = true;
$CONF['insert_field']   = json_encode(array(
                            array(
                            'causative_name'=> $T->createInputText('causative_name','','style="width:98%"'),
                            'causative_name2'=> $T->createInputText('causative_name2','','style="width:98%"'),
                            'enable_type'=> $T->createInputSelect($__YES_NO,'enable_type','','style="width:98%"'),
                            'causative_status'=> $T->createInputSelect($__STATUS,'causative_status','','style="width:98%"')
                                )
                        ));
$CONF['status_field']   = 'causative_status';
$CONF['tablehead']      = array('Causative Agents (EN)','Causative Agents (MY)','Enable Input Type','Status');
$CONF['title']          = 'QSHE Setting &raquo; Causative Agents';
echo $Grid->CreateGrid($CONF);
include 't.footer.php';