import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))  
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if ( ! title ) {
        return res.writeHead(400).end('title missing')
      }

      if ( ! description ) {
        return res.writeHead(400).end('description missing')
      }

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: dayjs().format(),
        updated_at: dayjs().format(),
      }
  
      database.insert('tasks', task)
  
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if ( ! title ) {
        return res.writeHead(400).end('title missing')
      }

      if ( ! description ) {
        return res.writeHead(400).end('description missing')
      }

      try {
        database.update('tasks', id, {
          title,
          description,
          updated_at: dayjs().format()
        })
      } catch( err ) {
        return res.writeHead(404).end(err.message)
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.complete('tasks', id, {
          completed_at: dayjs().format()
        })
      } catch( err ) {
        return res.writeHead(404).end(err.message)
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.delete('tasks', id)
      } catch( err ) {
        return res.writeHead(404).end(err.message)
      }

      return res.writeHead(204).end()
    }
  },
]