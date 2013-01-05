/* Data Grid
 * Jquery Plugin buat load table via json
 * Minimal konfigurasi : $('#element').TransGrid({ url:'file_ajax.php' });
 * agung@transformatika.com
 */
$.fn.TransGrid = function(options){
    //setting default value 
    var element = this;
    var currentUrl = window.location.pathname;
    var defaults = {
        url : currentUrl, // return nya harus json
        ajaxtipe: 'post',
        data :'',
        tablehead:'',
        editable:false,
        url_edit:'',
        url_delete:'',
        url_insert:'',
        edit_field:'',
        insert_field:'',
        status_field:'',
        base_url :'',
        path:'',
        limit:20,
        total_data:0,
        width:'100%',
        keyword:'',
        title:'Transformatika Data Grid',
        pkey : '' // Primary Key
    },
    settings = $.extend({}, defaults, options);
    var tot_page = Math.ceil(settings.total_data / settings.limit);
    if(tot_page == 0){
        tot_page = 1;
    }
    Tgridreload(1);
    function Tgridreload(page){
        var respon = '';
        $.ajax({
            url:settings.url,
            type:settings.ajaxtipe,
            data:settings.data+'&page='+page+'&keyword='+settings.keyword,
            dataType:'json',
            beforeSend: function() {
                WriteStatus('loading','Loading. Please Wait...');
            },
            success: function(res){
                remove_element('theTrueMsg');
                // HITUNG PAGING NYA
                //var tot_data = res.length;
                
                var mulai;
                var no;
                var akhir;
                if(page == 1){
                    mulai = 0;
                    akhir = settings.limit - 1;
                    no = 1;
                }else{
                    mulai = parseInt((parseInt(page) -1 ) * settings.limit);
                    akhir = mulai + settings.limit;
                    no = mulai + 1;
                }
                
                respon += '<div class="ui-widget" style="display:block;">';
                respon += '<div class="ui-widget-header" style="padding:5px;">'+settings.title+'</div>';
                if(settings.editable == true){
                    respon += '<div class="ui-widget-content" style="padding:2px;position:relative;background:#F2F6F8;border-bottom:0;">';
                    respon += '<span style="width:4px;border-right:1.8px dotted #AAA;">&nbsp;</span> &nbsp;';
                    respon += '<a class="btn-enable" id="AddTGrid" href="#" data-page="'+page+'" style="padding:3px;display:inline-block;">+ Add New</a>';
                    respon += '&nbsp;&nbsp;<a class="btn-disable" id="SaveGrid" href="#" data-id="" data-op="none" data-page="'+page+'" style="padding:3px;display:inline-block;">&radic; Save</a>';
                    respon += '<span style="position:absolute;right:0px;margin:auto 5px;">';
                    respon += '<img src="'+settings.base_url+settings.path+'img/find.png" align="left">&nbsp; Filter: <input type="text" id="searchkey" style="width:200px;height:12px;" placeholder="Search" value="'+settings.keyword+'">';
                    respon += '</span>';
                    respon += '</div>';
                }
                
                respon += '<div class="ui-widget-content">';
                respon +='<table id="TransGrid" class="table-explorer"  style="width:'+settings.width+';margin:0px;">';
                if(res.length == 0){
                    var cols;
                    if(settings.tablehead != ''){
                        respon +='<tr><th width="24px">No</th>';
                        $.each(settings.tablehead, function(key, val) {
                            respon += '<th>'+val+'</th>';
                        });
                        if(settings.editable == true){
                            respon += '<th width="20"><span class="ui-icon ui-icon-trash" style="width:16px"></span></th>';
                            cols = parseInt(settings.tablehead.length) + 2;
                        }else{
                            cols = parseInt(settings.tablehead.length) + 1;
                        }
                        respon +='</tr>';
                    }else{
                        cols = 1;
                    }
                    respon += '<tr><td colspan="'+cols+'">Data not found</td></tr></table>';
                }else{
                    if(settings.tablehead == ''){
                        respon +='<tr><th width="24px">No</th>';
                        $.each(res, function(key, val) {
                            if(key == 0){
                                $.each(val,function(i,value){
                                    if(i != settings.pkey){
                                        respon += '<th>'+i+'</th>';
                                    }
                                });
                            }
                        });
                        if(settings.editable == true){
                            respon += '<th width="20"><span class="ui-icon ui-icon-trash" style="width:16px"></span></th>';
                        }
                        respon +='</tr>';
                    }else{
                        respon +='<tr><th width="24px">No</th>';
                        $.each(settings.tablehead, function(key, val) {
                            respon += '<th>'+val+'</th>';
                        });
                        if(settings.editable == true){
                            respon += '<th width="20"><span class="ui-icon ui-icon-trash" style="width:16px"></span></th>';
                        }
                        respon +='</tr>';
                    }
                    $.each(res, function(keys, vals) {
                        //if(keys >= mulai && keys <= akhir){
                            var editId;
                            var trClass = '';
                            var viewClass = '';
                            var array_field;
                            if(settings.edit_field == ''){
                                array_field = [];
                            }else{
                                array_field = settings.edit_field;
                            }
                            $.each(vals,function(iii,valuess){
                                if(iii == settings.pkey){
                                    editId = valuess;
                                }else{
                                    if(settings.edit_field == ''){
                                        array_field.push(iii);
                                    }
                                }
                            });
                            if(settings.editable == true){
                                trClass = 'editThis';
                                viewClass = 'view';
                            }
                            respon +='<tr class="'+trClass+'" id="'+editId+'" data-page="'+page+'">';
                            respon +='<td width="24px" style="text-align:center;">'+no+'</td>';
                            $.each(vals,function(ii,values){
                                if(ii != settings.pkey){
                                    respon += '<td><span id="'+viewClass+editId+'" class="viewData">';
                                    if(ii == settings.status_field || values == 'y' || values == 'n'){
                                        if(values == 'y'){
                                            respon += 'Active';
                                        }else{
                                            respon += 'Not Active';
                                        }
                                    }else{
                                        respon += values;
                                    }
                                    respon +=' </span>';
                                    if(settings.editable==true){
                                        respon += '<span style="display:none;" id="edit'+editId+'" class="editData">';
                                        $.each(settings.edit_field,function(kk,vv){
                                            if($.inArray(ii,vv)){
                                            $.each(vv,function(vk,vvv){
                                                if(ii == vk){
                                                    if(vvv == 'varchar'){
                                                        respon += '<input type="text" name="'+vk+'" style="width:98%;" value="'+values+'">';
                                                    }else if(vvv == 'text'){
                                                        respon += '<textarea name="'+vk+'" style="width:98%;height:40px">'+values+'</textarea>';
                                                    }else if(vvv == 'date'){
                                                        respon += '<input class="datepickers" name="'+vk+'" style="width:98%;height:40px" value="'+values+'">';
                                                    }else if(vvv == 'datetime'){
                                                        respon += '<input class="datetimepickers" name="'+vk+'" style="width:98%;height:40px" value="'+values+'">';
                                                    }else if(vvv == 'int' || vvv == 'bigint'){
                                                        respon += '<input class="integerInput" type="text" name="'+vk+'" style="width:98%;" value="'+values+'">';
                                                    }else if(vvv =='radio'){
                                                        respon += '<input type="radio" name="'+editId+'_'+vk+'" value="y"';
                                                        if(values == 'y'){
                                                            respon += ' checked="checked"'
                                                        }    
                                                        respon += '> Active&nbsp;';
                                                        respon += '<input type="radio" name="'+editId+'_'+vk+'" value="n"';
                                                        if(values == 'n'){
                                                            respon += ' checked="checked"'
                                                        } 
                                                        respon += '> Not Active';
                                                    }else if(vvv == 'selectYear'){
                                                        var currentTime = new Date()
                                                        var year = currentTime.getFullYear()
                                                        var nextYear = parseInt(year) + 5;
                                                        respon += '<select name="'+vk+'">';
                                                        for(i=year;i<=nextYear;i++){
                                                            respon += '<option value="'+i+'"'
                                                            if(i == values){
                                                                respon += ' selected="selected"';
                                                            }    
                                                            respon += '>'+i+'</option>';
                                                        }
                                                        respon += '</select>';
                                                    }else{
                                                        respon += '<input type="text" name="'+vk+'" style="width:98%;" value="'+values+'">';
                                                    }
                                                }
                                            });
                                            }else{
                                                respon += values;
                                            }
                                        });
                                        respon += '</span>';
                                    }
                                    respon += '</td>';
                                }
                            });
                            no++;
                            if(settings.editable==true){
                                respon += '<td width="20"><span data-id="'+editId+'" data-page="'+page+'" class="ui-icon ui-icon-trash RemoveData" style="width:16px;cursor:pointer;"></span></td>';
                            }
                            respon +='</tr>';
                       // }
                    });
                    respon += '</table>';
                    respon +='<table class="table-explorer" style="width:'+settings.width+';margin:0px;">';
                    respon +='<tr>';
                    respon +='<th style="border-right:0;font-weight:normal;">';
                    respon += 'Page: '+page+' of '+tot_page;
                    respon += '&nbsp;<a href="#" style="text-decoration:none;color:#3e3e3e;padding:3px 10px;" ';
                    if(page > 1){
                        var prev = parseInt(page) - 1;
                        respon += ' class="Treload" data-id="'+prev+'"';
                    }else{
                        respon += ' class="btn-disable" ';
                    }    
                    respon += '>&laquo; Prev</a>';
                    respon += '<a href="#" style="text-decoration:none;color:#3e3e3e;padding:3px 10px;" ';
                    if(page < tot_page){
                        var next = parseInt(page) + 1;
                        respon += ' class="Treload" data-id="'+next+'"';
                    }else{
                        respon += ' class="btn-disable" ';
                    }      
                    respon += '>Next &raquo;</a>';
                    respon += '';
                    respon +='</th>';
                    respon +='<th style="text-align:right;font-weight:normal;">';
                    var urutan = Math.ceil((page - 1) * settings.limit) + 1;
                    respon +='Displaying '+urutan+' - '+(no - 1)+' of '+settings.total_data;
                    respon +='</th>';
                    respon +='</tr>';
                    respon +='</table>';
                }
                respon += '</div>';
                element.html(respon);
            }
        });
        return false;
    }
    function WriteStatus(tipe,pesan){
        var str;
        if(tipe == 'success'){
            str = '<div id="theTrueMsg" onclick="javascript:$(\'#theTrueMsg\').remove();" title="Click to close" style="background-image: url(images/status_ok.gif);background-repeat : no-repeat;background-position: 5px 3px;position:absolute;left:200px;right:200px;padding:10px 10px 10px 45px;" class="ui-widget ui-widget-content ui-corner-bottom">'
            +pesan+
            '</div>';
            $('body').prepend(str);
            setTimeout('$(\'#theTrueMsg\').remove();',2000);
        }else if(tipe == 'error'){
            str = '<div id="theTrueMsg" onclick="javascript:$(\'#theTrueMsg\').remove();" title="Click to close" style="background-image: url(images/status_warning.gif);background-repeat : no-repeat;background-position: 5px 1px;position:absolute;left:200px;right:200px;padding:10px 10px 10px 45px;" class="ui-widget ui-state-error ui-corner-bottom">'
            +pesan+
            '</div>';
            $('body').prepend(str);
            setTimeout('$(\'#theTrueMsg\').remove();',2000);
        }else if(tipe == 'loading'){
            str = '<div id="theTrueMsg" onclick="javascript:$(\'#theTrueMsg\').remove();" title="Click to close" style="background-image: url(images/ajax-loader.gif);background-repeat : no-repeat;background-position: 5px 1px;position:absolute;left:200px;right:200px;padding:10px 10px 10px 45px;" class="ui-widget ui-widget-content ui-corner-bottom">'
            +pesan+
            '</div>';
            $('body').prepend(str);
            setTimeout('$(\'#theTrueMsg\').remove();',2000);
        }
    }
    function remove_element(eId){
        return(EObj=document.getElementById(eId))?EObj.parentNode.removeChild(EObj):false;
    }
    $(".Treload").live('click',function(){
        var datanya = $(this).attr('data-id');
        Tgridreload(datanya);
    });
    $("#AddTGrid").live('click',function(){
        if ($("#SaveNewGrid").length > 0){
            $("#SaveNewGrid").remove();
            $("#SaveGrid").attr('data-op','none');
            $('#SaveGrid').removeClass('btn-enable');
            $('#SaveGrid').addClass('btn-disable');
            $("#AddTGrid").html('+ Add New');
        }else{
            
            var pages = $(this).attr('data-page');
            var appends = '';
            if(settings.tablehead == '' || settings.insert_field == ''){
                alert('insert_field or tablehead not define');
                $("#AddTGrid").html('+ Add New');
                $("#SaveGrid").attr('data-op','none');
                $('#SaveGrid').removeClass('btn-enable');
                $('#SaveGrid').addClass('btn-disable');
            }else{
                $('#SaveGrid').removeClass('btn-disable');
                $('#SaveGrid').addClass('btn-enable');
                $('#SaveGrid').attr('data-op','addnew');
                appends += '<tr id="SaveNewGrid" data-page="'+pages+'">';
                appends += '<td width="24" style="text-align:center;">+</td>';
                $.each(settings.insert_field,function(kk,vv){
                    $.each(vv,function(vk,vvv){
                        if(vvv == 'varchar'){
                            appends += '<td><input type="text" name="'+vk+'" style="width:98%;"></td>';
                        }else if(vvv == 'text'){
                            appends += '<td><textarea name="'+vk+'" style="width:98%;height:40px"></textarea></td>';
                        }else if(vvv == 'date'){
                            appends += '<td><input class="datepickers" name="'+vk+'" style="width:98%;height:40px"></td>';
                        }else if(vvv == 'datetime'){
                            appends += '<td><input class="datetimepickers" name="'+vk+'" style="width:98%;height:40px"></td>';
                        }else if(vvv == 'int' || vvv == 'bigint'){
                            appends += '<td><input class="integerInput" type="text" name="'+vk+'" style="width:98%;"></td>';
                        }else if(vvv =='radio'){
                            appends += '<td><input type="radio" name="'+vk+'" value="y" checked="checked"> Active&nbsp;';
                            appends += '<input type="radio" name="'+vk+'" value="n"> Not Active</td>';
                        }else if(vvv == 'selectYear'){
                            var currentTime = new Date()
                            var year = currentTime.getFullYear()
                            var nextYear = parseInt(year) + 5;
                            appends += '<td>';
                            appends += '<select name="'+vk+'">';
                            for(i=year;i<=nextYear;i++){
                                appends += '<option value="'+i+'"'
                                if(i == year){
                                    appends += ' selected="selected"';
                                }    
                                appends += '>'+i+'</option>';
                            }
                            appends += '</select></td>';
                        }else{
                            appends += '<td><input type="text" name="'+vk+'" style="width:98%;"></td>';
                        }
                    });
                });
                appends += '<td width="24"></td>';
                appends += '</tr>';
            }
            $("#AddTGrid").html('&times; Cancel');
            $("#TransGrid").append(appends);
            bind_datepicker();
        }
    });
    
//    $("tr#SaveNewGrid").live('change',function(){
//        var fields = {};
//        var pages = $(this).attr('data-page');
//        $('tr#SaveNewGrid input,select,textarea').each(function(){
//            var el = $(this);
//            if(el.attr('type') == 'radio'){
//                var nam = el.attr('name');
//                fields[nam] = $('input[name='+nam+']:checked').val(); 
//            }else{
//                fields[el.attr('name')] = el.val(); 
//            }
//        });
//        var ErrorCek = 0;
//        $.each(fields,function(kkk,vvv){
//            if(vvv.length < 1){
//                ErrorCek = 1;
//            }
//        });
//        if(ErrorCek == 0){
//            if(confirm('Are you sure want to save this data?')){
//                $.ajax({
//                    type:'post',
//                    url: settings.url_insert,
//                    data:fields,
//                    beforeSend: function() { WriteStatus('loading','Loading. Please Wait...'); },
//                    success:function(){
//                        Tgridreload(pages);
//                    }
//                });
//            }
//        }
//    });
    $('.RemoveData').live('click',function(e){
        e.preventDefault();
        var id = $(this).attr('data-id');
        var pages = $(this).attr('data-page');
        if(confirm('Are you sure want to delete this data?')){
            $.ajax({
                type:'post',
                url:settings.url_delete,
                data:settings.pkey+'='+id,
                success:function(res){
                    if(res == 'success'){
                        WriteStatus('success','Data has been successfully deleted');
                        var tmpp = settings.total_data;
                        settings.total_data = tmpp - 1;
                    }else{
                        WriteStatus('error','Failed while deleting data from database');
                    }
                    Tgridreload(pages);
                }
            });
        }
        return false;
    })
    $('.editThis').live('click',function(){
        var ID = $(this).attr('id');
        var pages = $(this).attr('data-page');
        $("#TransGrid tr").children('td').css('background','transparent');
        $(this).children('td').css('background','pink');
        $('.viewData').show();
        $('.editData').hide();
        $('span#view'+ID).hide();
        $('span#edit'+ID).show();
        $('#SaveGrid').attr('data-id',ID);
        $('#SaveGrid').attr('data-op','edit');
        $('#SaveGrid').removeClass('btn-disable');
        $('#SaveGrid').addClass('btn-enable');
    });
    $('.integerInput').live('keypress',function(e){
        var a = [];
        var k = e.which;
        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k)>=0))
            e.preventDefault();
    });
    $("#searchkey").live('keyup',function(e){
        if(e.keyCode == 13){
            var keys = $(this).val();
            settings.keyword = keys;
            Tgridreload(1);
        }
    });
    $('#SaveGrid').live("click",function(e){
        e.preventDefault();
        var fields = {};
        var ID = $(this).attr('data-id');
        var op = $(this).attr('data-op');
        var pages = $(this).attr('data-page');
        if(op == 'edit'){
            $('tr#'+ID+' input,textarea').each(function(){
                var el = $(this);
                if(el.attr('type') == 'radio'){
                    var nam = el.attr('name');
                    var new_nam = nam.replace(ID+'_','');
                    fields[new_nam] = $('input[name='+nam+']:checked').val(); 
                }else{
                    fields[el.attr('name')] = el.val(); 
                }
            });
            fields[settings.pkey] = ID;
            $.ajax({
                type:'post',
                url: settings.url_edit,
                data:fields,
                success:function(res){
                    if(res == 'success'){
                        WriteStatus('success','Data has been successfully Saved');
                    }else{
                        WriteStatus('error','Failed while saving data in to database');
                    }
                    Tgridreload(pages);
                    $('#SaveGrid').removeClass('btn-enable');
                    $('#SaveGrid').addClass('btn-disable');
                }
            });
        }else if(op == 'addnew'){
            $('tr#SaveNewGrid input,select,textarea').each(function(){
                var el = $(this);
                if(el.attr('type') == 'radio'){
                    var nam = el.attr('name');
                    fields[nam] = $('input[name='+nam+']:checked').val(); 
                }else{
                    fields[el.attr('name')] = el.val(); 
                }
            });
            var ErrorCek = 0;
            $.each(fields,function(kkk,vvv){
                if(vvv.length < 1){
                    ErrorCek = 1;
                }
            });
            if(ErrorCek == 0){
                //if(confirm('Are you sure want to save this data?')){
                    $.ajax({
                        type:'post',
                        url: settings.url_insert,
                        data:fields,
                        beforeSend: function() { WriteStatus('loading','Loading. Please Wait...'); },
                        success:function(res){
                            if(res == 'success'){
                                WriteStatus('success','Data has been successfully Saved');
                                var tmpp = settings.total_data;
                                settings.total_data = tmpp + 1;
                            }else{
                                WriteStatus('error','Failed while saving data in to database');
                            }
                            Tgridreload(tot_page); // Redirect ke halaman terakhir
                        }
                    });
                //}
            }
        }
    });
    $(document).live("mouseup",function(e){
        if ($("#SaveNewGrid").length == 0){
            if(!$(e.target).is('a#SaveGrid')) {
                $(".editData").hide();
                $(".viewData").show();
                $("#TransGrid tr").children('td').css('background','transparent');
                $('#SaveGrid').attr('data-op','none');
                $('#SaveGrid').removeClass('btn-enable');
                $('#SaveGrid').addClass('btn-disable');
            }
        }
    });
    function bind_datepicker(){
        $("input.datepickers").datepicker({dateFormat: 'yy-mm-dd',showAnim: 'clip'});
        $("input.datetimepickers").datetimepicker({dateFormat: 'yy-mm-dd',showAnim: 'clip'});
    }
};
