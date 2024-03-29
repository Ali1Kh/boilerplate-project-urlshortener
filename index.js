require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser")
const dns = require("dns");
const dotenv = require("dotenv")
const { url } = require('inspector');
const connectMongo = require("./connection.js");
const shortid = require("shortid");
const mongoose = require("mongoose")


dotenv.config()
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(cors());


const URLModel = mongoose.model('URL', new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: false, unique: true, default: shortid.generate },
}));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', bodyparser.urlencoded({ extended: false }), async function (req, res) {
  try {
    let { url } = req.body
    let domain = await new URL(url).hostname;
    await dns.lookup(domain, async (err) => {
      if (err) {
        return res.json({ error: "invalid url" })
      } else {
        let newUrl = await URLModel.create({ original_url: url })
        return res.json({ original_url: url, short_url: newUrl.short_url });
      }
    });

  } catch (error) {
    return res.json({ error: error.message });
  }

});

app.get('/api/shorturl/:short_url', async function (req, res) {
  let { short_url } = req.params;
  let link = await URLModel.findOne({ short_url })
  console.log(link.original_url, link.short_url, short_url);
  return res.redirect(link.original_url);
});


async function connect() {
  await connectMongo();
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
}

connect();

