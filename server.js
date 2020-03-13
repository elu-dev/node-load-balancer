const express = require('express')

const delayMiddleware = slow => (req, res, next) => {
    if (slow) setTimeout(next, 1000)
    else next()
}

const mainPage = (req, res) => {
    res.sendFile(__dirname + '/pages/index.html')
}

const pageResources = (req, res) => res.sendFile(__dirname + req.url)

module.exports = (slow = false) => express()
                                        .use(delayMiddleware(slow))
                                        .get('/', mainPage)
                                        .get('/pages/*', pageResources)
