'use strict';

const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
try {
	fs.rmSync(dist, { recursive: true, force: true });
} catch (err) {
	if (err.code !== 'ENOENT') throw err;
}
