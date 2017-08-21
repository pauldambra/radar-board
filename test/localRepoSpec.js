const expect = require('chai').expect
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach

describe('local storage repository', function () {
  let localRepo
  let data = {}
  beforeEach(function () {
    localRepo = new (require('../app/localRepo.js'))({
      getItem: key => JSON.stringify(data),
      setItem: (key, newData) => (data = JSON.parse(newData))
    })
  })

  it('should save and return a note', function () {
    const note = {id: 'asdadafasda'}
    localRepo.upsert(note)
    const foundNote = localRepo.find(n => n.id === 'asdadafasda')
    expect(foundNote.id).to.eql('asdadafasda')
  })

  it('should refuse a note without an id', function () {
    const note = {}
    expect(() => localRepo.upsert(note)).to.throw('A note must have a string id')
  })

  it('should refuse a note with an empty id', function () {
    const note = {id: '    '}
    expect(() => localRepo.upsert(note)).to.throw('A note must have a string id')
  })

  it('should refuse a note with a non-string id', function () {
    const note = {id: 9}
    expect(() => localRepo.upsert(note)).to.throw('A note must have a string id')
  })

  it('can replace by id', function () {
    for (var i = 0; i < 4; i++) {
      localRepo.upsert({id: i.toString()})
    }
    const newNote = {id: '3', updated: true}
    localRepo.upsert(newNote)
    const found = localRepo.find(n => n.id === '3')

    /* eslint-disable no-unused-expressions */
    expect(found.updated).to.be.true
  })
})
