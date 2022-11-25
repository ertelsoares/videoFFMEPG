const express = require("express");
const multer = require("multer");

const PORT = process.env.Port || 5000;
const app =  express();

const storage = multer.diskStorage({
    destination: (request,file,callback) =>{
        callback(null, './tmp');
    },
    filename:(request,file,callback) =>{
         callback(null, Date.now() + '-' + file.originalname);
    },
});

app.use(multer({storage}).single("file"));
app.post('/convert',(request ,response) => {
    return response.send("ok");
});

app.listen(PORT);