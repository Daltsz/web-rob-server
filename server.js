const express = require("express");
const bodyParser = require('body-parser');
const five = require('johnny-five');
const cors = require('cors');


const app = express();

const board = new five.Board({ port:"COM3"});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());



app.get("/", (req, res) =>{

    res.send("METODO GET RODANDO!!!");



});



app.get("/led-blink", (req, res) =>{

    res.send("OLAAAAA BOARD");

});





app.post("/led-blink", async (req, res) =>{

    let i = 0 



    for(i=0 ; i< (req.body.length-1); i++){
   
        try{



                    switch(req.body[i]){
                        
                       
                        case 'Blink_Led':
                            const led = new five.Led(13);

                            await led.blink(1000);
                            //res.json({message: 'sucess!!'});
                            
                            await board.wait(2000, async() =>{

                                await led.stop().off();
                                

                            });
                            break;

                        default:
                            res.json('NÃO PASSOU NENHUM PARAMETRO VALIDO');
                              
                    }

        } catch (error) {

            res.status(400).json({message: error.message});
            
        }
    }
    
    
    res.json({message: 'Sucess!!!!'});
   

});



const startServer = () =>{

    app.listen(5000, () =>{

        console.log("App Listening na Port 5000!!!!");
        console.log("Servidor ta rodandooooo muito show!!!!")


    });

}




board.on("ready", startServer);
