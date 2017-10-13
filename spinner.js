const ora = require('ora')

const _spinner = ora({
  _spinner: {
    interval: 80,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  }
}).start()

process.on('message', msg => {
  switch (msg.type) {
    case 'text':
      _spinner.text = msg.text
      _spinner.color = msg.color
      break
    case 'fail':
      _spinner.fail(msg.text)
      process.send({signal: 'we have failed'})
      break
    case 'succeed':
      _spinner.succeed(msg.text)
      if (!msg.lastStep) {
        _spinner.start()
      } else {
        process.send({signal: 'we are done'})
      }
      break
  }
})
