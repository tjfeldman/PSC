
//KITE MOVER
//TRIAL 2 INSTRUCTIONS
Main.KiteMoverInstr = function (game) {
    Main.Instr.call(this);
}
Main.KiteMoverInstr.prototype = Object.create(Main.Instr.prototype);
Main.KiteMoverInstr.prototype.changeText = function () {
    text.text = "Never fly kites, balloons, and stuff near power lines.\nDon't try to remove something that's tangled in a power line, either. That'll get you zapped for sure.";
}//changeText

//TRIAL 2 SCREEN/STATE
Main.KiteMover = function (game) {
    Main.DragToGoal.call(this);
};

Main.KiteMover.prototype = Object.create(Main.DragToGoal.prototype);

var kite;
var goalX = 850;

Main.KiteMover.prototype.setCustomBackground = function ()
{
    if(typeof background != 'undefined')
        background.loadTexture('background_sky');
}//setCustomBackground

Main.KiteMover.prototype.setPlayer = function ()
{
    kite = this.game.add.sprite(40, this.game.world.centerY, 'kite');
    kite.anchor.setTo(0, 0.5);

    player = this.game.add.sprite(40, this.game.world.centerY, null);//change to null for invisible
    player.anchor.setTo(-0.2, 0.65);
    player.width = 100;
    player.height = 150;

    snapBack = true;

}

Main.KiteMover.prototype.setObstacles = function ()
{
    var obst = obstacles.create(250, -3, 'wire_long_spriteSheet');
    obst.animations.add('zap');
    obst.animations.play('zap', 20, true);

    obst = obstacles.create(250, 600, 'wire_long_spriteSheet');
    obst.animations.add('zap');
    obst.animations.play('zap', 20, true);

    obst = obstacles.create(530, 300, 'wire_med_spriteSheet');
    obst.animations.add('zap');
    obst.animations.play('zap', 20, true);

    obst = obstacles.create(830, -3, 'wire_med_spriteSheet');
    obst.animations.add('zap');
    obst.animations.play('zap', 20, true);

    obst = obstacles.create(830, 500, 'wire_long_spriteSheet');
    obst.animations.add('zap');
    obst.animations.play('zap', 20, true);
}

Main.KiteMover.prototype.setGoal = function () {
    goal = this.game.add.sprite(goalX, 0, null);//change to null for invisible
    goal.width = this.game.width - goalX;
    goal.height = this.game.height;
    goal.alpha = 0.2;

    inside = true;
}

Main.KiteMover.prototype.setEmitter = function ()
{
    usesEmitter = true;
    emitter = this.game.add.emitter(0, 0, 25);
    emitter.makeParticles('particle_electricity');
    emitter.gravity = 200;
    emitterPositionOffset.x = 65;
}

Main.KiteMover.prototype.setText = function () {
    setTrialTextString("Move the kite to the other side without touching the power lines!");
}

Main.KiteMover.prototype.otherUpdate = function () {
    kite.position.copyFrom(player.position);
}

Main.KiteMover.prototype.lose = function () {
    hintText = "Carefully drag the kite to the other side without touching any of the power lines.";
    loseElectric();
}//Main.Trial2

//TUB MOVER
//TRIAL 3 ISTRUCTIONS
Main.TubMoverInstr = function (game) {
    Main.Instr.call(this);
}
Main.TubMoverInstr.prototype = Object.create(Main.Instr.prototype);
Main.TubMoverInstr.prototype.changeText = function () {
    text.text = "Water is a really good conductor of electricity. Keep electrical appliances away from water or some bad stuff will go down.";
}//changeText

//TRIAL 3 SCREEN/STATE
Main.TubMover = function (game) {
    Main.FallingObjects.call(this);
};

Main.TubMover.prototype = Object.create(Main.FallingObjects.prototype);

Main.TubMover.prototype.setObjects = function ()
{
    if (typeof background != 'undefined')
        background.loadTexture('background_bathroom');

    applianceStringArray = ["falling_lamp", "falling_toaster", "falling_phone", "falling_controller"];
    textString = "Move the bathtub to avoid electrical appliances!";
    avoid = true;

    collector = this.game.add.sprite(this.game.world.centerX, 720, 'tub');
    collector.anchor.setTo(0.5, 1);
}

Main.TubMover.prototype.setEmitter = function ()
{
    usesEmitter = true;
    emitter = this.game.add.emitter(0, 0, 25);
    emitter.makeParticles('particle_electricity');
    emitter.gravity = 200;
}

Main.TubMover.prototype.lose = function () {
    hintText = "Drag the tub from side to side to dodge the falling electrical appliances.";
    loseElectric();
}
//Main.Trial3

//WET HANDS KEEP AWAY
//TRIAL 7 INSTRUCTIONS
Main.WetHandsInstr = function (game) {
    this.game = game;
}
Main.WetHandsInstr.prototype = Object.create(Main.Instr.prototype);
Main.WetHandsInstr.prototype.changeText = function () {
    text.text = "Just having wet hands can be risky around electricity. Make sure your hands are dry before messing with electric appliances.";
}//changeText
//TRIAL 7 SCREEN/STATE
Main.WetHands = function (game) {
    Main.Avoider.call(this);
};

Main.WetHands.prototype = Object.create(Main.Avoider.prototype);

Main.WetHands.prototype.setPlayer = function ()
{
    var rand = this.game.rnd.integerInRange(1, 3);
    var playerString = "wethands" + rand.toString();
    player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, playerString);
    player.anchor.setTo(0.5, 0.5);

    playerHitBox = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, null);
    playerHitBox.anchor.setTo(0.5, 0.5);
    playerHitBox.width = 150;
    playerHitBox.height = 125;
    playerHitBox.alpha = 0.2;
}

Main.WetHands.prototype.setObstacles = function () {
    obstaclesList = ["falling_lamp", "falling_toaster", "falling_phone", "falling_controller"];
    obstacleSpeed = [2, 4, 6, 4];
}

Main.WetHands.prototype.setEmitter = function ()
{
    usesEmitter = true;
    emitter = this.game.add.emitter(0, 0, 25);
    emitter.makeParticles('particle_electricity');
    emitter.gravity = 200;
}

Main.WetHands.prototype.setText = function () {
    setTrialTextString("Keep the wet hands away from electrical appliances!");
}

Main.WetHands.prototype.lose = function () {
    hintText = "Drag the hands away from the moving objects until time runs out.";
    loseElectric();
}

//Main.Trial7

//LADDER POWERLINES TRIAL
//TRIAL 10 INSTRUCTIONS
Main.LadderInstr = function (game) {
    Main.Instr.call(this);
}
Main.LadderInstr.prototype = Object.create(Main.Instr.prototype);
Main.LadderInstr.prototype.changeText = function () {
    text.text = "You should keep ladders at least 10 feet away from power lines when carrying, moving, or raising them.  9 Feet and 11 inches is also probably okay.";
}//changeText
//TRIAL 10 SCREEN/STATE
Main.Ladder = function (game) {
    Main.PushAway.call(this);
};

Main.Ladder.prototype = Object.create(Main.PushAway.prototype);

Main.Ladder.prototype.setUp = function ()
{
    if (typeof background != 'undefined')
        background.loadTexture('background_ladder');

    //power line
    danger = this.game.add.sprite(250, this.game.world.centerY-15, 'powerLine');
    danger.anchor.setTo(0.5, 0.5);

    //safety line
    /*safety = this.game.add.graphics();
    safety.beginFill(0x000000);
    safety.lineStyle(10, 0xFFFF00, 1);
    safety.moveTo(danger.x + 400, 315);
    safety.lineTo(danger.x + 400, this.game.world.height);
    safety.endFill();*/
    var ruler = this.game.add.image(danger.x, this.game.world.height - 100,'ladderruler');

    //ladder
    object = this.game.add.sprite(250, 450, 'ladder');//y 505
    object.anchor.setTo(0, .5);

    //button
    button = this.game.add.sprite(this.game.width - 50, this.game.world.centerY, 'ladderButton');//y this.game.height -50
    button.anchor.setTo(1, 0.5);
    buttonDown = this.game.add.sprite(this.game.width - 50, this.game.world.centerY, 'ladderButton_down');
    buttonDown.anchor.setTo(1, 0.5);
    buttonDown.alpha = 0;

    //tap animation
    tapAnimation = game.add.sprite(button.position.x - button.width / 2, button.position.y - button.height/2, 'tap_spriteSheet');
    tapAnimation.anchor.setTo(0.5, 1);
    tapAnimation.animations.add('tap');
    tapAnimation.animations.play('tap', 3, true);

    //text
    text = "Move the ladder 10 feet back!";
}

Main.Ladder.prototype.lose = function () {
    hintText = "Press the button repeatedly to move the ladder away from power lines.";
    loseElectric();
}


//SAFE OUTLET
//TRIAL 15 INSTRUCTIONS
Main.SafeOutletInstr = function (game)
{
    Main.Instr.call(this);
}
Main.SafeOutletInstr.prototype = Object.create(Main.Instr.prototype);
Main.SafeOutletInstr.prototype.changeText = function ()
{
    text.text = "Wall outlets can cause fires and all kinds of bad stuff if they get overloaded or damaged. Treat 'em right.";
}//changeText
//TRIAL 15 SCREEN/STATE
Main.SafeOutlet = function (game)
{
    Main.SelectCorrect.call(this);
};
Main.SafeOutlet.prototype = Object.create(Main.SelectCorrect.prototype);

Main.SafeOutlet.prototype.setImages = function ()
{
    image1 = winImage = 'safeOutlet';
    image2 = 'overloadedOutlet';
    image3 = 'brokenOutlet';
}

Main.SafeOutlet.prototype.setText = function ()
{
    setTrialTextString("Which of these outlets is the safest?");
}

Main.SafeOutlet.prototype.lose = function () {
    hintText = "A safe outlet is one that isn't broken and doesn't have too many devices plugged into it.";
    loseElectric();
}
//Main.SafeOutlet


//PLUG PULL TRIAL
//TRIAL 17 INSTRUCTIONS
Main.PullPlugInstr = function (game) {
    Main.Instr.call(this);
}
Main.PullPlugInstr.prototype = Object.create(Main.Instr.prototype);
Main.PullPlugInstr.prototype.changeText = function () {
    text.text = "The best way to keep an electrical cord in excellent condition is to remove it by its plug.  Pulling from the cord is not excellent.";
}//changeText
//TRIAL 17 SCREEN/STATE
Main.PullPlug = function (game) {
    Main.DragToGoal.call(this);
};

Main.PullPlug.prototype = Object.create(Main.DragToGoal.prototype);

var cord;

Main.PullPlug.prototype.setPlayer = function ()
{
    var rand = this.game.rnd.integerInRange(1, 3);
    var playerString = "hand" + rand.toString();
    player = this.game.add.sprite(this.game.world.width / 3, this.game.world.height / 3, playerString);//'hand'
    player.anchor.setTo(1, 1);

    snapBack = true;
}

Main.PullPlug.prototype.setObstacles = function () {
    cord = obstacles.create(0, this.game.world.height * 2 / 3, 'pullCord');
    cord.anchor.setTo(1, 0.5);
    cord.x = cord.width;
}

Main.PullPlug.prototype.setGoal = function () {
    goal = this.game.add.sprite(0, 0, 'pullPlug');
    goal.anchor.setTo(0, 0.5);
    goal.y = cord.y - cord.height / 8 + 6;
    goal.x = cord.width;

    this.game.add.sprite(spriteRight(goal)-3, 370, 'plugoutlet');
    
}

Main.PullPlug.prototype.setText = function () {
    setTrialTextString("Guide the hand to pull the plug in the right spot!");
}

Main.PullPlug.prototype.otherUpdate = function () {
    if (player.y > cord.y + cord.height / 2) {
        player.y = cord.y + cord.height / 2;
    }
}

Main.PullPlug.prototype.goalHit = function () {
    var handTween = game.add.tween(player.position).to({ x: 900, y: 495 }, 150, Phaser.Easing.Linear.None, true);//y 505
}

Main.PullPlug.prototype.lose = function () {
    hintText = "Drag the hand over to the plug on the end of the cord.";
    loseElectric();
}

//MOVE FURNITURE TRIAL
//TRIAL 18 INSTRUCTIONS
Main.MoveFurnitureInstr = function (game) {
    Main.Instr.call(this);
}
Main.MoveFurnitureInstr.prototype = Object.create(Main.Instr.prototype);
Main.MoveFurnitureInstr.prototype.changeText = function () {
    text.text = "You shouldn't run cords in places they're likely to be stepped on or tripped over, like under rugs, in doorways, around furniture, and things like that.";
}//changeText
//TRIAL 18 SCREEN/STATE
Main.MoveFurniture = function (game) {
    Main.Evacuate.call(this);
};

Main.MoveFurniture.prototype = Object.create(Main.Evacuate.prototype);

var cord;

Main.MoveFurniture.prototype.setUpEvacArea = function ()
{
    if (typeof background != 'undefined')
        background.loadTexture('background_floor');

    cord = this.game.add.sprite(this.game.world.centerX, 0, 'furnitureCord');
    autoRelease = true;

    dangerArea = this.game.add.sprite(this.game.world.centerX, this.game.centerY, null);
    dangerArea.anchor.setTo(0.5, 0);
    dangerArea.width = this.game.world.width / 3 + 20;
    dangerArea.height = this.game.world.height;

    objects = this.game.add.group();

    for (var i = 0; i < 5; i++) {
        switch (i) {
            case 0:
                x = this.game.world.centerX;
                y = this.game.world.height / 5;
                break;
            case 1:
                x = this.game.world.centerX;
                y = this.game.world.height / 3;
                break;
            case 2:
                x = this.game.world.centerX;
                y = this.game.world.centerY;
                break;
            case 3:
                x = this.game.world.centerX;
                y = this.game.world.height * 2 / 3;
                break;
            case 4:
                x = this.game.world.centerX;
                y = this.game.world.height * 4 / 5;
                break;
            default:
                x = y = 0;
        }
        var furniture = objects.create(x, y, 'furniture' + (i + 1));
        if (i % 2 == 0) {
            furniture.x -= furniture.width / 2;
        } else {
            furniture.x += furniture.width / 2;
        }
        furniture.anchor.setTo(0.5, 0.5);
    }

    text = "Move the furniture away from the cord!";
}

Main.MoveFurniture.prototype.lose = function () {
    hintText = "Drag all the furniture away from the cord in the center."
    loseElectric();
}