const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(cors())
app.use(express.json())

const games =[
    {id:1, name: "Witcher3", price: 29.99},
    {id:2, name: "Cyberpunk2077", price: 29.99},
    {id:3, name: "Counter-Strike", price: 29.99},
    {id:4, name: "Payday 2", price: 29.99},
    {id:5, name: "Gta", price: 29.99},
]

app.get('/games', (req, res) => {res.send(games)})

app.get('/games/:id', (req, res) =>{
    if(typeof games[req.params.id -1] === 'undefined'){
        return res.status(404).send({error: "Game not found"})
    }
    res.send(games[req.params.id - 1])
})

app.post('/games', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({error: 'One or all params are missimg'})
    }
    let game = {id: games.length + 1, price: req.body.price, name: req.body.name}
    games.push(game)

    res.status(201)
        .location(`${getBaseUrl(req)}/games/${games.length}`)
        .send(game)
})

app.delete('/games/:id', (req, res) => {if (typeof games[req.params.id -1] === 'undefined'){return res.status(404).send({error: "Game not found"})}
games.splice(req.params.id - 1, 1)
res.status(204).send({error: "No content"})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})


function  getBaseUrl(req) {
    return req.connection && req.connection.encrypted
    ? 'http' : 'http' + `://${req.headers.host}`
}


//asdasdasdadadadsad