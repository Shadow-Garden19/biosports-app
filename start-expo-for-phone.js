/**
 * Lance Expo (web) pour test sur téléphone.
 * Affiche l'URL à ouvrir sur le téléphone (même Wi-Fi requis).
 */
const { spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

const PORT = 8081;
const ip = getLocalIP();
const url = `http://${ip}:${PORT}`;

console.log('');
console.log('  BIOSPORTS – Test sur téléphone');
console.log('  ==============================');
console.log('');
console.log('  Sur ton téléphone (même Wi‑Fi que ce PC) :');
console.log('');
console.log('    ' + url);
console.log('');
console.log('  Ouvre cette adresse dans Chrome (ou Safari sur iPhone).');
console.log('  Le serveur Expo démarre ci‑dessous…');
console.log('');

const child = spawn(
  'npx',
  ['expo', 'start', '--web'],
  {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      REACT_NATIVE_PACKAGER_HOSTNAME: ip,
    },
  }
);

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
