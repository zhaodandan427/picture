/* 通用类集合 */
export const Common = {
  /*
  * 判断元素是否含有指定类名
  * @params obj  查询的元素
  * @params cls  类名
  *  */
  hasClass(obj, cls) {
    let _class = obj.className;
    if (!_class || _class instanceof Object) {
      return false;
    }
    let _class_list = _class.split(/\s+/);
    let len = _class_list.length;
    for (let i = 0; i < len; i++) {
      if (_class_list[i] === cls) {
        return true;
      }
    }
    return false;
  },
  /*
  * 随机生成指定位数的id
  * @params n  几位
  * @params flag  是否不可重复 default false 可重复
  *  */
  randomID(n, flag) {
    let pass = "";

    pass += "0123456789";
    pass += "abcdefghijklmnopqrstuvwxyz";
    pass += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let passwords = [];
    let _chars = pass.split(""),
      password = "";
    for (let j = 0, k = n; j < k; j++) {
      if (_chars.length < 1) break;
      let index = Math.floor(Math.random() * _chars.length);
      password += _chars[index];
      if (flag) _chars.splice(index, 1);
    }

    passwords.push(password);
    return passwords.join("\n");
  },
  /*
  * 获取元素到window的距离
  * 注：该方法忽视transform的translate
  * */
  getElementOffset(ele) {
    let top = ele.offsetTop;
    let left = ele.offsetLeft;
    let curr = ele.offsetParent;
    while (curr !== null) {
      top += curr.offsetTop;
      left += curr.offsetLeft;
      curr = curr.offsetParent;
    }
    return {
      top,
      left
    };
  }
};

/**
 * copy Object
 * 不copy的属性值：undefined，null
 * @param target 不能是undefined
 * @param source
 * @param deepFlag
 * @returns {*}
 */
const objKeys = Object.keys;
const copyObj = (target, source, deepFlag) => {
  // source === undefined 或 {} 时，不进行copy
  if (source === undefined || objKeys(source).length === 0) return target;
  // target === undefined 时，抛出错误
  if (target === undefined) throw new Error('Target is undefined!');

  // 分两个循环，数组从两头进行汇合
  let sourceKeys = objKeys(source);
  let sourceKeysLength = sourceKeys.length;
  let sourceKeysHalfLength = Math.ceil(sourceKeysLength / 2);
  sourceKeysHalfLength = sourceKeysHalfLength < 1 ? 1 : sourceKeysHalfLength;

  for (let i = 0, j = sourceKeysLength - 1; i <= sourceKeysHalfLength; i++, j--) {
    let key1 = sourceKeys[i], key2 = sourceKeys[j];
    let s1 = source[key1], s2 = source[key2];
    if ((typeof s1 === 'boolean') || s1) valuesExchange(target, key1, s1, deepFlag);
    if ((typeof s2 === 'boolean') || s2) valuesExchange(target, key2, s2, deepFlag);
  }
  return target;
};

function valuesExchange(target, key, s, deepFlag) {
  if (s instanceof Array) {
    target[key] = s;
  } else if (typeof s !== 'string' && objKeys(s).length > 0 && deepFlag) {
    target[key] = target[key] === undefined ? {} : target[key];
    copyObj(target[key], s, deepFlag);
  } else {
    target[key] = s;
  }
}

export {
  copyObj
}
