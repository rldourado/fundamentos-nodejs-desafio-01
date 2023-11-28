import http from 'node:http'

import { json } from './middleware/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// Query Parameters: URL Stateful => Filtro, Paginação, Dados Não Obrigatórios, etc
// http://localhost:3333/users?userId=1&name=John

// Route Parameters: Identificação de Recursos
// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1

// Body Parameters: Envio de informações de formulário e/ou sensíveis (HTTPS)

const server = http.createServer(async(req, res) => {
  
  const { method, url, headers } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = { ...routeParams.groups }

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)