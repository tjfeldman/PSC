function spriteTop(mySprite)
{
    var aTop = mySprite.position.y + mySprite.height;
    if (mySprite.anchor.y != 0)
        aTop = mySprite.position.y + (mySprite.height - mySprite.height * mySprite.anchor.y);
    return aTop;
}//spriteTop

function spriteBottom(mySprite)
{
    var aBottom = mySprite.position.y;
    if (mySprite.anchor.y != 0)
        aBottom = mySprite.position.y - mySprite.height * mySprite.anchor.y;
    return aBottom;
}//spriteBottom

function spriteLeft(mySprite)
{
    var aLeft = mySprite.position.x;
    if (mySprite.anchor.x != 0)
        aLeft = mySprite.position.x - mySprite.width * mySprite.anchor.x;
    return aLeft;
}//spriteLeft

function spriteRight(mySprite)
{
    var aRight = mySprite.position.x + mySprite.width;
    if (mySprite.anchor.x != 0)
        aRight = mySprite.position.x + (mySprite.width - mySprite.width * mySprite.anchor.x);
    return aRight;
}//spriteRight

function testAABBCollision(a, b)
{
    //if (aLeft < bRight && aRight > bLeft && aBottom < bTop && aTop > bBottom)
    if (spriteLeft(a) < spriteRight(b) && spriteRight(a) > spriteLeft(b) && spriteBottom(a) < spriteTop(b) && spriteTop(a) > spriteBottom(b) )
        return true;
}//testAABBCollision


var Main = {};

//BOOT SCREEN/STATE
Main.Boot = function (game)
{
    this.game = game;
};

Main.Boot.prototype = {

    preload: function ()
    {
        this.game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;//Phaser.StageScaleMode.SHOW_ALL;
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.disablePauseScreen = true;

        this.game.stage.scale.minWidth = 512;
        this.game.stage.scale.minHeight = 384;

        this.game.stage.scale.maxWidth = 1024;
        this.game.stage.scale.maxHeight = 768;
        this.game.stage.scale.pageAlignHorizontally = true;

        if (this.game.device.android && this.game.device.chrome == false)
        {
            this.game.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
            this.game.stage.scale.maxIterations = 1;
        }

        this.load.image('loaderFull', 'images/preloadBar.png');
        //this.load.image('loaderEmpty', 'assets/UI/loaderEmpty.png');
    },

    create: function ()
    {
        //// this.game.stage.enableOrientationCheck(true, false, 'orientation');
        this.game.state.start('preloader', Main.Preloader);
        //this.game.state.start('trial3', Main.Trial3);
    },
    
}//main boot prototype

//PRELOADER SCREEN/STATE
Main.Preloader = function (game)
{
    this.game = game;
};

Main.Preloader.prototype = {
    preloadBar: Phaser.Sprite,
    test: Phaser.Sprite,
    preload: function ()
    {
        this.preloadBar = this.add.sprite(this.game.world.centerX, 370, 'loaderFull');
        this.preloadBar.position.x = 512 - this.preloadBar.width / 2;
        //this.preloadBar.anchor.setTo(0.5, 0);
        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.image('background', 'images/background.png');
        this.game.load.image('star', 'images/star.png');
        this.game.load.image('kite', 'images/kite.png');
    },
    create: function ()
    {
        // this.game.state.start('mainMenu', Main.MainMenu);
        this.game.state.start('trial13', Main.Trial13);
        //this.game.state.start('trial4instr', Main.Trial4Instr);
    },

}//PRELOADER


//TRIAL 1 SCREEN/STATE
Main.Trial1 = function (game)
{
    this.game = game;
};

Main.Trial1.prototype = {
    
    //stars:Phaser.group,
    goalPoint:Phaser.Point,
    goalRadius: Number,
    numStars: Number,
    starsInGoal: Number,

    preload: function ()
    {
        //this.game.load.image('star', 'images/star.png');
    },

    create: function ()
    {
        this.game.add.image(0, 0, 'background');
        goalPoint = new Phaser.Point(this.game.world.centerX, this.game.world.centerY);
        goalRadius = 150;
        numStars = 7;
        starsInGoal = 0;

        var stars = this.game.add.group();
        // stars.enableBody = true;
        var widthBuffer = 40;
        var x;
        var y;
        var quadrant = 0;

        for (var i = 0; i < numStars; i++) {
            //var x = game.rnd.integerInRange(0 + widthBuffer, game.width - widthBuffer);
            //var y = game.rnd.integerInRange(0 + widthBuffer, game.height - widthBuffer);
            //quadrant = this.game.rnd.integerInRange(0, 3);
            quadrant++; //cycle throuh quadrants o get nice spacing
            if (quadrant > 3) quadrant = 0;

            switch (quadrant) {
                case 0: //left quadrant
                    x = this.game.rnd.integerInRange(0 + widthBuffer, this.game.width / 2 - goalRadius);
                    y = this.game.rnd.integerInRange(0 + widthBuffer, this.game.height - widthBuffer);
                    break;
                case 1://top quadrant
                    x = this.game.rnd.integerInRange(0 + widthBuffer, this.game.width);
                    y = this.game.rnd.integerInRange(0 + widthBuffer, this.game.height / 2 - goalRadius);
                    break;
                case 2: //right quadrant
                    x = this.game.rnd.integerInRange(this.game.width / 2 + goalRadius, this.game.width - widthBuffer);
                    y = this.game.rnd.integerInRange(0 + widthBuffer, this.game.height - widthBuffer);
                    break;
                case 3: //bottom quadrant
                    x = this.game.rnd.integerInRange(0 + widthBuffer, this.game.width);
                    y = this.game.rnd.integerInRange(this.game.height / 2 + goalRadius, this.game.height - widthBuffer);
                    break;
                default: x = y = 0;
            }//switch

            var star = stars.create(x, y, 'star');

            star.anchor.setTo(0.5, 0.5);
            star.scale.set(4, 4);
            star.inputEnabled = true;
            star.input.enableDrag();
            //star.events.onDragStart.add(startDrag, this);
            star.events.onDragStop.add(this.stopDrag, this);
            //piece.events.onInputDown.add(selectPiece, this);

            star.originalPosition = star.position.clone();
            // console.log("STAR");
            // document.write("STAR");
        }//for stars

        //DRAW GOAL CIRCLE
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xFFFF0B, 0.5);
        graphics.drawCircle(this.game.width / 2, this.game.height / 2, goalRadius);//x, y, radius
        graphics.endFill();
    },

    stopDrag: function (currentSprite)
    {
        if (this.spriteInGoal(currentSprite)) {
            currentSprite.inputEnabled = false;
            starsInGoal++;
            if (starsInGoal >= numStars)
                this.win();
        }
        else {
            currentSprite.position.copyFrom(currentSprite.originalPosition);
        }
    },//stopDrag

    spriteInGoal: function(mySprite)
    {
        var dist = goalPoint.distance(mySprite);
        if (dist <= goalRadius)
            return true;
        return false;
    },//spriteInGoal

    win: function ()
    {
        this.game.state.start('trial2', Main.Trial2);
    },

}//Main.Trial1


//TRIAL 2 SCREEN/STATE
Main.Trial2 = function (game)
{
    this.game = game;
};

Main.Trial2.prototype = {
    goalX: Number,
    kite: Phaser.Sprite,
    kiteBody: Phaser.Sprite,
    obstacles: Phaser.Group,

    preload: function ()
    {
        //this.game.load.image('kite', 'images/kite.png');
        //this.game.load.image('star', 'images/star.png');
    },

    create: function ()
    {
        this.game.add.image(0, 0, 'background');

        goalX = 850;
       
        kite = this.game.add.sprite(40, this.game.world.centerY, 'kite');
        // kite.anchor.setTo(0.5, 0.5);
        kite.anchor.setTo(0, 0.5);
        kite.scale.set(0.8, 0.8);
        //kite.scale.set(4, 4);
        kite.inputEnabled = true;
        kite.input.enableDrag();
        kite.originalPosition = kite.position.clone();
        kiteBody = this.game.add.sprite(40, this.game.world.centerY, null);//change to null for invisible
        kiteBody.anchor.setTo(-0.2, 0.65);
        kiteBody.width = 120;
        kiteBody.height = 150;
        //kiteBody.alpha = 0.2;
        
        //OBSTACLES
        obstacles = this.game.add.group();
        var obst = obstacles.create(250, 0, 'wire');
        obst.height = 300;
        obst.width = 20;
        obst = obstacles.create(250, 600, 'wire');
        obst.height = 250;
        obst.width = 20;

        obst = obstacles.create(530, 300, 'wire');
        obst.height = 220;
        obst.width = 20;

        var obst = obstacles.create(830, 0, 'wire');
        obst.height = 200;
        obst.width = 20;

        obst = obstacles.create(830, 500, 'wire');
        obst.height = 250;
        obst.width = 20;

        //DRAW GOAL Rectangle
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xFFFF0B, 0.5);
        graphics.drawRect(goalX, 0, this.game.width - goalX, this.game.height);
        graphics.endFill();
    },

    update: function ()
    {
        if(kite.input.draggable == false)
            kite.input.draggable = true;

        if (this.spriteInGoal(kite))
            this.win();
        //if hit obstacle:
        for(var i = 0; i < obstacles.children.length; i++)
        {
            if(testAABBCollision(kiteBody, obstacles.children[i]))//kite
            {
                //kiteBody.position.copyFrom(kite.originalPosition);
                kite.position.copyFrom(kite.originalPosition);
                kite.input.draggable = false;
            }
        }
        
        kiteBody.position.copyFrom(kite.position);
    },

    spriteInGoal: function (mySprite)
    {
        
        if (mySprite.position.x + mySprite.width/2 >= goalX)
            return true;
        return false;
    },//spriteInGoal

    win: function ()
    {
        this.game.state.start('trial3', Main.Trial3);
    },
    
}//Main.Trial2


//TRIAL 3 SCREEN/STATE
Main.Trial3 = function (game)
{
    this.game = game;
};

Main.Trial3.prototype = {
    tub: Phaser.Sprite,
    //kiteBody: Phaser.Sprite,
    obstacles: Phaser.Group,
    fallSpeed: Number,
    obstacleSpawnCooldown: Number,
    obstacleSpawnRateMin: Number,
    obstacleSpawnRateMax: Number,
    trialTimer: Number,
    fullTrialTime: Number,

    preload: function ()
    {
        //this.game.load.image('tub', 'images/tub.png');
    },

    create: function ()
    {
        this.game.add.image(0, 0, 'background');
        fallSpeed = 5;
        obstacleSpawnCooldown = 0;
        obstacleSpawnRateMin = 20;
        obstacleSpawnRateMax = 120;
        trialTimer = 0;
        fullTrialTime = 60 * 10;

        tub = this.game.add.sprite(this.game.world.centerX,720, 'butt');
        tub.anchor.setTo(0.5, 1);
        tub.width = 250;
        tub.height = 130;
        tub.inputEnabled = true;
        tub.input.enableDrag();
        tub.input.allowVerticalDrag = false;
        
        obstacles = this.game.add.group();
    },

    update: function ()
    {
        if (trialTimer >= fullTrialTime)
            this.win();
        this.spawnObstacles();
        obstacleSpawnCooldown--;
        //if hit obstacle:
        for (var i = 0; i < obstacles.children.length; i++) {
            obstacles.children[i].position.y += fallSpeed;
            if (obstacles.children[i].position.y - obstacles.children[i].height > this.game.height)
            {
                obstacles.children[i].destroy();//kill();
            }                
            if (testAABBCollision(tub, obstacles.children[i]))//kite
            {
                obstacles.children[i].destroy();
                //penalize the player somehow - lower score, etc
            }
        }
        //STAY IN BOUNDS
        if (tub.position.x < 0 + tub.width / 2)
            tub.position.x = 0 + tub.width / 2;
        if (tub.position.x > this.game.width - tub.width / 2)//1024
            tub.position.x = this.game.width - tub.width / 2;

        trialTimer++;
    },

    spawnObstacles: function()
    {
        if (obstacleSpawnCooldown <= 0)
        {
            var obst = obstacles.create(this.randDropX(), -100, 'obstacle');
            obst.height = 100;
            obst.width = 100;
            obstacleSpawnCooldown = this.game.rnd.integerInRange(obstacleSpawnRateMin, obstacleSpawnRateMax);//num frames, so dist is num * 4 (fall speed)
        }        
    },

    randDropX: function ()
    {
        return this.game.rnd.integerInRange(0, this.game.width - 100);
    },

    win: function()
    {
        this.game.state.start('trial4', Main.Trial4);
    },
    
}//Main.Trial3



//TRIAL 4 ISTRUCTIONS
Main.Trial4Instr = function (game)
{
    this.game = game;
};

Main.Trial4Instr.prototype = {
    text: Phaser.Text,
    tapReady: Boolean, //to make sure if their finger was already down it doesn't skip

    preload: function ()
    {
        //this.game.load.image('tub', 'images/tub.png');
    },

    create: function ()
    {
        this.game.add.image(0, 0, 'background');
        
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        var textString = "You can use candles or storm lanters during a power outage.\n\nHowever, you should keep them away from flammable materials to prevent a fire.";
        text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, textString, style);
        text.anchor.setTo(0.5, 0.5);
        text.stroke = '#000000';
        text.strokeThickness = 8;

        //style.size = 60;
        style = { font: "58px Tw Cen MT", fill: "#ffffff", align: "center" };
        var textString = "(Tap to continue)";
        var tapText = this.game.add.text(this.game.world.centerX, this.game.height - 80, textString, style);
        tapText.anchor.setTo(0.5, 0.5);
        tapText.stroke = '#000000';
        tapText.strokeThickness = 8;

        tapReady = false;
    },

    goToTrial: function ()
    {
        this.game.state.start('trial4', Main.Trial4);
    },

    update: function ()
    {
        if (this.game.input.activePointer.isDown && tapReady)
        {
            this.goToTrial();
        }
        if (this.game.input.activePointer.isDown == false && tapReady == false)
        {
            tapReady = true;
        }
    },

}//Main.Trial4Instr


//TRIAL 4 SCREEN/STATE
Main.Trial4 = function (game)
{
    this.game = game;
};

Main.Trial4.prototype = {
    started: Boolean,
    text: Phaser.Text,
    player: Phaser.Sprite,
    obstacles: Phaser.Group,
    enemySpeed: Number,
    enemyTurnRateMin: Number,
    enemyTurnRateMax: Number,
    edgeBuffer: Number,
    textBuffer: Number,
    trialTimer: Number,
    fullTrialTime: Number,
    UP: Number,
    DOWN: Number,
    LEFT: Number,
    RIGHT: Number,

    tapReady: Boolean,
    tween: Phaser.Tween,

    preload: function ()
    {
        //this.game.load.image('tub', 'images/tub.png');
    },

    create: function ()
    {
        this.game.add.image(0, 0, 'background');
        tween = null;
        tapReady = false;
        started = false;
        textBuffer = 0;//80;
        edgeBuffer = 15;
        enemySpeed = 5;
        enemyTurnRateMin = 60 * 1;
        enemyTurnRateMax = 60 * 4;
        trialTimer = 0;
        fullTrialTime = 60 * 10;//60 fps * 10 seconds
        LEFT = 0;
        RIGHT = 1;
        UP = 2;        
        DOWN = 3;

        player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'butt');
        player.anchor.setTo(0.5, 0.5);
        player.width = 130;
        player.height = 130;
        //player.inputEnabled = true;
        //player.input.enableDrag();

        obstacles = this.game.add.group();
        var obst = obstacles.create(250, 150, 'obst');
        obst.height = obst.width = 100;
        obst.direction = this.randDirection();
        obst.turnCooldown = this.getTurnRate();

        obst = obstacles.create(250, this.game.height - 150, 'obst');
        obst.height = obst.width = 100;
        obst.direction = this.randDirection();
        obst.turnCooldown = this.getTurnRate();

        obst = obstacles.create(this.game.width - 250, 150, 'obst');
        obst.height = obst.width = 100;
        obst.direction = this.randDirection();
        obst.turnCooldown = this.getTurnRate();

        obst = obstacles.create(this.game.width - 250, this.game.height - 150, 'obst');
        obst.height = obst.width = 100;
        obst.direction = this.randDirection();
        obst.turnCooldown = this.getTurnRate();
        //console.log("obst.direction: " + obst.direction);
        //console.log("obst.turnCooldown: " + obst.turnCooldown);
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        var textString = "Keep the candle away from the flammable materials!";
        text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, textString, style);
        //var text = this.game.add.text(this.game.world.centerX, this.game.world.centerX, "Keep the candle away from the flammable materials!");
        text.anchor.setTo(0.5, 0.5);
        text.stroke = '#000000';
        text.strokeThickness = 8;
        //text.font = 'Oswald';
        //text.font = 'Roboto Condensed';
        /*text.font = 'Tw Cen MT';
        text.fill = '#ffffff';
        text.fontSize = 60;
        text.align = 'center';
        text.stroke = '#000000';
        text.strokeThickness = 6;*/
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },

    startGame: function ()
    {
        text.destroy();
        player.inputEnabled = true;
        player.input.enableDrag();
        started = true;
    },

    update: function ()
    {
        if (started == false)
        {
        }
        else if (started && trialTimer < fullTrialTime)
        {
            //if (trialTimer >= fullTrialTime)//WIN
                //this.win();

            for (var i = 0; i < obstacles.children.length; i++) {
                //move in direction you were going: .direction = 0,1,2,3 - left,right,up,down
                //if time to turn, turn
                //if you hit a wall, bounce
                var enemy = obstacles.children[i];
                if (enemy.turnCooldown <= 0) {
                    //enemy.direction = this.randDirection();
                    if (enemy.direction == LEFT || enemy.direction == RIGHT)
                        enemy.direction = this.upOrDown();
                    else
                        enemy.direction = this.rightOrLeft();
                    enemy.turnCooldown = this.getTurnRate();
                }
                switch (enemy.direction) {
                    case LEFT: enemy.position.x -= enemySpeed;
                        break;
                    case UP: enemy.position.y -= enemySpeed;
                        break;
                    case RIGHT: enemy.position.x += enemySpeed;
                        break;
                    case DOWN: enemy.position.y += enemySpeed;
                        break;
                    default: enemy.position.x += enemySpeed;
                }//switch
                enemy.turnCooldown--;
                //console.log("enemy.turnCooldown: " + enemy.turnCooldown);

                if (spriteLeft(enemy) <= edgeBuffer) {
                    if (enemy.direction == LEFT)
                        enemy.direction = RIGHT;
                }
                if (spriteRight(enemy) >= this.game.width - edgeBuffer) {
                    if (enemy.direction == RIGHT)
                        enemy.direction = LEFT;
                }
                if (spriteBottom(enemy) <= textBuffer)//edgeBuffer)
                {
                    if (enemy.direction == UP)
                        enemy.direction = DOWN;
                }
                if (spriteTop(enemy) >= this.game.height - edgeBuffer) {
                    if (enemy.direction == DOWN)
                        enemy.direction = UP;
                }
                /*
                if (testAABBCollision(player, enemy))
                {
                    //enemy.destroy();
                    //penalize the player somehow - lower score, etc
                }*/
            }
            //STAY IN BOUNDS
            if (player.position.x < player.width / 2)
                player.position.x = player.width / 2;
            if (player.position.x > this.game.width - player.width / 2)
                player.position.x = this.game.width - player.width / 2;
            if (player.position.y < player.height / 2 + textBuffer)
                player.position.y = player.height / 2 + textBuffer;
            if (player.position.y > this.game.height - player.height / 2)
                player.position.y = this.game.height - player.height / 2;

            trialTimer++;
        }
        else
        {
            if (tween == null)
            {
                this.win();
                player.inputEnabled = false;
            }
                
            //AFTER POPUP, ADVANCE
            if (tween != null && tween.isRunning == false) {
                //tween has completed
                if (this.game.input.activePointer.isDown && tapReady) {
                    this.goToTrial();
                }
                if (this.game.input.activePointer.isDown == false && tapReady == false) {
                    tapReady = true;
                }
            }//if tween
        }
        
    },
    
    randDirection: function ()
    {
        return this.game.rnd.integerInRange(0, 3);
    },

    upOrDown: function ()//2 or 3
    {
        return this.game.rnd.integerInRange(2, 3);
    },

    rightOrLeft: function ()//0 or 1
    {
        return this.game.rnd.integerInRange(0, 1);
    },

    getTurnRate: function ()
    {
        return this.game.rnd.integerInRange(enemyTurnRateMin, enemyTurnRateMax);
    },

    win: function ()
    {
        //this.game.state.start('trial1', Main.Trial1);
        var popup = this.game.add.sprite(this.game.world.centerX, this.game.height + 200, 'butt');
        popup.height = popup.width = 400;
        popup.anchor.setTo(0.5, 0.5);
        tween = this.game.add.tween(popup.position).to({ y: this.game.world.centerY }, 1000, Phaser.Easing.Elastic.Out, true);
    },

    goToTrial: function ()
    {
        this.game.state.start('trial5', Main.Trial5);
    },

}//Main.Trial4

//TRIAL 5 SCREEN/STATE
Main.Trial5 = function (game)
{
    this.game = game;
};

Main.Trial5.prototype = {
    ladder: Phaser.Sprite,
    powerLine: Phaser.Sprite,
    distance: Number,
    text: Phaser.Text,
    

    preload: function ()
    {
        //this.game.load.image('ladder', 'images/ladder.png');
        //this.game.load.image('powerLine', 'images/powerLine.png');
    },

    create: function ()
    {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Move the ladder away from the power line.", style);

        //ladder
        ladder = this.game.add.sprite(250, 575, 'ladder');
        ladder.anchor.setTo(0, .5);
        ladder.height = 450;
        ladder.width = 50;
        ladder.angle = -25;
        ladder.inputEnabled = true;
        ladder.input.enableDrag();
        ladder.input.allowVerticalDrag = false;

        //power line
        powerLine = this.game.add.sprite(50, 468, 'powerLine');
        powerLine.anchor.setTo(0, 0.5);
        powerLine.width = 100;
        powerLine.height = 600;

    },

    update: function ()
    {
        distance = ladder.x - powerLine.x;
        if (distance >= 700) {
            ladder.inputEnabled = false;
            this.win();
        }
    },

    win: function()
    {
        this.game.state.start('trial6', Main.Trial6);
    },

}//Main.Trial5

//TRIAL 6 SCREEN/STATE
Main.Trial6 = function (game) {
    this.game = game;
};

Main.Trial6.prototype = {
    text: Phaser.Text,
    dog: Phaser.Sprite,
    bird: Phaser.Sprite,
    snake: Phaser.Sprite,

    preload: function () {
        //this.game.load.image('dog', 'images/dog.png');
        //this.game.load.image('bird', 'images/bird.png');
        //this.game.load.image('snake', 'images/snake.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Which animal does a gas leak sound most like?", style);

        //dog
        dog = this.game.add.sprite(this.game.world.width / 4, this.game.world.centerY, 'dog');
        dog.anchor.setTo(0.5, 0.5);
        dog.width = 75;
        dog.height = 75;
        dog.inputEnabled = true;
        dog.events.onInputDown.add(this.click, this);

        //bird
        bird = this.game.add.sprite(this.game.world.width * 2 / 4, this.game.world.centerY, 'bird');
        bird.anchor.setTo(0.5, 0.5);
        bird.width = 75;
        bird.height = 75;
        bird.inputEnabled = true;
        bird.events.onInputDown.add(this.click, this);

        //snake
        snake = this.game.add.sprite(this.game.world.width * 3 / 4, this.game.world.centerY, 'snake');
        snake.anchor.setTo(0.5, 0.5);
        snake.width = 75;
        snake.height = 75;
        snake.inputEnabled = true;
        snake.events.onInputDown.add(this.click, this);
        
    },

    update: function () {

    },

    click: function(clickedSprite) {
        if (clickedSprite == snake) {
            this.win();
        } else {
            this.lose();
        }
    },

    win: function () {
        this.game.state.start('trial7', Main.Trial7);
    },

    lose: function () {
        //this.game.state.start('trial7', Main.Trial7);
    },

}//Main.Trial6

//TRIAL 7 SCREEN/STATE
Main.Trial7 = function (game) {
    this.game = game;
};

Main.Trial7.prototype = {
    text: Phaser.Text,
    devices: Phaser.Group,

    preload: function () {
        
        this.game.load.image('open', 'images/open.png');
        this.game.load.image('close', 'images/close.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "The power's out, close all the refrigerators and freezers!", style);

        devices = this.game.add.group();

        //add openned devices
        for (var i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    x = this.game.world.width / 3;
                    y = this.game.world.height / 3;
                    break;
                case 1:
                    x = this.game.world.width * 2 / 3;
                    y = this.game.world.height / 3;
                    break;
                case 2:
                    x = this.game.world.width * 2 / 3;
                    y = this.game.world.height * 2 / 3;
                    break;
                case 3:
                    x = this.game.world.width / 3;
                    y = this.game.world.height * 2 / 3;
                    break;
                default: x = y = 0;
            }//switch
            var openRefrigerator = devices.create(x, y, 'open');
            openRefrigerator.width = 75;
            openRefrigerator.height = 75;
            openRefrigerator.inputEnabled = true;
            openRefrigerator.events.onInputDown.add(this.click, this);

        }
    },

    update: function () {
        var count = 0;
        for (var i = 0; i < devices.children.length; i ++) 
        {
            if (devices.children[i].key == 'close') {
                count++;
            }
        }
        if (count == devices.children.length) {
            this.win();
        }
    },

    click: function (clickedSprite) {
        clickedSprite.loadTexture('close');
        clickedSprite.inputEnabled = false;
    },

    win: function () {
        this.game.state.start('trial8', Main.Trial8);
    },

}//Main.Trial7

//TRIAL 8 SCREEN/STATE
Main.Trial8 = function (game) {
    this.game = game;
};

Main.Trial8.prototype = {
    text: Phaser.Text,
    devices: Phaser.Group,

    preload: function () {

        this.game.load.image('open', 'images/open.png');
        this.game.load.image('close', 'images/close.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "The power's out, turn off all major appliances!", style);

        devices = this.game.add.group();

        //add openned devices
        for (var i = 0; i < 6; i++) {
            switch (i) {
                case 0:
                    x = this.game.world.width / 4;
                    y = this.game.world.height / 3;
                    break;
                case 1:
                    x = this.game.world.width * 2 / 4;
                    y = this.game.world.height / 3;
                    break;
                case 2:
                    x = this.game.world.width * 3 / 4;
                    y = this.game.world.height  / 3;
                    break;
                case 3:
                    x = this.game.world.width * 3 / 4;
                    y = this.game.world.height * 2 / 4;
                    break;
                case 4:
                    x = this.game.world.width * 2 / 4;
                    y = this.game.world.height * 2 / 4;
                    break;
                case 5:
                    x = this.game.world.width / 4;
                    y = this.game.world.height * 2 / 4;
                    break;
                default: x = y = 0;
            }//switch
            var device = devices.create(x, y, 'open');
            device.width = 75;
            device.height = 75;
            device.inputEnabled = true;
            device.events.onInputDown.add(this.click, this);
        }

    },

    update: function () {
        var count = 0;
        for (var i = 0; i < devices.children.length; i++) {
            if (devices.children[i].key == 'close') {
                count++;
            }
        }
        if (count == devices.children.length) {
            this.win();
        }
    },

    click: function (clickedSprite) {
        clickedSprite.loadTexture('close');
        clickedSprite.inputEnabled = false;
    },

    win: function () {
        this.game.state.start('trial9', Main.Trial9);
    },

}//Main.Trial8

//TRIAL 9 SCREEN/STATE
Main.Trial9 = function (game) {
    this.game = game;
};

Main.Trial9.prototype = {
    text: Phaser.Text,
    eyes: Phaser.Sprite,
    nose: Phaser.Sprite,
    ear: Phaser.Sprite,

    preload: function () {
        //this.game.load.image('eyes', 'images/eyes.png');
        //this.game.load.image('nose', 'images/nose.png');
        //this.game.load.image('ear', 'images/ear.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Which is your best natural gas detector?", style);

        //eyes
        eyes = this.game.add.sprite(this.game.world.width / 4, this.game.world.centerY, 'eyes');
        eyes.anchor.setTo(0.5, 0.5);
        eyes.width = 75;
        eyes.height = 75;
        eyes.inputEnabled = true;
        eyes.events.onInputDown.add(this.click, this);

        //nose
        nose = this.game.add.sprite(this.game.world.width * 2 / 4, this.game.world.centerY, 'nose');
        nose.anchor.setTo(0.5, 0.5);
        nose.width = 75;
        nose.height = 75;
        nose.inputEnabled = true;
        nose.events.onInputDown.add(this.click, this);

        //ear
        ear = this.game.add.sprite(this.game.world.width * 3 / 4, this.game.world.centerY, 'ear');
        ear.anchor.setTo(0.5, 0.5);
        ear.width = 75;
        ear.height = 75;
        ear.inputEnabled = true;
        ear.events.onInputDown.add(this.click, this);

    },

    update: function () {

    },

    click: function (clickedSprite) {
        if (clickedSprite == nose) {
            this.win();
        } else {
            this.lose();
        }
    },

    win: function () {
        this.game.state.start('trial10', Main.Trial10);
    },

    lose: function () {
        //this.game.state.start('trial10', Main.Trial10);
    },

}//Main.Trial9

//TRIAL 10 SCREEN/STATE
Main.Trial10 = function (game) {
    this.game = game;
};

Main.Trial10.prototype = {
    text: Phaser.Text,
    normal: Phaser.Sprite,
    overloaded: Phaser.Sprite,
    frayed: Phaser.Sprite,

    preload: function () {
        //this.game.load.image('normal', 'images/normal.png');
        //this.game.load.image('overloaded', 'images/overloaded.png');
        //this.game.load.image('frayed', 'images/frayed.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Which of these outlets is the safest?", style);

        //normal
        normal = this.game.add.sprite(this.game.world.width / 4, this.game.world.centerY, 'normal');
        normal.anchor.setTo(0.5, 0.5);
        normal.width = 75;
        normal.height = 75;
        normal.inputEnabled = true;
        normal.events.onInputDown.add(this.click, this);

        //overloaded
        overloaded = this.game.add.sprite(this.game.world.width * 2 / 4, this.game.world.centerY, 'overloaded');
        overloaded.anchor.setTo(0.5, 0.5);
        overloaded.width = 75;
        overloaded.height = 75;
        overloaded.inputEnabled = true;
        overloaded.events.onInputDown.add(this.click, this);

        //frayed
        frayed = this.game.add.sprite(this.game.world.width * 3 / 4, this.game.world.centerY, 'frayed');
        frayed.anchor.setTo(0.5, 0.5);
        frayed.width = 75;
        frayed.height = 75;
        frayed.inputEnabled = true;
        frayed.events.onInputDown.add(this.click, this);

    },

    update: function () {

    },

    click: function (clickedSprite) {
        if (clickedSprite == normal) {
            this.win();
        } else {
            this.lose();
        }
        
    },

    win: function () {
        this.game.state.start('trial11', Main.Trial11);
    },

    lose: function () {
        //this.game.state.start('trial1', Main.Trial1);
    },

}//Main.Trial10

//TRIAL 11 SCREEN/STATE
Main.Trial11 = function (game) {
    this.game = game;
};

Main.Trial11.prototype = {
    text: Phaser.Text,
    flower: Phaser.Sprite,
    rottenEggs: Phaser.Sprite,
    milk: Phaser.Sprite,

    preload: function () {
        //this.game.load.image('flower', 'images/flower.png');
        //this.game.load.image('rottenEggs', 'images/rottenEggs.png');
        //this.game.load.image('milk', 'images/milk.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Which of these outlets is the safest?", style);

        //flower
        flower = this.game.add.sprite(this.game.world.width / 4, this.game.world.centerY, 'flower');
        flower.anchor.setTo(0.5, 0.5);
        flower.width = 75;
        flower.height = 75;
        flower.inputEnabled = true;
        flower.events.onInputDown.add(this.click, this);

        //rottenEggs
        rottenEggs = this.game.add.sprite(this.game.world.width * 2 / 4, this.game.world.centerY, 'rottenEggs');
        rottenEggs.anchor.setTo(0.5, 0.5);
        rottenEggs.width = 75;
        rottenEggs.height = 75;
        rottenEggs.inputEnabled = true;
        rottenEggs.events.onInputDown.add(this.click, this);

        //milk
        milk = this.game.add.sprite(this.game.world.width * 3 / 4, this.game.world.centerY, 'milk');
        milk.anchor.setTo(0.5, 0.5);
        milk.width = 75;
        milk.height = 75;
        milk.inputEnabled = true;
        milk.events.onInputDown.add(this.click, this);

    },

    update: function () {

    },

    click: function (clickedSprite) {
        if (clickedSprite == flower) {
            this.win();
        } else {
            this.lose();
        }

    },

    win: function () {
        this.game.state.start('trial12', Main.Trial12);
    },

    lose: function () {
        //this.game.state.start('trial12', Main.Trial12);
    },

}//Main.Trial11

//TRIAL 12 SCREEN/STATE
Main.Trial12 = function (game) {
    this.game = game;
};

Main.Trial12.prototype = {
    plug: Phaser.Sprite,
    cord: Phaser.Sprite,
    hand: Phaser.Sprite,
    text: Phaser.Text,


    preload: function () {
        //this.game.load.image('plug', 'images/plug.png');
        //this.game.load.image('cord', 'images/cord.png');
        //this.game.load.image('hand', 'images/hand.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Guide the hand to pull the plug in the right spot", style);

        //hand
        hand = this.game.add.sprite(this.game.world.width / 3, this.game.world.height / 3, 'hand');
        hand.height = 50;
        hand.width = 125;
        hand.anchor.setTo(0.5, 0.5);
        hand.inputEnabled = true;
        hand.input.enableDrag();

        //cord
        cord = this.game.add.sprite(0, this.game.world.height * 2 / 3, 'cord');
        cord.width = 900;
        cord.height = 25;
        hand.anchor.setTo(0, 0);

        //plug
        plug = this.game.add.sprite(0, 0, 'plug');
        plug.width = 50;
        plug.height = 75;
        plug.anchor.setTo(1, 0.5);
        plug.x = cord.width + plug.width / 2;
        plug.y = cord.y + plug.height/6;



    },

    update: function () {
        //don't let hand go below cord
        if (hand.y > cord.y - hand.height) {
            hand.y = cord.y - hand.height;
        }

        //STAY IN BOUNDS
        if (hand.position.x < 0)
            hand.position.x = 0;
        if (hand.position.x > this.game.width - hand.width)//1024
            hand.position.x = this.game.width - hand.width;

        //check to see if plug is touched
        if (hand.position.x >= plug.x - plug.width - hand.width && hand.position.x <= plug.x + plug.width + hand.width)
        {
            if (hand.y + hand.height/4 >= plug.y - plug.height) 
            {
                this.win();
            }
        }
            
     
    },

    win: function () {
        this.game.state.start('trial13', Main.Trial13);
    },

}//Main.Trial12

//TRIAL 13 SCREEN/STATE
Main.Trial13 = function (game) {
    this.game = game;
};

Main.Trial13.prototype = {
    cord: Phaser.Sprite,
    furnitures: Phaser.group,
    distance: Number,
    text: Phaser.Text,


    preload: function () {
        //this.game.load.image('cord', 'images/cord.png');
        //this.game.load.image('furniture', 'images/furniture.png');
    },

    create: function () {
        this.game.add.image(0, 0, 'background');

        //cord
        cord = this.game.add.sprite(this.game.world.centerX, 0, 'cord');
        cord.height = this.game.height;
        cord.width = 25;

        //text
        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(25, 25, "Move the furniture away from the cord", style);

        //add furniture
        furnitures = this.game.add.group();
        var x, y, width, height;

        for (var i = 0; i < 5; i++) {
            switch (i) {
                case 0:
                    width = 75;
                    height = 50;
                    x = this.game.world.centerX - width;
                    y = this.game.world.height / 3;                
                    break;
                case 1:
                    width = 125;
                    height = 75;
                    x = this.game.world.centerX + width;
                    y = this.game.world.height / 3;                    
                    break;
                case 2:
                    width = 50;
                    height = 125;
                    x = this.game.world.centerX + width;
                    y = this.game.world.centerY;                    
                    break;
                case 3:
                    width = 75;
                    height = 75;
                    x = this.game.world.centerX - width;
                    y = this.game.world.height * 2 / 3;                    
                    break;
                case 4:
                    width = 125;
                    height = 125;
                    x = this.game.world.centerX + width;
                    y = this.game.world.width * 1.75 / 3;                    
                    break;
                default:
                    x = y = 0;
            }
            var furniture = furnitures.create(x, y, 'furniture');
            furniture.anchor.setTo(0.5, 0.5);
            furniture.height = height;
            furniture.width = width;
            furniture.inputEnabled = true;
            furniture.input.enableDrag();
        }

    },

    update: function () {
        var count = 0;
        for (var i = 0; i < furnitures.children.length; i++) {
            if (Math.abs(furnitures.children[i].x - cord.x) >= this.game.world.width / 3.5) {
                count++;
            }
        }
        if (count == furnitures.children.length) {
            this.win();
        }
    },

    win: function () {
        this.game.state.start('trial1', Main.Trial1);
    },

}//Main.Trial13
