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
  next()
})

app.post('/tinymce-contenful/image-upload', (req, res) => {
  try {
    const { image } = req.files
    if (!image) return res.sendStatus(400)
    const fileName = `${image.md5}_${image.name}`
    image.mv('/opt/raysync-software-site/src/images/' + fileName)
    const location = `https://www.raysync.io/tinymce-contentful/images/${fileName}`
    res.status(200).send({ location })
  } catch (e) {
    console.log(e)
    res.status(500).send({ e: JSON.stringify(e) })
  }
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
