# node-js-user-details

A barebones Node.js demo app for the **Orange** [User Details API](https://www.orangepartner.com/integrate).
This app is using [Express 4](http://expressjs.com/).


## App declaration at OrangePartner

client id: `tXBelIi9Am2I2f1nbvAC59GAwPTEGuX5`  
uri redirect: `https://userdetails.herokuapp.com/identity`


## App deployment to Heroku

```
$ cd node-js-user-details
$ git init
$ heroku git:remote -a userdetails
$ git add .
$ git commit -am "latest"
$ git push heroku master
$ heroku open
$ heroku logs --tail 
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)

