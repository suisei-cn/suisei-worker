import { getObject } from './asset'
import { genPodcast } from './podcast'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers: {
        Allow: 'OPTIONS, GET, HEAD',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const url = new URL(request.url)
  const path = url.pathname
  const range = request.headers.get('range')

  if (path === '/podcast.xml') {
    let lang = 'en'
    const country = (() => {
      try {
        return request.cf.country
      } catch (_) {
        return ''
      }
    })()
    switch (country) {
      case 'JP': {
        lang = 'ja'
        break
      }
      case 'CN': {
        lang = 'zh-hans'
        break
      }
      case 'HK':
      case 'TW': {
        lang = 'zh-hant'
        break
      }
    }
    const langParam = url.searchParams.get('lang')
    if (langParam === 'zh') {
      lang = 'zh-hans'
    } else if (langParam !== null) {
      lang = langParam
    }
    const filterParam = Number(url.searchParams.get('filter')) || 0
    return genPodcast(url, lang, filterParam, request.method)
  }

  const ret = await getObject(path, range, request.method)
  return ret
}
