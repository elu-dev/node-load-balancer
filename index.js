// require('dotenv').config()
const express = require('express')
const request = require('request')
const createServer = require('./server')

// initialize the servers
const servers = []
for (let i = 0; i < 4; ++i) {
    const server = createServer()
    const port = 3000 + i
    const address = `http://localhost:${port}`

    server.listen(port, () => console.log(`server ${i} on port ${port}...`))
    
    servers.push({server, address})
}

let current_server = 0

/**
 * switches across the list of servers
 * to balance their workload by pipping
 * the request data to the response
 */
const balancer = (req, res) => {
    console.log(`request sent to server ${current_server}`)
    req.pipe(request({ url: servers[current_server].address + req.url })).pipe(res)
    current_server = ++current_server % servers.length
}

// pass all the GET and POST request through the balancer
const app = express().get('*', balancer).post('*', balancer)

let port = process.env.BALANCER_PORT || 8000
app.listen(port, () => console.log(`balancer on port ${port}...`))
