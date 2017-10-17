//节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// 用mouseenter/mouseleave即可
// function contains(p, c) {
//   return p.contains ? p != c && p.contains(c) : !!(p.compareDocumentPosition(c) & 16)
// }
// //使得子元素不触发 父元素的mouseover和mouseout事件
// export function fixedMouse(e, target) {
//   // console.log(e.type);
//   let related, type = e.type.toLowerCase();
//   if (type == 'mouseover') {
//     related = e.relatedTarget || e.fromElement
//   } else if (type == 'mouseout') {
//     related = e.relatedTarget || e.toElement
//   } else return true;
//   return related && related.prefix != 'xul' && !contains(target, related) && related != target;
// }
// 获取随机颜色
export const getColor = (function () {
  var r = 0,
    m = Math,
    u = m.PI * 2,
    v = m.cos,
    z = m.random;

  var getColor = function () {
    r -= u / -40;
    return 'rgba(' + parseInt(v(r) * 100 + 155) + ',' + parseInt(v(r + u / 3) * 100 + 155) + ',' + parseInt(v(r + u / 3 * 2) * 100 + 155) + ', 0.7)'
  }
  return getColor;
})();
// 时间格式化
export function formatTime(duration) {
  duration = duration | 0 //取整，非数字字符转化成0
  let min = (duration / 60 | 0) + ''
  let sec = duration % 60 + ''
  min = "00".substr(0, 2 - min.length) + min
  sec = "00".substr(0, 2 - sec.length) + sec
  return `${min}:${sec}`
}
function getRandomInt(min, max){
  return Math.floor(Math.random()*(max-min)+min)
}
// 重排序
export function shuffle(arr){
  let _arr = arr.slice()
  for(let i =0;i<_arr.length;i++){
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}