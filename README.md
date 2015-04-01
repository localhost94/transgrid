```
include 'path/to/TransGrid/transgrid.php';
$Grid = new TransGrid();
$CONF['table']          = 'tablename';
$CONF['editable']       = true;
$CONF['field']          = array('id','field1','status');
$CONF['primary_key']    = 'id';
$CONF['limit']          = 15;
$CONF['edit_field']     = array('field1','status');
$CONF['insert_field']   = array('field1','status');
$CONF['status_field']   = 'status';
$CONF['tablehead']      = array('Head 1','Head 2');
$CONF['title']          = 'Title Name';
$CONF['sortable']       = true;
$CONF['order_field']    = 'orderby';
echo $Grid->CreateGrid($CONF);
```
