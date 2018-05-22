/**
 * @param [Object] [obj] [需要转化的对象名]
 * @param [String] [flag1] [属性与值的间隔符]
 * @param [String] [flag2] [属性之间的间隔符]
 * @param [Boolean] [notNeedFilterNull] [不需要过滤空值]　默认会过滤空值
 * 存放在obj里的IGNOREEMPTY以','分隔的字段，不会被过滤空值
 */
//对象转字符串
export function objToStr(obj, flag1, flag2, notNeedFilterNull) {
  flag1 = flag1 || '=';
  flag2 = flag2 || '&';
  var result = '';
  for (var item in obj) {
    /* 不需要过滤空值 */
    if (notNeedFilterNull) {
      result += item + flag1 + obj[item] + flag2;
      continue;
    }

    /* 需要过滤空值（默认）　*/
    //'IGNOREEMPTY'标识里的字段，不过滤空值
    if (obj['IGNOREEMPTY'] && obj['IGNOREEMPTY'].split(',').indexOf(item) !== -1) {
      result += item + flag1 + obj[item] + flag2;
      continue;
    }
    if (obj[item] === '' || obj[item] === null || obj[item] === undefined || item === 'IGNOREEMPTY') continue;
    result += item + flag1 + obj[item] + flag2;
  }
  return result.slice(0, -1);
};

//字符串转对象 'a=1&b=2'
export function strToObj(str, flag1, flag2) {
  flag1 = flag1 || '&';
  flag2 = flag2 || '=';
  var arr = str.split(flag1),
      item = '',
      result = {};
  for (var i in arr) {
    item = arr[i].split(flag2);
    result[item[0]] = item[1];
  }

  return result;
};

//克隆
export function cloneObj (obj){
  var str, newobj = obj.constructor === Array ? [] : {};
  if(typeof obj !== 'object'){
    return;
  } else if(window.JSON){
    str = JSON.stringify(obj), //系列化对象
    newobj = JSON.parse(str); //还原
  } else {
    for(var i in obj){
      newobj[i] = typeof obj[i] === 'object' ? 
      this.cloneObj(obj[i]) : obj[i]; 
    }
  }
  return newobj;
};

//获取url参数
export function getUrlParams(name) {
  var searchStr = window.location.search.substring(1);
  return this.strToObj(searchStr)[name] || '';
};

// 判断是否数组
export function isArrayFn(value){
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
};

//填充0
export const paddingZero = function paddingZero(number) {
  if(number < 10){
    return '0' + number;
  } else {
    return number;
  }
};

//日期格式化(时间戳)
export function dateFormat(date, type) {
  //如果是字符串，先转成日期对象
  if (typeof date != 'object') {
    date = '' + date;
    //js格式的时间戳
    if (date.length > 12) {
      date = new Date(parseInt(date));
    } else {
    //java里的时间戳
      date = new Date(parseInt(date) * 1000);
    }
  }

  let year = date.getFullYear(),
      month = paddingZero(date.getMonth() + 1),
      day = paddingZero(date.getDate()),
      hour = paddingZero(date.getHours()),
      minute = paddingZero(date.getMinutes()),
      second = paddingZero(date.getSeconds()),
      //默认YYYY-MM-DD HH:mm:ss
      defaultDateStr = [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');

  //先做简单判断
  //'YYYY-MM-DD'
  if (type !== undefined && type.split(' ').length < 2) {
    return [year, month, day].join('-');
  } else {
  //默认
    return defaultDateStr;
  }
};

//手机号码加上掩码
export function phoneMask(phoneNum, startIndex, maskBits) {
  //从第几位开始加掩码　默认第四位起
  startIndex = startIndex || 3;
  //掩码位数，默认四位
  maskBits = maskBits || 4;

  let maskStr = new Array(maskBits + 1).join('*'),
      phoneNumStr = phoneNum + '';

  return phoneNumStr.substring(0, startIndex) + maskStr + phoneNumStr.substring(startIndex + maskBits);
};

//金钱格式化 12 => $12.00 || 12.344 => $12.34
export function priceFormat(price, priceIcon, floatBits) {
  //默认为人民币符号
  priceIcon = '¥' || priceIcon;
  //默认为小数点后两位
  floatBits = floatBits || 2;

  if (typeof price === 'number') {
    price = price.toString();
    _toFloat();
  } else {
  //是字符串
    _toFloat();
  }

  function _toFloat() {
    let priceArr;

    //是符点数
    if (price.indexOf('.') !== -1) {
      priceArr = price.split('.');
      return priceIcon + priceArr[0] + '.' + priceArr[1].substring(0, floatBits);
    }
    //是整数
    return priceIcon + price + '.' + new Array(floatBits + 1).join('0');
  }
}

export function status(msg) {
  switch(msg) {    
    case 'approving':
      return '审批中'
      break;
    case 'available':
      return '可用'
      break;
    case 'disable':
      return '停用'
      break;
    case 'editing':
      return '编辑中'
      break;
    case 'reject':
      return '驳回'
      break;
    case '':
      return '全部'
      break;
  }
};

