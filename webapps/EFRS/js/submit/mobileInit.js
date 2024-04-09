function initSubmitUploadInfo(json){
    let isUploadInfo = false;
    let isOfflineUpload = json.OfflineUpload;
    let isCustomUpload = false;
    $.each(json.SheetArray, function (_i, _in) {
        let dataCheckInfos = _in.DataCheckInfos;
        let customDataCheckInfos = _in.CustomDataCheckInfos;
        let uploadInfoss = _in.UploadInfos;
        let customUploadInfos = _in.CustomUploadInfos;
        if(customUploadInfos.length != 0){
            isCustomUpload = true;
        }
        if(dataCheckInfos.length != 0 || customDataCheckInfos.length != 0){
            isShowValidate = true;
        }
        if(uploadInfoss.length != 0 || customUploadInfos.length != 0){
            isUploadInfo = true;
        }
        //let sheetName = _in.SheetName;
        $.each(_in.UploadInfos, function (_j, _jn) {
            let uploadName = _jn.UploadInfoName; //填报名
            if ($.inArray(_jn.UploadInfoName, uploadInfos) == -1) { //不包含该填报名
                uploadInfos.push(_jn.UploadInfoName);
            }
        });

    });
    //非自定义填报
    if(!isCustomUpload){
        $('#sql').parent().parent().hide();
        $('.sql-divider').hide();
    }
    if(isUploadFlag != 0){//没有权限填报
        // $('#normal-buttonDiv').css('display' , 'inline-flex');
        $('#buttonDiv').hide();
    }else{
        //没有填报信息
        if(!isUploadInfo){
            // $('#normal-buttonDiv').css('display' , 'inline-flex');
            $('#buttonDiv').hide();
        }else{
            // $('#normal-buttonDiv').css('display' , 'none');
            $('#buttonDiv').css('display' , 'inline-flex');
        }
    }

    //没有校验信息
    // console.log("执行到这里来了。。。。。。。。20230310");
    if(!isShowValidate){
        $('.validateP').parent().parent().hide();
        $('.validate-divider').hide();
        $('.clearP').parent().parent().hide();
        $('.clear-divider').hide();

        $("#div_btn_data_validate_table").hide();
        // $("#div_btn_data_submit_table").show();

        $("#div_btn_data_submit_table").hide();
    } else {
        // $("#div_btn_data_validate_table").show();
        // $("#div_btn_data_submit_table").show();

        $("#div_btn_data_validate_table").hide();
        $("#div_btn_data_submit_table").hide();
    }

    if(isOfflineUpload){
        $('.offline-btn').show();
        $('.offline-divider').show();
    }else{

    }

}

function isNull(obj) {
    if (obj == null || obj == undefined || obj == '') {
        return true;
    }
    return false;
}