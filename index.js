"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const app = express();

const port = process.env.port || 3000;
const url = 'mongodb://localhost:27017/anothernewdb';

let db;

const contacts = [
  {firstname: "a", secondname: "aa", phone: "111"},
  {firstname: "b", secondname: "bb", phone: "222"},
  {firstname: "c", secondname: "cc", phone: "333"},
  {firstname: "d", secondname: "dd", phone: "444"}
];

app.use(bodyParser.urlencoded({"extended": true}));
app.use(bodyParser.json());

app.get("/contacts", function(req, res) {
  db.collection('contacts').find().toArray(function(err, result) {
    if (err) console.log(err);
    else {
      res.json({contacts: result});
    };
  });
});

app.post("/contacts", function(req, res) {
  db.collection('contacts').save(
    {
      firstname: req.body.firstname,
      secondname: req.body.secondname,
      phone: req.body.phone
    },
    function(err, result) {
      if (err) console.log(err);
      else {
        res.json({ message: 'Запись о контакте добавлена' });
      };
    }
  );
});

app.put("/contacts/:id", function(req, res) {
  db.collection('contacts').update(
    { _id: req.body.id },
    { $set: {
        firstname: req.body.firstname,
        secondname: req.body.secondname,
        phone: req.body.phone
      }
    },
    function(err, result) {
      if (err) console.log(err);
      else if (result) {
        res.json({ message: 'Информация о контакте обновлена' });
      }
      else {
        res.json({ message: 'Запись о контакте не найдена' });
      };
    }
  );
});

app.get("/contacts/:id", function(req, res) {
  db.collection('contacts').find({
    firstname: req.body.firstname
  }).toArray(function(err, result) {
    if (err) console.log(err);
    else {
      res.json({contacts: result});
    };
  });
});


MongoClient.connect(url, function(err, database) {
  if (err) console.log(err);
  else {
    db = database;
    const collection = db.collection('contacts');
    collection.insert(contacts, function(err, result) {
      if (err) console.log(err);
    });
    app.listen(port, function() {
      console.log(`Listening to ${port}`);
    });
  }
});
