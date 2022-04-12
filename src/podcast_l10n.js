const L10N = {
  'Collection of music of suisei. Powered by suisei-cn.': {
    'zh-hans': '星街音乐收集处。由 suisei-cn 提供。',
  },
  '🎤 This clip is an acappella with no background music.': {
    'zh-hans': '🎤 这是一段清唱片段。',
  },
  '😟 The source for this clip is corrupted due to various problems.': {
    'zh-hans': '😟 由于音源受到影响，此片段的质量不佳。',
  },
  '🔇 This clip is muted in the source due to concerns on copyright.': {
    'zh-hans': '🔇 由于版权原因，此片段在音源被静音。',
  },
  '<p>This episode has the following flags:\n<ul>': {
    'zh-hans': '<p>此片段有以下标记：\n<ul>',
  },
  'Song name': {
    'zh-hans': '曲目名',
  },
  '<p>An original song by %s</p>': {
    'zh-hans': '<p>%s 之原创歌曲</p>',
  },
  'Originally by': {
    'zh-hans': '原作者',
  },
  'Performed by': {
    'zh-hans': '表演者',
  },
  'Performed at': {
    'zh-hans': '时间',
  },
  Source: {
    'zh-hans': '来源',
  },
  'This podcast is powered by suisei-cn. See the music list <a href="%s">here</a>.<br>If things don\'t seem right, report it <a href="%s">here</a>.':
    {
      'zh-hans':
        '本 Podcast 由 suisei-cn 提供。<a href="%s">在此查看音频列表</a>。<br>如果内容异常，请报告至<a href="%s">此处</a>。',
    },
  '%s, an original song by 星街すいせい performed on %s': {
    'zh-hans': '%s，星街彗星原创曲，于 %s 表演',
  },
  '%s, originally by %s, performed by %s on %s': {
    'zh-hans': '%s，原作者为 %s，由 %s 于 %s 表演',
  },
}

let LANG = 'en'

export function setLang(lang) {
  LANG = lang
}

export function $t(txt, ...args) {
  let tpl = txt
  try {
    tpl = L10N[txt][LANG] || txt
  } catch (_) {}
  for (const i of args) {
    tpl = tpl.replace(/%s/, i)
  }
  return tpl
}
