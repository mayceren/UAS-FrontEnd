// Menggunakan Express untuk menyajikan file statis
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'src')));

// Menyajikan file statis dari node_modules untuk AngularJS dan UI-Router
app.use('/js/angular', express.static(path.join(__dirname, 'node_modules/angular')));
app.use('/js/ui-router', express.static(path.join(__dirname, 'node_modules/@uirouter/angularjs')));

// Rute untuk halaman utama (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
