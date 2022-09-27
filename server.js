const VirtualSerialPort = require('udp-serial').SerialPort;
const express = require("express");
const firmata = require('firmata');
const bodyParser = require('body-parser');
const five = require('johnny-five');
const cors = require('cors');

const app = express();
var sp = new VirtualSerialPort({
    host: '192.168.4.1',
    type: 'udp4',
    port: 1025
});
var io = new firmata.Board(sp);
const board = new five.Board({io: io, repl: true});
console.log(board)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.get("/", (req, res) =>{
    res.send("METODO GET RODANDO!!!");
});
app.get("/led-blink", (req, res) =>{
    res.send("OLA BOARD");
});
app.post("/led-blink",  (req, res) =>{
    let i = 0 
    const motors = new five.Motors([
        { pins: {dir: 4, pwm: 5}, invertPWM:true  },
        { pins: {dir: 12, pwm: 11},  invertPWM:true}       
        ]);  
        board.repl.inject({
        motors
        });
        const led = new five.Led(13);
        console.log(req.body);
        try{ 
            for (i=0 ; i< (req.body.length-1); i++){
                console.log(req.body[i]);
                (function(i){
                    setTimeout(function(){
                        switch(req.body[i]){                     
                            case 'Blink_Led':
                                led.blink(1000);
                                //res.json({message: 'sucess!!'});
                                console.log('Passed Here')
                                board.wait(2000, async () =>{
                                    led.off().stop();  
                                    res.writeContinue();   
                                }); 
                                break;
                            case 'Para_Frente':
                                console.log("VAI PRA FRENTE OS DOIS JUNTOS");
                                // Trocar por Motor forward futuramente//
                                motors.reverse(255);
                                board.wait(2000, function () {
                                    motors.stop();                                   
                                    res.writeContinue();
                                });
                                break;
                            case 'Para_Tras':
                                console.log("VAI PRA TRAS OS DOIS JUNTOS");
                                // Trocar por Motor Reverse futuramente//
                                motors.forward(255);
                                board.wait(2000, function () {
                                    motors.stop();                                    
                                    res.writeContinue();
                                });
                                break;                     
                            case 'Esquerda':
                                console.log("Virar para Esquerda");
                                motors[0].forward(255);
                                motors[1].reverse(255);                    
                                board.wait(2000, function() {
                                motors.stop();
                                res.writeContinue();
                                });              
                                break;            
                            case 'Direita':
                                console.log("VAI PRA DIREITA");
                                motors[1].forward(255);
                                motors[0].reverse(255);            
                                board.wait(2000, function() {
                                    motors.stop();
                                    res.writeContinue();
                                });            
                                break;
                            default:
                                res.json('NÃO PASSOU NENHUM PARAMETRO VALIDO');            
                        }        
                    }, 4000 * i);
                })(i);
            }  
        } catch (error) {
            res.status(400).json({message: error.message});    
        }
    res.json({message: 'Sucess!!!'});
});
const startServer = () =>{
    app.listen(5000, () =>{
        console.log("App Listening na Port 5000!!!!");
        console.log("Servidor ta rodandooooo muito show!!!!")
    });
}
io.once('ready', function(){
    console.log('IO Ready');
    io.isReady = true;
    board.on("ready", startServer);
});