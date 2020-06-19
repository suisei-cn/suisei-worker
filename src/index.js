import { getObject } from './asset'
import { genPodcast } from './podcast'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method != 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const path = new URL(request.url).pathname
  const range = request.headers.get('range')

  if (path === '/podcast.xml') {
    return genPodcast()
  }

  return getObject(path, range)
}
