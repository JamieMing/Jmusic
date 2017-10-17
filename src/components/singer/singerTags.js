export const singerTags = [{
  "key": "all_all",
  "value": "全部"
}, {
  "key": "cn_man",
  "value": "华语男"
}, {
  "key": "cn_woman",
  "value": "华语女"
}, {
  "key": "cn_team",
  "value": "华语组合"
}, {
  "key": "k_man",
  "value": "韩国男"
}, {
  "key": "k_woman",
  "value": "韩国女"
}, {
  "key": "k_team",
  "value": "韩国组合"
}, {
  "key": "j_man",
  "value": "日本男"
}, {
  "key": "j_woman",
  "value": "日本女"
}, {
  "key": "j_team",
  "value": "日本组合"
}, {
  "key": "eu_man",
  "value": "欧美男"
}, {
  "key": "eu_woman",
  "value": "欧美女"
}, {
  "key": "eu_team",
  "value": "欧美组合"
}, {
  "key": "c_orchestra",
  "value": "乐团"
}, {
  "key": "c_performer",
  "value": "演奏家"
}, {
  "key": "c_composer",
  "value": "作曲家"
}, {
  "key": "c_cantor",
  "value": "指挥家"
}, {
  "key": "other_other",
  "value": "其他"
}, ];

const words = []
words.push('all')
for (let i = 0; i < 26; i++) {
  words.push(String.fromCharCode(65 + i))
}
words.push('9')
export function getWords() {
  return words
}
