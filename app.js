const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const apiRouter = express.Router();
const Sockets = require('./service/socket');
const fs = require('fs');
const server = http.Server((req,res) => app(req,res) );
const port = 3424;
const socket = new Sockets(server);

app.use('/public', express.static('public'));

app.use('/api', bodyParser.json({
    inflate: true,
    limit: '10mb'
}), apiRouter);

//I like piping the files directly rather than using the built in express routes
app.use((req, res, next) => {
    res.pipeFile = (fileLoc) => {
        let stream = fs.createReadStream(fileLoc);
        stream.pipe(res);
        return stream;
    };

    next();
});

//Inject the header into all views, not sure if this is bad practice yet
app.get('*', function(req, res, next) {
    let headerLoc = path.resolve('shared-modules/header.html');
    let headStream = fs.createReadStream(headerLoc);

    headStream.pipe(res, {end: false});
    headStream.once('end', () =>{
        next();
    });
});

app.get('/', function(req,res){
    res.pipeFile(path.resolve('views/index.html'));
});

app.get('/recipes', function(req,res){
    res.pipeFile(path.resolve('views/recipe/index.html'));
});

app.get('/recipes/view', function(req,res){
    res.pipeFile(path.resolve('views/recipe/view.html'));
});

app.get('/recipes/edit', function(req,res){
    res.pipeFile(path.resolve('views/recipe/edit.html'));
});

app.get('/recipes/add', function(req,res){
    res.pipeFile(path.resolve('views/recipe/add.html'));
});

app.get('/drinks', function(req,res){
    res.pipeFile(path.resolve('views/drink/index.html'));
});

app.get('/drinks/view', function(req,res){
    res.pipeFile(path.resolve('views/drink/view.html'));
});

app.get('/drinks/edit', function(req,res){
    res.pipeFile(path.resolve('views/drink/edit.html'));
});

app.get('/drinks/add', function(req,res){
    res.pipeFile(path.resolve('views/drink/add.html'));
});

require(path.resolve('api/recipe'))(apiRouter, socket);
require(path.resolve('api/drink'))(apiRouter, socket);

server.listen(port, () => {
	console.log(`Server up on port ${port}`);
});
