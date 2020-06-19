const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const request = require('superagent')
const wallpaper = require('wallpaper')
const Jimp = require('jimp')

const imageHandler = {}
exports = module.exports = imageHandler

imageHandler.basePath = path.join(__dirname, 'apods')
shell.mkdir('-p', imageHandler.basePath)
shell.rm('-f', path.join(imageHandler.basePath, '*.jpg'))

imageHandler.get = function ({ image, spinner }) {
  const step = 'fetching high resolution APOD'
  spinner.send({ type: 'text', text: step, color: 'cyan' })
  return new Promise((resolve, reject) => {
    if (image.media_type !== 'image') {
      throw new Error(
        'Hmm its not an image so I cant really turn this into a wallpaper for you! Better luck tomorrow I guess?'
      )
    }
    // const arr = image.hdurl.split('/')
    // const imageName = arr[arr.length - 1]
    image.path = path.join(imageHandler.basePath, 'latest.jpg')
    const stream = fs.createWriteStream(image.path)
    request
      .get(image.hdurl)
      .pipe(stream)
      .on('finish', () => {
        spinner.send({ type: 'succeed', text: step })
        return resolve({ image, spinner })
      })
      .on('error', err => {
        reject(err)
      })
  })
}

imageHandler.addText = function ({ image, spinner }) {
  const step = 'writing text to image'
  spinner.send({ type: 'text', text: step, color: 'yellow' })
  return new Promise((resolve, reject) => {
    Jimp.read(image.path, function (err, jimg) {
      if (err) return reject(err)
      Jimp.loadFont(getFont(jimg))
        .then(function (font) {
          let textOnImage = `${image.date} : ${image.explanation}`
          if (image.copyright) {
            textOnImage += ` copyright ${image.copyright}`
          }
          jimg.print(
            font,
            getX(jimg),
            getY(jimg),
            textOnImage,
            getTextWidth(jimg)
          )
          jimg.write(image.path, () => {
            spinner.send({ type: 'succeed', text: step })
            return resolve({ image, spinner })
          })
        })
        .catch(err => reject(err))
    })
  })
}

imageHandler.setAsWallpaper = function ({ image, spinner }) {
  const step = 'setting image as wallpaper'
  spinner.send({ type: 'text', text: step, color: 'cyan' })
  return new Promise((resolve, reject) => {
    wallpaper
      .set(image.path)
      .then(() => {
        spinner.send({ type: 'succeed', text: step, lastStep: true })
        return resolve()
      })
      .catch(err => reject(err))
  })
}

function getFont (jimpImage) {
  if (jimpImage.bitmap.width >= 4000) {
    return Jimp.FONT_SANS_64_WHITE
  } else if (jimpImage.bitmap.width >= 3000) {
    return Jimp.FONT_SANS_32_WHITE
  } else {
    return Jimp.FONT_SANS_16_WHITE
  }
}

function getX (jimpImage) {
  return jimpImage.bitmap.width * 0.15
}
function getY (jimpImage) {
  return jimpImage.bitmap.height * 0.75
}
function getTextWidth (jimpImage) {
  return jimpImage.bitmap.width * 0.70
}
