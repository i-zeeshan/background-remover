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
            "selectable": true,

        });
        addedObject.center();
    }
    return false;
    //}
}
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    console.log(opt.e.clientX)
    console.log(opt.e.clientY)

    zoom = zoom + delta/350;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint(new fabric.Point(opt.e.clientX, opt.e.clientY),zoom)
    //canvas.setZoom(zoom);
    opt.e.preventDefault();
    //opt.e.stopPropagation();
  })
img = new fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', function (img) {
    
    /*var scalex = canvas.width/img.width;
    var scaley = canvas.height/img.height;
    var scale;
    if (scalex > 1){
        scale = scaley;
    }
    else{
        scale = scalex;
    }*/
    
    img.on('mousedown',function(options) {
        
        /*var object = new fabric.Circle({
            radius: 15,
            fill: 'blue',
            left: 100,
            top: 100,
            clientX: options.e.clientX,
            clientY: options.e.clientY
        });
        object.set({ hasControls: false, hasBorders: false, selectable: false })
        canvas.add(object);
        console.log(options.e.clientX, options.e.clientY)});*/
    //canvas.freeDrawingBrush.color = '#00ff00';
    //canvas.freeDrawingBrush.width = 15;
});
    img.on('mousemove',function(options) {
        /*var object = new fabric.Circle({
            radius: 15,
            fill: 'blue',
            left: 100,
            top: 100,
            clientX: options.e.clientX,
            clientY: options.e.clientY
        });
        canvas.add(object);
    console.log(options.e.clientX, options.e.clientY)*/
    var color = document.getElementById("favcolor").value;
    console.log(color);
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = 15;
    /*var i;
    var len = canvas.getObjects().length;
    for (i = 0; i < len; i++) {
        if(canvas.getObjects()[i].type == "path"){
            canvas.getObjects()[i].selectable = false;
        }
    }*/
    // isDrawingMode : false,
    // canvas.freeDrawingBrush.selectable = false;
    // canvas.freeDrawingBrush.hasControls = false;
    // canvas.freeDrawingBrush.hasBorders = false;
    // canvas.freeDrawingBrush.lockMovementX = true;
    // canvas.freeDrawingBrush.lockMovementY = true;
    
    canvas.renderAll();
});
    //var oImg;


  // Centers object vertically and horizontally on canvas to which is was added last
    //oImg = img.set({ hasControls: false, hasBorders: false, selectable: true });
    img.centerH();
    img.centerV();
    canvas.add(img);

});
addCircle = function(){
    canvas.set("isDrawingMode", false);
    object = new fabric.Circle({
        radius: 15,
        fill: 'blue',
        left: 100,
        top: 100,
        
    });
    canvas.add(object);

}
addTriangle = function(){
    canvas.set("isDrawingMode", false);
    object = new fabric.Triangle({
        fill: 'blue',
        left: 100,
        top: 100,
        
    });
    canvas.add(object);

}
addRectangle = function(){
    canvas.set("isDrawingMode", false);
    object = new fabric.Rect({
        "top":100,
        "width": 30,
        "height": 30,
        "left": 70,
        "fill": "blue"
    })
    canvas.add(object)
}
addPolygon = function(){
    canvas.set("isDrawingMode", false);
    var startPoints = [
        {x: 0, y: 42},
        {x: 155, y: 0},
        {x: 155, y: 243},
        {x: 0, y: 256}
      ];
    object = new fabric.Polygon(startPoints,{
        "top":100,
        "width": 30,
        "height": 30,
        "left": 70,
        "fill": "blue"
    });
    canvas.add(object);

}
canvas.on('object:added', onObjectAdded);
img;
canvas.setHeight(650);
canvas.setWidth(649);
canvas.renderAll();

$("#dra").click(function(){
    canvas.set("isDrawingMode", true);
    
}   
);
var addgreen = function(){
    canvas.set("isDrawingMode", true);
    canvas.freeDrawingBrush.color = "#00ff00";
    
}
$("#cir").click(addCircle);
$("#tri").click(addTriangle);
$("#poly").click(addPolygon);
$('#rect').click(addRectangle);
$("#plusbtn").click(addgreen);
$("#text").click(function(){
    
    $(document).ready(function(){
        canvas.set("isDrawingMode", false);
        console.log("button has been pressed")
        canvas.add(new fabric.Text('foo', { 
        fontFamily: 'Delicious_500', 
        left: 100, 
        top: 100,
        fill: '#ffffff',
        }));
    });
    canvas.renderAll();
});



/*var canvas1 = new fabric.Canvas('d');
canvas1.setHeight(750);
canvas1.setWidth(490);
canvas1.renderAll();
fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', function(myImg) {
    var oImg;
    oImg = myImg.set({ hasControls: false, hasBorders: false, selectable: false });
    canvas1.add(oImg);
})*/

