const socket = new WebSocket('ws://192.168.100.120:8080');
let imageObj = null;
let drawingState = false;
let pastState = [0, 0];
let photo = null;
let url = null;
let canvas = new fabric.Canvas('leftcanvas',{
    backgroundColor: '#d3d3d3',
    isDrawingMode : false,
    height:650,
    width:650 
});
let canvas2 = new fabric.Canvas('rightcanvas',{
    backgroundColor: '#d3d3d3',
    isDrawingMode : false,
    height:650,
    width:650 
});
socket.addEventListener('open', function (event) {
    console.log("Connection is open")
});
socket.addEventListener('close', function (event) {
    console.log('Connection is closed');
});
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
let imageUpload = function () {
    photo = this.files[0];
    console.log(photo);
    const file = photo;
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        console.log(reader.result)
        url = reader.result;
        if(socket.readyState === WebSocket.OPEN){
            msg = {"event": "image", "data": url}
            socket.send(JSON.stringify(msg))
        }
        fabric.Image.fromURL(url, function(oImg) {
            resizeImg(oImg)
            canvas.add(oImg);
            });
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}
let addgreen = () => {
    canvas.set("isDrawingMode", true);
    canvas.freeDrawingBrush.color = "#00ff00";
}
let addred = () => {
    canvas.set("isDrawingMode", true);
    canvas.freeDrawingBrush.color = "#ff0000";
}
let dis = (state0, state1) => {
    return(Math.pow(Math.pow(state0[0]-state1[0], 2)+Math.pow(state0[1]-state1[1], 2), 1/2))
}
let resizeImg = (img) => {
    let scaleElementX = 1;
    let scaleElementY = 1;
    if(img.width > img.height){
        scaleElementY = canvas.width/img.width;
        img.set({
            scaleY:scaleElementY,
            scaleX:scaleElementY
        });
    }
    else{
        scaleElementX = canvas.height/img.height;
        img.set({
            scaleY:scaleElementX,
            scaleX:scaleElementX
        });
    }
}
let onObjectAdded  = (event) => {
    const addedObject = event.target;
    
    if (addedObject.type === "path"){
        addedObject.set({
            "selectable": false
        });
    }
    else if(addedObject.type === "image"){
        imageObj = addedObject;
        addedObject.set({
            "selectable": false
        }); 
    }
}
let mouseDownBefore = (evt) => {
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
}
let mouseDown = (opt) => {
    if(canvas.isDrawingMode){
        drawingState = true;
    }
    if(drawingState){
        pastState = [Math.round(opt.e.clientX/imageObj.scaleX), Math.round(opt.e.clientY/imageObj.scaleY)]
        console.log(opt.e.clientX);
        console.log(opt.e.clientY);
        if (canvas.freeDrawingBrush.color === "#00ff00"){
            msg = {"event": "f", "data": {"x": Math.round(opt.e.clientX/imageObj.scaleX), "y": Math.round(opt.e.clientY/imageObj.scaleY)}};
            socket.send(JSON.stringify(msg));
        }
        else if (canvas.freeDrawingBrush.color === "#ff0000"){
            msg = {"event": "b", "data": {"x": Math.round(opt.e.clientX/imageObj.scaleX), "y": Math.round(opt.e.clientY/imageObj.scaleY)}};
            socket.send(JSON.stringify(msg));
        }  
    }
}
let mouseMove = (opt) => {
    if(drawingState){
        if(dis(pastState, [Math.round(opt.e.clientX/imageObj.scaleX), Math.round(opt.e.clientY/imageObj.scaleY)])>10){
            console.log(opt.e.clientX);
            console.log(opt.e.clientY);
            if (canvas.freeDrawingBrush.color === "#00ff00"){
                msg = {"event": "f", "data": {"x": Math.round(opt.e.clientX/imageObj.scaleX), "y": Math.round(opt.e.clientY/imageObj.scaleY)}};
                socket.send(JSON.stringify(msg));
            }
            else if (canvas.freeDrawingBrush.color === "#ff0000"){
                msg = {"event": "b", "data": {"x": Math.round(opt.e.clientX/imageObj.scaleX), "y": Math.round(opt.e.clientY/imageObj.scaleY)}};
                socket.send(JSON.stringify(msg));
            }
            pastState = [opt.e.clientX, opt.e.clientY];
        }
    }
}
let mouseUp = (opt) => {
    if(drawingState){
        console.log(opt.e.clientX);
        console.log(opt.e.clientY);
        if (canvas.freeDrawingBrush.color === "#00ff00"){
            msg = {"event": "f", "data": {"x": Math.round(opt.e.clientX/imageObj.scaleX), "y": Math.round(opt.e.clientY/imageObj.scaleY)}};
            socket.send(JSON.stringify(msg));
            socket.send(JSON.stringify({"event": "register"}))
        }
        else if (canvas.freeDrawingBrush.color === "#ff0000"){
            msg = {"event": "b", "data": {"x": Math.round(opt.e.clientX/imageObj.scaleX), "y": Math.round(opt.e.clientY/imageObj.scaleY)}};
            socket.send(JSON.stringify(msg));
            socket.send(JSON.stringify({"event": "register"}))
        }
    }
    drawingState = false;
}
canvas.on('mouse:down:before',mouseDownBefore)
canvas.on('mouse:down', mouseDown)
canvas.on('mouse:move', mouseMove)
canvas.on('mouse:up', mouseUp)
canvas.on('object:added', onObjectAdded);
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
$('#imgUploaded').change(imageUpload);
$("#plusbtn").click(addgreen);
$("#minusbtn").click(addred);


