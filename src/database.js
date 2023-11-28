// { 'users': [...] }

import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

// console.log(databasePath)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select( table, search ) {
    let data = this.#database[table] ?? []

    if ( search ) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert( table, data ) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const updatedRow = { ...this.#database[table][rowIndex] }
      updatedRow.title = data.title
      updatedRow.description = data.description
      updatedRow.updated_at = data.updated_at

      this.#database[table][rowIndex] = updatedRow
      this.#persist()
    } else {
      throw new Error('registry not found!')
    }
  }

  complete(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const updatedRow = { ...this.#database[table][rowIndex] }
      updatedRow.completed_at = data.completed_at

      this.#database[table][rowIndex] = updatedRow
      this.#persist()
    } else {
      throw new Error('registry not found!')
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } else {
      throw new Error('registry not found!')
    }
  }
}