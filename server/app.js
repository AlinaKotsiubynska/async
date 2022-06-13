import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors'
import { XMLHttpRequest } from 'xmlhttprequest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const xhr = new XMLHttpRequest();
const port = 8080;
const urls = {
  base: 'https://dummyjson.com/',
  get product1 () {
    return this.base + 'products/1'
  },
  get product2 () {
    return this.base + 'products/2'
  },
  get user1 () {
    return this.base + 'users/1'
  },
  get quote () {
    return this.base + 'quotes/random'
  }
};

server.use(cors())

server.use(express.static('../'));

server.get('/products', async (req, res) => {
  console.log('start /products')

  try {
    const id = setInterval(() => console.log(Date.now()), 200)
    const product1 = await (await fetch(urls.product1)).json()
    const product2 = await (await fetch(urls.product2)).json()
    res.send(JSON.stringify([product1, product2]))
    clearInterval(id)
    console.log('end /products')
  } catch (err) {
    handleError(err, res)
    clearInterval(id)
    console.log('end /products')
  }

})

server.get('/user', (req, res) => {
  console.log('start /user')

  const id = setInterval(() => console.log(Date.now()), 200)

  fetch(urls.user1)
    .then(user => user.json()
      .then(userInfo => {
        res.send(JSON.stringify(userInfo))
        clearInterval(id)
        console.log('end /user')
    }))
    .catch(err => {
      handleError(err, res)
      clearInterval(id)
      console.log('end /user')
    })

})

server.get('/quote', (req, res) => {
  console.log('start /quote')

  const id = setInterval(() => console.log(Date.now()), 100)

  xhr.open('GET', urls.quote , false);

  try {
    xhr.send();
    if (xhr.status != 200) {
      res.send(`Error ${xhr.status}: ${xhr.statusText}`)
      clearInterval(id)
      console.log('end /quote')
    } else {
      res.send(xhr.responseText)
      setTimeout(() => {
        console.log('end synchronous request')
        clearInterval(id)
        console.log('end /quote')
      }, 500)
        // clearInterval(id)
      // console.log('end /quote')
    }
  } catch(err) {
    handleError(err, res)
    clearInterval(id)
    console.log('end /quote')
  }

})

function handleError(err, res) {
  res.statusCode(500)
  res.statusMessage(err.message)
    res.send()
    console.log(err);
  }


server.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, () => console.log(`Server running at ${port}/`));