# Pet Store App

Small CRUD application that displays data from API in a table and allows to add, modify and delete records.

Built with:
- Angular
- Angular Material
- RXJS
- NGRX

Includes custom Material theme and is mostly composed of Material components. It also has 2 themes that you can toggle between.

Main functionalities are:
- Displaying records from API filtered by status
- Adding new record
- Editing existing record
- Deleting selected record
- Displaying record details in a dialog
- Sorting the table by every column
- Limit records showing in the table with pagination
- Filtering the table by "name" property of records

## Installation

Clone this repository and open a terminal in the repository directory, then simply run `npm install` command and wait for all packages to install.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Then you can simply upload it on your server of choice to see the running app.

## Linter

Run `ng lint` to lint the code and check if there are any errors. Linting using ESLint.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Live demo

You can check the app [here](https://michalgrochowski.github.io/petstore-app/).
