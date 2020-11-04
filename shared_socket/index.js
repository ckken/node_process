const net = require('net')
const cp = require('child_process')
const numCPUs = 4
const wk = []
for (let i = 1; i <= numCPUs; i++) {
  wk[i] = cp.fork('./shared_socket/worker.js')
}
const server = net.createServer()
const port = 8002
//
for (const id in wk) {
  wk[id].on('message', (msg) => {
    console.log(msg)
    wk[id].send({ from: 'Main_Node', worker: id, pid: wk[id].pid })
  })
}
//
server.listen(port, function () {
  wk.map((w, k) => w.send({ type: 'Shared', pid: w.pid, worker: k }, server))
  server.close()
})
