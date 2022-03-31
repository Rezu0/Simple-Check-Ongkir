require('dotenv').config()
const express = require('express');
const app = express();
const port = 8080;
var url = require('url');

app.get('/api/city', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    var RajaOngkir = require('rajaongkir-nodejs').Starter(process.env.YOUR_API_KEY);
   
    var q = url.parse(req.url, true).query;
    RajaOngkir.getCity(q.id).then(function (result){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.rajaongkir));
    }).catch(function (error){
        res.end(JSON.stringify({
              'messages' : error
        }))
    });
});

app.get('/api/allcity', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

  var RajaOngkir = require('rajaongkir-nodejs').Starter(process.env.YOUR_API_KEY);
 
  RajaOngkir.getCities().then(function (result){
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result.rajaongkir));
  }).catch(function (error){
      res.end(JSON.stringify({
            'messages' : error
      }))
  });
})

app.post('/api/costjne', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    var RajaOngkir = require('rajaongkir-nodejs').Starter(process.env.YOUR_API_KEY);

    var q = url.parse(req.url, true).query;
 
    var params = {
        origin: q.origin,
        destination: q.destination,
        weight: q.weight
    };
    RajaOngkir.getJNECost(params).then(function (result){
        res.end(JSON.stringify(result.rajaongkir));
    }).catch(function (error){
        res.end(JSON.stringify({
            'messages' : error
      }))
    });
});

app.post('/api/costtiki', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    var RajaOngkir = require('rajaongkir-nodejs').Starter(process.env.YOUR_API_KEY);

    var q = url.parse(req.url, true).query;
 
    var params = {
        origin: q.origin,
        destination: q.destination,
        weight: q.weight
    };
    RajaOngkir.getTIKICost(params).then(function (result){
        res.end(JSON.stringify(result.rajaongkir));
    }).catch(function (error){
        res.end(JSON.stringify({
            'messages' : error
      }))
    });
});

app.post('/api/costpos', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    var RajaOngkir = require('rajaongkir-nodejs').Starter(process.env.YOUR_API_KEY);

    var q = url.parse(req.url, true).query;
 
    var params = {
        origin: q.origin,
        destination: q.destination,
        weight: q.weight
    };
    RajaOngkir.getPOSCost(params).then(function (result){
        res.end(JSON.stringify(result.rajaongkir));
    }).catch(function (error){
        res.end(JSON.stringify({
            'messages' : error
      }))
    });
});

app.listen(port, () => {
  console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});