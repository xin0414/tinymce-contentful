Nginx 配置如下：

```
location /tinymce-contenful/image-upload {
    client_max_body_size 10m;
    proxy_pass http://127.0.0.1:3000/tinymce-contenful/image-upload;
}
location ^~ /tinymce-contentful {
    alias /opt/raysync-software-site/tinymce-contentful/src/;
}
```

启动 Node 服务:

```
pm2 start ./src/app.js --name tinymce-image-upload
```
