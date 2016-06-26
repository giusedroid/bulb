#!/bin/bash

cd /vagrant_data/bulb-api

knex migrate:latest
knex seed:run
npm start