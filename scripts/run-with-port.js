const { spawn } = require('child_process');
const net = require('net');

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function main() {
  const mode = process.argv[2] || 'start';
  const preferredPort = Number(process.env.PORT || 3000);
  let port = preferredPort;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await isPortAvailable(port)) {
      break;
    }
    port += 1;
  }

  const canUsePort = await isPortAvailable(port);
  if (!canUsePort) {
    console.error(`Unable to find a free port starting at ${preferredPort}`);
    process.exit(1);
  }

  const nextBin = require.resolve('next/dist/bin/next');
  const args = [nextBin, mode, '-p', String(port)];

  const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
