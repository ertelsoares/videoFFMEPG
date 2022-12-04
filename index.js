const express = require("express");

const multer = require("multer");

const {exec} = require("child_process");
const path = require('path');
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;


const app =  express();


app.use(express.static('public'));


var dir = 'public';

var subDirectory = 'public/uploads';

if(!fs.existsSync(dir)){
    fs.mkdirSync(dir)

    fs.mkdirSync(subDirectory)
}


var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
})


var upload = multer({storage:storage})

const PORT = process.env.Port || 3000;

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/home.html")
})

app.post('https://videocodec.herokuapp.com/convert',upload.single('file'),(req,res)=>{
      if(req.file && req.body.ext){
        console.log(req.file.path)
        var extensao = req.body.ext;

        var output =  Date.now() + `output.${extensao}`;
        
        converte(req.file.path,output,extensao)
        

        function converte(req,output,extensao){
            exec(`ffmpeg -i ${req}  ${output}`,(error,stdout,stderr)=>{
            if(error){
                console.log(`error: ${error.message}`);
            }else{
                
                    console.log('Arquivo convertido');
                    res.download(output,(err) =>{
                        if (err) throw err
    
                        fs.unlinkSync(req.file.path)
                        fs.unlinkSync(output)
                    })
            
              }
            })
        }

        
      }
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
