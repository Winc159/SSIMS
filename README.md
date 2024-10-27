The aim of this project is to develop a student Information management system (SSIMS) specifically tailored for special education institutions in China. Through literature review and technical evaluation, the project found that traditional student information management systems were unable to meet many needs in special education. Examples include the inability to effectively support the administration of individualized education programs (IEP), the lack of a platform for interaction and communication, and the risk of data security. In terms of technical realization, this project chooses Pug and CSS for front-end development, so as to develop more efficiently and accurately and improve user interface experience; In the back-end development, Node.js and Express.js are used to achieve stable server-side applications by utilizing their efficient asynchronous processing capabilities and lightweight framework characteristics. Use MySQL database for complex data management, while JIRA for project management, GitHub for code version control and Figma for interface design. Despite implementation challenges such as high initial costs and technical support requirements, customized SSIMS can significantly improve teacher productivity, enhance student support, and effectively guarantee data security and privacy, providing strong support for further development in the field of special education.

# MySQL, PHPMyAdmin and Node.js (ready for Express development)

This will install Mysql and phpmyadmin (including all dependencies to run Phpmyadmin) AND node.js

This receipe is for development - Node.js is run in using supervisor: changes to any file in the app will trigger a rebuild automatically.

For security, this receipe uses a .env file for credentials.  A sample is provided in the env-sample file. If using these files for a fresh project, copy the env-sample file to a file called .env.  Do NOT commit the changed .env file into your new project for security reasons (in the node package its included in .gitignore so you can't anyway)

In node.js, we use the MySQl2 packages (to avoid problems with MySQL8) and the dotenv package to read the environment variables.

Local files are mounted into the container using the 'volumes' directive in the docker-compose.yml for ease of development.

### Super-quickstart your new project:

* Make sure that you don't have any other containers running usind docker ps
* run ```docker-compose up --build```

#### Visit phphmyadmin at:

http://localhost:8081/

#### Visit your express app at:

http://localhost:3000

For reference, see the video at: https://roehampton.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=6f290a6b-ba94-4729-9632-adcf00ac336e

NB if you are running this on your own computer rather than the azure labs that has been set up for you, you will need to install the following:

* node.js  (windows: https://nodejs.org/en/download/)
* docker desktop (for windows, this will also prompt you to install linux subsystem for windows https://docs.docker.com/desktop/windows/install/ )

### Whats provided in these scaffolding files?


  * A docker setup which will provide you with node.js, mysql and phpmyadmin, including the configuration needed so that both node.js AND phpmyadmin can 'see' and connect to your mysql database.  If you don't use docker you'll have to set up and connect each of these components separately.
  * A basic starting file structure for a node.js app.
  * A package.json file that will pull in the node.js libraries required and start your app as needed.
  * A db.js file which provides all the code needed to connect to the mysql database, using the credentials in the .env file, and which provides a query() function that can send queries to the database and receive a result.  In order to use this (ie. interact with the database, you simply need to include this file in any file you create that needs this database interaction) with the following code:

```const db = require('./services/db');
```

____

Useful commands:

Get a shell in any of the containers

```bash
docker exec -it <container name> bash -l
```

Once in the database container, you can get a MySQL CLI in the usual way

```bash
mysql -uroot -p<password> 
```
