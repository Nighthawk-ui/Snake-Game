//canvas size and single block size
const canvasSide = 525;
const blockSide = 15;

//record data type for a block to store position

let head= {
    x : canvasSide/2 - blockSide/2,
    y : canvasSide/2 - blockSide/2
}

let grow = false
let block = {
    x : null,
    y : null
}
let blockArray = []
Hori = true
Vert = true

let food = false
let foodX;
let foodY;

let gameOver = false


window.onload = function(){
    board = document.getElementById("myCanvas");
    context = myCanvas.getContext("2d");

    board.width = canvasSide;
    board.height = canvasSide;

    //draw starting block (the head)
    context.fillStyle = "red";
    context.fillRect(head.x, head.y, blockSide, blockSide);

    //check if an arrow button is pressed in the start
    document.addEventListener("keydown", (event) =>{
        key = event.key
        
        headPosUpdateVert()
        headPosUpdateHoriz()

        update()
        intervalId = setInterval(update,100)
    },{once: true})

    

}


function update(){

    if (gameOver){
        clearInterval(intervalId)
        return
    }
    

    document.addEventListener("keydown", (event) =>{
        headPosDecision(event.key)
    })

    
    context.clearRect(0,0,canvasSide,canvasSide);
    newBlockSpawn()
    tailPosUpdate()

    // OPTIMISATION: REMOVE MOVEHORIZ IFS BY JUST MANAGING KEY STORING. wILL ALSO FIX MOVEMENT STUCK BY PEPENDICULAR FASTINPUT (anytime it stops moving this is problem)
    headPosUpdateHoriz()
    headPosUpdateVert()


    collision()
    debug()
    
    //PrevPos = Object.assign({}, head)
    context.fillStyle = "red"
    context.fillRect(head.x, head.y, blockSide, blockSide);
    


    drawFood()
    context.fillStyle = 'white';
    context.fillText("Game Over:  " + gameOver, 15, 70)

    //context.fillText("food x : " + foodX, 15, 210)
    //context.fillText("food y : " + foodY, 15, 230)
    foodCollision()


    
}

function headPosDecision(keystroke){
        if ((keystroke === "ArrowLeft" || keystroke === "ArrowRight") && Vert){
            key = keystroke
        }
        if ((keystroke === "ArrowUp" || keystroke === "ArrowDown") && !Vert){
            key = keystroke
        }
}



function headPosUpdateHoriz(){
    if (key === "ArrowLeft"){
        head.x -= blockSide
        Vert = false
    } else if (key=== "ArrowRight"){
        head.x += blockSide
        Vert = false
    }
    moveHoriz = true
    if (head.x < 0 ){
        head.x = canvasSide - blockSide
    } else if (head.x == canvasSide ) {
        head.x = 0
    }
}

function headPosUpdateVert(){
    if (key === "ArrowUp"){
    head.y -= blockSide
    Vert = true
    } else if (key === "ArrowDown"){
    head.y += blockSide
    Vert = true
    }
    moveHoriz = false
    if (head.y < 0 ){
        head.y = canvasSide - blockSide
    } else if (head.y == canvasSide ) {
        head.y = 0
    }

}

function drawFood(){
    if (!food){
        do {
            foodX = Math.round(Math.random() * (canvasSide - 3 * blockSide) + blockSide);
            foodY = Math.round(Math.random() * (canvasSide - 3 * blockSide) + blockSide);



        }while (foodX % blockSide !== 0 || foodY % blockSide !== 0 || foodX == head.x || foodY == head.y) // solve spawing on head
        
        context.fillStyle = "blue"
        context.fillRect(foodX, foodY, blockSide, blockSide);
        food = true
    } else {
        context.fillStyle = "blue"
        context.fillRect(foodX, foodY, blockSide, blockSide)
    }
}

function tailPosUpdate(){
    if (blockArray.length > 0){
        blockArray[blockArray.length -1] = Object.assign({}, blockArray[blockArray.length -2])
        

        for ( let i = blockArray.length - 1; i > 0 ; i--){
            //blockArray [0] = Object.assign({}, )
            blockArray[i] = blockArray[Math.max(0, i - 1)]
        }

        blockArray[0] = Object.assign({}, head)

        

        for (let i = 0; i < blockArray.length; i++){
            context.fillStyle = "white"
            context.fillRect(blockArray[i].x, blockArray[i].y, blockSide, blockSide);

            
        }
    }
}

function foodCollision(){
    if (head.x == foodX && head.y == foodY){
        grow = true
        food = false
    }
}

function newBlockSpawn(){
    if (grow && blockArray.length == 0){
        block = Object.assign({}, head)
        blockArray.push({ ...block })
    
    } else if (grow){
        block = Object.assign({}, blockArray[blockArray.length - 1]) //spawn problem
        blockArray.push({ ...block })

    }
    grow = false
}

function collision(){
    if (blockArray.length > 0){
        for (let i = 0; i < blockArray.length; i++){
            if (head.x == blockArray[i].x && head.y == blockArray[i].y ){
                gameOver = true
            }
        }
    }
}

function debug(){
    context.font = '19px Arial';   // Font size and family
    context.fillStyle = 'white';
    // context.fillText(key, 15, 30)
    context.fillText("Array length " + blockArray.length, 15, 50)
    //context.fillText("Head y position: " + head.y, 15, 70)
    // context.fillText("Vertical movement: " + Vert, 15, 90)
    // context.fillText("Horizontal movement: " + Hori, 15, 110)
    // context.fillText("Key: " + key, 15, 130)
    // context.fillText("Keystroke: " + key, 15, 150)
    // context.fillText("moveHoriz: " + moveHoriz, 15, 170)
    // context.fillText("food present?: " + food, 15, 190)
}

