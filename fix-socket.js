const fs = require('fs');
const path = require('path');

const socketPath = path.join(__dirname, 'frontend/src/services/socket.js');
let content = fs.readFileSync(socketPath, 'utf-8');

// Fix 1: Check for connected status
content = content.replace(
  'if (socket) {\n    return socket;\n  }',
  'if (socket && socket.connected) {\n    return socket;\n  }'
);

// Fix 2: Add fallback transports and handle disconnect
content = content.replace(
  "reconnectionAttempts: 5,\n  });",
  "reconnectionAttempts: 5,\n    transports: ['websocket', 'polling'],\n  });"
);

// Fix 3: Reset socket on disconnect
content = content.replace(
  "socket.on('disconnect', (reason) => {\n    console.log('❌ Socket.IO disconnected:', reason);\n  });",
  "socket.on('disconnect', (reason) => {\n    console.log('⚠️ Socket.IO disconnected:', reason);\n    socket = null;\n  });"
);

// Fix 4: Add error listener
content = content.replace(
  "socket.on('connect_error', (error) => {\n    console.error('Socket connection error:', error.message);\n  });",
  "socket.on('connect_error', (error) => {\n    console.error('🔴 Socket connection error:', error.message || error);\n  });\n\n  socket.on('error', (error) => {\n    console.error('🔴 Socket error:', error);\n  });"
);

// Fix 5: Add connected check for all emit functions
content = content.replace(
  /if \(currentSocket\) \{/g,
  'if (currentSocket && currentSocket.connected) {'
);

fs.writeFileSync(socketPath, content, 'utf-8');
console.log('✅ socket.js has been updated successfully!');
