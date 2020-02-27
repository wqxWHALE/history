function getObjectValues(Array)
{
    let valueArr=[];
    for(let i=0;i<Array.length;i++){
        var values = [];
        for (let property in Array[i]){
            values.push( Array[i][property]);
        }
        valueArr.push(values);
    }
    return valueArr;
}
exports.getObjectValues=function(object){
    return getObjectValues(object)
};
/*取parent下class为clsName的节点数组*/
function getUnderNode(parent,clsName){
    let pId = document.getElementById(parent);
    let boxArr = [];
    let oElements  = pId.getElementsByTagName('*');
    console.log("node length:"+oElements.length);
    for(let i=0;i<oElements.length;i++){
        console.log(oElements[i].className);
        if(oElements[i].className.indexOf(clsName)!== -1){
            boxArr.push(oElements[i]);
        }
     }
    return boxArr;
}

exports.getUnderNode=function(parent,clsName){
    return getUnderNode(parent,clsName)
};

//判断是否为空
function isNotNull(x) {
    return x !== null && x !== undefined && x !== ''
}

exports.isNotNull=function(x){
    return isNotNull(x)
};

//input验证是否为空
function inputCheckNull() {
    // if (arguments.length===2) {
    //     //验证input是否为空，错误输出在placeholder属性
    //     return valueCheckTipOnPlaceholder(arguments[0],arguments[1]);
    // }else if(arguments.length===3){
    //     //验证input是否为空，错误输出在参数对象中
    //     return valueCheckTipOnObj(arguments[0], arguments[1],arguments[2]);
    // }
}


// function valueCheckTipOnObj(obj,tip,tipShowObj) {
//     if (isNotNull(obj)) {
//         if ($.trim(obj.val()) === "") {
//             tipShowObj.html(tip);
//             return false;
//         } else {
//             tipShowObj.html("");
//             return true;
//         }
//     } else {
//         return false;
//     }
// }
//
// function valueCheckTipOnPlaceholder(obj, tip) {
//     if (isNotNull(obj)) {
//         if ($.trim(obj.val()) === "") {
//             obj.attr("placeholder", tip);
//             return false;
//         } else {
//
//             return true;
//         }
//     } else {
//         return false;
//     }
// }
//input验证是否为手机号
function checkIsPhone(target) {
    if (target.length === 11) {
        let reg = /^1[0-9]{10}$/;
        return reg.test(target);
    }else{
        return false;
    }
}

exports.checkIsPhone=function(target){
    return checkIsPhone(target);
};
