import { getObject } from './asset'

function genItem(item) {
  return `<item>
<enclosure url="${item.url}" length="0" type="audio/mpeg"/>
<guid isPermaLink="true">${item.url}</guid>
<title><![CDATA[${item.title}]]></title>
<pubDate>${new Date(item.datetime).toUTCString()}</pubDate>
<description><![CDATA[${item.title}, originally by ${
    item.artist
  }, performed by ${item.performer} at ${item.datetime}]]></description>
<content:encoded><![CDATA[
<p>Song name: ${item.title}</p>
<p>Originally by ${item.artist}</p>
<p>Performed by: ${item.performer}</p>
<p>Performed at: ${item.datetime}</p>
<br>
<p>
This podcast is powered by suisei-cn. See the music list <a href="https://github.com/suisei-cn/suisei-music/">here</a>. <br>
If things don't seem right, report it <a href="https://github.com/suisei-cn/suisei-podcast/issues">here</a>.
</p>
]]></content:encoded>
</item>`
}

function genFeed(items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>Suisei Music Podcast</title>
<link>https://github.com/suisei-cn/suisei-music</link>
<itunes:author>星街すいせい工房</itunes:author>
<description>Collection of music of suisei. Powered by suisei-cn.</description>
<itunes:owner>
<itunes:name>星街すいせい工房</itunes:name>
</itunes:owner>
<itunes:image href="https://suisei.moe/image/podcast.jpeg"/>
<itunes:category text="Music"/>
<itunes:explicit>false</itunes:explicit>
${items.map(genItem).join('\n')}
</channel>
</rss>`
}

export async function genPodcast(params) {
  const resp = await getObject('/meta.json')
  const items = await resp.json()

  return new Response(genFeed(items), {
    status: 200,
    headers: {
      'content-type': 'text/xml',
    },
  })
}
