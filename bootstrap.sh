#!/bin/bash

PKG_DEPENDENCIES=(
    'build-essential'
    'git'
    'g++'
    'nodejs'
    'npm'
    'postgresql'
    'postgresql-contrib'
)

# Enable multiverse.
sed -i "/^# deb.*multiverse/ s/^# //" /etc/apt/sources.list

apt-get update
apt-get install -y ${PKG_DEPENDENCIES[@]}

sudo -u postgres psql -c "CREATE USER bulb WITH PASSWORD 'bulb';"
sudo -u postgres psql -c "CREATE DATABASE bulb_db OWNER bulb;"

cd /vagrant_data
cd bulb/data/bulb-api

npm install
npm install knex -g
npm install nodemon -g
npm install jasmine-node -g
# make symbolic link to node instead of nodejs
ln -s /usr/bin/nodejs /usr/bin/node

#sudo -u vagrant knex migrate:latest
#sudo -u vagrant knex seed:run

#npm test
#npm start