# Secrets

### Secrets web application offers a user-friendly platform for individuals to anonymously share their personal revelations and access secrets shared by others. To add or read secrets, users must first register or log in, with the option to conveniently sign up using either Google or Github credentials.

### Technologies used: Node.js, Express, body-parser, EJS, mongoose, mongoDB, Passport.js, Passport strategy for authenticating with Google using the OAuth 2.0 API, Robo 3T

## Required software

- Docker
- Node.js

## To run the application

From command line
 
```bash
 git clone https://github.com/ljenchik/Secrets.git
 docker run -d -p 27017:27017 --name test-mongo mongo:latest
 npm install
 nodemon app.js
```



This project is based on the guidance and steps provided by Angela Yu's Udemy <a href="https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/18125215#questions/18744410"> 
"The Complete 2023 Web Development Bootcamp"</a>. However, I have enhanced its functionality by allowing a user to submit multiple secrets.


<img src="https://github.com/ljenchik/Secrets/assets/84686704/0e061e12-7223-42eb-96ca-63382f015199" width="300px"/>

<img src="https://github.com/ljenchik/Secrets/assets/84686704/49c02559-1b2c-4914-93c4-f2ed9fcff123" width="300px"/>

<img src="https://github.com/ljenchik/Secrets/assets/84686704/2ad76765-4218-4132-8adf-3ebf0e4014a2" width="300px"/>