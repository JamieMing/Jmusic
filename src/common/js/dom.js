
//兼容处理 

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    // 检测浏览器有没有这个属性
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

const _event = function() {
  return {
    addEvent(obj, type, handler) {
      if (obj.addEventListener) {
        obj.addEventListener(type, handler, false)
        return handler
      } else if (obj.attachEvent) {
        // 矫正this。event对象
        var wrapper = function(){
          var e = window.event
          e.target = e.srcElement
          handler.call(obj, e)
        }
        obj.attachEvent('on' + type, wrapper)
        return wrapper
      } else {
        obj['on' + type] = handler
      }
    },
    removeEvent(obj, type, handler) {
      if (obj.removeEventListener) {
        obj.removeEventListener(type, handler, false);
      } else if (obj.detachEvent) {
        obj.detachEvent('on' + type, handler); //ie
      } else {
        obj['on' + type] = null;
      }
    }
  }
}
export const event = _event();
