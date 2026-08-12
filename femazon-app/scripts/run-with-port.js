const { spawn } = require('child_process');
const net = require('net');

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createConnection({ host: '127.0.0.1', port });
    tester.once('connect', () => {
      tester.end();
      resolve(false);
    });
    tester.once('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function main() {
  const mode = process.argv[2] || 'start';
  const preferredPort = Number(process.env.PORT || 3000);
  let port = preferredPort;

  for (let attempt = 0; attempt < 10; attempt += 1) {
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

  console.log(`Starting Next.js on http://localhost:${port}`);

  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const args = ['next', mode, '-p', String(port)];

  const child = spawn(command, args, {
    shell: process.platform === 'win32',
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
