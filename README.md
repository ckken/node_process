# Node Socket 
> 探讨 node cluster & child_process 工作原理 

## Shared Socket 
+ `node shared_socket`

## Node Cluster
+ `node cluster`

## 总结

+ `cluster.fork` 在 `child_process.fork` 的顶部实现。 
+ `cluster.fork` 带来的其他好处是，它将使您能够在共享端口上进行侦听。