/**
 *
 * @param {string[]} lang
 */
export default function (lang) {
  lang = lang.map((x) => x.toLowerCase())
  for (const i of lang) {
    if (i.startsWith('en')) return 'en'
    if (i.startsWith('ja')) return 'ja'
    if (i.startsWith('zh')) {
      if (['zh-hk', 'zh-mo', 'zh-tw', 'zh-hant'].includes(i)) return 'zh-hant'
      if (['zh-cn', 'zh-sg', 'zh-hans'].includes(i)) return 'zh-hans'
      if (i === 'zh') return 'zh-hans'
    }
  }
  return 'en'
}
