const app = require('./controller/app');
const port = 3000;
const hostname = 'localhost';
const servestatic = require('serve-static');
const path = require('path');
var cors = require('cors');

app.use(servestatic(path.join(__dirname, '/public')));

app.use((req,res,next) => {
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);

    next();
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});