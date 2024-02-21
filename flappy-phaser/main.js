//Create our 'main' state that will contain the game
var mainState = {

    //This function will be executed at the beginning 
    //That's where we load the images and sounds
    preload: function(){
        game.load.image('bird', 'assets/heart-small.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('pt', 'assets/pipe-top.png');
        game.load.image('pb', 'assets/pipe-bottom.png');
        game.load.image('healthImg', 'assets/healthBlock.png');
    },

    //This function is called after the preload function
    //Here we set up tha game, display sprites, etc.
    create: function(){
        game.stage.backgroundColor = '#0';
        

        //Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Displaying the bird at x=100 y=245
        this.bird = game.add.sprite(100, 245, 'bird');
        
        //Add physics to the bird
        //Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);
        
        //Gravity to make the bird fall
        this.bird.body.gravity.y = 1000;
        //Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes,this);

        this.health = game.add.group();
        this.healthCount = 4;
        this.addRowOfHealthBlocks();
        // this.score = 0;
        this.labelHealth = game.add.text(20, 20, "health: ", { font: "25px Arial", fill: "#ffffff"});

    },

    //This function is called 60 times per second
    //It contains the game's logic
    update: function(){

        //If the bird is out of the screen we can call the 
        //'restartGame' function
        if (this.bird.y <0 || this.bird.y >490) {
            this.restartGame();
        }
        game.physics.arcade.overlap(this.bird, this.pipes, 
            // this.health, 
            this.restartGame, null, this);
    },

    jump: function(){
        this.bird.body.velocity.y = -350;
    },

    restartGame: function() {
        game.state.start('main');
    },


    addOnePipe: function (x, y, type) {
        //Create a pipe at the position x & y
        if (type === "normal") {
            var pipe = game.add.sprite(x, y, 'pipe');
            
        } else if(type === "top") {
            var pipe = game.add.sprite(x, y, 'pt');
        } else if(type === "bottom"){
            var pipe = game.add.sprite(x, y, 'pb');
        };

        //Add the pipe to our previously created group
        this.pipes.add(pipe);

        //Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        //Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        //Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        //Randomly pick a number between 1 & 5
        //This wil be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        //Add the 6 pipes
        //With one big hole at the position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                if(i===hole - 1) {
                    this.addOnePipe(800, i * 60 + 10, "bottom");
                } else if(i===hole + 2) {
                    this.addOnePipe(800, i * 60 + 10, "top");
                } else {
                    this.addOnePipe(800, i * 60 + 10, "normal");

                }
            }
        }
        // this.score += 1;
        // this.labelScore.text = this.score;
    },

    addhealthBlock: function(x, y) {
        var healthBlock = game.add.sprite(x, y, "healthImg");
        this.health.add(healthBlock);
        game.physics.arcade.enable(healthBlock);
    },

    addRowOfHealthBlocks: function() {
        for (var i = 0; i < this.healthCount; i++ ){
            this.addhealthBlock(0 + i * 50, 10)
        }
    },

};

var game = new Phaser.Game(800, 490);

game.state.add('main', mainState);

game.state.start('main');
