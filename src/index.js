import { genPodcast } from './podcast'
import getLangName from './i18n'

/**
 * Return the accepted language list of a request
 * @param {Request} request
 * @returns {string[]} language
 */
function detectLang(request) {
  const params = (new URL(request.url).searchParams.get('lang') || '')
    .split(',')
    .filter((x) => x)
  const headers = (request.headers.get('accept-language') || 'en')
    .split(',')
    .map((x) => {
      x = x.trim()
      const match = x.match(/q=([0-9\.]+)/)
      if (match === null || isNaN(Number(match[1]))) {
        return {
          lang: x,
          q: 1,
        }
      }
      return {
        lang: x.split(';')[0],
        q: Number(match[1]),
      }
    })
    .sort((a, b) => b.q - a.q)
    .map((x) => x.lang)
  return (params.length && params) || headers
}

async function handleRequest(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const url = new URL(request.url)
  const path = url.pathname
  const range = request.headers.get('range')

  if (path === '/podcast.xml') {
    const langTags = detectLang(request)
    const lang = getLangName(langTags)
    const filterParam = Number(url.searchParams.get('filter')) || 0
    return genPodcast(url, lang, filterParam, request.method)
  }

  return new Response('Not Found', {
    status: 404,
  })
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request)
  },
}
