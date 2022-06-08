Main.SelectCorrect = function (game) {
    this.game = game;
};

Main.SelectCorrect.prototype = {
    choice1: Phaser.Sprite,
    choice2: Phaser.Sprite,
    choice3: Phaser.Sprite,

    image1: String,
    image2: String,
    image3: String,
    winImage: String,

    started: Boolean,
    text: Phaser.Text,

    create: function () {
        this.game.add.image(0, 0, 'background');
        
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


        var style = { font: "68px Tw Cen MT", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
        text = this.game.add.text(this.game.world.centerX, 25, "", style);
        text.anchor.setTo(0.5, 0);
        text.stroke = '#000000';
        text.strokeThickness = 8;
        this.setText();
        flyInText(text);
        this.game.time.events.add(Phaser.Timer.SECOND * 10, function () { doLose = true; }, this);
    },

    //override if different lose screen
    update: function ()
    {
        if (trialOver == false)
        {
            if (doWin)
                win();
            else if (doLose)
                loseExplode();
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


}//Main.SelectCorrect.prototype

Main.Avoider = function (game) {
    this.game = game;
};