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
        limit:20,
        total_data:0,
        width:'100%',
        title:'Transformatika Data Grid',
        pkey : '' // Primary Key
    },
    settings = $.extend({}, defaults, options);
    Tgridreload(1);
    function Tgridreload(page){
        var respon = '';
        $.ajax({
            url:settings.url,
            type:settings.ajaxtipe,
            data:settings.data+'&page='+page,
            dataType:'json',
            beforeSend: function() {
                WriteStatus('loading','Loading. Please Wait...');
            },
            success: function(res){
                remove_element('theTrueMsg');
                // HITUNG PAGING NYA
                //var tot_data = res.length;
                var tot_page = Math.ceil(settings.total_data / settings.limit);
                if(tot_page == 0){
                    tot_page = 1;
                }
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
                    respon += '<div class="ui-widget-content" style="padding:2px;background:#F2F6F8;border-bottom:0;">';
                    respon += '<span style="width:4px;border-right:1.8px dotted #AAA;">&nbsp;</span> &nbsp;';
                    respon += '<a class="btn-enable" id="AddTGrid" href="#" data-page="'+page+'" style="padding:3px;display:inline-block;">+ Add New</a>';
                    respon += '&nbsp;&nbsp;<a class="btn-disable" id="SaveGrid" href="#" data-id="" data-page="'+page+'" style="padding:3px;display:inline-block;">&radic; Save</a>';
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
                                    if(values == 'y' || values == 'n'){
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
                                        if($.inArray(ii, array_field) >= 0){
                                            if(values != 'y' && values != 'n'){
                                                respon += '<input type="text" name="'+ii+'" id="'+editId+'" style="width:98%" value="'+values+'">';
                                            }else{
                                                //respon += '<select id="'+editId+'" name="'+ii+'" style="width:98%;" onclick="return false;">';
                                                respon += '<input type="radio" name="'+editId+'_'+ii+'" value="y"';
                                                if(values == 'y'){
                                                    respon += ' checked="checked"';
                                                }
                                                respon += '>Active</option>';
                                                respon += '<input type="radio" name="'+editId+'_'+ii+'" value="n"';
                                                if(values == 'n'){
                                                    respon += ' checked="checked"';
                                                }
                                                respon += '>Not Active</option>';
                                            //respon += '</select>';
                                       
                                            }
                                        }else{
                                            respon += values;
                                        }
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
                    respon +='<th>';
                    respon += 'Page: '+page+' of '+tot_page;
                    respon += '&nbsp;<a href="#" style="text-decoration:none;color:#3e3e3e;padding:3px 10px;" ';
                    if(page > 1){
                        var prev = parseInt(page) - 1;
                        respon += ' class="Treload" data-id="'+prev+'"';
                    }    
                    respon += '>&laquo; Prev</a>';
                    respon += '<a href="#" style="text-decoration:none;color:#3e3e3e;padding:3px 10px;" ';
                    if(page < tot_page){
                        var next = parseInt(page) + 1;
                        respon += ' class="Treload" data-id="'+next+'"';
                    }    
                    respon += '>Next &raquo;</a>';
                    respon += '';
                    respon +='</th>';
                    respon +='<th style="text-align:right;">';
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
            setTimeout('$(\'#theTrueMsg\').remove();',1000);
        }else if(tipe == 'error'){
            str = '<div id="theTrueMsg" onclick="javascript:$(\'#theTrueMsg\').remove();" title="Click to close" style="background-image: url(images/status_warning.gif);background-repeat : no-repeat;background-position: 5px 1px;position:absolute;left:200px;right:200px;padding:10px 10px 10px 45px;" class="ui-widget ui-state-error ui-corner-bottom">'
            +pesan+
            '</div>';
            $('body').prepend(str);
            setTimeout('$(\'#theTrueMsg\').remove();',1000);
        }else if(tipe == 'loading'){
            str = '<div id="theTrueMsg" onclick="javascript:$(\'#theTrueMsg\').remove();" title="Click to close" style="background-image: url(images/ajax-loader.gif);background-repeat : no-repeat;background-position: 5px 1px;position:absolute;left:200px;right:200px;padding:10px 10px 10px 45px;" class="ui-widget ui-widget-content ui-corner-bottom">'
            +pesan+
            '</div>';
            $('body').prepend(str);
            setTimeout('$(\'#theTrueMsg\').remove();',1000);
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
            $("#AddTGrid").html('+ Add New');
        }else{
            var pages = $(this).attr('data-page');
            var appends = '';
            if(settings.tablehead == '' || settings.insert_field == ''){
                alert('insert_field or tablehead not define');
                $("#AddTGrid").html('+ Add New');
            }else{
                appends += '<tr id="SaveNewGrid" data-page="'+pages+'">';
                appends += '<td width="24" style="text-align:center;">+</td>';
                $.each(settings.insert_field,function(kk,vv){
                    $.each(vv,function(vk,vvv){
                        if(vvv == 'text'){
                            appends += '<td><input type="text" name="'+vk+'" style="width:98%;"></td>';
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
                        }else if(vvv == 'selectDept'){
                            appends += '<td>';
                            appends += '<select name="'+vk+'">';
                            appends += '<option value="DLMI">Corporate</option>';
                            appends += '<option value="DLMI_OPS">Operation</option>';
                            appends += '<option value="DLMI_OPS_MNF">Manufacture</option>';
                            appends += '<option value="DLMI_OPS_MNF_MLR">MLR</option>';
                            appends += '<option value="DLMI_OPS_MNF_CHP">Chilled</option>';
                            appends += '<option value="DLMI_OPS_MNF_UHT">UHT</option>';
                            appends += '<option value="DLMI_OPS_MNF_STM">STM</option>';
                            appends += '<option value="DLMI_OPS_MNF_PWD">Powder</option>';
                            appends += '<option value="DLMI_QCS">QC & SHE</option>';
                            appends += '<option value="DLMI_QCS_QC">QC</option>';
                            appends += '<option value="DLMI_QCS_SHE">SHE</option>';
                            appends += '<option value="DLMI_CI">Continuous Improvement</option>';
                            appends += '<option value="DLMI_PUR">Purchasing</option>';
                            appends += '<option value="DLMI_IT">IT</option>';
                            appends += '<option value="DLMI_MAC">Management Accountant</option>';
                            appends += '</select></td>';
                        }
                    });
                });
                appends += '<td width="24"></td>';
                appends += '</tr>';
            }
            $("#TransGrid").append(appends);
            $("#AddTGrid").html('&times; Cancel');
        }
    });
    $("tr#SaveNewGrid").live('change',function(){
        var fields = {};
        var pages = $(this).attr('data-page');
        $('tr#SaveNewGrid input,select').each(function(){
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
            if(confirm('Are you sure want to save this data?')){
                $.ajax({
                    type:'post',
                    url: settings.url_insert,
                    data:fields,
                    beforeSend: function() { WriteStatus('loading','Loading. Please Wait...'); },
                    success:function(){
                        Tgridreload(pages);
                    }
                });
            }
        }
    });
    $('.RemoveData').live('click',function(e){
        e.preventDefault();
        var id = $(this).attr('data-id');
        var pages = $(this).attr('data-page');
        if(confirm('Are you sure want to delete this data?')){
            $.ajax({
                type:'post',
                url:settings.url_delete,
                data:settings.pkey+'='+id,
                success:function(){
                    Tgridreload(pages);
                }
            });
        }
        return false;
    })
    $('.editThis').live('click',function(){
        var ID = $(this).attr('id');
        var pages = $(this).attr('data-page');
        $('.viewData').show();
        $('.editData').hide();
        $('span#view'+ID).hide();
        $('span#edit'+ID).show();
        $('#SaveGrid').attr('data-id',ID);
        $('#SaveGrid').removeClass('btn-disable');
        $('#SaveGrid').addClass('btn-enable');
    });
    
    $('#SaveGrid').live("click",function(){
        var fields = {};
        var ID = $(this).attr('data-id');
        var pages = $(this).attr('data-page');
        $('tr#'+ID+' input').each(function(){
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
            success:function(){
                Tgridreload(pages);
                $('#SaveGrid').removeClass('btn-enable');
                $('#SaveGrid').addClass('btn-disable');
            }
        });
    });
    $(document).live("mouseup",function(){
        $(".editData").hide();
        $(".viewData").show();

    });
};
