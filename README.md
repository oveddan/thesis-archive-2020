# This is the Code for the Website of ITP Thesis Archive 2020.

It is built in React and Typescript.

## To Develop Locally

In the project directory, to install all dependencies, run:

    yarn

To start the application, run:

    yarn start

This runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## To Build a Package that can be Deployed to a Site

In the project directory:

    yarn build

This will create the built package in 'build'

To test it on a local server:

    yarn global add serve
    serve -s build