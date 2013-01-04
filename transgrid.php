<?php
Class TransGrid {
    var $base_url   = 'http://localhost/qshe/';
    var $path       = 'libs/TransGrid/';
    var $CONF       = array();
    function __construct() {
        $this->CONF['table']          = '';
        $this->CONF['title']          = 'Transformatika DataGrid';
        $this->CONF['editable']       = false;
        $this->CONF['field']          = '*';
        $this->CONF['primary_key']    = '';
        $this->CONF['limit']          = 20;
        $this->CONF['edit_field']     = array();
        $this->CONF['insert_field']   = array();
        $this->CONF['status_field']   = '';
        $this->CONF['tablehead']      = array();
        return $this->CONF;
    }
    function CreateGrid($CONF){
        foreach($this->CONF as $key=>$val){
            if(array_key_exists($key, $CONF)){
                $this->CONF[$key] = $CONF[$key];
            }
        }
        if($this->CONF['editable'] == NULL || $this->CONF['editable'] == false){
            $this->CONF['editable'] = 'false';
        }else{
            $this->CONF['editable'] = 'true';
        }
        global $T;
        if($this->CONF['status_field'] == '' || $this->CONF['status_field'] == NULL){
            $total_data = $T->dbCount($this->CONF['table']);
        }else{
            $total_data = $T->dbCount($this->CONF['table'],' WHERE '.$this->CONF['status_field'].' != \'d\'');
        }
        
        if(is_array($this->CONF['field']) && count($this->CONF['field']) > 0){
            $fields = implode(',',$this->CONF['field']);
        }else{
            $fields = '*';
        }
        if(is_array($this->CONF['insert_field']) && count($this->CONF['insert_field']) > 0){
            $insert_field = implode(',',$this->CONF['insert_field']);
        }else{
            $insert_field = '';
        }
        if(is_array($this->CONF['tablehead']) && count($this->CONF['tablehead']) > 0){
            $tablehead = json_encode($this->CONF['tablehead']);
        }else{
            $tablehead = '';
        }
        if(!isset($this->CONF['primary_key']) || $this->CONF['primary_key'] == ''){
            $query = $T->dbQuery("SELECT column_name
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE OBJECTPROPERTY(OBJECT_ID(constraint_name), 'IsPrimaryKey') = 1
                    AND table_name = '".$_POST['table']."'");
            $pkey   = $T->dbFetchArray($query);
            $this->CONF['primary_key'] = $pkey[0];
        }
        $res = '<link type="text/css" href="'.$this->base_url.$this->path.'css/qshe.css" rel="stylesheet" />';
        $res .= '<script src="'.$this->base_url.$this->path.'js/datagrid.js"></script>';
        $res .= '<div id="TransGrid"></div>';
        $res .= '<script>';
        $res .= '$(document).ready(function(){
                    $("#TransGrid").TransGrid({
                        data:"table='.$this->CONF['table'].'&limit='.$this->CONF['limit'].'&field='.$fields.'&primary_key='.$this->CONF['primary_key'].'&status_field='.$this->CONF['status_field'].'",
                        url:"'.$this->base_url.$this->path.'handle.php?action=load",
                        editable : '.$this->CONF['editable'].',
                        limit : '.$this->CONF['limit'].',    
                        total_data : '.$total_data.',
                        title : "'.$this->CONF['title'].'",
                        pkey: "'.$this->CONF['primary_key'].'",
                        url_edit: "'.$this->base_url.$this->path.'handle.php?action=edit&table='.$this->CONF['table'].'&primary_key='.$this->CONF['primary_key'].'",  
                        url_delete: "'.$this->base_url.$this->path.'handle.php?action=delete&table='.$this->CONF['table'].'&primary_key='.$this->CONF['primary_key'].'&status_field='.$this->CONF['status_field'].'",
                        url_insert: "'.$this->base_url.$this->path.'handle.php?action=addnew&table='.$this->CONF['table'].'&primary_key='.$this->CONF['primary_key'].'",
                        insert_field : "'.$insert_field.'",
                        tablehead : '.$tablehead.'    
                    });
                });';
        
        $res .= '</script>';
        return $res;
    }
}

?>
