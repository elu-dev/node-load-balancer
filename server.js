const express = require('express')

// HANDLERS
const mainPage = (slow = false) => (req, res) => {
    if (slow) setTimeout(() => res.setStatus(200).send('./pages/index.html'), 2000)
    else res.send('./pages/index.html')
}


module.exports = (slow = false) => express().get('/', mainPage(slow))
