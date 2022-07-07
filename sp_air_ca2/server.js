const app = require('./controller/app');
const port = 3000;
const hostname = 'localhost';
const servestatic = require('serve-static');
const path = require('path');

app.use(servestatic(path.join(__dirname, '/public')));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});