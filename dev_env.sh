#!/bin/sh
# 建议远程管理mysql客户端(Mac)
# Sequel Pro
# https://www.sequelpro.com/
# 
# mysql
# host: rm-uf68lsw07o293t779o.mysql.rds.aliyuncs.com 外部访问 (调试使用，不要暴露到外面)
# host: rm-uf68lsw07o293t779.mysql.rds.aliyuncs.com 内部访问，只能在线上环境使用 (生产版本使用)
# name: mxplayer
# passwd: 8H6l3jjF
# port: 3306

PORT="8000"
DB_NAME="menuxx"
DB_HOST="rm-uf68lsw07o293t779o.mysql.rds.aliyuncs.com"
DB_USER="menuxx"
DB_PASSWORD="7H6ltkjiF"
DB_PORT="3306"
BASE_URL="http://127.0.0.1:8000"
CONTEXT_PATH="/"
NODE_ENV="development"
export PORT DB_NAME DB_HOST DB_USER DB_PASSWORD DB_PORT CONTEXT_PATH NODE_ENV BASE_URL