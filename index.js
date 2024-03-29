require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser")
const dns = require("dns")

const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(cors());

let urls = [];

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
   await dns.lookup(domain, (err) => {
    console.log(err);
    if (err) {
      return res.json({ error: "invalid url" })
    
    }else{
      urls.push({ original_url: url, short_url: urls.length })
      return res.json({ original_url: url, short_url: urls.length });  
    }
  });

} catch (error) {
  return res.json({ error: error.message });
}

});

app.get('/api/shorturl/:short_url', function (req, res) {
  let {short_url} = req.params;
  res.redirect(short_url);
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
