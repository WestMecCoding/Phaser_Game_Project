var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var coin;
var platforms;
var enemy;
var score = 0;
var gem;
var scoreText;
var gameOver = false;
var cursors;

function preload() {
    this.load.image('bg', 'assets/bg.png');
    this.load.image('cat', 'assets/cat.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('gem', 'assets/gem.png');
}

function create() {
    this.add.image(500, 400, 'bg');

    platforms = this.physics.add.staticGroup();
    platforms.create(500, 750, 'ground').setScale(2).refreshBody();

    platforms.create(800, 600, 'ground'); //1Right
    platforms.create(200, 450, 'ground'); //1Left
    platforms.create(750, 220, 'ground'); //2RIght

    player = this.physics.add.sprite(50, 550, 'cat');
    enemy = this.physics.add.sprite(150, 350, 'enemy');
    coin = this.physics.add.sprite(850, 100, 'coin');
    gem = this.physics.add.sprite(950, 450, 'gem');

    player.setBounce(0.2);

    player.setCollideWorldBounds(true);
    enemy.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(coin, platforms);
    this.physics.add.collider(gem, platforms);

    this.physics.add.overlap(player, enemy, hitEnemy, null, this);
    this.physics.add.overlap(player, coin, coinGrab, null, this);
    this.physics.add.overlap(player, gem, gemGrab, null, this);
    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(100, 100, 'Score: 0', { fontSize: '32px', fill: '#000' });
}


function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-460);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(460);
    } 
    else {
        player.setVelocityX(0);
    }

    if (cursors.space.isDown && player.body.touching.down) {
        if (gemGrab === true) {
            player.setVelocityY(4000);
            // gemGrab = false;
        } else {
            player.setVelocityY(2000);
        }
    }
}
 
function hitEnemy() {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
}

function coinGrab() {
    this.physics.pause();
    coin.disableBody(true, true);
    coinGrab = true;
    gameOver = false; 
    if (coinGrab === true);
    score += 10000;
    scoreText.setText('Score: ' + score);
}

function gemGrab() {
    gem.disableBody(true, true);
    gemGrab = true;
    gameOver = false;
}

function switchGameFly() {
    window.location.href = "./indexFLY.html";
}

