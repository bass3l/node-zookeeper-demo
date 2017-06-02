# node-zookeeper-demo
A basic sample of some nodejs mockup microservices with an api gateway, simple loadbalancing (round-robin) and zookeeper clients.

## Getting Started
To get started with running the services :
* first install deps with `npm install`
* install zookeeper (see below for instructions)
* update config file with your zookeeper configurations : `config\configs.json`
* run `node bootstrap-zookeeper.js` to bootstrap zookeeper with some initial configs
* run `npm run gateway` to start a gateway service
* run `npm run getservice` to start a mockup service for `get` requests for `http://localhost:PORT` and `http://localhost:PORT/posts`
* run `npm run postservice` to start a mockup service for `post` requests for `http://localhost:PORT/post`

## Installing Zookeeper
To install zookeeper do the following : (requires java to be installed)
* download a stable version from http://hadoop.apache.org/zookeeper/releases.html
* create a config file under `ZOOKEEPER_DIR/conf/zoo.cfg` with:
```
tickTime=2000
dataDir=/var/zookeeper
clientPort=2181
```
* start zookeeper with `/bin/zkServer.sh start`
* start a client with `/bin/zkClient.sh`

## Bootstraping Zookeeper
By running `bootstrap-zookeeper.js` the following nodes will be created
* `/system` which will be the centerlized environment configurations of our system (`/system/dev`-`/system/prod`-`/system/test`).
* `/services` which the services will register at.