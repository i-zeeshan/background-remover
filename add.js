drawingState = false;
pastState = [0, 0];
// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.100.120:5678');

// Connection opened
socket.addEventListener('open', function (event) {
    // socket.send('Connection is open');
    console.log("Connection is open")
});
socket.addEventListener('close', function (event) {
    console.log('Connection is closed');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

dis = (state0, state1) => {
    return(Math.pow(Math.pow(state0[0]-state1[0], 2)+Math.pow(state0[1]-state1[1], 2), 1/2))
}


var canvas = new fabric.Canvas('leftcanvas',{
    backgroundColor: '#d3d3d3',
    isDrawingMode : false,
    
});
var canvas2 = new fabric.Canvas('rightcanvas',{
    backgroundColor: '#d3d3d3',
    isDrawingMode : false,
    
});
canvas2.setHeight(650);
canvas2.setWidth(649);

onObjectAdded  = function (event) {
    const addedObject = event.target;
    //const objectIndex = canvas.getObjects().length - 1;
    //if (canvas.isDrawingMode) {
        //const customVariables = {"subType": "free-drawing"};
        //addedObject.customVariables = customVariables;
    
    if (addedObject.type == "path"){
        addedObject.set({
            "selectable": false
        });
    }
    else if(addedObject.type == "image"){
        addedObject.set({
            // "selectable": true,
            "selectable": false

        });
        function convertToDataURLviaCanvas(url, callback, outputFormat){
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var c = document.createElement('CANVAS');
                var ctx = c.getContext('2d');
                var dataURL;
                c.height = this.height;
                c.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = c.toDataURL(outputFormat);
                callback(dataURL);
                c = null; 
            };
            img.src = url;
        }
        // Usage
        
        convertToDataURLviaCanvas('http://fabricjs.com/assets/pug_small.jpg', function(base64Img){
            if(socket.readyState === WebSocket.OPEN){
                msg = {"event": "image", "data": base64Img}
                // print(JSON.stringify(msg))
                // socket.send(JSON.parse(JSON.stringify(msg)));
                socket.send(JSON.stringify(msg))
            }
        });
        // addedObject.center();

        
        // if(socket.readyState === WebSocket.OPEN){
        //     msg = {event: "image", data: base64String}
        //     socket.send(msg);
        // }
    }
    return false;
    //}
}
mouseDownBefore = (evt) => {
    if(canvas.freeDrawingBrush.width < 5){
        canvas.freeDrawingBrush.width =20;
    }
    if(document.getElementById("sizebtn").innerHTML === "5px"){
        canvas.freeDrawingBrush.width = 5;
    }
    else if(document.getElementById("sizebtn").innerHTML === "10px"){
        canvas.freeDrawingBrush.width = 10;
    }
    else if(document.getElementById("sizebtn").innerHTML === "20px"){
        canvas.freeDrawingBrush.width = 20;
    }
    else if(document.getElementById("sizebtn").innerHTML === "30px"){
        canvas.freeDrawingBrush.width = 30;
    }
    else if(document.getElementById("sizebtn").innerHTML === "40px"){
        canvas.freeDrawingBrush.width = 40;
    }
    // if()
}
mouseDown = (opt) => {
    if(canvas.isDrawingMode){
        drawingState = true;
    }
    if(drawingState){
        pastState = [opt.e.clientX, opt.e.clientY]
        console.log(opt.e.clientX);
        console.log(opt.e.clientY);
        if (canvas.freeDrawingBrush.color === "#00ff00"){
            msg = {"event": "f", "data": {"x": opt.e.clientX, "y": opt.e.clientY}};
            socket.send(JSON.stringify(msg));
        }
        else if (canvas.freeDrawingBrush.color === "#ff0000"){
            msg = {"event": "b", "data": {"x": opt.e.clientX, "y": opt.e.clientY}};
            socket.send(JSON.stringify(msg));
        }
        
    }
    
}
mouseMove = (opt) => {
    // console.log(canvas.isDrawingMode)
    if(drawingState){
        
        if(dis(pastState, [opt.e.clientX, opt.e.clientY])>10){
            console.log(opt.e.clientX);
            console.log(opt.e.clientY);
            if (canvas.freeDrawingBrush.color === "#00ff00"){
                msg = {"event": "f", "data": {"x": opt.e.clientX, "y": opt.e.clientY}};
                socket.send(JSON.stringify(msg));
            }
            else if (canvas.freeDrawingBrush.color === "#ff0000"){
                msg = {"event": "b", "data": {"x": opt.e.clientX, "y": opt.e.clientY}};
                socket.send(JSON.stringify(msg));
            }
            pastState = [opt.e.clientX, opt.e.clientY];
        }
        
        
    }

}
mouseUp = (opt) => {
    if(drawingState){
        console.log(opt.e.clientX);
        console.log(opt.e.clientY);
        if (canvas.freeDrawingBrush.color === "#00ff00"){
            msg = {"event": "f", "data": {"x": opt.e.clientX, "y": opt.e.clientY}};
            socket.send(JSON.stringify(msg));
        }
        else if (canvas.freeDrawingBrush.color === "#ff0000"){
            msg = {"event": "b", "data": {"x": opt.e.clientX, "y": opt.e.clientY}};
            socket.send(JSON.stringify(msg));
        }
        
    }
    drawingState = false;
}
canvas.on('mouse:down:before',mouseDownBefore)
canvas.on('mouse:down', mouseDown)
canvas.on('mouse:move', mouseMove)
canvas.on('mouse:up', mouseUp)
// canvas.on('mouse:wheel', function(opt) {
//     var delta = opt.e.deltaY;
//     var zoom = canvas.getZoom();
//     console.log(opt.e.clientX)
//     console.log(opt.e.clientY)

//     zoom = zoom + delta/350;
//     if (zoom > 20) zoom = 20;
//     if (zoom < 0.01) zoom = 0.01;
//     canvas.zoomToPoint(new fabric.Point(opt.e.clientX, opt.e.clientY),zoom)
//     //canvas.setZoom(zoom);
//     opt.e.preventDefault();
//     //opt.e.stopPropagation();
//   })

img = new fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', function (img) {
    // let c = document.createElement('canvas');
    
    // width = img.width * img.scaleX, 
    // height = img.height * img.scaleY
    // c.height = img.naturalHeight;
    // c.width = img.naturalWidth;
    // var ctx = c.getContext('2d');
    // let imageObj = new Image();
    // imageObj.src = 'http://fabricjs.com/assets/pug_small.jpg';
    // imageObj.onload = function() {
    //     ctx.drawImage(imageObj, 0, 0);
    //     // let base64String = c.toDataURL();
    //     // console.log({event: base64String})
    //     console.log(imageObj);
    // };
    
    
    
    /*var scalex = canvas.width/img.width;
    var scaley = canvas.height/img.height;
    var scale;
    if (scalex > 1){
        scale = scaley;
    }
    else{
        scale = scalex;
    }*/
    
//     img.on('mousedown',function(options) {
        
//         /*var object = new fabric.Circle({
//             radius: 15,
//             fill: 'blue',
//             left: 100,
//             top: 100,
//             clientX: options.e.clientX,
//             clientY: options.e.clientY
//         });
//         object.set({ hasControls: false, hasBorders: false, selectable: false })
//         canvas.add(object);
//         console.log(options.e.clientX, options.e.clientY)});*/
//     //canvas.freeDrawingBrush.color = '#00ff00';
//     //canvas.freeDrawingBrush.width = 15;
// });
//     img.on('mousemove',function(options) {
//         /*var object = new fabric.Circle({
//             radius: 15,
//             fill: 'blue',
//             left: 100,
//             top: 100,
//             clientX: options.e.clientX,
//             clientY: options.e.clientY
//         });
//         canvas.add(object);
//     console.log(options.e.clientX, options.e.clientY)*/
//     var color = document.getElementById("favcolor").value;
//     console.log(color);
//     canvas.freeDrawingBrush.color = color;
//     canvas.freeDrawingBrush.width = 15;
//     /*var i;
//     var len = canvas.getObjects().length;
//     for (i = 0; i < len; i++) {
//         if(canvas.getObjects()[i].type == "path"){
//             canvas.getObjects()[i].selectable = false;
//         }
//     }*/
//     // isDrawingMode : false,
//     // canvas.freeDrawingBrush.selectable = false;
//     // canvas.freeDrawingBrush.hasControls = false;
//     // canvas.freeDrawingBrush.hasBorders = false;
//     // canvas.freeDrawingBrush.lockMovementX = true;
//     // canvas.freeDrawingBrush.lockMovementY = true;
    
//     canvas.renderAll();
// });
    //var oImg;


  // Centers object vertically and horizontally on canvas to which is was added last
    //oImg = img.set({ hasControls: false, hasBorders: false, selectable: true });
    // img.centerH();
    // img.centerV();
    canvas.add(img);

});

canvas.on('object:added', onObjectAdded);
img;
canvas.setHeight(650);
canvas.setWidth(649);
canvas.renderAll();

$("#dra").click(function(){
    canvas.set("isDrawingMode", true);
    
}   
);
var addgreen = () => {
    
    console.log(document.getElementById("sizebtn").innerHTML)
    canvas.set("isDrawingMode", true);
    canvas.freeDrawingBrush.color = "#00ff00";
    
    
    
}
let addred = () => {
    console.log(document.getElementById("sizebtn").innerHTML)
    canvas.set("isDrawingMode", true);
    canvas.freeDrawingBrush.color = "#ff0000";
    if(canvas.freeDrawingBrush.width < 5){
        canvas.freeDrawingBrush.width =20;
    }
}
// let readval = () => {
//     console.log(this.value);
// }
$("#plusbtn").click(addgreen);
$("#minusbtn").click(addred);
// $("#sizebtn").click(readval)



/*var canvas1 = new fabric.Canvas('d');
canvas1.setHeight(750);
canvas1.setWidth(490);
canvas1.renderAll();
fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', function(myImg) {
    var oImg;
    oImg = myImg.set({ hasControls: false, hasBorders: false, selectable: false });
    canvas1.add(oImg);
})*/

