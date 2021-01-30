import { setLang, $t } from './podcast_l10n'
import podcast from 'podcast'
import dayjs from 'dayjs'

function generateNotice(item) {
  let ret = []
  const status = item.status || 0
  if (status & 1) {
    ret.push($t('🎤 This clip is an acappella with no background music.'))
  }
  if (status & 2) {
    ret.push(
      $t('😟 The source for this clip is corrupted due to various problems.'),
    )
  }
  if (status & 4) {
    ret.push(
      $t('🔇 This clip is muted in the source due to concerns on copyright.'),
    )
  }
  if (ret.length !== 0) {
    return (
      $t('<p>This episode has the following flags:\n<ul>') +
      ret.map((x) => `<li>${x}</li>`).join('\n') +
      '</ul>\n</p>'
    )
  } else {
    return ''
  }
}

function generateContent(item, original, time) {
  return `
    <p>${$t('Song name')}: ${item.title}</p>
    ${
      original
        ? $t(`<p>An original song by 星街すいせい</p>`)
        : item.artist
        ? `<p>${$t('Originally by')}: ${item.artist}</p>`
        : ''
    }
    <p>${$t('Performed by')}: ${item.performer}</p>
    <p>${$t('Performed at')}: ${time}</p>
    <p>${$t('Source')}: <a href="${item.source}">${item.source}</a></p>
    ${generateNotice(item)}
    <br>
    <p>
    ${$t(
      'This podcast is powered by suisei-cn. See the music list <a href="%s">here</a>.<br>If things don\'t seem right, report it <a href="%s">here</a>.',
      'https://github.com/suisei-cn/suisei-music/',
      'https://github.com/suisei-cn/suisei-podcast/issues',
    )}
    </p>
    `
}

function getFilterTitle(filter) {
  let ret = []
  if (filter & 1) {
    ret.push('Acappella')
  }
  if (filter & 2) {
    ret.push('Corrupted')
  }
  if (filter & 4) {
    ret.push('Slient')
  }
  return ret.join(', ')
}

function createPodcast(body, url, lang, filter) {
  setLang(lang)
  let filterTitle = getFilterTitle(filter)
  const feed = new podcast({
    title: 'Suisei Music Podcast' + (filter !== 0 ? ` (${filterTitle})` : ''),
    description:
      $t('Collection of music of suisei. Powered by suisei-cn.') +
      (filter !== 0 ? ` (Filter applied: ${filterTitle})` : ''),
    generator: 'podcast@npmjs',
    feedUrl: url || 'https://suisei.moe/podcast.xml',
    siteUrl: 'https://github.com/suisei-cn/suisei-worker',
    imageUrl: 'https://static.suisei.moe/image/98f560ae05c02361.jpeg',
    author: '星街すいせい工房',
    categories: ['music', 'virtual youtuber'],
    itunesType: 'episodic',
    itunesCategory: [
      {
        text: 'Arts',
        subcats: [{ text: 'Performing Arts' }],
      },
    ],
    pubDate: new Date(),
  })
  let bodyFiltered = body
  if (filter !== 0) {
    bodyFiltered = body.filter((x) => x.status & filter)
  }
  for (const i of bodyFiltered) {
    const time = new Date(i.datetime)
    const readableTime = dayjs(time).add(9, 'hour').format('YYYY/MM/DD HH:mm')
    feed.addItem({
      title: i.title,
      description:
        i.artist === '星街すいせい'
          ? $t(
              '%s, an original song by 星街すいせい performed on %s',
              i.title,
              readableTime,
            )
          : $t(
              '%s, originally by %s, performed by %s on %s',
              i.title,
              i.artist,
              i.performer,
              readableTime,
            ),
      content: generateContent(i, i.artist === '星街すいせい', readableTime),
      url: i.url,
      enclosure: {
        url: i.url,
      },
      date: time,
    })
  }
  return feed.buildXml('  ')
}

export async function genPodcast(url, lang, filter, method) {
  const resp = await fetch("https://suisei-podcast.outv.im/meta.json")
  const items = await resp.json()
  const ret = createPodcast(items, url, lang, filter)

  if (method === 'HEAD') {
    return new Response('', {
      status: 200,
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
        'content-length': ret.length,
      },
    })
  }

  return new Response(ret, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'content-length': ret.length,
    },
  })
}
