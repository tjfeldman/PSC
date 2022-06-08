//EVACUATE HOUSE
//TRIAL 5 ISTRUCTIONS
Main.HomeEvacInstr = function (game) {
    Main.Instr.call(this);
}
Main.HomeEvacInstr.prototype = Object.create(Main.Instr.prototype);
Main.HomeEvacInstr.prototype.changeText = function () {
    text.text = "If you ever suspect a gas leak quickly evacuate the entire building, leave a door open, and call your Gas Utility or 911 from a safe location such as a neighbor's house.";
}//changeText
//TRIAL 5 SCREEN/STATE
Main.HomeEvac = function (game) {
    Main.Evacuate.call(this);
};

Main.HomeEvac.prototype = Object.create(Main.Evacuate.prototype);

Main.HomeEvac.prototype.setUpEvacArea = function () {
    dangerArea = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'house');
    dangerArea.anchor.setTo(0.5, 0.5);
    dangerArea.width = 460;
    dangerArea.height = 460;

    objects = this.game.add.group();

    var object = objects.create(this.game.world.centerX - 100, this.game.world.centerY - 20, 'guy');//- 100
    object.anchor.setTo(0.5, 0.5);

    object = objects.create(this.game.world.centerX + 100, this.game.world.centerY -20, 'girl');//- 100
    object.anchor.setTo(0.5, 0.5);

    object = objects.create(this.game.world.centerX - 100, this.game.world.centerY + 180, 'kid');//+ 100
    object.anchor.setTo(0.5, 0.5);

    object = objects.create(this.game.world.centerX + 100, this.game.world.centerY + 180, 'dog');
    object.anchor.setTo(0.5, 0.5);

    text = "Evacuate the house!";
}

Main.HomeEvac.prototype.lose = function () {
    hintText = "Drag everyone away from the building.";
    loseExplode();
}


//ANIMAL SOUNDS TRIAL
//TRIAL 11 INSTRUCTIONS
Main.AnimalSoundInstr = function (game)
{
    Main.Instr.call(this);
}
Main.AnimalSoundInstr.prototype = Object.create(Main.Instr.prototype);
Main.AnimalSoundInstr.prototype.changeText = function ()
{
    text.text = "Sometimes a gas leak will make a noise you can hear with your strange earthling ears.\n\nThe leak would make a roaring, hissing, or whistling sound.";
}//changeText
//TRIAL 11 SCREEN/STATE
Main.AnimalSound = function (game)
{
    Main.SelectCorrect.call(this);
};
Main.AnimalSound.prototype = Object.create(Main.SelectCorrect.prototype);

Main.AnimalSound.prototype.setImages = function ()
{
    image1 = 'dog2';
    image2 = 'bird';
    image3 = winImage = 'snake';
}

Main.AnimalSound.prototype.setText = function ()
{
    setTrialTextString("Which of these Earth animals does a gas leak sound most like?");
}

Main.AnimalSound.prototype.lose = function ()
{
    hintText = "A gas leak makes a hissing sound that you could hear. Which animal also hisses?"
    loseExplode();
}
//Main.Trial11


//BEST DETECTOR TRIAL
//TRIAL 14 INSTRUCTIONS
Main.GasDetectorInstr = function (game)
{
    Main.Instr.call(this);
}
Main.GasDetectorInstr.prototype = Object.create(Main.Instr.prototype);
Main.GasDetectorInstr.prototype.changeText = function ()
{
    text.text = "There are three ways you can sense a gas leak: Smell, sight, and sound.\n\nThe most reliable of these is smell.";
}//changeText
//TRIAL 14 SCREEN/STATE
Main.GasDetector = function (game)
{
    Main.SelectCorrect.call(this);
};
Main.GasDetector.prototype = Object.create(Main.SelectCorrect.prototype);

Main.GasDetector.prototype.setImages = function ()
{
    var rand = this.game.rnd.integerInRange(1, 3);
    var noseString = "nose" + rand.toString();
    rand = this.game.rnd.integerInRange(1, 3);
    var earString = "ear" + rand.toString();
    image1 = 'eye';
    image2 = winImage = noseString;
    image3 = earString;
}

Main.GasDetector.prototype.setText = function ()
{
    setTrialTextString("Which of these earthling parts is your best natural gas detector?");//"Which is your best natural gas detector?"
}

Main.GasDetector.prototype.lose = function () {
    hintText = "A gas leak could happen anywhere in your house. It's unlikely that you will be able to see it, and you might not be close enough to hear it."
    loseExplode();
}
//Main.Trial14


//ROTTEN EGSS TRIAL
//TRIAL 16 INSTRUCTIONS
Main.RottenEggsInstr = function (game)
{
    Main.Instr.call(this);
}
Main.RottenEggsInstr.prototype = Object.create(Main.Instr.prototype);
Main.RottenEggsInstr.prototype.changeText = function ()
{
    text.text = "Natural gas has no scent. However, a strong odorant, like rotten eggs, is added to help you smell it. It is also the smell we Gassians use to say 'goodnight.'";
}//changeText
//TRIAL 16 SCREEN/STATE
Main.RottenEggs = function (game)
{
    Main.SelectCorrect.call(this);
};
Main.RottenEggs.prototype = Object.create(Main.SelectCorrect.prototype);

Main.RottenEggs.prototype.setImages = function ()
{
    image1 = 'flower';
    image2 = winImage = 'rottenEgg';
    image3 = 'milk';
}

Main.RottenEggs.prototype.setText = function ()
{
    setTrialTextString("Which of these smells like natural gas?");
}

Main.RottenEggs.prototype.lose = function () {
    hintText = "Flowers and milk don't smell very rotten."
    loseExplode();
}
//Main.Trial16


//FOLLOW YOUR NOSE
//TRIAL 19 INSTRUCTIONS
Main.FollowNoseInstr = function (game) {
    Main.Instr.call(this);
}
Main.FollowNoseInstr.prototype = Object.create(Main.Instr.prototype);
Main.FollowNoseInstr.prototype.changeText = function ()
{
    //"The best way for you to detect a natural gas leak is with your nose."
    text.text = "The smell of gas will be stronger the closer you are to the leak. If you smelled a Gassian from too close, you would probably pass out.";
}//changeText
//TRIAL 19 SCREEN/STATE
Main.FollowNose = function (game) {
    Main.DragToGoal.call(this);
};

Main.FollowNose.prototype = Object.create(Main.DragToGoal.prototype);

var buffer = 30;
var regNose;
var redNose;

function setNoseRedness(distance,redSprite)
{
    var tempAlpha = 1 / ((distance * distance) / 80000);//20000 | higher number -> more sensitive
    if (tempAlpha > 1) tempAlpha = 1;
    redSprite.alpha = tempAlpha;
}//setNoseRedness

Main.FollowNose.prototype.setPlayer = function ()
{
    var rand = this.game.rnd.integerInRange(1, 3);
    var noseString = "nose" + rand.toString();
    regNose = this.game.add.sprite(0, 0, noseString);
    regNose.anchor.setTo(0.5, 0.5);

    player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, null);
    player.width = 80;
    player.height = 120;
    player.anchor.setTo(0.5, 0.5);
    regNose.position.copyFrom(player.position);

    redNose = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'noseRed');// noseFrontRed
    redNose.anchor.setTo(0.5, 0.5);
    redNose.alpha = 0;
}

Main.FollowNose.prototype.setGoal = function () {
    var leak = this.game.rnd.integerInRange(0, 3);
    goal = obstacles.children[leak];

    //start nose redness correctly | after setting goal because you need all the positions
    distance = Phaser.Point.distance(player.position, goal.position);
    if (distance == 0)
        distance = 1;
    setNoseRedness(distance, redNose);
}

Main.FollowNose.prototype.setObstacles = function () {
    var listOfLeaks = ['furnace', 'fireplace', 'stove', 'dryer'];
    var posX = [this.game.world.width / 7, this.game.world.width / 7, this.game.world.width * 6 / 7, this.game.world.width * 6 / 7];
    var posY = [this.game.world.height / 6, this.game.world.height * 6 / 7, this.game.world.height / 6, this.game.world.height * 6 / 7];

    for (var i = 0; i < listOfLeaks.length; i++) {
        var pos = this.game.rnd.integerInRange(0, posX.length - 1);
        var obst = obstacles.create(posX[pos], posY[pos], listOfLeaks[i]);
        obst.anchor.setTo(0.5, 0.5);

        posX.splice(pos, 1);
        posY.splice(pos, 1);
    }
}

Main.FollowNose.prototype.setText = function () {
    setTrialTextString("Move the nose to find the gas leak!");
}

Main.FollowNose.prototype.otherUpdate = function () {
    redNose.position.copyFrom(player.position);
    distance = Phaser.Point.distance(player.position, goal.position);

    if (distance == 0)
        distance = 1;
    setNoseRedness(distance, redNose);

    regNose.position.copyFrom(player.position);
}

Main.FollowNose.prototype.goalHit = function () {
    var exclam = this.game.add.sprite(goal.position.x, goal.position.y, 'exclamationpoint');
    exclam.anchor.setTo(0.5, 0.5);
}

Main.FollowNose.prototype.lose = function () {
    hintText = "The nose turns red as you drag it closer to the gas leak."
    loseExplode();
}

//Move Grill
Main.GrillInstr = function (game) {
    Main.Instr.call(this);
}
Main.GrillInstr.prototype = Object.create(Main.Instr.prototype);
Main.GrillInstr.prototype.changeText = function () {
    text.text = "Using an outside gas grill inside leads to a build up of carbon monoxide, an odorless and poisonous gas. We Gassians are immune, but we prefer smellier gases.";
}

Main.Grill = function (game) {
    Main.DragToGoal.call(this);
}

Main.Grill.prototype = Object.create(Main.DragToGoal.prototype);

var grill;
Main.Grill.prototype.setPlayer = function ()
{
    if (typeof background != 'undefined')
        background.loadTexture('background_floor');

    player = this.game.add.sprite(30, this.game.height - 80, null);
    player.anchor.setTo(0, 1);
    player.width = 115;
    player.height = 195;
    grill = this.game.add.sprite(30, this.game.height - 80, 'grill');
    grill.anchor.setTo(0.1, 1);
    grill.scale.setTo(0.85, 0.85);
    
    snapBack = true;
}

Main.Grill.prototype.otherUpdate = function ()
{
    grill.position.copyFrom(player.position);
}

Main.Grill.prototype.setObstacles = function () {
    var obst;

    obst = obstacles.create(10, 0, 'furniture2');//250, 250
    obst.anchor.setTo(0, 0);

    obst = obstacles.create(505, 660, 'furniture4');//575, 550 //furniture2 //505, 720,
    obst.anchor.setTo(0.5, 0.5);

    obst = obstacles.create(650, 125, 'furniture1');//furniture4
    obst.anchor.setTo(0.5, 0.5);



    obst = obstacles.create(this.game.width - 150, -10, 'wall');
    obst.anchor.setTo(0.5, 0);
    obst.width = 50;
    obst.height = 400;
}

Main.Grill.prototype.setGoal = function () {
    goal = this.game.add.sprite(this.game.width - 130, this.game.world.centerY, null);
    goal.anchor.setTo(0, 0.5);
    goal.width = 130;
    goal.height = this.game.height;
    goal.alpha = 0.5;

    inside = true;
}

Main.Grill.prototype.setText = function () {
    setTrialTextString("Move the grill out of the room!");
}

Main.Grill.prototype.lose = function () {
    hintText = "Drag the grill to the other side. Avoid colliding with furniture.";
    loseExplode();
}

//Stove Clutter
Main.StoveClutterInstr = function (game) {
    Main.Instr.call(this);
}
Main.StoveClutterInstr.prototype = Object.create(Main.Instr.prototype);
Main.StoveClutterInstr.prototype.changeText = function () {
    text.text = "Keep the area around natural gas appliances clean and uncluttered. This is mostly for your safety, but also because nobody likes a messy mooplorper.";
}

Main.StoveClutter = function (game) {
    Main.Evacuate.call(this);
}

Main.StoveClutter.prototype = Object.create(Main.Evacuate.prototype);

Main.StoveClutter.prototype.setUpEvacArea = function () {
    dangerArea = this.game.add.sprite(this.game.world.centerX, this.game.height, 'stovetop');//this.game.world.centerY
    dangerArea.anchor.setTo(0.5, 1);

    objects = this.game.add.group();

    var clutter;
    clutter = objects.create(420, 360, 'papertowels');
    clutter.anchor.setTo(0.5, 0.5);

    clutter = objects.create(1024 - 420, 360, 'cereal');
    clutter.anchor.setTo(0.5, 0.5);

    clutter = objects.create(420, 510, 'can1');
    clutter.anchor.setTo(0.5, 0.5);

    clutter = objects.create(1024-420, 510, 'book');
    clutter.anchor.setTo(0.5, 0.5);


    text = "Remove the clutter!";
}

Main.StoveClutter.prototype.lose = function () {
    hintText = "Drag the objects away from the stove.";//Drag the clutter off of the stove top
    loseExplode();
}