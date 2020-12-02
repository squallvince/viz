## docker build：
1. 将 config.properties， dockerfile， start.sh，nginx.conf三个文件以及前端文件夹build放在同级目录
2. 需要修改config.properties 项目配置
3. 执行命令

``` shell script
docker build -t <dockerImgName:version> .
```
> config.properties配置文件说明
```properties
# 后端地址
locationApi=http://10.146.143.59:18080/api
# locationResource地址
locationResource=http://10.217.62.10:8081
```

> 新增加配置文件

1. 需要在 `03Other/viz_html_dockerfile/config.properties` 处添加配置并替换nginx.conf中的值为 ${配置名}  
```
如：
# config.properties
locationApi=http://10.146.143.59:18080/api

# nginx.conf
location /api {
    proxy_pass ${locationApi};
    add_header 'Access-Control-Max-Age' 0;
}
```
2. 在此文档添加配置说明   
注：此处指针对`nginx.conf`，如果在其他模块增加配置文件需告知
