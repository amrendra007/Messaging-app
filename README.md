# NODEJS ASSIGNMENT – MESSAGING APP
CASHPOSITIVE nodeJs assignment, following end-points and available operation with that.

1. POST /register - This api register and logged in user after successful registration
Correct format of req. body with correct property name is required.

#### How to make req to register:
Properties of req.body to make successful post req - username, password, firstName, lastName
username and password should be min. of 6 characters and firstName, lastName should not be blank.
for example: 

    {
        "username": "amrendra007",
        "password": "qwerty123",
        "firstName": "Amrendra",
        "lastName": "kumar"
    }

2. POST /login - This api checks authenticity of user

#### How to make req to login:
provide your username and password like:

    {
        "username":"amrendra007",
        "password": "qwert123"
    }

3. POST /sendmessage - Using this api endpoint a logged in user can send message to another user.
provide subject(subject of message), message(actual message), toUser(sender's username)

#### How to make req to send message:
Example: 

    {
        "subject":"how to say hello?",
        "message": "hello",
        "toUser": "amrendra"
    }

4. GET /inbox - This api retrieves all current logged in user's messages.

#### How to make req to get all messages:
Example:

Log in first then make GET req to /inbox

5. PUT /block/{username} - Making req to this api block provided 'username' from sending message to you

#### How to make req to block user
Example:

Log in first then make 
PUT req to /block/amrendra007

## Install
1. Create mlab account <https://mlab.com/>
2. create mlab data base add db username and password, copy url of db
3. create a '.env' file inside Messaging-app/
4. Add folling env variable to .env file

    DB_HOST = 'mongodb://'
    DB_USER= 'mlab-db_username'
    DB_PASS= 'mlab-db_password'

5. npm install
6. node app.js , App is running on localhost:3000

## Deployed link: 

Heroku link: <https://messagebox.herokuapp.com/>
