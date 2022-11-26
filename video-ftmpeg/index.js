const express = require("express");
const multer = require("multer");
const fs = require("fs");
const ffmepg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

ffmepg.setFfmpegPath(ffmpegPath);

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
console.log(ffmepg);
app.use(multer({storage}).single("file"));
app.post('/convert',(request ,response) => {
    const file = request.file;
    const fileName = ' output.mp3';

    ffmepg('tmp/' + file.filename).toFormat('mp3').
    on("end",() =>{
        //Fazer download do arquivo mp3
        return response.download(__dirname + fileName, (error) =>{
            if (error) throw  error;
            console.log("convertion sucess");

        });

        // Apagar arquivo mp4
    }).on("error" , (error) =>{
        console.log(error);
        //Apagar arquivo mp4
    }).saveToFile(__dirname + fileName)

});

function removeFile(directory){
  fs.unlink(directory,(error) =>{
      if (error) throw  error;
      console.log("File deleted");
  })
}

app.listen(PORT);