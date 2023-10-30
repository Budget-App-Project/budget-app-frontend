# Budget App Front End
This project is the front end of the budget app website created to allow me to track my spending habits while learning about all sorts of technologies, however, it can be used by anyone who wants to! This project taught me a great deal about Angular in specific and the various tools and rules that come along with it.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Endpoints](#deployment)
- [Contributors](#contributors)

## Tech Stack
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![SCSS](https://img.shields.io/badge/S-SCSS-red)

#### Installation and Setup
* Fork and clone github repo onto local machine
* Firstly, ensure you have the Angular CLI installed you can do so by running the command:
```bash
npm install -g @angular/cli
```
* Then, have angular build and serve the assets recompiling each time you save a change using the command:
```bash
ng serve --watch
```
* It is important to note that ng serve is not for deployments. Any of the files created should either be moved over to the corresponding directory in the backend or server using the webserver specifically such as Apache Tomcat.

## Features
* Angular Router
  * Multipage website facilitated by the usage of Angulare router serving the correct information and format to the correct routes.
* Guards and Services
  * Various guards and services ensuring protected routes are only accessible to logged in users and services used on multiple pages through dependency injection allowing for code reusability 
* Chart.js
  * Charts displaying the data from the expenses in a clear and visual manner

## Contributors
<a href="https://github.com/Bornean-Orangutan/Ratings-and-Reviews-API/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Bornean-Orangutan/Ratings-and-Reviews-API" />
</a>
