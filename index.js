const cluster = require('cluster');
const os = require('os');
const express = require('express');
const crypto = require('crypto');

const PORT = 80;
const NUM_CPUS = os.cpus().length;

if (cluster.isPrimary) {

  console.log(`Primary ${process.pid} running`);
  console.log(`Spawning ${NUM_CPUS} workers...`);

  for (let i = 0; i < NUM_CPUS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {

  const app = express();

  app.get('/hashes', (req, res) => {
    const hashes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(32).toString('hex')
    );

    res.json({ 
      hashes,
      worker: process.pid  // so you can verify different workers are handling requests
    });
  });

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started`);
  });

}