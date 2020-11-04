const cluster = require('cluster')
const http = require('http')
const port = 8001
if (cluster.isMaster) {
  // const numCPUs = require('os').cpus().length;
  const numCPUs = 4
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (msg) => {
      console.log(msg)
      // 发送到 worker
      cluster.workers[id].send({ from: 'Master', worker: id, pid: cluster.workers[id].process.pid })
    })
  }
} else {
  console.log({ type: 'Cluster', pid: cluster.worker.process.pid, worker: cluster.worker.id })
  // worker 监听 master 信息
  cluster.worker.on('message', (msg) => {
    console.log(msg)
  })
  http.Server((req, res) => {
    if (req.url.includes('favicon.ico')) {
      res.writeHead(204)
      res.end()
      return
    }
    res.writeHead(200)
    res.end(`NODE-CLUSTER\nisMaster:${cluster.isMaster}\nprocessID:${cluster.worker.process.pid}`)
    //
    process.send({ from: 'Slave', pid: cluster.worker.process.pid, worker: cluster.worker.id })
  }).listen(port)
}
