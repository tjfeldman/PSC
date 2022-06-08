var game;
var gameStates = new Array();
var currentPlanet = new Array();
var gasPlanetStates = new Array();
var electricPlanetStates = new Array();
var stormPlanetStates = new Array();
var currentTrialIndex = 0;  //global storage of where we are in the array
var lastTrial = 0;
var completedPlanets = [false, false, false];//gas, electric, storm
var losses = [0, 0, 0];//gas, electric, storm
var popup;
var hintText = null;

var timer = null;
var trialDuration = 10;
var timerDisplay;
var rect;

var idleTimer = null;
var idleTime = 0;
var canIdle = true;
var pause = false;

var trialLoseCount = 0;

//fonts
//42px
var dialogueTextWordWrapWidth = 710;
var dialogueTextStyle;
var dialogueText;
var nameTextStyle;
var nameText;

//START OF GAME STATES
var Main = {};

window.onload = function ()
{
    document.ontouchstart = function (e) { e.preventDefault(); }//ontouchmove
    //var game;
    game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create });//,false,false); //AUTO

    nameTextStyle = { font: "36px Helvetica", fill: "#000000", align: "left" };//750 //38px
    dialogueTextStyle = { font: "37px Helvetica", fill: "#000000", align: "left", wordWrap: true, wordWrapWidth: dialogueTextWordWrapWidth };//40px
    
    function preload()
    {
        //game.load.image('background', 'images/background.png');
    }
    function create()
    {
        //debug keys
        game.input.keyboard.inputEnabled = true;

        //check for activeness
        if (canIdle) {
            var area = document.getElementById("game").addEventListener('touchstart', resetIdleTimer);
            var area = document.getElementById("game").addEventListener('touchmove', resetIdleTimer);
            var area = document.getElementById("game").addEventListener('touchend', resetIdleTimer);
            var area = document.getElementById("game").addEventListener('touchcancel', resetIdleTimer);
        }

        //game.add.image(0, 0, 'background');
        game.state.add('boot', Main.Boot, true);//Main.Boot.key
        game.state.add('preloader', Main.Preloader);
        game.state.add('splashscreen', Main.SplashScreen);
        game.state.add('titlescreen', Main.TitleScreen);
        game.state.add('hangerscene', Main.HangerScene);
        game.state.add('cockpitscene', Main.CockpitScene);
        game.state.add('utilitybeltscene', Main.UtilityBeltScene);
        game.state.add('selectPlanet', Main.SelectPlanet);
        game.state.add('aliendialoguescene', Main.AlienDialogueScene);
        game.state.add('winscreen', Main.WinScreen);

        makeAndStoreTrialStates('gasDetectorInstr', Main.GasDetectorInstr, 'gasDetector', Main.GasDetector, gasPlanetStates);
        makeAndStoreTrialStates('homeEvacInstr', Main.HomeEvacInstr, 'homeEvac', Main.HomeEvac, gasPlanetStates);      
        makeAndStoreTrialStates('rottenEggsInstr', Main.RottenEggsInstr, 'rottenEggs', Main.RottenEggs, gasPlanetStates);
        makeAndStoreTrialStates('followNoseInstr', Main.FollowNoseInstr, 'followNose', Main.FollowNose, gasPlanetStates);
        makeAndStoreTrialStates('grillInstr', Main.GrillInstr, 'grill', Main.Grill, gasPlanetStates);
        makeAndStoreTrialStates('animalSoundInstr', Main.AnimalSoundInstr, 'animalSound', Main.AnimalSound, gasPlanetStates);
        makeAndStoreTrialStates('stoveClutterInstr', Main.StoveClutterInstr, 'stoveClutter', Main.StoveClutter, gasPlanetStates);

        makeAndStoreTrialStates('safeOutletInstr', Main.SafeOutletInstr, 'safeOutlet', Main.SafeOutlet, electricPlanetStates);
        makeAndStoreTrialStates('pullPlugInstr', Main.PullPlugInstr, 'pullPlug', Main.PullPlug, electricPlanetStates);
        makeAndStoreTrialStates('moveFurnitureInstr', Main.MoveFurnitureInstr, 'moveFurniture', Main.MoveFurniture, electricPlanetStates);
        makeAndStoreTrialStates('wetHandsInstr', Main.WetHandsInstr, 'wetHands', Main.WetHands, electricPlanetStates);
        makeAndStoreTrialStates('tubMoverInstr', Main.TubMoverInstr, 'tubMove', Main.TubMover, electricPlanetStates);
        makeAndStoreTrialStates('ladderInstr', Main.LadderInstr, 'ladder', Main.Ladder, electricPlanetStates);
        makeAndStoreTrialStates('kiteMoverInstr', Main.KiteMoverInstr, 'kiteMover', Main.KiteMover, electricPlanetStates);

        makeAndStoreTrialStates('collectBatteriesInstr', Main.CollectBatteriesInstr, 'collectBatteries', Main.CollectBatteries, stormPlanetStates);
        makeAndStoreTrialStates('pantryStockerInstr', Main.PantryStockerInstr, 'pantryStocker', Main.PantryStocker, stormPlanetStates);
        makeAndStoreTrialStates('phoneChargerInstr', Main.PhoneChargerInstr, 'phoneCharger', Main.PhoneCharger, stormPlanetStates);
        makeAndStoreTrialStates('waterCatcherInstr', Main.WaterCatcherInstr, 'waterCatcher', Main.WaterCatcher, stormPlanetStates);
        makeAndStoreTrialStates('closeRefrigeratorsInstr', Main.CloseRefrigeratorsInstr, 'closeRefrigerators', Main.CloseRefrigerators, stormPlanetStates);
        makeAndStoreTrialStates('turnOffAppliancesInstr', Main.TurnOffAppliancesInstr, 'turnOffAppliances', Main.TurnOffAppliances, stormPlanetStates);
        makeAndStoreTrialStates('candleInstr', Main.CandleInstr, 'candle', Main.Candle, stormPlanetStates);
    }//create
    function makeAndStoreTrialStates(instrKey, instrObject, trialKey, trialObject, array)
    {
        game.state.add(instrKey, instrObject);
        game.state.add(trialKey, trialObject);
        array.push([instrKey, instrObject, trialKey, trialObject]);
    }//makeAndStoreTrialStates
}//onload

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
        this.game.load.image('background_splash', 'images/background_splash.png');
        this.game.load.image('PSC_planet', 'images/PSC_planet.png');
    },

    create: function ()
    {
        //// this.game.stage.enableOrientationCheck(true, false, 'orientation');
        this.game.state.start('preloader', Main.Preloader);
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
        this.game.add.image(0, 0, 'background_splash');
        var splashImage = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'PSC_planet');
        splashImage.anchor.setTo(0.5, 0.5);
        this.preloadBar = this.add.sprite(this.game.world.centerX, 550, 'loaderFull');//y 370
        this.preloadBar.position.x = 512 - this.preloadBar.width / 2;
        this.load.setPreloadSprite(this.preloadBar);


        this.game.load.image('background', 'images/pantonebackground.png');
        this.game.load.image('titlescreen', 'images/titlescreen_v2.png');
        this.game.load.image('tap_to_start', 'images/tap_to_start.png');

        this.game.load.image('kite', 'images/kite.png');
        this.game.load.spritesheet('wire_long_spriteSheet', 'images/wire_long_spritesheet.png', 70, 308, 2);
        this.game.load.spritesheet('wire_med_spriteSheet', 'images/wire_med_spritesheet.png', 70, 228, 2);
        this.game.load.image('cardboardbox', 'images/cardboardbox.png');
        this.game.load.image('battery1', 'images/battery1.png');
        this.game.load.image('battery2', 'images/battery2.png');
        this.game.load.image('battery3', 'images/battery3.png');
        this.game.load.image('battery4', 'images/battery4.png');
        this.game.load.image('battery5', 'images/battery5.png');
        this.game.load.image('battery6', 'images/battery6.png');
        this.game.load.image('paperclip', 'images/paperclip.png');
        this.game.load.image('penny', 'images/penny.png');
        this.game.load.image('lipstick', 'images/lipstick.png');
        this.game.load.image('small_milk', 'images/small_milk.png');
        this.game.load.image('steak', 'images/steak.png');
        this.game.load.image('waterdrop', 'images/waterdrop.png');
        this.game.load.image('basin', 'images/basin.png');
        this.game.load.image('phone', 'images/phone.png');
        this.game.load.image('charger', 'images/charger.png');
        this.game.load.image('house', 'images/house.png');
        this.game.load.image('guy', 'images/person1.png');
        this.game.load.image('girl', 'images/person2.png');
        this.game.load.image('kid', 'images/person4.png');
        this.game.load.image('dog', 'images/person3.png');
        this.game.load.image('dog2', 'images/quizdog.png');
        this.game.load.image('bird', 'images/bird.png');
        this.game.load.image('snake', 'images/snake.png');
        this.game.load.image('ear1', 'images/ear1.png');
        this.game.load.image('ear2', 'images/ear2.png');
        this.game.load.image('ear3', 'images/ear3.png');
        this.game.load.image('eye', 'images/eye.png');
        this.game.load.image('nose1', 'images/nose1.png');
        this.game.load.image('nose2', 'images/nose2.png');
        this.game.load.image('nose3', 'images/nose3.png');
        this.game.load.image('flower', 'images/flower.png');
        this.game.load.image('milk', 'images/milk.png');
        this.game.load.image('rottenEgg', 'images/rottenegg.png');
        this.game.load.image('wethands1', 'images/wethands1.png');
        this.game.load.image('wethands2', 'images/wethands2.png');
        this.game.load.image('wethands3', 'images/wethands3.png');
        this.game.load.image('tub', 'images/tub.png');
        this.game.load.image('falling_controller', 'images/falling_controller.png');
        this.game.load.image('falling_controller', 'images/falling_controller.png');
        this.game.load.image('falling_lamp', 'images/falling_lamp.png');
        this.game.load.image('falling_toaster', 'images/falling_toaster.png');
        this.game.load.image('falling_phone', 'images/falling_phone.png');
        this.game.load.image('cereal', 'images/cereal.png');
        this.game.load.image('can1', 'images/can1.png');
        this.game.load.image('can2', 'images/can2.png');
        this.game.load.image('canopener', 'images/canopener.png');
        this.game.load.image('bottles', 'images/bottles.png');
        this.game.load.image('candle', 'images/candle.png');
        this.game.load.image('flammablegirl1', 'images/flammablegirl1.png');
        this.game.load.image('flammablegirl2', 'images/flammablegirl2.png');
        this.game.load.image('flammablegirl3', 'images/flammablegirl3.png');
        this.game.load.image('book', 'images/book.png');
        this.game.load.image('tnt', 'images/tnt.png');
        this.game.load.image('blanket', 'images/blanket.png');
        this.game.load.image('grill', 'images/grill.png');
        this.game.load.image('wall', 'images/wall.png');
        
        this.game.load.image('safeOutlet', 'images/safeoutlet.png');
        this.game.load.image('overloadedOutlet', 'images/overloadedoutlet.png');
        this.game.load.image('brokenOutlet', 'images/brokenoutlet.png');

        this.game.load.image('ladder', 'images/ladder.png');
        this.game.load.image('ladderruler', 'images/ladderruler.png');
        this.game.load.image('powerLine', 'images/powerlines.png');
        this.game.load.image('ladderButton', 'images/ladderbutton.png');
        this.game.load.image('ladderButton_down', 'images/ladderbutton_down.png');

        this.game.load.image('fridge1Open', 'images/fridge1Open.png');
        this.game.load.image('fridge2Open', 'images/fridge2Open.png');
        this.game.load.image('fridge3Open', 'images/fridge3Open.png');
        this.game.load.image('fridge4Open', 'images/fridge4Open.png');
        this.game.load.image('fridge1Closed', 'images/fridge1Closed.png');
        this.game.load.image('fridge2Closed', 'images/fridge2Closed.png');
        this.game.load.image('fridge3Closed', 'images/fridge3Closed.png');
        this.game.load.image('fridge4Closed', 'images/fridge4Closed.png');

        this.game.load.image('acOn', 'images/acOn.png');
        this.game.load.image('blenderOn', 'images/blenderOn.png');
        this.game.load.image('tvOn', 'images/tvOn.png');
        this.game.load.image('lampOn', 'images/lampOn.png');
        this.game.load.image('computerOn', 'images/computerOn.png');
        this.game.load.image('acOff', 'images/acOff.png');
        this.game.load.image('blenderOff', 'images/blenderOff.png');
        this.game.load.image('tvOff', 'images/tvOff.png');
        this.game.load.image('lampOff', 'images/lampOff.png');
        this.game.load.image('computerOff', 'images/computerOff.png');

        this.game.load.image('hand1', 'images/bighand_1.png');
        this.game.load.image('hand2', 'images/bighand_2.png');
        this.game.load.image('hand3', 'images/bighand_3.png');
        this.game.load.image('pullCord', 'images/pullcord.png');
        this.game.load.image('pullPlug', 'images/pullplug.png');
        this.game.load.image('plugoutlet', 'images/plugoutlet.png');

        this.game.load.image('furniture1', 'images/chair1.png');
        this.game.load.image('furniture2', 'images/table.png');
        this.game.load.image('furniture3', 'images/rug.png');
        this.game.load.image('furniture4', 'images/chair2.png');
        this.game.load.image('furniture5', 'images/stool.png');
        this.game.load.image('furnitureCord', 'images/furniturecord.png');

        this.game.load.image('characterIntroBox', 'images/instruction_box.png');
        this.game.load.image('checkmark', 'images/checkmark.png');
        this.game.load.image('noseRed', 'images/noseRed.png');
        this.game.load.image('exclamationpoint', 'images/exclamationpoint.png');
        this.game.load.image('furnace', 'images/leak_furnace.png');
        this.game.load.image('dryer', 'images/leak_dryer.png');
        this.game.load.image('stove', 'images/leak_stove.png');
        this.game.load.image('fireplace', 'images/leak_fireplace.png');
        this.game.load.image('stovetop', 'images/stovetop.png');
        this.game.load.image('papertowels', 'images/papertowels.png');

        this.game.load.image('heart', 'images/heart.png');

        this.game.load.image('background_black', 'images/background_black.png');
        this.game.load.image('background_hanger', 'images/background_hanger.png');
        this.game.load.image('background_cockpit', 'images/background_cockpit_starless.png');
        this.game.load.image('background_stars', 'images/background_stars.png');
        this.game.load.image('background_hanger_cockpit', 'images/background_hanger_cockpit.png');
        this.game.load.image('background_electric_planet', 'images/background_electric_planet.png');
        this.game.load.image('background_gas_planet', 'images/background_gas_planet.png');
        this.game.load.image('background_storm_planet', 'images/background_storm_planet.png');
        this.game.load.image('background_sky', 'images/background_sky.png');
        this.game.load.image('background_ladder', 'images/background_ladder.png');
        this.game.load.image('background_floor', 'images/background_floor.png');
        this.game.load.image('background_bathroom', 'images/background_bathroom.png');

        this.game.load.image('planet_electric_reg', 'images/planet_electric_reg.png');
        this.game.load.image('planet_gas_reg', 'images/planet_gas_reg.png');
        this.game.load.image('planet_storm_reg', 'images/planet_storm_reg.png');
        this.game.load.image('utility_belt_label', 'images/utility_belt_label.png');
        this.game.load.image('planet_label_storm', 'images/planet_label_storm.png');
        this.game.load.image('planet_label_gas', 'images/planet_label_gas.png');
        this.game.load.image('planet_label_electric', 'images/planet_label_electric.png');

        this.game.load.spritesheet('tap_spriteSheet', 'images/tap_spriteSheet.png', 150, 150, 2);
        this.game.load.image('particle_electricity', 'images/particle_electricity.png');
        this.game.load.image('particle_fire', 'images/particle_fire.png');

        this.game.load.image('dialogueBox', 'images/dialogue_box.png');
        this.game.load.image('dialogueBoxWide', 'images/dialogue_box_wide.png');
        this.game.load.image('safe-t_pose_atEase', 'images/safe-t_pose_atEase.png');
        this.game.load.image('gasian_pose_reg', 'images/gasian_pose_reg.png');
        this.game.load.image('boltian_pose_reg', 'images/boltian_pose_reg.png');
        this.game.load.image('stormian_pose_reg', 'images/stormian_pose_reg.png');

        this.game.load.image('lose_explode', 'images/lose_explode.png');
        this.game.load.image('lose_electric', 'images/lose_electric.png');
        this.game.load.image('lose_neutral', 'images/lose_neutral.png');
        this.game.load.image('win_popup', 'images/win_popup.png');

        
        this.game.load.image('psc_badge', 'images/PSC Captain Badge trimmed.png');
        this.game.load.image('restart_button', 'images/restart_button.png');
        this.game.load.image('idle_popup', 'images/idle_popup.png');
        this.game.load.image('skip_popup', 'images/skip_popup.png');
    },
    create: function ()
    {
        currentTrialIndex = 0;
        this.game.state.start('titlescreen', Main.TitleScreen);
    },

}//PRELOADER


//SPLASH SCREEN OBJECT
Main.SplashScreen = function (game)
{
    this.game = game;
};
Main.SplashScreen.prototype = {
    fadeOutTween: Phaser.Tween,
    blackFade: Phaser.Image,

    create: function ()
    {
        this.game.add.image(0, 0, 'background_splash');
        var splashImage = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'PSC_planet');
        splashImage.anchor.setTo(0.5, 0.5);
    },

    update: function ()
    {
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.transitionToNextScreen, this);//this.goToTitle
    },

    transitionToNextScreen: function ()
    {
        blackFade = this.game.add.image(0, 0, 'background_black');
        blackFade.alpha = 0;
        fadeOutTween = this.game.add.tween(blackFade).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
        fadeOutTween.onComplete.add(this.goToTitle, this);
    },

    goToTitle: function()
    {
        this.game.state.start('titlescreen', Main.TitleScreen);
    },

}//Main.SplashScreen

//TITLE SCREEN OBJECT
Main.TitleScreen = function (game)
{
    this.game = game;
};
Main.TitleScreen.prototype = {
    fadeOutTween: Phaser.Tween,
    blackFade: Phaser.Image,
    tapMessage: Phaser.Image,
    num: Number,

    create: function ()
    {
        this.game.add.image(0, 0, 'titlescreen');
        completedPlanets = [false, false, false];
        losses = [0, 0, 0];
        pause = false;

        tapMessage = this.game.add.image(this.game.world.centerX, this.game.height - 150, 'tap_to_start');
        tapMessage.anchor.setTo(0.5, 0.5);

        num = 1;
    },

    update: function ()
    {
        if (this.game.input.activePointer.isDown)
            this.transitionToNextScreen();
        
        tapMessage.alpha = (Math.sin(num)+ 1) /2;
        num += 0.03;
    },

    transitionToNextScreen: function ()
    {
        blackFade = this.game.add.image(0, 0, 'background_black');
        blackFade.alpha = 0;
        fadeOutTween = this.game.add.tween(blackFade).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
        fadeOutTween.onComplete.add(this.nextScreen, this);
    },

    nextScreen: function ()
    {
        if (canIdle) {
            clearInterval(idleTimer);//prevent duplicate idle timers
            idleTimer = setInterval(idleTimerIncrement, 1000);//every 15 seconds
        }
        this.game.state.start('hangerscene', Main.HangerScene);
    },

}//Main.TitleScreen
//STORY SCREEN GENERIC OBJECT
Main.StoryScreen = function (game)
{
    this.game = game;
};
Main.StoryScreen.prototype = {
    tapReady: Boolean,
    delayDialogue:Boolean,
    dialogueStarted:Boolean,
    myNextScreen: Array,
    dialogue: Array,

    doFadeIn: Boolean,
    fadeOutTween: Phaser.Tween,
    fadeInTween: Phaser.Tween,
    blackFade: Phaser.Image,
    backTint: Phaser.Image,

    dialogueBox: Phaser.Image,
    currentDialogueObject: DialogueObject,
    previousDialogueObject: DialogueObject,
    currentCharacter: Phaser.Image,
    previousCharacter: Phaser.Image,

    flyOut: Phaser.Tween, //for exiting character

    tapAnimation: Phaser.Sprite,

    create: function ()
    {
        currentCharacter = null;
        tapAnimation = null;
        flyOut = null;
        fadeOutTween = null;
        fadeInTween = null;
        doFadeIn = true;
        dialogue = [];
        currentDialogueObject = null;
        dialogueBox = null;
        delayDialogue = true;
        this.setup();
        tapReady = false;
        dialogueStarted = false;
        if (doFadeIn == true)
        {
            blackFade = this.game.add.image(0, 0, 'background_black');
            fadeInTween = this.game.add.tween(blackFade).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
        }//doFadeIn
        if (delayDialogue == true)
        {
            this.game.time.events.add(Phaser.Timer.SECOND * 0.7, this.startDialogue, this);//.5
        }
        else
        {
            this.startDialogue();
        }
        
        //for winscreen adding badge on top
        this.lateSetup();
    },

    startDialogue: function()
    {
        if (dialogue.length > 0) {

            if (delayDialogue == true)
            {
                backTint = this.game.add.image(0, 0, 'background_black');
                backTint.alpha = 0;
                this.game.add.tween(backTint).to({ alpha: 0.5 }, 300, Phaser.Easing.Linear.None, true);
                this.game.time.events.add(300, function () { this.advanceDialogue(); dialogueStarted = true; }, this);
            }
            else {
                var blackOverlay = this.game.add.image(0, 0, 'background_black');
                blackOverlay.alpha = 0.5;
                this.advanceDialogue();
                dialogueStarted = true;
            }
        }
    },

    update: function ()
    {
        if (((this.game.input.activePointer.isDown && dialogueStarted) && (fadeInTween == null || fadeInTween.isRunning == false) && tapReady == true) && !pause)
        {
            if (dialogue.length > 0)
            {
                this.advanceDialogue();
            }
            else if (fadeOutTween == null && (flyOut == null || flyOut.isRunning == false))
            {
                if (typeof currentDialogueObject != 'undefined' && currentDialogueObject != null && currentDialogueObject.flyOut == true && flyOut == null) {
                    var tempPos = currentCharacter.position.clone();
                    if (currentDialogueObject.boxType == 0) tempPos.y += 500;
                    else if (currentDialogueObject.boxType == 1) tempPos.x -= 400;
                    else if (currentDialogueObject.boxType == 2) tempPos.x += 400;
                    flyOut = this.game.add.tween(currentCharacter.position).to({ x: tempPos.x, y: tempPos.y }, 200, Phaser.Easing.Linear.None, true);

                    if (typeof dialogueText != 'undefined')
                        dialogueText.destroy();
                    if (typeof nameText != 'undefined')
                        nameText.destroy();
                    if (typeof dialogueBox != 'undefined')
                        dialogueBox.destroy();
                    if (typeof tapAnimation != 'undefined')
                        tapAnimation.destroy();
                }
                else {
                    this.dialogueFinished();
                }
            }
            tapReady = false;
        }
        if (this.game.input.activePointer.isDown == false && tapReady == false) {
            tapReady = true;
        }

        //FOR AFTER FLY OUT
        if (typeof currentDialogueObject != 'undefined' && currentDialogueObject != null && currentDialogueObject.flyOut == true && flyOut != null && flyOut.isRunning == false && dialogue.length == 0)
        {
            this.dialogueFinished();
        }
    },

    setup: function ()
    {
        this.game.add.image(0, 0, 'background');
    },

    lateSetup: function ()
    {
        
    },

    advanceDialogue: function()
    {
        if (currentDialogueObject == null)
            currentDialogueObject = dialogue[0];

        if (currentDialogueObject.broughtIn == false)
        {
            if (typeof currentCharacter != 'undefined' && currentCharacter != null)
            {
                previousCharacter = currentCharacter;
                currentCharacter = null;
                if(previousDialogueObject.flyOut == true)
                {
                    var tempPos = previousCharacter.position.clone();
                    if (currentDialogueObject.boxType == 0) previousCharacter.position.y -= 500;
                    else if (currentDialogueObject.boxType == 1) previousCharacter.position.x += 300;
                    else if (currentDialogueObject.boxType == 2) previousCharacter.position.x -= 300;
                    flyOut = this.game.add.tween(previousCharacter.position).to({ x: tempPos.x, y: tempPos.y }, 200, Phaser.Easing.Linear.None, true);
                }
                else
                {
                    previousCharacter.destroy();
                }
            }
            
            //bring in tween
            currentCharacter = this.game.add.image(10, this.game.height, currentDialogueObject.pose);
            //SCALE
            if (typeof currentDialogueObject.scale != 'undefined' && currentDialogueObject.scale != 1)
            {
                currentCharacter.scale.setTo(currentDialogueObject.scale, currentDialogueObject.scale);
            }
            var x, y;
            y = this.game.height;
            if (currentDialogueObject.boxType == 0)//top
            {
                x = this.game.world.centerX;
                currentCharacter.anchor.setTo(0.5, 0.75);
                if (currentCharacter.key == 'boltian_pose_reg' || currentCharacter.key == 'stormian_pose_reg')
                    currentCharacter.anchor.y = 0.7;
            }
            else if (currentDialogueObject.boxType == 1)//left
            {
                x = 140;
                currentCharacter.anchor.setTo(0.5, 0.65);
            }
            else //2, right
            {
                x = this.game.width - 140;
                currentCharacter.anchor.setTo(0.5, 0.65);
            }
            if (currentCharacter.key == 'gasian_pose_reg')
                currentCharacter.anchor.y = 0.8;
            if (currentCharacter.key == 'psc_badge')
                currentCharacter.anchor.y = 1.05;

            currentCharacter.position.x = x;
            currentDialogueObject.broughtIn = true;

            if(currentDialogueObject.flyIn == true)
            {
                var tempPos = currentCharacter.position.clone();
                if (currentDialogueObject.boxType == 0) currentCharacter.position.y += 500;
                else if (currentDialogueObject.boxType == 1) currentCharacter.position.x -= 400;
                else if (currentDialogueObject.boxType == 2) currentCharacter.position.x += 400;
                var flyIn = this.game.add.tween(currentCharacter.position).to({ x: tempPos.x, y: tempPos.y }, 200, Phaser.Easing.Linear.None, true);
            }
        }//bring in

        //PLACE DIALOGUE BOX
        if (dialogueBox != null)
            dialogueBox.destroy();
        if (currentDialogueObject.boxType == 0) {
            dialogueBox = this.game.add.image(this.game.world.centerX, 0, 'dialogueBoxWide');
            dialogueBox.anchor.x = 0.5;
        }
        else if (currentDialogueObject.boxType == 1) {
            dialogueBox = this.game.add.image(this.game.width, this.game.height, 'dialogueBox');
            dialogueBox.anchor.setTo(1, 1);
        }
        else {
            dialogueBox = this.game.add.image(0, this.game.height, 'dialogueBox');
            dialogueBox.anchor.setTo(0, 1);
        }

        if (currentDialogueObject.lines.length > 0)
        {
            this.placeText();
            currentDialogueObject.lines.shift();
        }
        if (currentDialogueObject.lines.length == 0) {
            previousDialogueObject = dialogue.shift();
            if (dialogue.length > 0) {
                currentDialogueObject = dialogue[0];
            }
        }
    },

    placeText: function()
    {
        if(typeof dialogueText != 'undefined')
            dialogueText.destroy();
        if (typeof nameText != 'undefined')
            nameText.destroy();
        var style = dialogueTextStyle;
        style.wordWrapWidth = dialogueTextWordWrapWidth;
        if (currentDialogueObject.boxType == 0)
        {
            style.wordWrapWidth = 924;
            dialogueText = this.game.add.text(50, 50, currentDialogueObject.lines[0], style);
            nameText = this.game.add.text(55, 5, currentDialogueObject.name, nameTextStyle);
            this.placeTapAnimation(this.game.width - 150, this.game.height - 200);
        }
        else if (currentDialogueObject.boxType == 1)
        {
            dialogueText = this.game.add.text(300, 588, currentDialogueObject.lines[0], style);
            nameText = this.game.add.text(305, 548, currentDialogueObject.name, nameTextStyle);
            this.placeTapAnimation(this.game.width - 300, this.game.height - 280);
        }
        else
        {
            dialogueText = this.game.add.text(20, 588, currentDialogueObject.lines[0], style);
            nameText = this.game.add.text(25, 548, currentDialogueObject.name, nameTextStyle);
            this.placeTapAnimation(500, this.game.height - 280);
        }
    },

    placeTapAnimation: function(tapX,tapY)
    {
        if (typeof tapAnimation == 'undefined' || tapAnimation == null){
            tapAnimation = game.add.sprite(tapX, tapY, 'tap_spriteSheet');
            tapAnimation.anchor.setTo(0.5, 0.5);
            tapAnimation.animations.add('tap');
            tapAnimation.animations.play('tap', 3, true);
        }
        tapAnimation.position.setTo(tapX, tapY);
    },

    dialogueFinished: function ()
    {
        this.transitionToNextScreen();
    },

    transitionToNextScreen: function ()
    {
        //tween black fade, then switch states
        blackFade = this.game.add.image(0, 0, 'background_black');
        blackFade.alpha = 0;
        fadeOutTween = this.game.add.tween(blackFade).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
        fadeOutTween.onComplete.add(this.nextScreen, this);
    },

    nextScreen: function()
    {
            this.game.state.start(myNextScreen[0], myNextScreen[1]);
    },

}//Main.StoryScreen

//HANGER SCENE
Main.HangerScene = function (game)
{
    Main.StoryScreen.call(this);
}
Main.HangerScene.prototype = Object.create(Main.StoryScreen.prototype);
Main.HangerScene.prototype.setup = function ()
{
    this.game.add.image(0, 0, 'background_hanger');
    myNextScreen = ['cockpitscene', Main.CockpitScene];

    var d1 = new DialogueObject('Safe-T 1000','safe-t_pose_atEase', 0, true);
    d1.lines.push("Hello, you must be the new trainee! Welcome to the Planetary Safety Commission. My name is Safe-T 1000, and I'll be assisting you on your missions.");
    d1.lines.push("As you know, the purpose of the PSC is to spread knowledge about utility safety across the universe.");
    d1.lines.push("Our captains fly their ships to planets in need, and teach the inhabitants how they can be safer.");
    d1.lines.push("Let's get aboard the ship.");
    dialogue.push(d1);
}//create
//HANGER SCENE

//COCKPIT SCENE
Main.CockpitScene = function (game)
{
    Main.StoryScreen.call(this);
}
Main.CockpitScene.prototype = Object.create(Main.StoryScreen.prototype);
Main.CockpitScene.prototype.setup = function ()
{
    this.game.add.image(0, 0, 'background_hanger_cockpit');
    this.game.add.image(0, 0, 'background_cockpit');
    myNextScreen = ['utilitybeltscene', Main.UtilityBeltScene];

    var d1 = new DialogueObject('Safe-T 1000','safe-t_pose_atEase', 1, true);
    d1.lines.push("To be officially certified as a captain, you must complete training missions on the planets of the Utility Belt. Each planet specializes in one utility.");
    d1.lines.push("It won't take us long to get there in this ship.");
    
    dialogue.push(d1);
}//create
//COCKPIT SCENE

//UTILITY BELT SCENE
Main.UtilityBeltScene = function (game)
{
    Main.StoryScreen.call(this);
}
Main.UtilityBeltScene.prototype = Object.create(Main.StoryScreen.prototype);
Main.UtilityBeltScene.prototype.setup = function ()
{
    this.game.add.image(0, 0, 'background_stars');
    
    var electricPlanet = this.game.add.sprite(this.game.width - 250, 230, 'planet_electric_reg');
    electricPlanet.anchor.setTo(0.5, 0.5);

    var gasPlanet = this.game.add.sprite(this.game.world.centerX, 365, 'planet_gas_reg');
    gasPlanet.anchor.setTo(0.5, 0.5);

    var stormPlanet = this.game.add.sprite(250, 230, 'planet_storm_reg');
    stormPlanet.anchor.setTo(0.5, 0.5);
    this.game.add.image(0, 0, 'background_cockpit');
    
    var d1 = new DialogueObject('Safe-T 1000','safe-t_pose_atEase', 1, false, true);
    d1.lines.push("We've arrived at the Utility Belt. An ambassador from each of these planets has been chosen to guide you through a set of safety trials.");
    d1.lines.push("Please select which planet you'd like to complete the trials for first.");
    dialogue.push(d1);

    myNextScreen = ['selectPlanet', Main.SelectPlanet];

    delayDialogue = false;
}//create
Main.UtilityBeltScene.prototype.transitionToNextScreen = function ()
{
    this.nextScreen();  //skip the fadeOut
}//transitionToNextScreen
//UTILITY BELT SCENE

Main.SelectPlanet = function (game) {
    this.game = game;
}
Main.SelectPlanet.prototype = {
    electricPlanet: Phaser.Sprite,
    gasPlanet: Phaser.Sprite,
    stormPlanet: Phaser.Sprite,

    planets: Array,

    utilityBeltLabel: Phaser.Image,

    create: function ()
    {
        this.game.add.image(0, 0, 'background_stars');
        

        electricPlanet = this.game.add.sprite(this.game.width - 250, 230, 'planet_electric_reg');
        electricPlanet.anchor.setTo(0.5, 0.5);
        electricPlanet.inputEnabled = true;
        electricPlanet.events.onInputDown.add(this.click, this);

        gasPlanet = this.game.add.sprite(this.game.world.centerX, 365, 'planet_gas_reg');
        gasPlanet.anchor.setTo(0.5, 0.5);
        gasPlanet.inputEnabled = true;
        gasPlanet.events.onInputDown.add(this.click, this);

        stormPlanet = this.game.add.sprite(250, 230, 'planet_storm_reg');
        stormPlanet.anchor.setTo(0.5, 0.5);
        stormPlanet.inputEnabled = true;
        stormPlanet.events.onInputDown.add(this.click, this);

        this.game.add.image(0, 0, 'background_cockpit');
        planets = [ gasPlanet, electricPlanet, stormPlanet ];

        //checkmarks for completing planets
        for (var i = 0; i < planets.length; i++) {
            if (completedPlanets[i]) {
                planets[i].inputEnabled = false;
                addCheckMarkTo(planets[i]);
            }
        }
        addPlanetLabels();

        //TEXT
        var style = { font: "76px Helvetica", fill: "#ffffff", align: "center" };//, wordWrap: true, wordWrapWidth: 635 
        var chooseText = this.game.add.text(this.game.world.centerX, this.game.height - 120, "-Select a Planet-", style);
        chooseText.anchor.setTo(0.5, 0.5);
        chooseText.stroke = '#000000';
        chooseText.strokeThickness = 10;

        currentTrialIndex = 0;//no matter what planet, start at the beginning
    },

    click: function (planet)
    {
        if (planet == gasPlanet) {
            //go to gas trials
            currentPlanet = gasPlanetStates;
        }
        if (planet == electricPlanet) {
            //go to gas trials
            currentPlanet = electricPlanetStates;
        }
        if (planet == stormPlanet) {
            //go to gas trials
            currentPlanet = stormPlanetStates;
        }

        if (currentPlanet.length > 0) {
            gameStates = currentPlanet.slice();
            this.game.state.start('aliendialoguescene', Main.AlienDialogueScene);
        }
    },
}
//Select Planet

//ALIEN DIALOGUE SCENE
Main.AlienDialogueScene = function (game)
{
    Main.StoryScreen.call(this);
}
Main.AlienDialogueScene.prototype = Object.create(Main.StoryScreen.prototype);
Main.AlienDialogueScene.prototype.setup = function ()
{
    delayDialogue = false;

    this.game.add.image(0, 0, 'background_stars');

    doFadeIn = false;
    
    var electricPlanet = this.game.add.sprite(this.game.width - 250, 230, 'planet_electric_reg');
    electricPlanet.anchor.setTo(0.5, 0.5);

    var gasPlanet = this.game.add.sprite(this.game.world.centerX, 365, 'planet_gas_reg');
    gasPlanet.anchor.setTo(0.5, 0.5);

    var stormPlanet = this.game.add.sprite(250, 230, 'planet_storm_reg');
    stormPlanet.anchor.setTo(0.5, 0.5);

    var planets = [gasPlanet, electricPlanet, stormPlanet];

    addPlanetLabels();

    //checkmarks for completing planets
    for (var i = 0; i < planets.length; i++) {
        if (completedPlanets[i]) {
            addCheckMarkTo(planets[i]);
        }
    }
    this.game.add.image(0, 0, 'background_cockpit');

    var d1;
    if (currentPlanet == gasPlanetStates)
    {
        d1 = new DialogueObject('Clumpus','gasian_pose_reg', 2, true);
        d1.lines.push("Greetings and many splorblags to you, traveler.  I am Clumpus, and the odor you're smelling is how we Gassians say 'hello.'");
        d1.lines.push("On my planet I will teach you the ways of natural gas safety.");
    }
    else if (currentPlanet == electricPlanetStates) {
        d1 = new DialogueObject('Shocks','boltian_pose_reg', 2, true);
        d1.lines.push("What's zappenin', Captain? You can call me Shocks.  I'm gonna show you all about electric safety. High five!");
        d1.lines.push("Just kidding, I'm made out of electricity!");
    }
    else if (currentPlanet == stormPlanetStates) {
        d1 = new DialogueObject('Thunder Helm','stormian_pose_reg', 2, true);
        d1.lines.push("I am the honorable warrior known as Thunder Helm. I will be guiding you through the basics of storm safety.");
        d1.lines.push("Come, there's no time to waste.");
    }

    dialogue.push(d1);

}//set up
Main.AlienDialogueScene.prototype.nextScreen = function ()
{
    goToInstructions();
}//nextScreen
//ALIEN DIALOGUE SCENE

//WIN SCREEN
Main.WinScreen = function (game)
{
    Main.StoryScreen.call(this);
}
Main.WinScreen.prototype = Object.create(Main.StoryScreen.prototype);
Main.WinScreen.prototype.setup = function ()
{
    clearInterval(idleTimer);
    delayDialogue = false;
    this.game.add.image(0, 0, 'background_stars');
    this.game.add.image(0, 0, 'background_cockpit');
    myNextScreen = ['splashscreen', Main.SplashScreen];
    var d1 = new DialogueObject('Safe-T 1000', 'safe-t_pose_atEase', 0, true);
    d1.lines.push("Your training exercises are complete.  Let's see how the ambassadors think you did.");
    dialogue.push(d1);
    var d2 = new DialogueObject('Thunder Helm', 'stormian_pose_reg', 0, true);
    if (losses[2] == 0) {
        d2.lines.push("You completed each trial on your first attempt, like a true warrior.");
    }
    else if (losses[2] <= 5) {
        d2.lines.push("You made a few mistakes, but eventually pulled through. A good warrior needs perseverance.");
    }
    else {
        d2.lines.push("You seem to have had some trouble, but finished none the less.");
    }
    d2.lines.push("Overall, you pass storm safety.");
    dialogue.push(d2);
    var d3 = new DialogueObject('Clumpus', 'gasian_pose_reg', 0, true);
    if (losses[0] == 0) {
        d3.lines.push("A perfect score on the gas trials! Well done, human.");
    }
    else if (losses[0] <= 5) {
        d3.lines.push("Minimal problems.  Not bad, human.");
    }
    else {
        d3.lines.push("You had some rough patches, but I stink you'll be just fine.");
    }
    d3.lines.push("You pass gas safety!");
    dialogue.push(d3);
    var d4 = new DialogueObject('Shocks', 'boltian_pose_reg', 0, true);
    if (losses[1] == 0) {
        d4.lines.push("Whoa, you didn't mess up once on the electric trials. Most excellent job!");
    }
    else if (losses[1] <= 5) {
        d4.lines.push("You messed up a little, but who doesn't?");
    }
    else {
        d4.lines.push("Looks like you had some problems. You still won in the end, though.");
    }
    d4.lines.push("Electrical safety is totally a pass!");
    dialogue.push(d4);

    var d5 = new DialogueObject('Safe-T 1000', 'safe-t_pose_atEase', 0, true);
    d5.lines.push("Congratulations! You've completed your training and are now an officially certified captain of the Planetary Safety Commission, New York State Division!");
    dialogue.push(d5);

    var d6 = new DialogueObject('Safe-T 1000', 'psc_badge', 0, false,false,0.45);
    d6.lines.push("Show an attendant that you won and you'll be given a badge proving your rank.  Good luck on future missions, Captain!");
    dialogue.push(d6);

}//setup
Main.WinScreen.prototype.lateSetup = function ()
{
    //add overriding steps here
}

Main.WinScreen.prototype.dialogueFinished = function () 
{
    if (dialogueBox != null) {
        dialogueBox.destroy();
        dialogueText.destroy();
        tapAnimation.destroy();
        var restartButton = this.game.add.sprite(this.game.world.centerX, this.game.world.height / 6, 'restart_button');
        restartButton.anchor.setTo(0.5, 0.5);
        restartButton.inputEnabled = true;
        restartButton.events.onInputDown.add(this.transitionToNextScreen, this);
    }
}
//WIN SCREEN

//GENERIC INSTRUCTION SCREEN OBJECT
Main.Instr = function (game)
{
    this.game = game;
};

Main.Instr.prototype = {
    text: Phaser.Text,
    tapReady: Boolean, //to make sure if their finger was already down it doesn't skip
    canSkip: Boolean,
    character: Phaser.Image,

    create: function ()
    {
        var textColor;
        //CHARACTER
        if (currentPlanet == gasPlanetStates) {
            this.game.add.image(0, 0, 'background_gas_planet');
            character = this.game.add.image(170, this.game.height + 60, 'gasian_pose_reg');
            textColor = "#97b748";//"#7d973b";
        }
        else if (currentPlanet == electricPlanetStates) {
            this.game.add.image(0, 0, 'background_electric_planet');
            character = this.game.add.image(170, this.game.height + 60, 'boltian_pose_reg');
            textColor = "#fffd3c";
        }
        else if (currentPlanet == stormPlanetStates) {
            this.game.add.image(0, 0, 'background_storm_planet');
            character = this.game.add.image(170, this.game.height + 60, 'stormian_pose_reg');
            textColor = "#dd6f8e";//cc2150
        }
        character.anchor.setTo(0.5, 1);

        tapReady = false;
        canSkip = false;
        trialLoseCount = 0;

        game.time.events.add(Phaser.Timer.SECOND * .5, function () {

            var instructBox = this.game.add.image(this.game.width - 5, 20, 'characterIntroBox');
            instructBox.anchor.setTo(1, 0);
            instructBox.alpha = 0;
            this.game.add.tween(instructBox).to({ alpha: 0.75 }, 750, Phaser.Easing.Linear.None, true);

            var style = { font: "53px Helvetica", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 615 }; 
            style.fill = textColor;
            var textString = "default text";
            text = this.game.add.text(this.game.width * 0.68, this.game.world.centerY - 50, textString, style);
            text.anchor.setTo(0.5, 0.5);
            text.stroke = '#000000';
            text.strokeThickness = 4;//8
            text.alpha = 0;
            this.game.add.tween(text).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);

            style = { font: "48px Helvetica", fill: "#ffffff", align: "center" };//58px
            var textString = "(Tap to continue)";
            var tapText = this.game.add.text(this.game.width * 0.68, this.game.height - 80, textString, style);
            tapText.anchor.setTo(0.5, 0.5);
            tapText.stroke = '#000000';
            tapText.strokeThickness = 6;
            tapText.alpha = 0;
            this.game.add.tween(tapText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);

            tapReady = false;
            game.time.events.add(1000, function () {
                canSkip = true;
            }, this);
            
            this.changeText();
        }, this);
    },

    update: function ()
    {
        if (this.game.input.activePointer.isDown && this.tapReady && canSkip && !pause) {
            goToTrial();
        }
        if (this.game.input.activePointer.isDown == false && this.tapReady == false) {
            tapReady = true;
        }
    },

    changeText: function()
    {
        //override this
    },

}//Main.Instr


//START OF GLOBAL FUNCTIONS
var started = false;
var trialOver = false;
var timeUp = false;
var tween = null;
var lives = 3;
var hearts = [];
var deadHearts = [];
var immune = false;
var immunityDuration = 75;//1.25 seconds
var immunityTimer = 0;

//var trialTextString;// String,
var trialTextStyle = { font: "66px Helvetica", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 950 };
var trialText;// Phaser.Text,

function DialogueObject(aName,aPose,aBoxType,doFlyIn,doFlyOut,aScale)
{
    this.name = aName || "";
    this.pose = aPose;
    this.boxType = aBoxType;
    this.flyIn = doFlyIn;
    this.flyOut = doFlyOut || false;
    this.lines = new Array();
    this.scale = aScale || 1;
}
DialogueObject.prototype = {
    broughtIn: false,
    pose: String,
    flyIn: true,
    flyOut: false,
    boxType: 0,
    lines: Array,
    name: String,
    scale: Number,
}//DialogueObject

function goToInstructions()
{
    game.state.start(gameStates[currentTrialIndex][0], gameStates[currentTrialIndex][1]);
}//goToInstructions

function goToTrial()//from instructions
{
    trialOver = false;
    game.state.start(gameStates[currentTrialIndex][2], gameStates[currentTrialIndex][3]);
}//goToTrial

//TEMPORARY - GOES THROUGH INSTR AND TRIALS IN SAME ORDER EACH TIME
function nextTrial()
{
    if (gameStates.length == currentTrialIndex)
    {
        //save that you finished that planet
        if (currentPlanet == gasPlanetStates)
            completedPlanets[0] = true;
        else if (currentPlanet == electricPlanetStates)
            completedPlanets[1] = true;
        else if (currentPlanet == stormPlanetStates)
            completedPlanets[2] = true;
        if (completedPlanets[0] == true && completedPlanets[1] == true && completedPlanets[2] == true)
            this.game.state.start('winscreen', Main.WinScreen);
        else
            this.game.state.start('selectPlanet', Main.SelectPlanet);
        currentPlanet = new Array();
        return;
    }
    else if (lastTrial == currentTrialIndex) {
        goToTrial();
    }
    else
    {
        goToInstructions();
    }
}//nextTrial

var background;
function createMiniGame() {
    lastTrial = currentTrialIndex;
    lives = 3;
    immune = false;
    immunityTimer = 0;
    started = false;
    timeUp = false;
    hintText = null;
    background = this.game.add.image(0, 0, 'background');
}


function makeTrialText(forQuiz)
{
    trialText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "", trialTextStyle);//textString
    trialText.anchor.setTo(0.5, 0.5);
    trialText.stroke = '#000000';
    trialText.strokeThickness = 6;//8
    if (forQuiz != null && forQuiz == true)
    {
        trialText = this.game.add.text(this.game.world.centerX, 25, "", trialTextStyle);
        trialText.anchor.setTo(0.5, 0);
    }
}//makeTrialText

function setTrialTextString(myString)
{
    trialText.text = myString;
}//setTrialTextString

var blackOverlay;
function showTrialResult(imageKey)//,callbackFunction)
{
    if ((tween == null || tween.isRunning == false) && trialOver == false) {
        blackOverlay = this.game.add.image(0, 0, 'background_black');//var
        blackOverlay.alpha = 0.5;

        if (trialLoseCount > 2) {
            imageKey = "skip_popup";
        }

        popup = game.add.sprite(game.world.centerX, game.height + 200, imageKey);//var 
        popup.anchor.setTo(0.5, 0.5);
        tween = game.add.tween(popup.position).to({ y: game.world.centerY }, 1000, Phaser.Easing.Elastic.Out, true);
        trialOver = true;
        started = false;
        blackOverlay.inputEnabled = true;//popup

        //Delay mostly for ladder game so button mashing doesn't skip result
        game.time.events.add(Phaser.Timer.SECOND * 0.5, function ()
        {
            //if (trialLoseCount > 3) {
            if (imageKey == "skip_popup") {
                blackOverlay.events.onInputDown.add(function () {
                    var x = this.game.input.activePointer.x;
                    var y = this.game.input.activePointer.y;

                    var buttonXleft = 340;
                    var buttonXright = 685;
                    var skipTop = 345;
                    var skipBottom = 445;
                    var retryTop = 470;
                    var retryBottom = 560;

                    //check to see if we are within the x area of the buttons
                    if (x > buttonXleft && x < buttonXright) {
                        //check to see if the continue button was clicked and continue game
                        if (y > skipTop && y < skipBottom) {
                            blackOverlay.inputEnabled = false;
                            tween = null;
                            currentTrialIndex++;
                            nextTrial();
                        }

                        //check to see if the restart button was clicked and restart game
                        if (y > retryTop && y < retryBottom) {
                            blackOverlay.inputEnabled = false;
                            tween = null;
                            nextTrial();
                        }
                    }
                }, this);
            }
            else {
                blackOverlay.events.onInputDown.add(function () //popup
                {
                    if (!pause) {
                        blackOverlay.inputEnabled = false;
                        tween = null;
                        nextTrial();
                    }
                }, this);//nullify tween in case they click before it's done
            }
        }, this);
        

        if (hintText != null) {
            var hint = game.add.sprite(0, game.world.height, 'dialogueBoxWide');
            hint.anchor.setTo(0, 1);
            hint.position.y = game.world.height + hint.height;

            var style = dialogueTextStyle;
            style.wordWrapWidth = 924;
            var text = game.add.text(hint.width / 2, -hint.height / 2, hintText, style);
            text.anchor.setTo(0.5, 0.5);

            nameText = this.game.add.text(125, (-hint.height) + 5, "Tip", nameTextStyle);//x 50

            hint.addChild(nameText);
            hint.addChild(text);

            var hintTween = game.add.tween(hint.position).to({ y: game.world.height }, 100, Phaser.Easing.Linear.None, true).delay(200).start();
        }

        if (timer != null) {
            stopTimer();
        }
    }
}//showResult

function win()//callbackFunction)
{
    currentTrialIndex++;
    trialLoseCount = 0;
    showTrialResult('win_popup');
}//win

function incrementLoss() 
{
    if (currentPlanet == gasPlanetStates)
        losses[0]++;
    else if (currentPlanet == electricPlanetStates)
        losses[1]++;
    else if (currentPlanet == stormPlanetStates)
        losses[2]++;
    trialLoseCount++;
}

function loseExplode()
{
    incrementLoss();
    showTrialResult('lose_explode');
}//loseloseExplode

function loseElectric()
{
    incrementLoss();
    showTrialResult('lose_electric');
}//loseElectric

function loseNeutral()
{
    incrementLoss();
    showTrialResult('lose_neutral');
}//loseNeutral

//SPRITE FUNCTIONS
function localSpriteTop(mySprite)
{
    var aTop = mySprite.height;
    if (mySprite.anchor.y != 0)
        aTop = mySprite.height - mySprite.height * mySprite.anchor.y;
    return aTop;
}//localSpriteTop

function localSpriteBottom(mySprite)
{
    var aBottom = 0;
    if (mySprite.anchor.y != 0)
        aBottom = mySprite.height * mySprite.anchor.y;
    return aBottom;
}//localSpriteBottom

function localSpriteLeft(mySprite)
{
    var aLeft = 0;
    if (mySprite.anchor.x != 0)
        aLeft = mySprite.width * mySprite.anchor.x;
    return aLeft;
}//localSpriteLeft

function localSpriteRight(mySprite)
{
    var aRight = mySprite.width;
    if (mySprite.anchor.x != 0)
        aRight = mySprite.width - mySprite.width * mySprite.anchor.x;
    return aRight;
}//localSpriteRight

function spriteTop(mySprite)
{
    var aTop = mySprite.position.y + mySprite.height;
    if (mySprite.anchor.y != 0)
        aTop = mySprite.position.y + localSpriteTop(mySprite);
    return aTop;
}//spriteTop

function spriteBottom(mySprite)
{
    var aBottom = mySprite.position.y;
    if (mySprite.anchor.y != 0)
        aBottom = mySprite.position.y - localSpriteBottom(mySprite);
    return aBottom;
}//spriteBottom

function spriteLeft(mySprite)
{
    var aLeft = mySprite.position.x;
    if (mySprite.anchor.x != 0)
        aLeft = mySprite.position.x - localSpriteLeft(mySprite);
    return aLeft;
}//spriteLeft

function spriteRight(mySprite)
{
    var aRight = mySprite.position.x + mySprite.width;
    if (mySprite.anchor.x != 0)
        aRight = mySprite.position.x + localSpriteRight(mySprite);
    return aRight;
}//spriteRight

function keepSpriteOnScreen(sprite)
{
    if (spriteTop(sprite) > game.height)
        sprite.position.y = game.height - localSpriteTop(sprite);
    if (spriteBottom(sprite) < 0)
        sprite.position.y = 0 + localSpriteBottom(sprite);
    if (spriteLeft(sprite) < 0)
        sprite.position.x = 0 + localSpriteLeft(sprite);
    if (spriteRight(sprite) > game.width)
        sprite.position.x = game.width - localSpriteRight(sprite);
}//keepSpriteOnScreen

function testAABBCollision(spriteA, spriteB)
{
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}//testAABBCollision

function addCheckMarkTo(mySprite)
{
    var checkmark = this.game.add.sprite(0, 0, 'checkmark');
    checkmark.anchor.setTo(0.35, 0.65);
    checkmark.scale.setTo(0.7, 0.7);
    mySprite.addChild(checkmark);
}//addCheckMarkTo

function flyInText(myText)
{
    myText.scale.setTo(4, 4);
    game.add.tween(myText.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Linear.None, true);
}//flyInText

function setTimer()
{
    started = true;
    timer = game.time.events.add(Phaser.Timer.SECOND * trialDuration, function () { timeUp = true; }, this);
    timerDisplay = this.game.add.graphics(0, 0);
}//setTimer

function stopTimer()
{
    game.time.events.remove(timer);
}//stopTimer

function setUpHearts()
{
    hearts = new Array();
    deadHearts = new Array();
    for (var i = 0; i < 3;i++)
    {
        var heart = game.add.image(10 + i * 10, 10, 'heart');
        heart.position.x += heart.width * i + heart.width/2;
        heart.position.y += heart.height / 2;
        heart.anchor.setTo(0.5, 0.5);
        hearts.push(heart);
    }
}//setUpHearts

function destroyHeart()
{
    var heart = deadHearts.shift();
    heart.destroy();
}//destroyHeart

function updateHearts()
{
    if (hearts.length > lives)
    {
        var heart = hearts.pop();
        deadHearts.push(heart);
        var heartTween = game.add.tween(heart.scale).to({ x: 0, y: 0 }, 100, Phaser.Easing.Linear.None, true);
        heartTween.onComplete.add(destroyHeart, this);
    }
}//updateHearts

function setImmunity()
{
    if (lives > 0)
    {
        immune = true;
        immunityTimer = 0;
    }
}//setImmunity

function checkImmunity(sprite) 
{
    if (immunityTimer >= immunityDuration) {
        immune = false;
        if (typeof sprite != 'undefined' && sprite != null)
            sprite.alpha = 1;
    }
    if (immune == true) {
        immunityTimer++;
    }
    if (typeof sprite != 'undefined' && sprite != null)
    {
        if (immune)
        {
            if (immunityTimer < 15)
                sprite.alpha = 0.5;
            else if (immunityTimer < 30)
                sprite.alpha = 1;
            else if (immunityTimer < 45)
                sprite.alpha = 0.5;
            else if (immunityTimer < 60)
                sprite.alpha = 1;
            else //if (immunityTimer < 60)
                sprite.alpha = 0.5;
        }
    }
        
}//checkImmunity

//All trials should call this method in update. This is a global update function.
//updates timer display
function globalUpdate() {
    if (!trialOver) {
        if (timer != null && started) {
            var percent = timer.timer.duration / (Phaser.Timer.SECOND * trialDuration);

            var red = 0;
            var green = 255;

            if (percent * 100 <= 75) {
                var rPercent = ((percent * 100) - 50) / 25;
                if (rPercent < 0) {
                    rPercent = 0;
                }

                red = 255 * (1 - rPercent);
            }

            if (percent * 100 <= 50) {
                var gPercent = ((percent * 100) - 25) / 25;
                if (gPercent < 0) {
                    gPercent = 0;
                }

                green = 255 * gPercent;
            }

            timerDisplay.clear();

            timerDisplay.beginFill(Phaser.Color.getColor(red, green, 0));
            timerDisplay.drawRect(0, this.game.world.height - 25, this.game.world.width * percent, 25);
            timerDisplay.alpha = 0.75;
        }
    }
}


function addPlanetLabels()
{
    var utilityBeltLabel = this.game.add.image(this.game.world.centerX, 0, 'utility_belt_label');
    utilityBeltLabel.anchor.setTo(0.5, 0);

    var label = this.game.add.sprite(250, 230, 'planet_label_storm');
    label.anchor.setTo(0.5, 0.5);
    label = this.game.add.sprite(this.game.world.centerX, 365, 'planet_label_gas');//350
    label.anchor.setTo(0.5, 0.5);
    label = this.game.add.sprite(this.game.width - 250, 230, 'planet_label_electric');
    label.anchor.setTo(0.5, 0.5);
}//addPlanetLabels

function resetIdleTimer() {
    idleTime = 0;
}

function idleTimerIncrement() {
    idleTime++;
    if (idleTime > 29) //idle time in seconds before refresh
    {
        idleTime = 0;
        clearInterval(idleTimer);
        var idlePopup = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'idle_popup');
        idlePopup.anchor.setTo(0.5, 0.5);
        idlePopup.inputEnabled = true;
        pause = true;
        idlePopup.events.onInputDown.add(function () {
            var x = this.game.input.activePointer.x;
            var y = this.game.input.activePointer.y;

            var buttonXleft = 340;
            var buttonXright = 685;
            var continueTop = 345;
            var continueBottom = 445;
            var restartTop = 470;
            var restartBottom = 560;

            //check to see if we are within the x area of the buttons
            if (x > buttonXleft && x < buttonXright) {
                //check to see if the continue button was clicked and continue game
                if (y > continueTop && y < continueBottom) {
                    idlePopup.destroy();
                    clearInterval(idleTimer);//prevent duplicate idle timers
                    idleTimer = setInterval(idleTimerIncrement, 1000);//every 15 seconds
                    this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () { pause = false; }); //short delay to prevent auto-skipping dialogue
                }

                //check to see if the restart button was clicked and restart game
                if (y > restartTop && y < restartBottom) {
                    this.game.state.start('titlescreen', Main.TitleScreen);
                }
            }
        }, this);
        //this.game.state.start('titlescreen', Main.TitleScreen);
    }
}

//END OF GLOBAL FUNCTIONS/VARIABLES


