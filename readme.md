Nginx 配置如下：

```
location /tinymce-contenful/image-upload {
  client_max_body_size 10m;
  proxy_pass http://127.0.0.1:3000/tinymce-contenful/image-upload;
}
location /tinymce-contenful {
  alias /opt/raysync-software-site;
}
```
