#! /usr/bin/env node
const path = require('path')
const request = require('superagent')
const chalk = require('chalk')
const imageHandler = require('./image')
const fork = require('child_process').fork
const clearTerminalWindow = require('clear')

clearTerminalWindow()

console.log(chalk.bgCyan('ok, here we go..\n'))
const spinner = fork(path.join(__dirname, `spinner.js`))
process.on('exit', () => {
  spinner.kill()
})
spinner.on('message', (msg) => {
  if (msg.signal === 'we are done') {
    console.log(chalk.bgGreen('\nall done, enjoy your fresh APOD!'))
    process.exit(0)
  }
})

const API_KEY = process.argv[2] || 'DEMO_KEY'

const firstStep = 'fetching metadata'
spinner.send({ type: 'text', text: firstStep, color: 'blue' })
request
  .get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(res => {
    const image = res.body
    spinner.send({ type: 'succeed', text: firstStep })
    return Promise.resolve({
      image,
      spinner
    })
  })
  .then(imageHandler.get)
  .then(imageHandler.addText)
  .then(imageHandler.setAsWallpaper)
  .catch(err => {
    spinner.send({ type: 'fail', text: `failed with error ${err}` })
    process.exit(1)
  })
