import { AwsClient } from 'aws4fetch'

const aws = new AwsClient({
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
  service: 's3',
})

const params = {
  json: {
    'response-cache-control': 'public,max-age=60',
    'response-content-type': 'application/json;charset=utf-8',
  },
  m4a: {
    'response-cache-control': 'public,max-age=31536000,immutable',
    'response-content-type': 'audio/mp4',
  },
}

export async function getObject(key, range) {
  const headers = range ? { range: range } : {}
  const url = new URL(key, "")
  url.search = new URLSearchParams(params[key.split('.').pop()])

  return await aws.fetch(url, {
    method: 'GET',
    headers: headers,
    cf: { cacheEverything: true },
  })
}
