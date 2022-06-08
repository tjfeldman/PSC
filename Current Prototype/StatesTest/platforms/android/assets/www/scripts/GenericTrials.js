Main.SelectCorrect = function (game) {
    this.game = game;
}

Main.SelectCorrect.prototype = {
    choice1: Phaser.Sprite,
    choice2: Phaser.Sprite,
    choice3: Phaser.Sprite,

    image1: String,
    image2: String,
    image3: String,
    winImage: String,

    doWin: Boolean,
    doLose: Boolean,

    create: function () {
        createMiniGame();
        doWin = false;
        doLose = false;

        this.setImages();

        var positions = [this.game.world.width / 4, this.game.world.width * 2 / 4, this.game.world.width * 3 / 4];
        
        var index = this.game.rnd.integerInRange(0, positions.length-1);
        var x = positions.splice(index, 1);

        choice1 = this.game.add.sprite(x[0], this.game.world.centerY, image1);
        choice1.anchor.setTo(0.5, 0.5);
        choice1.inputEnabled = true;
        choice1.events.onInputDown.add(this.click, this);

        index = this.game.rnd.integerInRange(0, positions.length-1);
        x = positions.splice(index, 1);

        choice2 = this.game.add.sprite(x[0], this.game.world.centerY, image2);
        choice2.anchor.setTo(0.5, 0.5);
        choice2.inputEnabled = true;
        choice2.events.onInputDown.add(this.click, this);

        choice3 = this.game.add.sprite(positions[0], this.game.world.centerY, image3);
        choice3.anchor.setTo(0.5, 0.5);
        choice3.inputEnabled = true;
        choice3.events.onInputDown.add(this.click, this);

        makeTrialText(true);
        this.setText();
        flyInText(trialText);

        setTimer();
    },

    //override if different lose screen
    update: function ()
    {
        globalUpdate();
        if (trialOver == false)
        {
            if (doWin)
                win();
            else if (doLose || timeUp)
                this.lose();
        }
    },

    //set the name of the images to be used.
    //Image1, Image2, Image3
    setImages: function()
    {
        //to be overridden
    },

    setText: function()
    {
       //to be overridden  
    },
    
    click: function (clickedSprite) {
        if (clickedSprite.key == winImage) {
            doWin = true;
        } else {
            doLose = true;
        }
    },

    lose: function () {
        //override if different
        loseNeutral();
    },

}//Main.SelectCorrect.prototype

Main.Avoider = function (game) {
    this.game = game;
}

Main.Avoider.prototype = {
    player: Phaser.Sprite,
    playerHitBox: Phaser.Sprite,
    obstacles: Phaser.Group,
    enemyTurnRateMin: Number,
    enemyTurnRateMax: Number,
    edgeBuffer: Number,
    heartBuffer: Number,
    usesEmitter: Boolean,
    emitterPositionOffset: Phaser.Point,
    emitter: Phaser.Particles.Arcade.Emitter,

    UP: Number,
    DOWN: Number,
    LEFT: Number,
    RIGHT: Number,

    obstaclesList: Array,
    obstacleSpeed: Array,

    create: function () {
        createMiniGame();
        
        heartBuffer = 0;//100
        edgeBuffer = 15;
        enemyTurnRateMin = 60 * 1;
        enemyTurnRateMax = 60 * 4;
        usesEmitter = false;
        emitterPositionOffset = new Phaser.Point();

        LEFT = 0;
        RIGHT = 1;
        UP = 2;
        DOWN = 3;

        this.setPlayer();
        this.setObstacles();
        this.setEmitter();

        obstacles = this.game.add.group();
        var x = [250, 250, this.game.width - 250, this.game.width - 250];
        var y = [150, this.game.height - 150, 150, this.game.height - 150];

        for (var i = 0; i < obstaclesList.length; i++) {
            var obst = obstacles.create(x[i], y[i], obstaclesList[i]);
            obst.anchor.setTo(0.5, 0.5);
            obst.direction = this.randDirection();
            obst.turnCooldown = this.getTurnRate();
            obst.speed = obstacleSpeed[i];
        }

        makeTrialText();
        this.setText();
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);

        setUpHearts();
    },

    startGame: function () {
        trialText.destroy();
        player.inputEnabled = true;
        player.input.enableDrag();
        started = true;
        setTimer();
    },

    update: function () {
        globalUpdate();

        playerHitBox.position = player.position;

        if (started && trialOver == false) {

            if (timeUp) {
                win();
            }

            for (var i = 0; i < obstacles.children.length; i++) {
                //move in direction you were going: .direction = 0,1,2,3 - left,right,up,down
                //if time to turn, turn
                //if you hit a wall, bounce
                var enemy = obstacles.children[i];
                if (testAABBCollision(enemy, playerHitBox) && !immune) {
                    this.hitObstacle();
                }
                if (enemy.turnCooldown <= 0) {
                    //enemy.direction = this.randDirection();
                    if (enemy.direction == LEFT || enemy.direction == RIGHT)
                        enemy.direction = this.upOrDown();
                    else
                        enemy.direction = this.rightOrLeft();
                    enemy.turnCooldown = this.getTurnRate();
                }
                switch (enemy.direction) {
                    case LEFT: enemy.position.x -= enemy.speed;
                        break;
                    case UP: enemy.position.y -= enemy.speed;
                        break;
                    case RIGHT: enemy.position.x += enemy.speed;
                        break;
                    case DOWN: enemy.position.y += enemy.speed;
                        break;
                    default: enemy.position.x += enemy.speed;
                }//switch
                enemy.turnCooldown--;
                if (spriteLeft(enemy) <= edgeBuffer) {
                    if (enemy.direction == LEFT)
                        enemy.direction = RIGHT;
                }
                if (spriteRight(enemy) >= this.game.width - edgeBuffer) {
                    if (enemy.direction == RIGHT)
                        enemy.direction = LEFT;
                }
                if (spriteBottom(enemy) <= heartBuffer)//edgeBuffer)
                {
                    if (enemy.direction == UP)
                        enemy.direction = DOWN;
                }
                if (spriteTop(enemy) >= this.game.height - edgeBuffer) {
                    if (enemy.direction == DOWN)
                        enemy.direction = UP;
                }
            }
            //STAY IN BOUNDS
            keepSpriteOnScreen(player);

            updateHearts();
            checkImmunity(player);
            if (lives <= 0)
                this.lose();
        }

        if (trialOver && player.inputEnabled)
            player.inputEnabled = false;

        //text.text = "Lives = " + lives;
    },

    hitObstacle: function () {
        lives--;
        setImmunity();
        if (usesEmitter)//typeof emitter != 'undefined' && emitter != null)
        {
            emitter.x = player.position.x + emitterPositionOffset.x;
            emitter.y = player.position.y + emitterPositionOffset.y;
            emitter.start(true, 2000, null, 8);
        }
    },

    randDirection: function () {
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

    getTurnRate: function () {
        return this.game.rnd.integerInRange(enemyTurnRateMin, enemyTurnRateMax);
    },

    setPlayer: function () {
        //to be overridden
    },

    setObstacles: function () {
        //to be overridden
    },

    setEmitter: function ()
    {
        //to be overridden
    },

    setText: function () {
        //to be overridden
    },

    lose: function()//override if different lose
    {
        loseNeutral();
    },
}//Main.Avoider.prototype

Main.ClickAll = function (game) {
    this.game = game;
}

Main.ClickAll.prototype = {
    appliances: Phaser.Group,
    appliancesOnList: Array,
    appliancesOffList: Array,

    current: Number,

    create: function () {
        createMiniGame();

        appliances = this.game.add.group();
        current = 0;

        var x = [this.game.width / 4, this.game.width * 3 / 4, this.game.width / 4, this.game.width * 3 / 4, this.game.width / 2, this.game.width / 2];
        var y = [this.game.height / 3 - 10, this.game.height / 3 - 10, this.game.height * 2 / 3 + 10, this.game.height * 2 / 3 + 10, this.game.height / 3 - 10, this.game.height * 2 / 3 + 10];
        this.setAppliances();

        if (appliancesOnList.length <= 4) {
            x.pop();
            x.pop();
            y.pop();
            y.pop();
        }

        for (var i = 0; i < appliancesOnList.length; i++) {
            var pos = this.game.rnd.integerInRange(0, x.length - 1);

            var appliance = appliances.create(x[pos], y[pos], appliancesOnList[i]);
            appliance.anchor.setTo(0.5, 0.5);
            appliance.alpha = 0;
            appliance.inputEnabled = false;
            appliance.offSprite = appliancesOffList[i];

            x.splice(pos, 1);
            y.splice(pos, 1);
        }
        //text
        makeTrialText();
        this.setText();
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);

    },

    startGame: function () {
        trialText.destroy();

        this.enableNextAppliance();

        started = true;
        
        setTimer();
    },

    update: function () {
        globalUpdate();
        var count = 0;
        if (current == appliances.children.length && !trialOver)
            win();
        if (timeUp && !trialOver)
            this.lose();
    },

    enableNextAppliance: function () {
        var app = appliances.children[current];
        var popIn = this.game.add.tween(app).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
        app.inputEnabled = true;
        app.events.onInputDown.add(this.click, this);

    },

    click: function (clickedSprite) {
        if (clickedSprite.alpha == 1) {
            clickedSprite.alpha = 0.75;
            clickedSprite.inputEnabled = false;
            clickedSprite.loadTexture(clickedSprite.offSprite);
            current++;
            if (current < appliances.children.length) { this.enableNextAppliance(); }
        }
    },

    setAppliances: function () {
        //to be overridden
    },

    setText: function() {
        //to be overridden
    },

    lose: function () {
        //override if different
        loseNeutral();
    },
}//Main.ClickAll.prototype

Main.Collect = function (game) {
    this.game = game;
}

Main.Collect.prototype = {
    items: Phaser.Group,
    goal: Phaser.Sprite,
    itemsInGoal: Number,

    collectionObjectsArray: Array,
    wrongObjectsArray: Array,

    failures: Number,

    create: function () {
        createMiniGame();
        itemsInGoal = 0;
        
        this.setObjectsToGather();
        this.setGoalType();

        items = this.game.add.group();
        var widthBuffer = 150;
        var x;
        var y;
        var quadrant = 0;
        var quadsChecked = 0;

        for (var i = 0; i < collectionObjectsArray.length + wrongObjectsArray.length; i++) {
            quadrant++; //cycle throuh quadrants to get nice spacing
            if (quadrant > 3) quadrant = 0;

            failures = 0;

            switch (quadrant) {
                case 0: //left quadrant
                    do {
                        x = this.game.rnd.integerInRange(0 + widthBuffer / 2, this.game.width / 2 - (goal.width / 2 + widthBuffer / 2));
                        y = this.game.rnd.integerInRange(0 + widthBuffer / 2, this.game.height - widthBuffer / 2);
                    } while (this.checkPos(x, y, i) && failures < 100);
                    break;
                case 1://top quadrant
                    do {
                        x = this.game.rnd.integerInRange(0 + widthBuffer / 2, this.game.width - widthBuffer / 2);
                        y = this.game.rnd.integerInRange(0 + widthBuffer / 2, this.game.height / 2 - (goal.height / 2 + widthBuffer / 2));
                    } while (this.checkPos(x, y, i) && failures < 100);
                    break;
                case 2: //right quadrant
                    do {
                        x = this.game.rnd.integerInRange(this.game.width / 2 + (goal.width / 2 + widthBuffer / 2), this.game.width - widthBuffer / 2);
                        y = this.game.rnd.integerInRange(0 + widthBuffer / 2, this.game.height - widthBuffer / 2);
                    } while (this.checkPos(x, y, i) && failures < 100);
                    break;
                case 3: //bottom quadrant
                    do {
                        x = this.game.rnd.integerInRange(0 + widthBuffer / 2, this.game.width - widthBuffer / 2);
                        y = this.game.rnd.integerInRange(this.game.height / 2 + (goal.height / 2 + widthBuffer / 2), this.game.height - widthBuffer / 2);
                    } while (this.checkPos(x, y, i) && failures < 100);
                    break;
                default: x = y = 0;
            }//switch

            if (quadsChecked == 4 && failures == 100) {
                i = 0;
                quadrant = 0;
                while (collectionObjectsArray.length > 0) {
                    collectionObjectsArray.children[0].destroy();
                }

                while (wrongObjectsArray.length > 0) {
                    wrongObjectsArray.children[0].destroy();
                }
                continue;
            }
            if (failures == 100) {
                i--;
                quadsChecked++;
                continue;
            }

            quadsChecked = 0;

            if (i < collectionObjectsArray.length) {
                var item = items.create(x, y, collectionObjectsArray[i]);
                item.anchor.setTo(0.5, 0.5);
                item.originalPosition = item.position.clone();
                item.collection = true;
            } else {
                var item = items.create(x, y, wrongObjectsArray[i-collectionObjectsArray.length]);
                item.anchor.setTo(0.5, 0.5);
                item.originalPosition = item.position.clone();
                item.collection = false;
            }
        }//for items

        makeTrialText();
        this.setText();
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },

    startGame: function () {
        trialText.destroy();
        for (var i = 0; i < items.children.length; i++) {
            items.children[i].inputEnabled = true;
            items.children[i].input.enableDrag();
            items.children[i].events.onDragStart.add(this.startDrag, this);
            items.children[i].events.onDragStop.add(this.stopDrag, this);
        }
        started = true;
        setTimer();
    },

    update: function () {
        globalUpdate();
        if (itemsInGoal >= collectionObjectsArray.length && !trialOver)
            win();
        if (timeUp && !trialOver)
            this.lose();
        if (trialOver) {
            for (var i = 0; i < items.children.length; i++) {
                items.children[i].inputEnabled = false;
            }
        }
    },

    checkPos: function (x, y, count) {
        var overlap = false;
        for (var i = 0; i < count; i++) {
            var item = items.children[i];
            if (x > item.x - 150 && x < item.x + 150) {
                if (y > item.y - 150 && y < item.y + 150) {
                    overlap = true;
                    failures++;
                    break;
                }
            }
        }
        return overlap;
    },

    startDrag: function (currentSprite) {
        currentSprite.bringToTop();
    },

    stopDrag: function (currentSprite) {
        if (currentSprite.collection && testAABBCollision(currentSprite, goal)) {
            currentSprite.inputEnabled = false;
            itemsInGoal++;
            addCheckMarkTo(currentSprite);
        }
        else {
            currentSprite.position.copyFrom(currentSprite.originalPosition);
        }
    },//stopDrag

    setObjectsToGather: function () {
        //to be overridden
    },

    setGoalType: function () {
        //to be overridden
    },

    setText: function() {
        //to be overridden
    },

    lose: function () {
        //override if different
        loseNeutral();
    },
}//Main.Collect.prototype

Main.FallingObjects = function (game) {
    this.game = game;
}

Main.FallingObjects.prototype = {
    collector: Phaser.Sprite,
    obstacles: Phaser.Group,
    fallSpeed: Number,
    obstacleSpawnCooldown: Number,
    obstacleSpawnRate: Number,
    obstacleSpawnRateDecrease: Number,
    obstalceSpawnRateMin: Number,
    usesEmitter: Boolean,
    emitterPositionOffset: Phaser.Point,
    emitter: Phaser.Particles.Arcade.Emitter,

    applianceStringArray: Array,
    textString: String,
    avoid: Boolean,

    create: function ()
    {
        createMiniGame();
        fallSpeed = 5;
        obstacleSpawnCooldown = 0;
        obstacleSpawnRate = 90;//75
        obstacleSpawnRateDecrease = 10;
        obstacleSpawnRateMin = 30;
        usesEmitter = false;
        emitterPositionOffset = new Phaser.Point();

        this.setObjects();
        obstacles = this.game.add.group();
        collector.gameStart = false;
        this.setEmitter();

        makeTrialText();
        setTrialTextString(textString);
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
        setUpHearts();
    },

    startGame: function () {
        trialText.destroy();
        collector.inputEnabled = true;
        collector.input.enableDrag();
        collector.input.allowVerticalDrag = false;
        collector.gameStart = true;
        started = true;
        setTimer();
    },

    update: function () {
        globalUpdate();
        if (trialOver == false) {
            if (timeUp) {
                win();
            }
            else if (started) {
                this.spawnObstacles();
                obstacleSpawnCooldown--;
                //if hit obstacle:
                for (var i = 0; i < obstacles.children.length; i++) {
                    obstacles.children[i].position.y += fallSpeed;
                    if (obstacles.children[i].position.y - obstacles.children[i].height > this.game.height) {
                        obstacles.children[i].destroy();
                        //penalize the player somehow if point was to collect objects
                        if (!avoid) {
                            lives--;
                        }
                    }
                    if (testAABBCollision(collector, obstacles.children[i]) && obstacles.children[i].canCollect == true)
                    {
                        if (!immune) {
                            //penalize the player somehow - lower score, etc, if point was to avoid objects
                            if (avoid) {
                                this.hitObstacle(obstacles.children[i]);
                            }
                            obstacles.children[i].destroy();
                            i--;
                            continue;
                        } else {
                            obstacles.children[i].canCollect = false;
                        }
                    }
                    if (spriteTop(obstacles.children[i]) > spriteBottom(collector) + 6 && testAABBCollision(collector, obstacles.children[i]) == false && obstacles.children[i].canCollect) {
                        obstacles.children[i].canCollect = false;
                    }
                }//for

                updateHearts();
                if (lives <= 0)
                    this.lose();
                keepSpriteOnScreen(collector);

                checkImmunity(collector);
            }
        }
        if (trialOver && collector.inputEnabled)
            collector.inputEnabled = false;
    },

    getRandomApplianceString: function () {
        var num = this.game.rnd.integerInRange(0, applianceStringArray.length - 1);
        return applianceStringArray[num];
    },

    spawnObstacles: function () {
        if (obstacleSpawnCooldown <= 0) {
            var obst = obstacles.create(this.randDropX(), -100, this.getRandomApplianceString());
            obst.anchor.setTo(0, 1);
            if (collector.gameStart) {
                collector.gameStart = false;
                obst.x = collector.x - obst.width/2;
            }
            obst.canCollect = true;//becomes false if you're too late
            obstacleSpawnCooldown = obstacleSpawnRate;

            //speed up the rate of falling objects
            if (obstacleSpawnRate > obstacleSpawnRateMin) {
                obstacleSpawnRate -= obstacleSpawnRateDecrease;
            }
            else if (obstacleSpawnRate < obstacleSpawnRateMin) {
                obstacleSpawnRate = obstacleSpawnRateMin;
            }
        }
    },

    hitObstacle: function (obstacle)
    {
        lives--;
        setImmunity();
        if (usesEmitter)
        {
            emitter.x = spriteLeft(obstacle) + obstacle.width/2;
            emitter.y = obstacle.position.y;
            emitter.start(true, 2000, null, 8);
        }
    },

    randDropX: function () {
        return this.game.rnd.integerInRange(0, this.game.width - 100);
    },

    //set collector name, appliance string array, and if goal is to avoid.
    setObjects: function () {
        //to be overridden
    },

    setEmitter: function ()
    {
        //to be overridden
    },

    lose: function ()//override if different lose
    {
        loseNeutral();
    },
}//Main.FallingObjects.prototype

Main.DragToGoal = function (game) {
    this.game = game;
}

Main.DragToGoal.prototype = {
    player: Phaser.Sprite,
    obstacles: Phaser.Group,
    goal: Phaser.Sprite,
    usesEmitter: Boolean,
    emitter: Phaser.Particles.Arcade.Emitter,
    emitterPositionOffset: Phaser.Point,
    pointer: Phaser.Pointer,

    inside: Boolean,//is the object fully inside the goal.
    snapBack: Boolean,
        
    create: function () {
        createMiniGame();
        this.setCustomBackground();

        pointer = this.game.input.pointer1;
        
        inside = false;
        snapBack = false;
        obstacles = this.game.add.group();
        usesEmitter = false;
        emitterPositionOffset = new Phaser.Point();

        this.setPlayer();
        this.setObstacles();
        this.setGoal();
        this.setEmitter();

        makeTrialText();
        this.setText();
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },

    startGame: function () {
        trialText.destroy();
        player.inputEnabled = true;
        player.input.enableDrag();
        started = true;
        player.originalPosition = player.position.clone();
        setTimer();
    },

    update: function ()
    {
        globalUpdate();

        keepSpriteOnScreen(player);
        if (started && trialOver == false) {
            this.otherUpdate();
            if (player.inputEnabled && pointer.isUp && player.input.draggable == false)
                player.input.draggable = true;

            for (var i = 0; i < obstacles.children.length; i++) {
                if (testAABBCollision(player, obstacles.children[i]))//kite
                {
                    this.hitObstacle();
                }
            }
            //check to see if goal is touched
            if (testAABBCollision(player, goal) && !inside) {
                this.gameWon();
            } else if (spriteRight(player) -50 >= goal.x && inside) {
                this.gameWon();
            }
            if (timeUp) {
                this.lose();
            }
            if (trialOver && player.inputEnabled) {
                player.inputEnabled = false;
            }
        }
    },

    hitObstacle: function ()
    {
        if (usesEmitter)
        {
            emitter.x = player.position.x + emitterPositionOffset.x;
            emitter.y = player.position.y + emitterPositionOffset.y;
            emitter.start(true, 2000, null, 8);
        }
        if (snapBack) {
            player.input.draggable = false;
            canMove = false;
            player.position.copyFrom(player.originalPosition);
        }        
    },

    gameWon: function () {
        player.inputEnabled = false;
        this.goalHit();
        win();
    },

    setCustomBackground : function () {
        //to be overridden
    },

    setPlayer: function () {
        //to be overridden
    },

    setGoal: function () {
        //to be overridden
    },

    setObstacles: function () {
        //to be overridden
    },

    setEmitter: function () {
        //to be overridden
    },

    setText: function () {
        //to be overridden
    },

    //this function allows sub classes to add their own actions when the goal is hit by the player
    goalHit: function () {
        //to be overridden
    },

    //this function allows sub classes to add their own update actions
    otherUpdate: function () {
        //to be overridden
    },

    lose: function ()//override if different lose
    {
        loseNeutral();
    },
}

Main.PushAway = function (game) {
    this.game = game;
}

Main.PushAway.prototype = {
    object: Phaser.Sprite,
    danger: Phaser.Sprite,
    safety: Phaser.Graphics,
    button: Phaser.Sprite,
    buttonDown: Phaser.Sprite,
    tapAnimation: Phaser.Sprite,

    distance: Number,
    text: String,

    create: function () {
        createMiniGame();

        this.setUp();

        makeTrialText();
        setTrialTextString(text);
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },

    startGame: function () {
        trialText.destroy();
        started = true;
        button.inputEnabled = true;
        button.events.onInputDown.add(this.showButtonDown, this);
        button.events.onInputUp.add(this.click, this);
        setTimer();
    },

    update: function () {
        globalUpdate();
        if (started && !trialOver) {
            object.x -= 1;

            if (object.x < danger.x) {
                object.x = danger.x;
            }

            if (timeUp) {
                this.lose();
            }

            distance = object.x - danger.x;
            if (distance >= 400) {
                win();
                button.inputEnabled = false;
            }
        }
    },

    showButtonDown: function()
    {
        if (typeof tapAnimation != 'undefined')
            tapAnimation.destroy();
        button.alpha = 0;
        buttonDown.alpha = 1;
    },

    click: function () {
        object.x += 25;
        button.alpha = 1;
        buttonDown.alpha = 0;
    },

    lose: function () {
        loseNeutral();
    },

    setUp: function () {
        //to be overridden
    },
}

Main.Evacuate = function (game) {
    this.game = game;
}

Main.Evacuate.prototype = {

    objects: Phaser.GROUP,
    dangerArea: Phaser.Sprite,
    objectsLeft: Number,
    autoRelease: Boolean,

    text: String,

    create: function ()
    {
        autoRelease = false;
        createMiniGame();
        
        this.setUpEvacArea();

        objectsLeft = objects.children.length;

        makeTrialText();
        setTrialTextString(text);
        flyInText(trialText);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },

    startGame: function () {
        trialText.destroy();
        for (var i = 0; i < objects.children.length; i++) {
            var obj = objects.children[i];
            obj.inputEnabled = true;
            obj.input.enableDrag();
            obj.events.onDragStart.add(this.startDrag, this);
            obj.events.onDragStop.add(this.stopDrag, this);
            obj.originalPosition = obj.position.clone();
        }
        started = true;
        setTimer();
    },

    update: function () {
        globalUpdate();

        if (autoRelease == true && !trialOver)
        {
            for (var i = 0; i < objects.children.length; i++) {
                var obj = objects.children[i];
                this.checkSprite(obj, false);
            }//for
        }//autoRelease

        if (objectsLeft == 0 && !trialOver) {
            win();
        }
        else if (timeUp && !trialOver) {
            for (var i = 0; i < objects.children.length; i++) {
                var obj = objects.children[i];
                if (obj.inputEnabled)
                    obj.inputEnabled = false;
            }
            this.lose();
        }
    },

    startDrag: function (currentSprite) {
        currentSprite.bringToTop();
    },

    stopDrag: function (currentSprite) {
        this.checkSprite(currentSprite, true);
    },//stopDrag

    checkSprite: function (currentSprite,withSnap)
    {
        if (currentSprite.inputEnabled && testAABBCollision(currentSprite, dangerArea) == false)
        {
            currentSprite.inputEnabled = false;
            objectsLeft--;
            addCheckMarkTo(currentSprite);
        }
        else if (withSnap == true && currentSprite.inputEnabled) {
            currentSprite.position.copyFrom(currentSprite.originalPosition);
        }
    },

    setUpEvacArea: function () {
        //to be overridden
    },

    lose: function ()
    {
        loseNeutral();
    },
}