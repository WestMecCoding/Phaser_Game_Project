var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            // debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
noise.seed(Math.random())

var sky;
var enemy;
var player;
var isHurt = false;
var e_isHurt = false;
var knockback;
var e_knockback;
var e_isRunning = false;
var platforms;
var w = config.width;
var h = config.height;
var scale = h/800;
var cam;
let tileWidth = w/150;

var speed = scale*250;

var mapLayout = [
    { x: 0, y: 100, width: 100, height: 100 }
];

function platform(x, y, w, h, scene) {
    graphics = scene.add.graphics();
    graphics.fillStyle(0x1f782f, 1);
    graphics.fillRect(0, 0, w, h);
    const key = 'platformTexture' + Date.now(); 
    graphics.generateTexture(key, w, h);
    platforms.create(x + (w / 2), y + (h / 2), key);
    graphics.destroy();
}

function preload() {
    this.load.image('sky', 'assets/nature_2/origbig.png');
    this.load.spritesheet('player_idle', 'assets/Shinobi/Idle.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_walk', 'assets/Shinobi/Walk.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_run', 'assets/Shinobi/Run.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_shield', 'assets/Shinobi/Shield.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_attack_1', 'assets/Shinobi/Attack_1.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_attack_2', 'assets/Shinobi/Attack_2.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_attack_3', 'assets/Shinobi/Attack_3.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_hurt', 'assets/Shinobi/Hurt.png', { frameWidth: 128, frameHeight: 128 });

    this.load.spritesheet('enemy_idle', 'assets/Fighter/Idle.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_walk', 'assets/Fighter/Walk.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_run', 'assets/Fighter/Run.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_shield', 'assets/Fighter/Shield.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_attack_1', 'assets/Fighter/Attack_1.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_attack_2', 'assets/Fighter/Attack_2.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_attack_3', 'assets/Fighter/Attack_3.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy_hurt', 'assets/Fighter/Hurt.png', { frameWidth: 128, frameHeight: 128 });
}

function create() {
    sky = this.add.image(0, 0, 'sky').setOrigin(0.5, 0.5);
    const aspectRatio = sky.width / sky.height;
    sky.setScale(config.width / sky.width, config.height / sky.height);
    sky.setScrollFactor(0);
    sky.setPosition(config.width / 2, config.height / 2);

    platforms = this.physics.add.staticGroup();

    player = this.physics.add.sprite(w/2, h/2, 'player_idle');
    player.setSize(w/50, h/10, true)
    player.setOrigin(0.5,0.5)
    player.setOffset((player.width-w/50)/2,player.height-h/10)
    player.setScale(scale)
    player.setBounce(0.3);
    sky.x = player.x;
    sky.y = player.y;

    enemy = this.physics.add.sprite(0, 0, 'enemy_idle');
    enemy.setSize(w/50, h/10, true)
    enemy.setOrigin(0.5,0.5)
    enemy.setOffset((enemy.width-w/50)/2,enemy.height-h/10)
    enemy.setScale(scale)
    enemy.setBounce(0.3);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 5 }),
        frameRate: 15
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 7 }),
        frameRate: 15
    });
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 7 }),
        frameRate: 15
    });
    this.anims.create({
        key: 'block',
        frames: this.anims.generateFrameNumbers('player_shield', { start: 0, end: 3 }),
        frameRate: 30
    });
    this.anims.create({
        key: 'attack_1',
        frames: this.anims.generateFrameNumbers('player_attack_1', { start: 0, end: 4 }),
        frameRate: 30
    });
    this.anims.create({
        key: 'attack_2',
        frames: this.anims.generateFrameNumbers('player_attack_2', { start: 0, end: 2 }),
        frameRate: 15
    });
    this.anims.create({
        key: 'attack_3',
        frames: this.anims.generateFrameNumbers('player_attack_3', { start: 0, end: 3 }),
        frameRate: 30
    });
    this.anims.create({
        key: 'hurt',
        frames: this.anims.generateFrameNumbers('player_hurt', { start: 0, end: 1 }),
        frameRate: 15
    });

    this.anims.create({
        key: 'e_walk',
        frames: this.anims.generateFrameNumbers('enemy_walk', { start: 0, end: 7 }),
        frameRate: 15
    });
    this.anims.create({
        key: 'e_run',
        frames: this.anims.generateFrameNumbers('enemy_run', { start: 0, end: 7 }),
        frameRate: 15
    });
    this.anims.create({
        key: 'e_attack_1',
        frames: this.anims.generateFrameNumbers('enemy_attack_1', { start: 0, end: 3 }),
        frameRate: 10
    });
    this.anims.create({
        key: 'e_attack_2',
        frames: this.anims.generateFrameNumbers('enemy_attack_2', { start: 0, end: 2 }),
        frameRate: 10
    });
    this.anims.create({
        key: 'e_attack_3',
        frames: this.anims.generateFrameNumbers('enemy_attack_3', { start: 0, end: 3 }),
        frameRate: 10
    });
    this.anims.create({
        key: 'e_hurt',
        frames: this.anims.generateFrameNumbers('enemy_hurt', { start: 0, end: 2 }),
        frameRate: 15
    });

    cursors = this.input.keyboard.createCursorKeys();

    wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    ShiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(enemy, player, () => {
        isHurt = true
        knockback = 1000;
    });
    this.cameras.main.setBounds(0, 0, Infinity, config.height * 2);
    this.cameras.main.startFollow(player);

    let value = (noise.simplex2(0, 1)*50)+100;
    platform(0, value*(h/100), tileWidth, h, this);
    mapLayout.push({ x: 0, w: tileWidth})
    this.physics.world.gravity.setTo(0, speed*3);
}
var attack = 0
var e_attack_i = 0
var attackToggle = true
var e_attackToggle = true
var e_attack = false
function update() {
    var a = enemy.x-player.x
    var b = enemy.y-player.y
    var distance = Math.sqrt(Math.pow(a,2)+Math.pow(b,2))
    const LastPlatform = mapLayout[mapLayout.length-1].x-w;
    const distanceToEnd = player.x - LastPlatform;
    if (distanceToEnd > 0) {
        let value = (noise.simplex2(mapLayout.length/1000, 1)*50)+100;
        let amount = mapLayout[mapLayout.length-1].x+(mapLayout[mapLayout.length-1].w-1);
        platform(amount, value*(h/100), tileWidth, h, this);
        mapLayout.push({ x: amount, w: tileWidth});
    }

    
    if (eKey.isDown) {
        player.anims.play('block', true);
    } else if (aKey.isDown) {
        if (ShiftKey.isDown) {
            player.setVelocityX(-speed*2);
            player.anims.play('run', true);
        } else {
            player.setVelocityX(-speed/2);
            player.anims.play('walk', true);
        }
        player.flipX = true;
    } else if (dKey.isDown) {
        if (ShiftKey.isDown) {
            player.setVelocityX(speed*2);
            player.anims.play('run', true);
        } else {
            player.setVelocityX(speed/2);
            player.anims.play('walk', true);
        }
        player.flipX = false;
    } else {
        if (SpaceKey.isDown) {
            player.setVelocityX(0);
            if (e_isHurt) {
                enemy.anims.play('e_hurt', true);
                enemy.setVelocityX((enemy.x-player.x)/Math.abs(enemy.x-player.x)*e_knockback);
                e_knockback-=20;
                if (e_knockback <= 0) {
                    SpaceKey.isDown = false;
                    e_isHurt = false;
                }
            }
            if (attackToggle) {
                if (distance <= speed/2) {
                    e_knockback = 1000;
                    e_isHurt = true;
                }
                attackToggle = false;
                attack++;
            }
            if (attack > 3) {attack = 1}
            player.anims.play(`attack_${attack}`, true);
        } else {
            if (isHurt) {
                e_attack = true
                setTimeout(()=>{
                    e_attack = false;
                },1000)
                player.anims.play('hurt', true);
                player.setVelocityX((player.x-enemy.x)/Math.abs(player.x-enemy.x)*knockback);
                knockback -= 20;
                if (knockback <= 0) {
                    isHurt = false;
                    e_attackToggle = true;
                }
            } else {
                player.setVelocityX(0);
                player.anims.play('idle', true);
            }
        }
    }

    if (SpaceKey.isUp) {
        attackToggle = true;
    }

    if (wKey.isDown && player.body.touching.down && !eKey.isDown) {
        if (ShiftKey.isDown) {
            player.setVelocityY(-speed*2);
        } else {
            player.setVelocityY(-speed*1.5);
        }
    }


    if (player.y > h*2) {
        player.x = w/2
        player.y = 0;
        player.setVelocityY(0);
        player.setVelocityX(0);
    }

    if (enemy.y > h*2) {
        enemy.x = player.x;
        enemy.y = player.y;
        enemy.setVelocityY(0);
        enemy.setVelocityX(0);
    }

    if (player.x < player.width/2) {
        player.x = (player.width/2)
    }

    if (!SpaceKey.isDown) {
        if (distance < w/3) {
            e_isRunning = false
            enemy.setVelocityX((player.x-enemy.x)/Math.abs(player.x-enemy.x)*speed)
        } else {
            e_isRunning = true
            enemy.setVelocityX((player.x-enemy.x)/Math.abs(player.x-enemy.x)*(speed*1.9))
        }
        e_isHurt = false
    }
    enemy.flipX = ((player.x-enemy.x)/Math.abs(player.x-enemy.x) == -1);

    if (e_attack) {
        if (e_attackToggle) {
            e_attackToggle = false
            e_attack_i++
        }
        if (e_attack_i > 3) {e_attack_i = 1}
        enemy.anims.play(`e_attack_${e_attack_i}`, true);
    } else {
        if (!e_isHurt) {
            if (!e_isRunning) {
                enemy.anims.play('e_walk', true);
            } else {
                enemy.anims.play('e_run', true);
            }
        }
    }
}
