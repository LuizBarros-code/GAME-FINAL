const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height =600

c.fillRect(0,0, canvas.width , canvas.height)

const gravity =  1

const background = new Sprite({
    position:{
    x: 0,
    y: 0 
}, imageSrc: 'img/Floresta.jpg'
})

const fogueira = new Sprite({
    position:{
    x: 463,
    y: 380
}, 
imageSrc: 'img/fogueira.png', 
scale: 0.5,
framesMax: 5
})

const player = new fighter({
    position:{
        x: 0,
        y: 19
    },
    velocity:{
        x: 0,
        y: 0
    },
    imageSrc: 'img/hu/Idle.png',
    scale: 3,
    framesMax: 8,
    offset: {
        x: 200 ,
        y: 280
    },
    sprites:{
        idle: {
            imageSrc: 'img/hu/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: 'img/hu/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: 'img/hu/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: 'img/hu/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: 'img/hu/attack1.png',
            framesMax: 5
        },
        attack2:{
            imageSrc: 'img/hu/attack2.png',
            framesMax: 5
        },
        takeHit:{
            imageSrc: 'img/hu/Take-hit.png',
            framesMax: 3
        },
        death:{
            imageSrc: 'img/hu/Death.png',
            framesMax: 8
        }

    },
    attackBox: {
        offset: {
            x: 30,
            y: 0 
        },
        width: 100,
        height:50
    }
})



const enemy = new fighter({
    position:{
        x: 990,
        y: 0
    },
    velocity:{
        x:0,
        y:0 
    },
    color: 'blue',
    imageSrc: 'img/wizard/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 300,
        y: 400
    },
    sprites:{
        idle: {
            imageSrc: 'img/wizard/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: 'img/wizard/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: 'img/wizard/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: 'img/wizard/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: 'img/wizard/attack1.png',
            framesMax: 8
        },
        attack2:{
            imageSrc: 'img/wizard/attack2.png',
            framesMax: 8
        },
        takeHit:{
            imageSrc: 'img/wizard/Take hit.png',
            framesMax: 3
        },
        death:{
            imageSrc: 'img/wizard/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -150,
            y: 0
        },
        width: 100,
        height: 50
    }
})



console.log(player)

const keys = {
    a:{
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    ArrowUp:{
        pressed: false
    },
    ArrowDown:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    }
    
}

function rectangularCollision({rectangle1,rectangle2}){
    return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y +
        rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + 
        rectangle2.height)
}

function determineWinner({player,enemy,timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'EMPATE'
    }else if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'PLAYER 1 VENCEU'
    }else if(enemy.health > player.health){
        document.querySelector('#displayText').innerHTML = 'PLAYER 2 VENCEU'
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width,canvas.height)
    background.update()
    fogueira.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


    //andar
    if(keys.a.pressed && player.lastkey === 'a'){
        if(player.position.x == 0){
            player.velocity.x=0
        }else{
            player.velocity.x = -4
            player.switchSpite('run')
        }

    }else if(keys.d.pressed && player.lastkey === 'd'){
        if(player.position.x >= canvas.width-50){
            player.velocity.x=0
        }else{
            player.velocity.x = 4
            player.switchSpite('run')
        }
    }else{
        player.switchSpite('idle')
    }


        //pular
    if(keys.w.pressed && player.lastkey === 'w'){
            player.velocity.y = -10
    }

    if(player.velocity.y < 0){
        player.switchSpite('jump')
    }else if(player.velocity.y > 0){
        player.switchSpite('fall')
    }

    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        if(enemy.position.x == 0){
            enemy.velocity.x=0
        }else{
        enemy.velocity.x = -4
        enemy.switchSpite('run')
        }

    }else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        if(enemy.position.x >= canvas.width-50){
            enemy.velocity.x=0
        }else{
            enemy.velocity.x = 4
            enemy.switchSpite('run')
        }
        }else{
            enemy.switchSpite('idle')
        }
    if(keys.ArrowUp.pressed && enemy.lastkey === 'ArrowUp'){
        if(enemy.position.y <= 0){
            enemy.velocity.y=0
        }else{
            enemy.velocity.y = -10
        
        }

        if(enemy.velocity.y < 0){
            enemy.switchSpite('jump')
        }else if(enemy.velocity.y > 0){
            enemy.switchSpite('fall')
        }
    
    }

    let enemyHealthLabel
    //detecta o ataque
    if(rectangularCollision({rectangle1: player,rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 2){
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        enemyHealthLabel = document.querySelector('#enemyHealthLabel')
        if(enemy.health > 0){
        enemyHealthLabel.innerHTML = enemy.health
        }else{
            enemyHealthLabel.innerHTML = 0
        }
    }

    if(player.isAttacking && player.framesCurrent === 2){
        player.isAttacking = false
    }

    let playerHealthLabel

    if(rectangularCollision({rectangle1: enemy,rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit()
        document.querySelector('#playerHealth').style.width = player.health + '%'
        playerHealthLabel = document.querySelector('#playerHealthLabel')
        if(player.health > 0){
            playerHealthLabel.innerHTML = player.health
            }else{
                playerHealthLabel.innerHTML = 0
            }
    }

   if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    //detecta fim do game com base na vida
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})
    }

}

animate()

window.addEventListener('keydown' , (event) => {
    if(!player.dead){
        switch(event.key){
            case 'd':
            keys.d.pressed = true
                player.lastkey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastkey = 'a'
                break
            case 'w':
                keys.w.pressed = true
                player.lastkey = 'w'
                break
            case 's':
                keys.s.pressed = true
                player.lastkey = 's'
                break
            case 'j':
                player.attack1()
                break
            case 'k':
                player.attack2()
                break
        }
        console.log(event.key)
    }
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                        keys.ArrowRight.pressed = true
                        enemy.lastkey = 'ArrowRight'
                        break
                    case 'ArrowLeft':
                        keys.ArrowLeft.pressed = true
                        enemy.lastkey = 'ArrowLeft'
                        break
                    case 'ArrowUp':
                        keys.ArrowUp.pressed = true
                        enemy.lastkey = 'ArrowUp'
                        break
                    case 'ArrowDown':
                        keys.ArrowDown.pressed = true
                        enemy.lastkey = 'ArrowDown'
                        break
                    case '1':
                        enemy.attack1()
                        break
                    case '2':
                        enemy.attack2()
                        break
        }
    }
})

window.addEventListener('keyup' , (event) => {
    switch(event.key){
        case('d'):
        keys.d.pressed = false
        break
        case('a'):
        keys.a.pressed = false
        break
        case('w'):
        keys.w.pressed = false
        break
        case('s'):
        keys.s.pressed = false
        break

        case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp':
        keys.ArrowUp.pressed = false
        break
        case 'ArrowDown':
        keys.ArrowDown.pressed = false
        break
    }
})



