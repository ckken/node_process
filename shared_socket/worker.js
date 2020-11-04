const cluster = require('cluster')
let worker = null
const server = require('http').createServer(function (req, res) {
  if (req.url.includes('favicon.ico')) {
    res.writeHead(204)
    res.end()
    return
  }
  res.write(`SHARED-SOCKET\nisMaster:${cluster.isMaster}\nprocessID:${process.pid}`)
  res.end()
  //
  process.send({ form: 'Child_Node', pid: process.pid, worker })
})
let runOnce = false

process.on('message', (data, handle) => {
  console.log(data)
  if (data.worker) {
    worker = data.worker
  }
  if (!runOnce) {
    handle.on('connection', function (socket) {
      server.emit('connection', socket)
    })
    runOnce = true
  }
})
