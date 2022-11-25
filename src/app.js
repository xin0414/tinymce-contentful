const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

app.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    abortOnLimit: true,
  })
)

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
})

const getFullPath = (path = '', filename = '') => {
  return `${path}${!path.endsWith('/') ? '/' : ''}${filename}`
}

app.post('/tinymce-contentful/image-upload', (req, res) => {
  try {
    const { image } = req.files
    const { imagePath, imageLocation } = req.body
    if (!image || !imageLocation || !imagePath) return res.sendStatus(400)
    const fileName = `${image.md5}_${image.name}`
    image.mv(getFullPath(imagePath, fileName))
    res.status(200).send({ location: getFullPath(imageLocation, fileName) })
  } catch (e) {
    res.status(500).send({ e: JSON.stringify(e) })
  }
})

app.listen(3000, () => {
  console.log(`server listening on port 3000`)
})
