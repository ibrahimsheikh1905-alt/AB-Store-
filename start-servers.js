const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting E-commerce Development Servers...\n');

// Start backend server
console.log('📡 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a moment then start frontend
setTimeout(() => {
  console.log('🌐 Starting Frontend Server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });

  console.log('\n✅ Both servers are running!');
  console.log('📡 Backend: http://localhost:5000');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('\nPress Ctrl+C to stop both servers\n');

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 2000);