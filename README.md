
#HOW TO INSTALL

Config 
Edit docker/docker-compose.yml
```
- API_URL=http://api.estoryc ...
...

3020 => WEB PORT
```


Build image
```
yarn docker-prod:build
```

Run
```
yarn docker-prod:dev
```


Thêm 1 route:

Cmd P -> router.config
->
thêm 1 element:
```
      {
        name: 'asset',
        icon: 'fa::file-image', // fa:: as font-awesome (default: antd icon)
        path: '/assets',
        component: './Asset',
      },
```

Dịch:
Thêm: menu.asset vào locales/<lang>.js


Để tạo title head
=> 
```
<PageContainer title={formatMessage({ id: 'module.asset.pageTitle' })}>
```
