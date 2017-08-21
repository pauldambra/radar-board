'use strict'

const key = 'radarban-notes'

const assertNoteHasId = note => {
  if (!note.hasOwnProperty('id') ||
      typeof (note.id) !== 'string' ||
      !note.id.match(/\S/)) {
    throw new Error('A note must have a string id')
  }
}

class LocalStorageRepository {
  constructor (localStorage) {
    this.localStorage = localStorage
  }

  notes () {
    return JSON.parse(this.localStorage.getItem(key) || '{}')
  }

  overwrite (xs) {
    if (typeof (xs) !== 'string') {
      xs = JSON.stringify(xs)
    }
    this.localStorage.setItem(key, xs)
  }

  upsert (note) {
    assertNoteHasId(note)
    const ns = this.notes()
    ns[note.id] = note
    this.overwrite(ns)
  }

  find (predicate) {
    return Object.values(this.notes()).find(predicate)
  }

  filter (predicate) {
    return Object.values(this.notes()).filter(predicate)
  }

  forEach (action) {
    return Object.values(this.notes()).forEach(action)
  }
}

module.exports = LocalStorageRepository
