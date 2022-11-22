const images_upload_handler = (blobInfo, progress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    xhr.open('POST', 'https://www.raysync.io/tinymce-contenful/image-upload')

    xhr.upload.onprogress = (e) => {
      progress((e.loaded / e.total) * 100)
    }
    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: 'HTTP Error: ' + xhr.status, remove: true })
        return
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject('HTTP Error: ' + xhr.status + ',' + xhr.responseText)
        return
      }
      const json = JSON.parse(xhr.responseText)
      if (!json || typeof json.location != 'string') {
        reject('Invalid JSON: ' + xhr.responseText)
        return
      }
      resolve(json.location)
    }
    xhr.onerror = () => {
      reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
    }
    const formData = new FormData()
    formData.append('image', blobInfo.blob(), blobInfo.filename())

    xhr.send(formData)
  })
window.contentfulExtension.init(function (api) {
  function tinymceForContentful(api) {
    api.window.startAutoResizer()
    tinymce.init({
      selector: '#editor',
      language: 'zh-Hans',
      language_url: './zh-Hans.js',
      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'preview',
        'help',
        'wordcount',
      ],
      toolbar1:
        'undo redo | fullscreen ｜ link image media | blockquote backcolor forecolor underline strikethrough bold italic forecolor removeformat | ',
      toolbar2:
        'bullist numlist | outdent indent | alignleft aligncenter alignright alignjustify | ',
      toolbar3: 'lineheight | fontfamily fontsize blocks styles',
      link_rel_list: [
        { title: 'No Referrer', value: 'noreferrer' },
        { title: 'External Link', value: 'external' },
        { title: 'nofollow', value: 'nofollow' },
      ],
      link_default_target: '_blank',
      fullscreen_native: !0,
      content_style:
        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 90%; }',
      min_height: 600,
      max_height: 750,
      autoresize_bottom_margin: 15,
      resize: false,
      image_caption: true,
      images_upload_handler: images_upload_handler,
      init_instance_callback: function (editor) {
        var listening = true

        function getEditorContent() {
          return editor.getContent() || ''
        }

        function getApiContent() {
          return api.field.getValue() || ''
        }

        function setContent(x) {
          var apiContent = x || ''
          var editorContent = getEditorContent()
          if (apiContent !== editorContent) {
            //console.log('Setting editor content to: [' + apiContent + ']');
            editor.setContent(apiContent)
          }
        }

        setContent(api.field.getValue())

        api.field.onValueChanged(function (x) {
          if (listening) {
            setContent(x)
          }
        })

        function onEditorChange() {
          var editorContent = getEditorContent()
          var apiContent = getApiContent()

          if (editorContent !== apiContent) {
            //console.log('Setting content in api to: [' + editorContent + ']');
            listening = false
            api.field
              .setValue(editorContent)
              .then(function () {
                listening = true
              })
              .catch(function (err) {
                console.log('Error setting content', err)
                listening = true
              })
          }
        }

        var throttled = _.throttle(onEditorChange, 500, { leading: true })
        editor.on('change keyup setcontent blur', throttled)
      },
    })
  }

  function loadScript(src, onload) {
    var script = document.createElement('script')
    script.setAttribute('src', src)
    script.onload = onload
    document.body.appendChild(script)
  }

  loadScript('./tinymce.min.js', function () {
    tinymceForContentful(api)
  })
})
