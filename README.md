# Fragments

Code instructions on how to run the various scripts in Lab 1.

- [Lint](https://github.com/humphd/cloud-computing-for-programmers-winter-2024/blob/main/labs/lab-01/README.md#eslint-setup)
- [Start, dev, debug](https://github.com/humphd/cloud-computing-for-programmers-winter-2024/blob/main/labs/lab-01/README.md#express-server-setup)

Set a break point in the Health Chck route (src/app.js) (i.e., on the line res.status(200).json({) and start the server via VSCode's debugger. Then start server using the command "npm run debug" in the terminal and wait for the debugger to hit the breakpoint. As soon as the breakpoint is hit in the terminal then save the project file so that nodemon can restart the server and the server will work normally. We can confirm the server is working by visiting [http://localhost:8080/](http://localhost:8080/) or by entering the command [curl -i localhost:8080] in a seperate terminal.

Some interesting things learned were regarding the setup for [Lint](https://github.com/humphd/cloud-computing-for-programmers-winter-2024/blob/main/labs/lab-01/README.md#eslint-setup) and [Prettier](https://github.com/humphd/cloud-computing-for-programmers-winter-2024/blob/main/labs/lab-01/README.md#prettier-setup). This is something that I was not able to configure before in my projects. Also learning about the [App Setup](https://github.com/humphd/cloud-computing-for-programmers-winter-2024/blob/main/labs/lab-01/README.md#express-app-setup) was interesting as well because of using structured logging which is a new conept for me.

<!-- More updates coming to this doc -->

To authenticate into the EC2 instance server using putty

loagin as:- ec2-user

To transfer files to ec2 instance:

To pack the fragments server - npm pack

To send to ec2 instance - pscp -i "ec2InstanceKey" "packed-file" ec2-user@'ec2-instance-Public-IPv4-DNS':

to unpack the files after transfering to ec2-instance - tar -xvzf "packed-file"

To run the server as dev - npm run dev

To test the unit test files - npm test

To run a test for debugging - npm run test:watch (filename)

To run debug - npm run debug

Important [Docker notes](https://github.com/humphd/cloud-computing-for-programmers-winter-2024/blob/main/weeks/week-05/discussion.md)

To build an image in docker - docker build -t 'image-name':'version'
eg., docker build -t fragments:latest

To run a docker image - [docker run](https://docs.docker.com/engine/reference/commandline/container_run/) --rm --name 'container-name' 'image-name':'version'

-> docker run --rm --name fragments --env-file .env -p 8080:8080 fragments:latest
