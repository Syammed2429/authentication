const {app,port} = require('./index')
const connect = require('./config/db');




app.listen(port, async () => {
    await connect();
    console.log(`Listening at ${port}`);
});