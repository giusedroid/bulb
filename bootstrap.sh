#!/bin/bash

PKG_DEPENDENCIES=(
    'build-essential'
    'git'
    'g++'
    'nodejs'
    'postgresql'
    'postgresql-contrib'
)

# Enable multiverse.
sed -i "/^# deb.*multiverse/ s/^# //" /etc/apt/sources.list

apt-get update
apt-get install -y ${PKG_DEPENDENCIES[@]}

sudo -u postgres psql -c "CREATE USER bulb WITH PASSWORD 'bulb';"
sudo -u postgres psql -c "CREATE DATABASE bulb_db OWNER bulb;"

#cd /vagrant_data
#git clone https://github.com/giusedroid/bulb.git
#cd bulb/data/bulb-api

#npm install
#npm install knex -g

#npm start