import { genPodcast } from './podcast'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function detectLang(request) {
  const params = (new URL(request.url).searchParams.get('lang') || '').split(
    ',',
  )
  const headers = (request.headers.get('accept-language') || 'en')
    .split(/:|;/)[0]
    .trim()
  return params || headers
}

async function handleRequest(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const url = new URL(request.url)
  const path = url.pathname
  const range = request.headers.get('range')

  if (path === '/podcast.xml') {
    const lang = detectLang(request)
    const filterParam = Number(url.searchParams.get('filter')) || 0
    return genPodcast(url, lang, filterParam, request.method)
  }

  return new Response('Not Found', {
    status: 404,
  })
}
