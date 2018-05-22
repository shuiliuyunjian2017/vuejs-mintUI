// 数字校验
var isNumber = (value, message) => {
  let reg = /^[0-9]*$/,
      result = false;

  message = message || '只能输入数字';
    
  if (reg.test(value)) {
    result = true; 
  }

  return {
    result: result,
    message: message
  };
};

// 电话号码校验
var isPhone = (value, message) => {
  let reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1})|(16[6-7]{1})|(19[8-9]{1}))+\d{8})$/,
      result = false;

  message = message || '手机号码格式错误';
    
  if (reg.test(value)) {
    result = true; 
  }

  return {
    result: result,
    message: message
  };
};

// 英文校验
var isLetter = (value, message) => {
  let reg = /^[a-zA-Z]+$/,
      result = false;

  message = message || '只能输入英文';
    
  if (reg.test(value)) {
    result = true; 
  }

  return {
    result: result,
    message: message
  };
};

// 邮箱校验
var isEmail = (value, message) => {
  let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      result = false;

  message = message || '邮箱格式错误';
    
  if (reg.test(value)) {
    result = true; 
  }

  return {
    result: result,
    message: message
  };
};

// 身份证校验 
var isIdcard = (value, message) => {
  let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      result = false;

  message = message || '身份证号码格式错误';
    
  if (reg.test(value)) {
    result = true; 
  }

  return {
    result: result,
    message: message
  };
};

export{
  isNumber,isLetter,isPhone,isEmail,isIdcard
}