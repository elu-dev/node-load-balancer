require('dotenv').config()
const express = require('express')
const request = require('request')

// initialize the list of servers
const servers = []
for (let i = 0; i < parseInt(process.env.SERVERS) || 0; ++i) servers.push(process.env[`SERVER_${i}`])
let current_server = 0

/**
 * switches across the list of servers
 * to balance their workload by pipping
 * the request data to the response
 */
const balancer = (req, res) => {
    req.pipe(request({ url: servers[current_server] + req.url })).pipe(res)
    current_server = ++current_server % servers.length
}

// pass all the GET and POST request through the balancer
const app = express().get('*', balancer).post('*', balancer)

let port = process.env.BALANCER_PORT || 8000
app.listen(port, () => console.log(`balancer on port ${port}...`))


// SERVERS:

const handler = serverNum => (req, res) => {
    console.log(`server ${serverNum}:`, req.method, req.url, req.body || '');
    res.send(`Hello from server ${serverNum}!`);
}

const server0 = express().get('*', handler(0)).post('*', handler(0))
const server1 = express().get('*', handler(1)).post('*', handler(1))
const server2 = express().get('*', handler(2)).post('*', handler(2))

server0.listen(3000, () => console.log(`server 0 on port ${3000}...`))
server1.listen(3001, () => console.log(`server 1 on port ${3001}...`))
server2.listen(3002, () => console.log(`server 2 on port ${3002}...`))