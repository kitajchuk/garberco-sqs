garberco
========

> Website for Ryan Garber.

[garberco.com](http://garberco.com)



### Install
This walks through getting up and running ( in theory ).

* Clone this repository
* Run `npm i`
* Run `npm start`


### Deployments
Your first deployment to Squarespace using this Scaffold will require you to clone the current repository from your site first in order to pull down the correct `git` history. This walks through deploying our `Foobar` project.

* Trash the `build` directory created by the Squarespace toolbelt: `rm -rf build`
* Clone your live Squarespace repo into the build directory: `git clone https://garberco.squarespace.com/template.git build`
* Run your first deployment to your live Squarespace site from this Scaffold: `npm run deploy`

Moving forward you only need to use the `npm run deploy` command to push deployments to your live Squarespace site. Since Squarespace development is a little Cowboy in nature, there is no solution for staging environments or CI/CD integrations. You, the programmer, must manually deploy to the site from your machine. Oh joy :)


### Development
You can simply use `npm start` to start the runtime with `Webpack` and the Squarespace server.



### Notes

This template is a customization of the Squarespace [base-template-npm](https://github.com/Squarespace/base-template-npm).

* [Local Development](https://developers.squarespace.com/local-development)
* [Tools](https://developers.squarespace.com/tools)
* [Docs](https://developers.squarespace.com/quick-start)
