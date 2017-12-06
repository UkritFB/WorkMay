var serialPort = require("serialport"); //for nodejs v4
var sPort = null;

/* 
// Serial port list 
*/
function serialList (callback)  {
/*  sportName = [];
  serialPort.list(function (err, ports) {////for nodejs v4.. up  //edit by mang
    for (var i in ports)  {
      var portName = ports[i].comName;
      var serial = ports[i].serialNumber;
      if(portName.search('/dev/ttyUSB') == 0) {
        //console.log('Serial-list ->', ports[i]);
        if(serial.search('HubEmbedQ') != -1) {
         callback(portName);
         return;
        }
      }
    }
    callback('');
  });*/

  sportName = [];
  serialPort.list(function (err, ports) {////for nodejs v4.. up  //edit by mang
    for (var i in ports)  {
      var portName = ports[i].comName;
      // if (portName == '/dev/ttyUSB0')  {
      if (portName == '/dev/ttyUSB0')  {
        //console.log('Serial-list ->', portName);
        callback(portName);
        return;
      }
    }
    callback('');
  });
}

/*
// Serial port write data
*/
function writeSerialPort (sock, data, callback) {       //for nodejs v4.. up
  sock.write(data+'\u0000', function () {
    sock.drain(callback);
  });
}

/* 
// Serial init & recieve data 
*/
function serialInit (callback) {
  serialList(function(portName)  {
    if (portName == '')  {
      console.log('Serial port not found...');
      callback(-1);
      return;
    }
    // console.log('Serial port name ->',portName);
    var sPort = new serialPort(portName, {
      // baudrate: 115200,
      baudrate: 9600,
      autoOpen: false,
      //autoOpen: true
    }); // this is the openImmediately flag [default is true]
    // sPort.open(function (err) {  
    //   if (!err)  {
    //     // console.log(portName, 'already opened...');
    //   }
    //   else  {
    //     console.log(portName, 'open error...');
    //     callback(-1);
    //   }
    //   return;
    // }); 
    sPort.open();

    sPort.on('open', function() {
      console.log(portName, 'baudrate ->', sPort.options.baudRate);
      callback(sPort);
    });   

    sPort.on("close", function () {
      console.log('Serial port closed...',portName);
    });

    sPort.on('error', function(err) {
      console.log(err);
    });

    var tempBuff = '';
    var endLine = -1;
    sPort.on("data", function (_data) {
      var data = _data+'';
      endLine = data.indexOf('\n');
      // console.log('Temp-data ->',data, endLine);
      if (endLine == -1)  tempBuff += data;
      else {
        // data = data.split('\u0000').join('');
        var sportBuff = tempBuff+data;
        tempBuff = '';
        console.log('Complete-data ->',sportBuff);



        if (sPort != null)  {
          var text = 'OK\n';
          writeSerialPort(sPort, text, function()  {  
            console.log('Sendback-data ->', text);
          })
        }


      }
    });  
  })
}


serialInit(function(_sPort)  {
  if (sPort == -1)  return;
  sPort = _sPort;
})


