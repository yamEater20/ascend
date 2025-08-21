// If you're looking at the code, that's awesome! Leave a comment on Itch if you need help!
// (You can also find the repo at https://github.com/alexander-i-yang/minigame)
// From Yam (the Dev)
const canvas = document.createElement("canvas");

import {
	getLevelData,
    Direction,
    TILE_SIZE,
	TILE_MAP_SIZE,
	TILES_IN_LEVEL
} from './levelEditor.js';

const PIXEL_GAME_SIZE = [128, 128];
canvas.width = PIXEL_GAME_SIZE[0];
canvas.height = PIXEL_GAME_SIZE[1];
document.body.insertBefore(canvas, document.body.childNodes[0]);
const CTX = canvas.getContext("2d");
const PLAYER_GRAVITY_UP = 0.20;
const PLAYER_GRAVITY_DOWN = 0.12;
const PLAYER_JUMP_V = -2.5;
const PLAYER_HITBOX_PIXEL_SIZE = [6, 6];
const SLIDE_TIMER = 8;
const MAXFALL = 3;
const SPRING_SCALAR = 3.1;
const SPIKES_IMG = document.getElementById("spikes-img");
const WALL_TILESHEET = document.getElementById("wall-tilesheet");
const WALL_TILESHEET_OUTER = document.getElementById("wall-tilesheet-2");
const WALL_TILESHEET_CORNER = document.getElementById("wall-tilesheet-corner");
const SEMISOLID_TILESHEET = document.getElementById("semisolid-tilesheet");
const BUTTON = document.getElementById("button");
const BIG_BUTTON = document.getElementById("big-button");
const BLOCK = document.getElementById("block-sprite");

const ICE_TILESHEET = document.getElementById("ice-tilesheet");
const ICE_TILESHEET_OUTER = document.getElementById("ice-tilesheet-2");

const MAIN_CHARA_SPRITESHEET = document.getElementById("main-chara-spritesheet");
const SPRING_SPRITESHEET = document.getElementById("spring-spritesheet");
const SPAWN_SPRITESHEET = document.getElementById("spawn-spritesheet");
const SKULL_IMG = document.getElementById("skull-img");
const DIAMOND_IMG = document.getElementById("diamond-img");
const THROWABLE_SPRITESHEET = document.getElementById("throwable-spritesheet");
const FLAME_SPRITESHEET = document.getElementById("flame-spritesheet");
const GOD_RAY_IMG = document.getElementById("god-ray-img");
const VINE_IMGS = [
	document.getElementById("vines1-img"),
	document.getElementById("vines2-img"),
	document.getElementById("vines3-img"),
	document.getElementById("vines4-img")
];
const PLANT_IMGS = [
	document.getElementById("plants1-img"),
	document.getElementById("plants2-img"),
	document.getElementById("plants3-img"),
	document.getElementById("plants4-img")
];
const PEDESTAL_IMG = document.getElementById("pedestal-img");
const TORCH_IMG = document.getElementById("torch-img");
const BROWN_DUST_SPRITESHEET = document.getElementById("brown-dust-spritesheet");
const GROUND_DUST_SPRITESHEET = document.getElementById("ground-dust-spritesheet");
const BAT_SPRITESHEET = document.getElementById("bat-spritesheet");
const DEATH_SPRITESHEET = document.getElementById("death-spritesheet");
const TITLE_IMG = document.getElementById("title-img");
const ARROW_IMG = document.getElementById("arrow-img");

const POWERUP_JUMP_SPRITE = document.getElementById("powerup-jump");
const POWERUP_SLIDE_SPRITE = document.getElementById("powerup-slide");
const POWERUP_DJ_SPRITE = document.getElementById("powerup-dj");

const SPECIAL_MAP = document.getElementById("special-map");

let game;

//https://www.storyblocks.com/audio/stock/rainforest-bfw7-_sjvkcm8i51u.html

//https://freesound.org/people/Sheyvan/sounds/475226/

const SECRET_CODES = [
	"ebcbcf", //1
	"593449", //2
	"ca1d2e", //3
	"67184a", //4
	"2434b3", //Hey!
	"83a18f", //Stop
	"cb56d3", //Looking
	"e19837", //At
	"aace52", //The
	"779997", //Secret
	"55783b", //Codes
	"938c9d", //You
	"d757e9", //Sneaky
	"443a64", //Inspect
	"ac11a8", //Element
	"cfbd22", //Wielding
	"d35f98", //Pseudo-dev!
	"7dc7b9", //Sincerely,
	"bac4e3"  //yamEater (the dev)
];

const PIXEL_LETTERS = {
	'A': [
		[, 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1]
	],
	'B': [
		[1, 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1],
		[1, 1]
	],
	'C': [
		[1, 1, 1],
		[1],
		[1],
		[1],
		[1, 1, 1]
	],
	'D': [
		[1, 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1]
	],
	'E': [
		[1, 1, 1],
		[1],
		[1, 1, 1],
		[1],
		[1, 1, 1]
	],
	'F': [
		[1, 1, 1],
		[1],
		[1, 1],
		[1],
		[1]
	],
	'G': [
		[, 1, 1],
		[1],
		[1, , 1, 1],
		[1, , , 1],
		[, 1, 1]
	],
	'H': [
		[1, , 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1],
		[1, , 1]
	],
	'I': [
		[1, 1, 1],
		[, 1],
		[, 1],
		[, 1],
		[1, 1, 1]
	],
	'J': [
		[1, 1, 1],
		[, , 1],
		[, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'K': [
		[1, , , 1],
		[1, , 1],
		[1, 1],
		[1, , 1],
		[1, , , 1]
	],
	'L': [
		[1],
		[1],
		[1],
		[1],
		[1, 1, 1]
	],
	'M': [
		[1, 1, 1, 1, 1],
		[1, , 1, , 1],
		[1, , 1, , 1],
		[1, , , , 1],
		[1, , , , 1]
	],
	'N': [
		[1, , , 1],
		[1, 1, , 1],
		[1, , 1, 1],
		[1, , , 1],
		[1, , , 1]
	],
	'O': [
		[1, 1, 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'P': [
		[1, 1, 1],
		[1, , 1],
		[1, 1, 1],
		[1],
		[1]
	],
	'Q': [
		[0, 1, 1],
		[1, , , 1],
		[1, , , 1],
		[1, , 1, 1],
		[1, 1, 1, 1]
	],
	'R': [
		[1, 1],
		[1, , 1],
		[1, , 1],
		[1, 1],
		[1, , 1]
	],
	'S': [
		[, 1, 1],
		[1],
		[1, 1, 1],
		[, , 1],
		[1, 1,]
	],
	'T': [
		[1, 1, 1],
		[, 1],
		[, 1],
		[, 1],
		[, 1]
	],
	'U': [
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'V': [
		[1, , , , 1],
		[1, , , , 1],
		[, 1, , 1],
		[, 1, , 1],
		[, , 1]
	],
	'W': [
		[1, , , , 1],
		[1, , , , 1],
		[1, , , , 1],
		[1, , 1, , 1],
		[1, 1, 1, 1, 1]
	],
	'X': [
		[1, , 1],
		[1, , 1],
		[, 1,],
		[1, , 1],
		[1, , 1]
	],
	'Y': [
		[1, , 1],
		[1, , 1],
		[, 1],
		[, 1],
		[, 1]
	],
	'Z': [
		[1, 1, 1, 1, 1],
		[, , , 1],
		[, , 1],
		[, 1],
		[1, 1, 1, 1, 1]
	],
	'0': [
		[1, 1, 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'1': [
		[, 1],
		[1, 1],
		[, 1],
		[, 1],
		[1, 1, 1]
	],
	'2': [
		[, 1,],
		[1, , 1],
		[, , 1],
		[, 1,],
		[1, 1, 1]
	],
	'3': [
		[1, 1, 1],
		[, , 1],
		[1, 1, 1],
		[, , 1],
		[1, 1, 1]
	],
	'4': [
		[1, , 1],
		[1, , 1],
		[1, 1, 1],
		[, , 1],
		[, , 1]
	],
	'5': [
		[1, 1, 1],
		[1, ,],
		[1, 1,],
		[, , 1],
		[1, 1,]
	],
	'6': [
		[1, 1, 1],
		[1, ,],
		[1, 1, 1],
		[1, , 1],
		[1, 1, 1]
	],
	'7': [
		[1, 1, 1],
		[, , 1],
		[, , 1],
		[, , 1],
		[, , 1]
	],
	'8': [
		[1, 1, 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1],
		[1, 1, 1]
	],
	'9': [
		[1, 1, 1],
		[1, , 1],
		[1, 1, 1],
		[, , 1],
		[1, 1, 1]
	],
	' ': [
		[, ,],
		[, ,],
		[, ,],
		[, ,],
		[, ,]
	],
	':': [
		[],
		[1],
		[],
		[1],
		[]
	],
	'.': [
		[, ,],
		[, ,],
		[, ,],
		[, ,],
		[1, ,]
	],
	'!': [
		[, 1,],
		[, 1,],
		[, 1,],
		[, ,],
		[, 1,]
	], '-': [
		[, ,],
		[, ,],
		[1, 1, 1],
		[, ,],
		[, ,]
	],
	'(': [
		[, 1,],
		[1, ,],
		[1, ,],
		[1, ,],
		[, 1,]
	],
	')': [
		[, 1,],
		[, , 1],
		[, , 1],
		[, , 1],
		[, 1,]
	],
	'+': [
		[, ,],
		[, 1,],
		[1, 1, 1],
		[, 1,],
		[, ,]
	],
	'/': [
		[, , 1],
		[, , 1],
		[, 1,],
		[, 1,],
		[1, ,],
		[1, ,]
	],
	'<': [
		[, , 1],
		[, 1,],
		[1, ,],
		[, 1,],
		[, , 1],
		[, ,]
	],
	'>': [
		[1, ,],
		[, 1,],
		[, , 1],
		[, 1,],
		[1, ,],
		[, ,]
	],
};

function bezier(ti, x1, x2, y1, y2) {
	const t = 1 - ti;
	//t (t^2 + 3 (1 - t)^2 y(1) + 3 t (1 - t) y(2))
	return (t * (t * t + 3 * ti * ti * y1 + 3 * ti * t * y2));
}

function clampedQuadratic(t, scale, zero, cutoff) {
	let py = scale * t * (t - zero);
	if (t > cutoff) {
		const cutoffSpeed = 2 * scale * cutoff - scale * zero;
		py = cutoffSpeed * (t - cutoff) + scale * cutoff * (cutoff - zero);
	}
	return py;
}

function getWidthOfText(txt, size) {
	let ret = 0;
	const letters = txt.split("");
	letters.map(letter => {
		let addX = 0;
		for (let y = 0; y < letter.length; y++) {
			let row = letter[y];
			addX = Math.max(addX, row.length * size);
		}
		ret += size + addX;
	});
	ret += letters.length * size * 2;
	return Math.round(ret);
}

function writeText(txt, size, pos, color, spacing) {
	let needed = [];
	txt = txt.toUpperCase(); // because I only did uppercase letters
	for (let i = 0; i < txt.length; i++) {
		const letter = PIXEL_LETTERS[txt.charAt(i)];
		if (letter) { // because there's letters I didn't do
			needed.push(letter);
		}
	}
	spacing = spacing ? spacing : 0;
	CTX.fillStyle = color ? color : 'black';
	let currX = pos.x;
	for (let i = 0; i < needed.length; i++) {
		const letter = needed[i];
		let currY = pos.y;
		let addX = 0;
		for (let y = 0; y < letter.length; y++) {
			let row = letter[y];
			for (let x = 0; x < row.length; x++) {
				if (row[x]) {
					CTX.fillRect(currX + x * size + game.cameraOffset.x, currY + game.cameraOffset.y, size, size);
				}
			}
			addX = Math.max(addX, row.length * size);
			currY += size;
		}
		currX += size + addX + spacing;
	}
}

function drawPixel(x, y, color) {
	CTX.fillStyle = color ? color : 'black';
	CTX.fillRect(x + game.cameraOffset.x, y + game.cameraOffset.y, 1, 1);
}

const Vector = ({x, y}) => ({
	x, y,
	incrPoint(p) {
		this.x += p.x;
		this.y += p.y;
	},
	addPoint(p) {
		return Vector({x: this.x + p.x, y: this.y + p.y});
	},
	scalarX(scalar) {
		return (Vector({x: this.x * scalar, y: this.y}));
	},
	// scalarY(scalar) {return(Vector({x: this.x, y:this.y*scalar}));},
	scalar(s) {
		return (Vector({x: this.x * s, y: this.y * s}));
	}
});

const VectorUp = Vector({x: 0, y: -1});
const VectorRight = Vector({x: 1, y: 0});
const VectorDown = Vector({x: 0, y: 1});
const VectorLeft = Vector({x: -1, y: 0});
const VectorZero = Vector({x: 0, y: 0});

const SCREEN_SHAKES = [
	Vector({x: 0, y: 0}),
	Vector({x: -2, y: -2}),
	Vector({x: -2, y: -2}),
	Vector({x: 0, y: -2}),
	Vector({x: 0, y: -2}),
	Vector({x: 2, y: 0}),
	Vector({x: 2, y: 0}),
	Vector({x: 0, y: 0}),
	Vector({x: 0, y: 0}),
];

function codeIsWall(code) {
	return code < 19 && code > 0;
}

function codeIsIce(code) {
	return code > 24 && code < 43;
}


const CAVE_AMBIANCE = new Howl({
	src: ['Songs/cavesounds1.ogg'], loop: true,
});
const HEADER_MUSIC = new Howl({
	src: ['Songs/velvetOpening.ogg'], loop: false,
});
const LOOP1_MUSIC = new Howl({
	src: ['Songs/velvet1.ogg'], loop: false,
});
const LOOP2_MUSIC = new Howl({
	src: ['Songs/velvet2.ogg'], loop: false,
});
const LOOP3_MUSIC = new Howl({
	src: ['Songs/velvet3.ogg'], loop: false,
});
const END_MUSIC = new Howl({
	src: ['Songs/velvetCredits.ogg'], loop: true,
});
const DEATH_SFX = new Howl({
	src: ['sfx/Death.wav'], loop: false,
});
const THROW_SFX = new Howl({
	src: ['sfx/Throw.wav'], loop: false,
});
const PICKUP_SFX = new Howl({
	src: ['sfx/Pickup.ogg'], loop: false,
	maxVolume: 0.5
});
const GEM_PICKUP_SFX = new Howl({
	src: ['sfx/GemPickup.wav'], loop: false,
});
const SPRING_SFX = new Howl({
	src: ['sfx/Spring.ogg'], loop: false,
	volume: 0.5,
});
const JUMP_SFX = new Howl({
	src: ['sfx/Jump.ogg'], loop: false,
});

const DJUMP_SFX = new Howl({
	src: ['sfx/DJump.ogg'], loop: false,
});

const UNLOCK_SFX = new Howl({
	src: ['sfx/pianoPickup.ogg'], loop: false,
});

const BUTTON_SFX = new Howl({
	src: ['sfx/bigButton.wav'], loop: false,
});

const PING_SFX = new Howl({
	src: ['sfx/Ping.wav'], loop: false,
});

const PONG_SFX = new Howl({
	src: ['sfx/Pong.wav'], loop: false,
});

const INCORRECT_SFX = new Howl({
	src: ['sfx/Incorrect.ogg'], loop: false,
});

const CORRECT_SFX = new Howl({
	src: ['sfx/Correct.ogg'], loop: false,
});

const MAX_VOLS = {
	PICKUP_SFX: 0.5,
	SPRING_SFX: 0.5,
	CAVE_AMBIANCE: 1,
	
	HEADER_MUSIC: 0.5,
	LOOP1_MUSIC: 0.5,
	LOOP2_MUSIC: 0.5,
	LOOP3_MUSIC: 0.5,
};

class AudioController {
	constructor() {
		this.curSong = null;
		this.curSongId = -1;
		this.musicVolume = 0.5;
		this.sfxVolume = 1;

		this.nowPlaying = "";
	}

	/**
	 * Queues the next song but doesn't play it
	 * */
	queueSong(s) {
		this.curSong = s;
	}

	playAmbiance(ambiance) {
		ambiance.volume(this.getMaxVolume(ambiance) * this.sfxVolume);
		ambiance.play();
		this.ambiance = ambiance;
	}

	playSong(song, stopOnEnd) {
		this.nowPlaying = song._src;
		song.volume(this.getMaxVolume(song) * this.musicVolume);
		this.curSongId = song.play();
		this.curSong = song;

		if (!stopOnEnd) {
			this.curSong.on('end', () => {
				this.playSong(this.curSong);
			}, this.curSongId)
		}
	}

	fadeOutSong(ms) {
		if (this.curSong) {
			this.curSong.fade(1,0,ms,this.curSongId);
			this.curSong.off('end');
		}
		this.ambiance.fade(1, 0, ms);
	}

	stopSong() {
		if (this.curSong) this.curSong.stop();
		this.curSong = null;
	}

	playSoundEffect(s, onEnd) {
		onEnd = onEnd ? onEnd : () => {
		};
		s.on('end', () => {
			this.curSoundEffect = null;
			onEnd();
		});
		s.volume(this.getMaxVolume(s) * this.sfxVolume);
		s.play();
		this.curSoundEffect = s;
	}

	getMaxVolume(sound) {
		return MAX_VOLS[sound] ? MAX_VOLS[sound] : 1;
	}

	setMusicVolume(vol) {
		this.musicVolume = vol * this.getMaxVolume(this.curSong);
		this.curSong.volume(vol * this.getMaxVolume(this.curSong));
	}

	setSFXVolume(vol) {
		this.sfxVolume = vol;
		this.ambiance.volume(vol * this.getMaxVolume(this.ambiance));
	}
}

const audioCon = new AudioController();

class Rectangle {
	constructor(x, y, width, height) {
		this.pos = Vector({x, y});
		this.width = width;
		this.height = height;
	}

	toString() {
		return `x: ${this.pos.x} y: ${this.pos.y} w: ${this.width} height: ${this.height}`
	}

	getX() {
		return (this.pos.x);
	}

	getY() {
		return (this.pos.y);
	}

	setX(x) {
		this.pos.x = x;
	}

	setY(y) {
		this.pos.y = y;
	}

	incrX(dx) {
		this.pos.x += dx;
	}

	incrY(dy) {
		this.pos.y += dy;
	}

	isOverlap(rectangle) {
		let x = this.getX();
		let y = this.getY();
		let rx = rectangle.getX();
		let ry = rectangle.getY();
		return (x < rx + rectangle.width &&
			x + this.width > rx &&
			y < ry + rectangle.height &&
			y + this.height > ry);
	}

	isTouching(rectangle) {
		return (
			this.isOnTopOf(rectangle) ||
			rectangle.isOnTopOf(this) ||
			this.isLeftOf(rectangle) ||
			rectangle.isLeftOf(this)
		)
	}

	isOnTopOf(rectangle) {
		return (
			this.getY() + this.height === rectangle.getY() &&
			this.getX() + this.width > rectangle.getX() &&
			rectangle.getX() + rectangle.width > this.getX()
		);
	}

	isLeftOf(rectangle) {
		return (
			this.getX() + this.width === rectangle.getX() &&
			this.getY() < rectangle.getY() + rectangle.height &&
			this.getY() + this.height > rectangle.getY()
		)
	}
}

class Hitbox {
	constructor(x, y, width, height) {
		this.rect = new Rectangle(x, y, width, height);
	}

	toString() {
		return `${this.rect.toString()}`
	}

	getX() {
		return (this.rect.getX());
	}

	getY() {
		return (this.rect.getY());
	}

	getWidth() {
		return (this.rect.width);
	}

	getHeight() {
		return (this.rect.height);
	}

	setX(x) {
		this.rect.setX(x);
	}

	setY(y) {
		this.rect.setY(y);
	}

	incrX(dx) {
		this.rect.incrX(dx);
	}

	incrY(dy) {
		this.rect.incrY(dy);
	}

	isOverlap(hitbox) {
		return (hitbox !== this && this.rect.isOverlap(hitbox.rect));
	}

	isTouching(hitbox) {
		return (hitbox !== this && this.rect.isTouching(hitbox.rect));
	}

	isOnTopOf(hitbox) {
		return this.rect.isOnTopOf(hitbox.rect);
	}

	isLeftOf(hitbox) {
		return this.rect.isLeftOf(hitbox.rect);
	}

	draw(color) {
		drawOnCanvas(this.rect, color);
	}

	cloneOffset(v) {
		return new Hitbox(this.getX() + v.x, this.getY() + v.y, this.rect.width, this.rect.height);
	}
}

function vToRad(v) {
	switch (v) {
		case VectorUp:
			return 0;
		case VectorDown:
			return Math.PI;
		case VectorLeft:
			return Math.PI * 1.5;
		case VectorRight:
			return Math.PI / 2;
		default:
			return null;
	}
}

class Sprite {
	constructor(img, direction) {
		this.img = img;
		this.direction = direction;
		this.flip = false;
	}

	drawSelf(x, y) {
		const d = () => {
			CTX.drawImage(this.img, x, y);
		};
		if (this.flip) {
			CTX.save();
			CTX.translate(x + TILE_SIZE, 0);
			CTX.scale(-1, 1);
			CTX.translate(-x, 0);
			d();
			CTX.restore();
		} else {
			d();
		}
	}

	getImage() {
		return this.img;
	}

	draw(x, y) {
		if (this.direction) {
			const rad = vToRad(this.direction);
			CTX.save();
			CTX.translate(x + game.cameraOffset.x, y + game.cameraOffset.y);
			CTX.rotate(rad);
			let uberOffset = Vector({x: 0, y: 0});
			switch (this.direction) {
				case VectorUp:
					break;
				case VectorLeft:
					uberOffset.x = -TILE_SIZE;
					break;
				case VectorRight:
					uberOffset.y = -TILE_SIZE;
					break;
				case VectorDown:
					uberOffset.x = -TILE_SIZE;
					uberOffset.y = -TILE_SIZE;
				default:
					break;
			}

			CTX.translate(-x + uberOffset.x, -y + uberOffset.y);
			this.drawSelf(x, y);
			CTX.restore();
		} else {
			this.drawSelf(x + game.cameraOffset.x, y + game.cameraOffset.y);
		}
	}

	update() {}
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[2], 16),
		parseInt(result[3], 16),
		parseInt(result[4], 16),
		parseInt(result[1], 16)
	] : null;
}

function recolorImage(x, y, oldRGB, newRGB) {
	const imageData = CTX.getImageData(x, y, TILE_SIZE, TILE_SIZE);
	const len = imageData.data.length;
	for (let i = 0; i < len; i += 4) {
		if (imageData.data[i + 1] === oldRGB[1]
			&& imageData.data[i + 2] === oldRGB[2]
			&& imageData.data[i + 3] === oldRGB[3]
		) {

			imageData.data[i] = newRGB[0];
			imageData.data[i + 1] = newRGB[1];
			imageData.data[i + 2] = newRGB[2];
			imageData.data[i + 3] = newRGB[3]
		}

	}
	CTX.putImageData(imageData, x, y);
}

class TileSprite extends Sprite {
	constructor(tiles, v, replaceColor, fillColor) {
		super(tiles, null);
		this.v = v;
		this.replaceColor = replaceColor;
		this.fillColor = fillColor;
	}

	drawSelf(x, y) {
		/** TODO: change this to not replace pixels every frame; just have two spritesheets (1 red+1 blue)
		 *  see https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		 *  Try putting the image back and then referencing it
		 */
		CTX.drawImage(this.img, this.v.x * TILE_SIZE, this.v.y * TILE_SIZE, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
		if (this.replaceColor) {
			recolorImage(x, y, this.replaceColor, this.fillColor);
		}
	}
}

class AnimatedSprite extends Sprite {
	constructor(spritesheet, direction, animationData, w, h) {
		super(spritesheet, direction);
		this.offsetFrames = 0;
		this.curCol = 0;
		this.row = 0;
		this.animationData = animationData;
		this.w = w ? w : TILE_SIZE;
		this.h = h ? h : TILE_SIZE;
		this.continue = false;
		this.startFrame = 0;
	}

	drawSelf(x, y) {
		const xOffset = (this.offsetFrames + this.curCol) * this.w;
		const d = () => {
			CTX.drawImage(super.getImage(), xOffset, 0, this.w, this.h, x, y, this.w, this.h);
		};
		if (this.flip) {
			CTX.save();
			CTX.translate(x + TILE_SIZE, 0);
			CTX.scale(-1, 1);
			CTX.translate(-x, 0);
			d();
			CTX.restore();
		} else {
			d();
		}
		// CTX.drawImage(super.getImage(), 0, 0, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
	}

	setRow(r) {
		const data = this.animationData[r];
		if (r !== 0) {
			this.curCol = data.reverse ? data.frames : 1;
			this.continue = true;
			try {
				this.startFrame = game.animFrame;
			} catch (error) {
				this.startFrame = 0;
			}
		} else if (data.onComplete !== "boomerang") {
			this.curCol = 0;
		} else {
			this.continue = 2;
		}
		this.row = r;
		this.resetXOffset();
	}

	resetXOffset() {
		let offsetFrames = 0;
		for (let i = 0; i < this.row; ++i) {
			offsetFrames += this.animationData[i].frames;
		}
		this.offsetFrames = offsetFrames;
	}

	update() {
		if (this.row) {
			const data = this.animationData[this.row];
			const maxFrames = data.frames;

			let continueAnim = this.continue;
			if (data.nth) {
				continueAnim = continueAnim && ((game.animFrame - this.startFrame) % data.nth === 0)
			}
			if (continueAnim) {
				if (data.reverse || this.continue === 2) {
					this.curCol = (this.curCol - 1) % maxFrames;
				} else {
					this.curCol = (this.curCol + 1) % maxFrames;
				}
			}
			if (this.curCol === ((data.reverse || this.continue === 2) ? maxFrames : 0)) {

				if (data.onComplete == null) {
					this.setRow(0);
					this.continue = false;
				} else if (data.onComplete === "boomerang") {
					this.curCol = maxFrames;
					this.continue = false;
				} else if (data.onComplete === "stop") {
					this.curCol = maxFrames;
					this.continue = false;
				}
			}
		}
	}

	getRow() {
		return this.row;
	}
}

function drawOnCanvas(rect, color) {
	CTX.fillStyle = color ? color : "#29ADFF";
	CTX.fillRect(rect.getX() + game.cameraOffset.x, rect.getY() + game.cameraOffset.y, rect.width, rect.height);
}

function clearCanvas() {
	canvas.width = canvas.width;
}

class Option {
	constructor(txt, pos, zPressed) {
		this.txt = txt;
		this.pos = pos;
		this.color = "#C2C3C7";
		this.zPressed = zPressed;
	}

	draw(selected) {
		writeText(
			this.getFormattedTxt(selected),
			1,
			this.pos,
			selected ? this.color : "#5F574F",
		)
	}

	setKeys(k) {
		const kZ = k["jump"];
		if (!this.prevZ && kZ) this.zPressed();
		this.prevZ = kZ;
	}

	getFormattedTxt() {
		return this.txt
	}
}

class SliderOption extends Option {
	constructor(txt, pos, valChange) {
		super(txt, pos, null);
		this.valChange = valChange;
		this.val = 10;
	}

	getFormattedTxt(selected) {
		return this.txt.replace(" {{val}} ", selected ? `\<${this.val}\>` : this.val);
	}

	setKeys(k) {
		const kLeft = k["moveLeft"];
		const kRight = k["moveRight"];
		let valChange = false;
		if (!this.prevLeft && kLeft) {
			this.val = Math.max(this.val - 1, 0);
			valChange = true;
		} else if (!this.prevRight && kRight) {
			this.val = Math.min(this.val + 1, 10);
			valChange = true;
		}
		if (valChange) {
			this.valChange(this.val);
			audioCon.playSoundEffect(PING_SFX);
		}
		this.prevLeft = kLeft;
		this.prevRight = kRight;
	}
}

class BrokenTextOption extends Option {
	constructor(txt, pos, onFill, onCorrect) {
		super(txt, pos, null);
		this.brokenTextField = new BrokenTextField(this.pos.addPoint(Vector({x: 0, y: 8})), onFill, 6, onCorrect);
	}

	setKeys(k) {
		this.brokenTextField.setKeys(k);
	}

	draw(selected) {
		super.draw(selected);
		if (selected) {
			this.brokenTextField.draw("#FFF1E8");
		}
	}
}

String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

class BrokenTextField {
	constructor(pos, onFill, length, onCorrect) {
		this.pos = pos;
		this.onFill = onFill;
		this.onCorrect = onCorrect;
		this.length = length;
		this.reset();
		this.shakeWrongFrames = 0;
		this.shakeRightFrames = 0;
	}

	draw() {
		const offset = Vector({x: 0, y: 0});
		let specialColor = null;
		if (this.shakeWrongFrames > 0) {
			this.shakeWrongFrames -= 1;
			offset.x = Math.round(Math.sin(this.shakeWrongFrames * Math.PI / 4));
			specialColor = "#FF004D";
			if (this.shakeWrongFrames === 0) this.reset();
		} else if (this.shakeRightFrames > 0) {
			this.shakeRightFrames -= 1;
			offset.y = Math.round(2 * Math.sin(this.shakeRightFrames * Math.PI / 6));
			specialColor = "#00E436";
			if (this.shakeRightFrames === 0) {
				this.onCorrect(this.getTextString());
				this.reset();
			}
		}
		for (let i = 0; i < this.length; ++i) {
			const white = (this.curInd === i) && Math.floor(game.animFrame / 4) > 3;
			let color = null;
			if (specialColor != null) {
				color = specialColor;
			} else {
				color = white ? "#FFF1E8" : "#5F574F";
			}
			drawOnCanvas(new Rectangle(this.pos.x + i * 8 + offset.x, this.pos.y + 8 + offset.y, 6, 1), color);
			writeText(this.txt[i], 1, this.pos.addPoint(Vector({x: 1 + i * 8, y: 1})).addPoint(offset), color, 2);
		}
	}

	setKeys(k) {
		const btf = this;
		Object.keys(k).map(function (key) {
			if ((key.includes("Key") || key.includes("Digit")) && k[key] === 1) {
				if (!audioCon.curSoundEffect || audioCon.curSoundEffect._src !== PING_SFX._src) {
					audioCon.playSoundEffect(PING_SFX);
					btf.txt[btf.curInd] = key.slice(-1);
					btf.curInd = Math.min(btf.curInd + 1, btf.length - 1);
				}
			}
		});
		const kBack = k["Backspace"];
		// const kRight = k["moveRight"];
		if (!this.prevBack && kBack) {
			this.curInd = Math.max(0, this.curInd - 1);
			this.txt[this.curInd] = "";
			audioCon.playSoundEffect(PONG_SFX);
		}
		//     this.curInd = Math.max(this.curInd-1, 0);
		//     audioCon.playSoundEffect(PONG_SFX);
		// } else if(!this.prevRight && kRight) {
		//     this.curInd = Math.min(this.curInd+1, this.length-1);
		//     audioCon.playSoundEffect(PONG_SFX);
		// }
		// this.prevLeft = kLeft;
		// this.prevRight = kRight;
		this.prevBack = kBack;
		if (this.shakeWrongFrames === 0 && this.shakeRightFrames === 0 && this.getTextString().length === this.length) {
			this.onFill(this, this.getTextString());
		}
	}

	getTextString() {
		return this.txt.join("");
	}

	reset() {
		this.curInd = 0;
		this.txt = [];
		for (let i = 0; i < this.length; ++i) {
			this.txt.push("");
		}
	}

	shakeWrong() {
		this.shakeWrongFrames = 20;
	}

	shakeRight() {
		this.shakeRightFrames = 20;
	}
}

class OptionsController {
	constructor() {
		this.bgRect = new Rectangle(0, 0, PIXEL_GAME_SIZE[0], PIXEL_GAME_SIZE[1]);
		this.optionsPos = Vector({x: 30, y: 30});
		this.optionsRect = new Rectangle(this.optionsPos.x, this.optionsPos.y, PIXEL_GAME_SIZE[0] - this.optionsPos.x * 2, PIXEL_GAME_SIZE[1] - this.optionsPos.y * 2);
		this.otherRect = new Rectangle(this.optionsPos.x - 2, this.optionsPos.y - 2, PIXEL_GAME_SIZE[0] - this.optionsPos.x * 2 + 4, PIXEL_GAME_SIZE[1] - this.optionsPos.y * 2 + 4);
		this.showing = false;
		this.optionInd = 0;
		this.options = [
			new Option("Resume", this.optionsPos.addPoint({x: 4, y: 14}), () => {
				this.showing = false;
			}),
			new SliderOption("Music vol: {{val}} ", this.optionsPos.addPoint({x: 4, y: 20}), (val) => {
				audioCon.setMusicVolume(val * 0.1);
			}),
			new SliderOption("SFX vol: {{val}} ", this.optionsPos.addPoint({x: 4, y: 26}), (val) => {
				audioCon.setSFXVolume(val * 0.1);
			}),
			/*new BrokenTextOption(
                "Cheat code",
                this.optionsPos.addPoint({x: 4, y: 32}),
                (field, text) => {
                    text = text.toLowerCase();
                    if (game.checkCheatCode(text)) {
                        field.shakeRight();
                        audioCon.playSoundEffect(CORRECT_SFX);
                    } else {
                        audioCon.playSoundEffect(INCORRECT_SFX);
                        field.shakeWrong();
                    }
                },
                (text) => {
                    this.showing = false;
                    game.applyCheatCode(text.toLowerCase());
                }
            ),*/
		]
	}

	draw() {
		drawOnCanvas(this.bgRect, "#00000080");
		drawOnCanvas(this.otherRect, "#1D2B53");
		drawOnCanvas(this.optionsRect, "#000000");
		writeText("Options", 1, this.optionsPos.addPoint(Vector({x: 4, y: 4})), "#FFF1E8");

		this.options.forEach((option, i) => {
			option.draw(i === this.optionInd);
		});
	}

	setKeys(k) {
		const len = this.options.length;
		let incrBy = 0;
		const kDown = k["ArrowDown"];
		const kUp = k["ArrowUp"];
		if (!this.prevDown && kDown) incrBy = 1;
		else if (!this.prevUp && kUp) incrBy = -1;
		if (incrBy !== 0) audioCon.playSoundEffect(PONG_SFX);

		this.optionInd = (this.optionInd + (incrBy) + len) % len;
		this.options[this.optionInd].setKeys(k);
		this.prevUp = kUp;
		this.prevDown = kDown;
	}

	toggleOptions() {
		this.showing = !this.showing;
		if (this.showing) {
			pause();
		} else {
			play();
		}
	}
}

const optionsCon = new OptionsController();

let timeDelta = 0;
let lastTime;

function pause() {
	if (!paused) {
		pauseTime = window.performance.now();
	}
}

let paused = false;
let pauseTime = 0;
let pauseDuration = 0;

function play() {
	if (paused) {
		pauseDuration = window.performance.now() - pauseTime;
	}
}

class Game {
	constructor(levelData) {
		this.levels = [];
		this.visitedLevels = {};
		this.bigUnlocked = false;
		this.startTime = -1;
		this.lastFacing = VectorRight;
		this.lastSliding = false;
		this.canDoubleJump = false;

		this.map = new WorldMap(this);
		this.numLevels = levelData.numLevels;
		this.navigateMap = levelData.navigateMap;
		for (let levelInd = 0; levelInd < this.numLevels; levelInd++) {
			let level = null;
			const sliceArr = levelData.levels.slice(levelInd * TILES_IN_LEVEL, (levelInd + 1) * TILES_IN_LEVEL);
			// if(levelInd === 0) {level = new StartScreen(sliceArr, this);}

			const arrCopy = [...sliceArr];
			if (levelInd === 2) {
				level = new EndScreen(sliceArr, this, levelInd);
			} else {
				level = new Level(sliceArr, this, levelInd);
			}

			this.map.pushMapSec(arrCopy, level.location, level);

			this.levels.push(level);
		}
		this.levelInd = 12;
		this.visitedLevels[this.levelInd] = true;

		this.cameraOffset = Vector({x: 0, y: 0});
		this.deaths = 0;

		this.animFrame = 0;
		this.animTime = 0;
		this.screenShakeFrames = 0;
		this.scoreboardRect = new Rectangle(4, 4, 44, 19);
		this.scoreboardFrames = 0;
		this.secondsUntilBat = Math.round(Math.random() * 10 + 5);
		this.framesUntilDrop = 60;
		this.cheated = false;
		this.emptySquareData = {x: -1, y: -1, rad: -1, color: null};

		this.fellFromHeight = 0;

		this.debugFlying = false;

		this.unlockScreen = new UnlockScreen(this);
		this.unlocks = {
			JUMP: false,
			SLIDE: false,
			DJ: false,
		}

		this.getCurrentLevel().resetStage();

		audioCon.playAmbiance(CAVE_AMBIANCE);
	}

	getCurrentLevel() {
		return this.levels[this.levelInd];
	}

	drawCurrentLevel() {
		this.getCurrentLevel().drawAll();
		this.unlockScreen.draw();

		if (this.scoreboardFrames > 0) {
			this.drawScoreboard();
		}
		if (this.showMap) this.map.draw();
		if (this.animFrame % 60 === 0) {
			this.secondsUntilBat -= 1;
		}
		this.framesUntilDrop--;
		if (this.secondsUntilBat < 0) {
			this.getCurrentLevel().spawnBat();
			this.secondsUntilBat = Math.round(Math.random() * 10 + 5);
		}
		if (this.framesUntilDrop < 0) {
			this.getCurrentLevel().spawnDrop();
			this.framesUntilDrop = Math.round(Math.random() * 45 + 15);
		}
		if (this.emptySquareData.x !== -1) {
			this.drawEmptySquareAround(
				this.emptySquareData.x,
				this.emptySquareData.y,
				this.emptySquareData.rad,
				this.emptySquareData.color,
			)
		}
		if (optionsCon.showing) {
			optionsCon.draw();
		}
	}

	onBigButtonPush(curHeight) {
		
	}

	resetFellHeight() {
		this.fellFromHeight = this.getCurrentLevel().height;
	}

	tick() {
		if (timeDelta === 0) lastTime = window.performance.now();
		const now = window.performance.now() + 1;
		// timeDelta = ((now-lastTime)-pauseDuration);
		timeDelta = now - lastTime;
		lastTime = now;
		pauseDuration = 0;
	}

	setDrawEmptySquareData(x, y, rad, color) {
		this.emptySquareData = {x: x, y: y, rad: rad, color: color};
	}

	stopDrawEmptySquare() {
		this.emptySquareData.x = -1;
	}

	getPlayer() {
		return this.getCurrentLevel().getPlayer();
	}

	drawEmptySquareAround(x, y, r, color) {
		const xmr = x - r;
		const ypr = y + r;
		const rects = [
			new Rectangle(0, 0, xmr, PIXEL_GAME_SIZE[1]),
			new Rectangle(xmr, 0, 2 * r, y - r),
			new Rectangle(xmr, ypr, 2 * r, PIXEL_GAME_SIZE[1] - ypr),
			new Rectangle(x + r, 0, PIXEL_GAME_SIZE[0] - x - r, PIXEL_GAME_SIZE[1])
		];
		rects.map(r => drawOnCanvas(r, color ? color : "black"));
	}

	drawScoreboard() {
		// const backgroundRect = new Rectangle(this.scoreboardRect.getX()-1, this.scoreboardRect.getY()-1, this.scoreboardRect.width+2, this.scoreboardRect.height+2);
		// drawOnCanvas(backgroundRect, "#7e2553");
		drawOnCanvas(this.scoreboardRect, "#000000d0");
		writeText(this.formatTimeSinceStart(), 1, Vector({
			x: this.scoreboardRect.getX() + 2,
			y: this.scoreboardRect.getY() + 2
		}), this.cheated ? "#FF004D" : "#FFF1E8");
		CTX.drawImage(SKULL_IMG, this.scoreboardRect.getX() + 1 + this.cameraOffset.x, this.scoreboardRect.getY() + 10 + this.cameraOffset.y);
		writeText(this.deaths.toString(), 1, Vector({
			x: this.scoreboardRect.getX() + 10,
			y: this.scoreboardRect.getY() + 11
		}), "#FFF1E8");
	}

	setKeys(keys) {
		keys["moveLeft"] = keys["ArrowLeft"] || keys["KeyA"];
		keys["moveRight"] = keys["ArrowRight"] || keys["KeyD"];
		keys["jump"] = keys["KeyZ"] || keys["KeyN"];
		keys["slide"] = keys["KeyX"] || keys["KeyM"];

		if (keys["ArrowLeft"] || keys["ArrowRight"]) this.controlScheme = 0;
		if (keys["KeyA"] || keys["KeyD"]) this.controlScheme = 1;

		if (!optionsCon.showing) {
			if (keys["KeyO"] && !this.prevO) {
				this.debugFlying = !this.debugFlying;
			}
			if (keys["KeyH"] && !this.prevH) {
				this.unlocks.JUMP = !this.unlocks.JUMP;
			}
			if (keys["KeyJ"] && !this.prevJ) {
				this.unlocks.SLIDE = !this.unlocks.SLIDE;
			}
			if (keys["KeyK"] && !this.prevK) {
				this.unlocks.DJ = !this.unlocks.DJ;
			}
			if (keys["KeyI"] && !this.prevI) {
				this.getCurrentLevel().onButtonPush();
			}

			if (this.startTime < 1  && (keys["moveLeft"] || keys["moveRight"])) this.startTime = window.performance.now();
			
			const keyC = keys["KeyC"]
			if (this.onLastLevel() && this.getCurrentLevel().endGameFrames !== 0) {
				//Suppress c input
			} else {
				if (keyC) this.scoreboardFrames += 1;
				this.showMap = keyC;
				this.cAudio(keyC, this.prevC);
			}
			
			keys["PrevJump"] = this.prevZ;

			this.prevO = keys["KeyO"];
			this.prevH = keys["KeyH"];
			this.prevJ = keys["KeyJ"];
			this.prevK = keys["KeyK"];
			this.prevI = keys["KeyI"];
			this.prevS = keys["KeyP"];
			this.prevZ = keys["jump"];
			this.prevC = keys["KeyC"];

			this.getCurrentLevel().setKeys(keys);
		} else {
			optionsCon.setKeys(keys)
		}
		if (!this.prevEnter && keys["Enter"]) {
			optionsCon.toggleOptions();
		}
		this.prevEnter = keys["Enter"];
	}

	cAudio(keyC, prevC) {
		if (keyC && !prevC) audioCon.playSoundEffect(PING_SFX);
		if (!keyC && prevC) audioCon.playSoundEffect(PONG_SFX);
	}

	onLastLevel() {
		return this.levelInd === 2;
	}

	updateLevelPhysicsPos() {
		this.tick();

		// this.animFrame = (this.animFrame+1)%60;
		this.animTime += timeDelta;
		let i = 0;
		while (this.animTime >= 16.666) {
			this.animFrame = (this.animFrame + 1) % 60;
			this.animTime -= 16.666;
			i++;
			if (!optionsCon.showing) {

				this.getCurrentLevel().updatePhysicsAllPos();
				if (this.screenShakeFrames > 0) {
					this.shakeScreen();
				}
				if (this.scoreboardFrames > 0) {
					this.scoreboardFrames -= 1;
				}
			}
		}
	}

	nextLevel(direction, playerPos) {
		this.setLevel(this.navigateMap(this.levelInd, direction), direction, playerPos)
	}

	setLevel(ind, direction, playerPos) {
		this.getCurrentLevel().dustSprites = [];

		this.levelInd = ind;
		this.visitedLevels[ind] = true;
		/*if(this.levelInd > 0 && this.levelInd < 11) {
            if(audioCon.curSong._src !== STAGE1_MUSIC._src && audioCon.curSong._src !== BEGINNING_MUSIC._src) {audioCon.playSong(STAGE1_MUSIC);}
            else {audioCon.queueSong(STAGE1_MUSIC);}
        } else if(this.levelInd > 10) {
            if(audioCon.curSong._src !== STAGE2_MUSIC._src) {audioCon.stopSong(); audioCon.playSong(STAGE2_MUSIC);}
            else {audioCon.queueSong(STAGE2_MUSIC);}
        }*/
		this.getCurrentLevel().setCurrentSpawn(direction, playerPos);
		this.getCurrentLevel().resetStage(true);
		this.getPlayer().setYVelocity(this.lastYVelocity);

		this.respawn();
		if (this.onLastLevel()) {
			const t = window.performance.now();
			this.nanosecondsSinceStart = () => {
				return t - this.startTime;
			};
			audioCon.fadeOutSong(750);
		}
	}

	formatTimeNs(ns) {
		return new Date(ns).toISOString().substr(11, 11)
	}

	nanosecondsSinceStart() {
		if (this.startTime < 0) return 0;
		return window.performance.now() - this.startTime;
	}

	formatTimeSinceStart() {
		return this.formatTimeNs(this.nanosecondsSinceStart());
	}

	death() {
		this.deaths += 1;
		this.screenShakeFrames = 14;
		if (this.levelInd !== 0) this.spawnDusts(14);
	}

	startScreenShake() {
		if (this.screenShakeFrames === 0) {
			this.screenShakeFrames = 9;
			if (this.levelInd !== 0) this.spawnDusts(Math.random() * 4 + 7);
		}
	}

	spawnDusts(numDusts) {
		for (let i = 0; i < numDusts; ++i) {
			const spawnX = Math.random() * PIXEL_GAME_SIZE[0];
			const curLevel = this.getCurrentLevel();
			const mult = Math.random() + 3 * 3;
			const angleOffset = Math.random() * 5;
			const dust = new BrownDust(Math.round(spawnX), Math.round(-5 - Math.random() * 50), Math.random() * 3 + 0.5, new AnimatedSprite(
					BROWN_DUST_SPRITESHEET,
					null,
					[{"frames": 0, onComplete: null}, {"frames": 6, onComplete: null, nth: 10}]
				),
				(frame) => {
					return Math.round(spawnX + (mult * Math.sin(frame / 60 * 2 * Math.PI + angleOffset)));
				},
				curLevel,
			);
			curLevel.pushDecoration(dust);
		}
	}

	spawnSlideParticles(x, y, facing) {
		for (let i = 0; i < 5; ++i) {
			const spawnY = y + Math.random() * 5;
			const spawnX = x + Math.random() * 2;
			const curLevel = this.getCurrentLevel();

			const r0 = Math.random() * 20;
			const r1 = Math.random() * 20;
			const r2 = Math.random() / 10;
			
			function p(t) {
				const px = clampedQuadratic(t, facing * (120+r0), 0.7, 0.33);
				const py = clampedQuadratic(t, (50+r1), (0.6 + r2), (0.6 + r2) / 2 + r2);
				return {x: spawnX + px, y: spawnY + py};
			}
			const dust = new Particle(curLevel, "#ffa300", p, Vector({x:1,y:1}));
			curLevel.pushDustSprite(dust);
		}
	}

	spawnSlideDust(x, y, facing) {
		const spawnX = x + Math.random() * 2;
		const curLevel = this.getCurrentLevel();

		const r0 = Math.random() * 20;
		const r1 = Math.random() * 20;
		const r2 = Math.random() / 10;

		const size = Math.ceil(Math.random() * 2);
		
		function p(t) {
			const px = clampedQuadratic(t, facing * (120+r0), 0.7, 0.33);
			const py = clampedQuadratic(t, (100+r1), (0.6 + r2), (0.6 + r2) / 2 + r2);
			return {x: spawnX + px, y: y + py};
		}
		const dust = new Particle(curLevel, "#ffa300", p, Vector({x:size,y:size}));
		curLevel.pushDustSprite(dust);
	}

	spawnDoubleJumpParticles(x, y) {
		for (let i = 0; i < 5; ++i) {
			const spawnX = x + Math.random() * 2;
			const curLevel = this.getCurrentLevel();

			const r0 = Math.random() * 10;
			const r1 = Math.random() * 10;
			const r2 = Math.random() / 10;
			
			function p(t) {
				const px = clampedQuadratic(t, (30+r0) * (i - 3), 0.7, 0.33);
				const py = clampedQuadratic(t, -(130+r1), (0.6 + r2), (0.6 - r2) / 2 - r2);
				return {x: spawnX + px, y: y + py};
			}
			const dust = new Particle(curLevel, "#188755", p, Vector({x:1,y:1}));
			curLevel.pushDustSprite(dust);
		}
	}

	spawnSpringParticles(x, y) {
		for (let i = 0; i < 5; ++i) {
			const spawnX = x + Math.random() * 2;
			const curLevel = this.getCurrentLevel();

			const r0 = Math.random() * 10;
			const r1 = Math.random() * 10;
			const r2 = Math.random() / 10;
			
			function p(t) {
				const px = clampedQuadratic(t, (30+r0) * (i - 3), 0.7, 0.33);
				const py = clampedQuadratic(t, (50+r1), (0.6 + r2), (0.6 + r2) / 2 + r2);
				return {x: spawnX + px, y: y + py};
			}
			const dust = new Particle(curLevel, "#ff004d", p, Vector({x:1,y:1}));
			curLevel.pushDustSprite(dust);
		}
	}
	
	spawnPowerupParticles(x, y, color) {
		for (let i = 0; i < 12; ++i) {
			const spawnX = x + Math.random() * 2;
			const curLevel = this.getCurrentLevel();

			const r0 = Math.random() * 10;
			const r1 = Math.random() * 10;
			const r2 = Math.random() / 10;
			function p(t) {
				const px = clampedQuadratic(t, (30+r0) * (i - 6), 0.7, 0.33);
				const py = clampedQuadratic(t, (130+r1), (0.6 + r2), (0.6 - r2) / 2 - r2);
				return {x: spawnX + px, y: y + py};
			}
			const dust = new Particle(curLevel, color, p, Vector({x:2,y:2}));
			curLevel.pushDustSprite(dust);
		}
	}

	shakeScreen() {
		this.screenShakeFrames -= 1;
		this.cameraOffset = SCREEN_SHAKES[this.screenShakeFrames % 8];
		canvas.style.backgroundPosition = `top ${this.cameraOffset.y * 3}px left ${this.cameraOffset.x * 2}px`;
	}

	endGame() {
		this.getCurrentLevel().endGame();
	}

	respawn() {
		// this.scoreboardFrames = 90;
	}

	onStickyLevel() {
		return this.levelInd === 10;
	}

	checkCheatCode(cheatCode) {
		return SECRET_CODES.includes(cheatCode);
	}

	applyCheatCode(cheatCode) {
		const ind = SECRET_CODES.indexOf(cheatCode);
		if (ind !== -1) {
			this.cheated = true;
			this.setLevel(ind + 1);
		}
	}

	showHintText() {
		this.getCurrentLevel().showHintText();
	}
}

const keyNames = [
	{
		"jump": "Z",
		"slide": "X",
		"restart": "R",
		"map": "C"
	}, {
		"jump": "N",
		"slide": "M",
		"restart": "R",
		"map": "C"
	}, 
]

function getHintText(levelInd, special) {
	switch (levelInd) {
		case 12:
			if (special === 2) return {text: "Press r to restart", pos: Vector({x: 24, y:32})};
			return {text: "Arrow keys / WASD to move", pos: Vector({x: 16, y:32})};
		case 11: return {text: `Hold ${keyNames[game.controlScheme].map} for map`, pos: Vector({x: 54, y:16})};
		case 10: return {text: `Press ${keyNames[game.controlScheme].jump} to jump`, pos: Vector({x: 34, y:116})};
		case 14: return {text: `Press ${keyNames[game.controlScheme].slide} to slide through spikes`, pos: Vector({x: 3, y:32})};
		case 15: return {text: "Jump in midair to double jump", pos: Vector({x: 8, y:8})};
	}
}

function numToVec(num) {
	switch (num) {
		case 0:
			return VectorUp;
		case 1:
			return VectorRight;
		case 2:
			return VectorDown;
		case 3:
			return VectorLeft;
	}
	return null;
}

const vecTiles = [
	Vector({x: 0, y: 0}),
	Vector({x: 1, y: 0}),
	Vector({x: 2, y: 0}),
	Vector({x: 0, y: 1}),
	Vector({x: 1, y: 1}),
	Vector({x: 2, y: 1}),
	Vector({x: 0, y: 2}),
	Vector({x: 1, y: 2}),
	Vector({x: 2, y: 2}),
];

const vecTilesOuter = [
	Vector({x: 0, y: 0}),
	Vector({x: 1, y: 0}),
	Vector({x: 2, y: 0}),
	Vector({x: 0, y: 1}),
	Vector({x: 1, y: 1}),
	Vector({x: 2, y: 1}),
	null,
	Vector({x: 1, y: 2}),
	null
];

const vecTilesCorner = [
	Vector({x: 0, y: 0}),
	Vector({x: 1, y: 0}),
	Vector({x: 0, y: 1}),
	Vector({x: 1, y: 1}),
]

function convertWallTiles(arr) {
	let curInd = 0;
	const xyToTileInd = (x, y) => y * TILE_MAP_SIZE[0] + x;
	for (let y = 0; y < TILE_MAP_SIZE[1]; y++) {
		for (let x = 0; x < TILE_MAP_SIZE[0]; x++) {
			const tileCode = parseInt(arr[curInd]);

			if (tileCode === 1 || tileCode === 25) {
				let v = 0;
				const codeIsConnector = tileCode === 1 ? codeIsWall : codeIsIce;
				//List of indices of possible tiles
				let vecInds = Array(vecTiles.length).fill().map(() => v++);
				const filterVec = (filterFunc) => {
					return vecInds.filter(function (value) {
						return filterFunc(value);
					});
				};

				const isWallLeft = codeIsConnector(x - 1 < 0 ? tileCode : parseInt(arr[xyToTileInd(x - 1, y)]));
				const isWallRight = codeIsConnector(x + 2 > TILE_MAP_SIZE[0] ? tileCode : parseInt(arr[xyToTileInd(x + 1, y)]));
				const isWallTop = codeIsConnector(y - 1 < 0 ? tileCode : parseInt(arr[xyToTileInd(x, y - 1)]));
				const isWallBottom = codeIsConnector(y + 2 > TILE_MAP_SIZE[1] ? tileCode : parseInt(arr[xyToTileInd(x, y + 1)]));
				const debugCode = -1;

				let col = -1;
				let row = -1;
				let outer = false;
				if (isWallLeft && isWallRight) {
					col = 1;
				} else if (isWallLeft) {
					col = 2;
				} else if (isWallRight) {
					col = 0;
				} else {
					col = 1;
					outer = true;
				}

				vecInds = filterVec(x => x % 3 === col);

				if (isWallTop && isWallBottom) {
					row = 1;
				} else if (isWallTop) {
					row = 2;
				} else if (isWallBottom) {
					row = 0;
				} else {
					row = 1;
					outer = true;
				}
				vecInds = filterVec(x => x >= row && x < (row + 1) * 3);
				let last = -100;
				if (outer && isWallLeft && isWallRight) {
					last = 9 + tileCode
				} else if (outer && !isWallLeft && !isWallTop && !isWallRight && !isWallBottom) {
					last = 11 + tileCode;
				} else {
					last = vecInds[vecInds.length - 1] + (outer ? 9 : 0) + tileCode;
				}

				arr[curInd] = last;
			}
			curInd += 1;
		}
	}

	curInd = 0;
	const arrCopy = [...arr]
	for (let y = 0; y < TILE_MAP_SIZE[1]; y++) {
		for (let x = 0; x < TILE_MAP_SIZE[0]; x++) {
			const tileCode = arrCopy[curInd];
			if (tileCode === 5) {
				// const codeIsConnector = (t) => t <= 15 && t !== 5;

				// const isWallLeft = codeIsConnector(x - 1 < 0 ? 5 : parseInt(arrCopy[xyToTileInd(x - 1, y)]));
				// const isWallRight = codeIsConnector(x + 2 > TILE_MAP_SIZE[0] ? 5 : parseInt(arrCopy[xyToTileInd(x + 1, y)]));
				// const isWallTop = codeIsConnector(y - 1 < 0 ? 5 : parseInt(arrCopy[xyToTileInd(x, y - 1)]));
				// const isWallBottom = codeIsConnector(y + 2 > TILE_MAP_SIZE[1] ? 5 : parseInt(arrCopy[xyToTileInd(x, y + 1)]));

				const left = x - 1 < 0 ? 5 : parseInt(arrCopy[xyToTileInd(x - 1, y)]);
				const right = x + 2 > TILE_MAP_SIZE[0] ? 5 : parseInt(arrCopy[xyToTileInd(x + 1, y)]);
				const top = y - 1 < 0 ? 5 : parseInt(arrCopy[xyToTileInd(x, y - 1)]);
				const bottom = y + 2 > TILE_MAP_SIZE[1] ? 5 : parseInt(arrCopy[xyToTileInd(x, y + 1)]);
				// if (!isWallTop && !isWallLeft) arr[curInd] = 77;
				// if (!isWallTop && !isWallRight) arr[curInd] = 77;
				if ((top === 6 || top === 3) && (right === 2 || right === 3)) arr[curInd] = 77;
				if ((top === 4 || top === 1) && ((left === 2 || left === 1))) arr[curInd] = 76;
				if ((bottom === 4 || bottom === 7) && ((left === 8 || left === 7))) arr[curInd] = 78;
				if ((bottom === 6 || bottom === 9) && ((right === 8 || right === 9))) arr[curInd] = 79;

			}
			curInd++;
		}
	}
}

class UnlockScreen {
	constructor() {
		this.pos = Vector({x: 0, y: 0});
		this.rect = new Rectangle(this.pos.x, this.pos.y, 64, 64);
		this.color = "#00000030";
	}

	drawText() {
		const e = 0;
		let text;
		let offset;
		switch (e) {
			case 0:
				text = "Hello";

				writeText("Hello", 1, this.pos.addPoint(), "white");
				break;
		}
	}

	draw() {
		// drawOnCanvas(this.rect, this.color);
		// this.drawText();
	}
}

class WorldMap {
	constructor(game) {
		this.mapSections = [];
		this.game = game;
	}

	pushMapSec(tileArr, location, level) {
		this.mapSections.push(new MapSec(tileArr, this.game, level));
	}

	draw() {
		const margin = 1;

		const offset = Vector({x: 5, y: game.getCurrentLevel().realCamOffsetY < -80 ? 128 + 76 : 14});
		const roomsW = 5;
		const roomsH = 4;

		drawOnCanvas(new Rectangle(16 + offset.x - 1, offset.y + 15, ((16 + margin) * roomsW) + 3, (16 + margin) * roomsH + 3), "#FFCCAA");
		drawOnCanvas(new Rectangle(16 + offset.x, offset.y + 16, ((16 + margin) * roomsW) + 1, (16 + margin) * roomsH + 1), "#1E2B53");
		this.mapSections.forEach((m, i) => {
			if ([0,1,3,4].includes(i)) return;

			const x = (m.level.location.x + 1) * (TILE_MAP_SIZE[0] + margin) + offset.x;
			const y = (m.level.location.y + 1) * (TILE_MAP_SIZE[1] + margin) + offset.y;
			m.draw(x, y);
		})
	}
}

class MapSec {
	constructor(tileArr, game, level) {
		this.game = game;
		this.pixels = [];
		this.level = level;

		this.convertToPixels(tileArr);
	}

	hasVisited() {
		return this.game.visitedLevels[this.level.myLevelInd];
	}

	convertToPixels(tileArr) {
		for (let t = 0; t < TILES_IN_LEVEL; t++) {
			const tileCode = parseInt(tileArr[t]);
			if (tileCode === 1) this.pixels.push("#5F574F");
			// else if (52 <= tileCode && 55 >= tileCode) this.pixels.push("#FF004D");
			else if (tileCode === 73) this.pixels.push("#AB5236");
			else this.pixels.push("#000000");
		}
	}

	draw(offsetX, offsetY) {
		if (this.level.myLevelInd === undefined) return;
		if (this.level.myLevelInd === 2) {
			if (!this.hasVisited()) {
				CTX.drawImage(SPECIAL_MAP, offsetX, offsetY);
				return;
			}
		}
		
		if (!this.hasVisited()) {
			let i = 0;
			for (let y = 0; y < TILE_MAP_SIZE[1]; y++) {
				for (let x = 0; x < TILE_MAP_SIZE[0]; x++) {
					drawPixel(offsetX + x, offsetY + y, (i+y) % 2 == 0 ? "#000000" : "#1d2b53");
					i++;
				}
			}
			return;
		}

		let i = 0;
		for (let y = 0; y < TILE_MAP_SIZE[1]; y++) {
			for (let x = 0; x < TILE_MAP_SIZE[0]; x++) {
				drawPixel(offsetX + x, offsetY + y, this.pixels[i]);
				i++;
			}
		}

		if (this.level.myLevelInd === this.game.levelInd) {
			const p = this.level.getPlayer();
			drawPixel(offsetX + Math.floor(p.getX() /TILE_SIZE), offsetY + Math.floor(p.getY() /TILE_SIZE), "#ff0000")
		}
	}
}

class Level {
	constructor(tileArr, game, levelInd) {
		this.solids = [];
		this.actors = [];
		this.decorations = [];
		this.frontDecorations = [];
		this.dustSprites = [];
		this.myLevelInd = levelInd;
		let curTileMapInd = 0;
		this.game = game;
		this.nextDirection = Direction.NULL;
		this.curSpawn;
		this.spawn;
		this.switchBlocks = [];
		this.buttons = [];

		let locationX;
		let locationY;

		convertWallTiles(tileArr);

		for (let t = 0; t < TILES_IN_LEVEL; t++) {
			const x = t % TILE_MAP_SIZE[0];
			const y = Math.floor(t / TILE_MAP_SIZE[1]);
			const gameSpaceX = x * TILE_SIZE;
			const gameSpaceY = y * TILE_SIZE;
			const tileCode = parseInt(tileArr[curTileMapInd]);
			const direction = numToVec(tileCode % 4);
			if (tileCode === 0) {

			} else {
				let tilesheet = null;
				let vec = null;
				switch (Math.floor(tileCode / 4)) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
						tilesheet = tileCode < 10 ? WALL_TILESHEET : WALL_TILESHEET_OUTER;
						vec = tileCode < 10 ? vecTiles[tileCode - 1] : vecTilesOuter[tileCode - 10];
						this.solids.push(new Wall(gameSpaceX, gameSpaceY, TILE_SIZE, TILE_SIZE, this, tilesheet, vec));
						break;
					case 5:
						this.solids.push(new PlayerKill(gameSpaceX, gameSpaceY + TILE_SIZE / 2 + 2, TILE_SIZE, 2, this, direction));
						break;
					case 6:
					case 7:
					case 8:
					case 9:
					case 10:
						tilesheet = tileCode < 34 ? ICE_TILESHEET : ICE_TILESHEET_OUTER;
						vec = tileCode < 34 ? vecTiles[tileCode - 25] : vecTilesOuter[tileCode - 34];
						this.solids.push(new Ice(gameSpaceX, gameSpaceY, TILE_SIZE, TILE_SIZE, this, tilesheet, vec));
						break;
					case 13:
						this.actors.push(new Spring(gameSpaceX, gameSpaceY + TILE_SIZE - 3, TILE_SIZE, 3, direction, this));
						break;
					case 14:
						switch (tileCode) {
							case 56:
								// this.player = new Player(gameSpaceX+1, gameSpaceY+2, TILE_SIZE - 2, TILE_SIZE - 2, this);
								// this.actors.push(this.player);
								break;
							case 57:
								this.throwable = new Throwable(gameSpaceX + 1, gameSpaceY + 2, TILE_SIZE - 2, TILE_SIZE - 2, this);
								this.actors.push(this.throwable);
								break;
							case 58:
								this.throwable = new StickyThrowable(gameSpaceX + 1, gameSpaceY + 2, TILE_SIZE - 2, TILE_SIZE - 2, this);
								this.actors.push(this.throwable);
							default:
								break
						}
						break;
					case 15:
						let centerTile = false;
						switch (tileCode) {
							case 60:
								this.frontDecorations.push(new GodRay(gameSpaceX-16, gameSpaceY-16, this));
								break;
							case 61:
								centerTile = true;
							case 62:
								this.decorations.push(new Torch(gameSpaceX, gameSpaceY, this, centerTile));
								break;
							case 63:
								this.frontDecorations.push(new GodRay(gameSpaceX, gameSpaceY, this));
								break;
						}
						break;
					case 16:
						this.spawn = new Spawn(gameSpaceX + 1, gameSpaceY + 2);
						break;
					case 17:
						switch (tileCode) {
							case 68:
								this.frontDecorations.push(new Vine(gameSpaceX, gameSpaceY, this));
								break;
							case 69:
								this.frontDecorations.push(new Plant(gameSpaceX, gameSpaceY, this));
								break;
							case 70:
								this.solids.push(new Pedestal(gameSpaceX, gameSpaceY, this));
								break;
							case 71:
								this.frontDecorations.push(new Vine(gameSpaceX, gameSpaceY, this));
								break;
						}
					case 18:
						switch (tileCode) {
							case 72:
								const button = new Button(gameSpaceX, gameSpaceY + 5, 8, 3, this, () => this.onButtonPush());
								this.solids.push(button);
								this.buttons.push(button);
								break;
							case 73:
								const hasLeft = parseInt(tileArr[curTileMapInd - 1]) === 73;
								const hasRight = parseInt(tileArr[curTileMapInd + 1]) === 73;
								let v;
								if (hasLeft && hasRight) v = Vector({x: 1, y: 0});
								else if (hasLeft) v = Vector({x: 2, y: 0});
								else if (hasRight) v = Vector({x: 0, y: 0});

								this.solids.push(new Semisolid(gameSpaceX, gameSpaceY, 8, 3, this, new TileSprite(SEMISOLID_TILESHEET, v)));
								//this.solids.push(new Button(gameSpaceX, gameSpaceY, 3, 8, this, () => this.onButtonPush()));
								break;
							case 74:
								this.solids.push(new Button(gameSpaceX + 5, gameSpaceY, 3, 8, this, () => this.onButtonPush()));
								break;
							case 75:
								const s = new SwitchBlock(gameSpaceX, gameSpaceY, 8, 8, true, this, null)
								this.switchBlocks.push(s);
								this.solids.push(s);
								break;
						}
						break;
					case 19:
						vec = vecTilesCorner[tileCode % 4];
						this.solids.push(new Wall(gameSpaceX, gameSpaceY, TILE_SIZE, TILE_SIZE, this, WALL_TILESHEET_CORNER, vec));
						break;
					case 20:
						this.solids.push(new Collectible(gameSpaceX, gameSpaceY));
						break;
					case 21:
						let onPush;
						let sprite;
						let x = gameSpaceX - 2;
						let y = gameSpaceY - 2;
						let diamond = false;
						
						const onPickup = (unlock, particleColor, music) => {
							game.unlocks[unlock] = true;
							audioCon.playSoundEffect(UNLOCK_SFX);
							audioCon.queueSong(music);
							game.spawnPowerupParticles(x, y, particleColor);
							game.showHintText();
						}
						
						switch (tileCode) {
							case 84:
								onPush = () => {
									audioCon.playSong(HEADER_MUSIC);
									onPickup("JUMP", "#ff004d", LOOP1_MUSIC);
								}
								sprite = POWERUP_JUMP_SPRITE;
								break;
							case 85:
								x += 4;
								onPush = () => onPickup("SLIDE", "#ffa300", LOOP2_MUSIC);
								sprite = POWERUP_SLIDE_SPRITE;
								break;
							case 86:
								x+=4;
								onPush = () => onPickup("DJ", "#188755", LOOP3_MUSIC);
								sprite = POWERUP_DJ_SPRITE;
								break;
							case 87:
								x+=4;
								onPush = () => {
									game.endGame();
									audioCon.playSoundEffect(GEM_PICKUP_SFX);
									audioCon.playSong(END_MUSIC);
								}
								sprite = DIAMOND_IMG;
								this.solids.push(new DiamondPowerup(x, y, this, onPush, sprite));
								diamond = true;
								break;
						}
						if (!diamond) this.solids.push(new Powerup(x, y, this, onPush, sprite));
						break;
					//Meta
					case 64:
						const height = tileCode % 4;
						this.height = height;
						break;
					case 70:
					case 71:
						locationX = tileCode - 280;
						break;
					case 72:
					case 73:
						locationY = tileCode - 288;
						break;
					default:
						break;
				}
			}
			curTileMapInd += 1;
		}

		this.location = Vector({x: locationX, y: locationY});
		this.endLevelFrames = 0;
		this.opacity = 0;

		if (this.myLevelInd === 11) this.hintText = true;
		if (this.myLevelInd === 12) this.hintText = true;
	}

	setCurrentSpawn(direction, playerPos) {
		let x = playerPos.x, y = playerPos.y;
		switch (direction) {
			case Direction.NORTH:
				y = PIXEL_GAME_SIZE[1] - PLAYER_HITBOX_PIXEL_SIZE[0] - 3;
				break;
			case Direction.SOUTH:
				y = 1;
				break;
			case Direction.WEST:
				x = PIXEL_GAME_SIZE[0] - PLAYER_HITBOX_PIXEL_SIZE[0] - 1;
				break;
			case Direction.EAST:
				x = 1;
				break;
			default:
				console.log("Error: bad direction");
				break;
		}

		y = y - y % TILE_SIZE + 2;

		this.currentSpawn = Vector({x: x, y: y});
		//this.currentSpawn = this.spawns[direction];
	}

	drawAll() {
		this.decorations.forEach(curItem => {
			curItem.draw();
		});
		this.getSolids().forEach(curItem => {
			curItem.draw();
		});
		this.actors.forEach(item => {
			item.draw();
		});
		if (this.throwable) this.throwable.draw();
		this.player.draw();
		this.frontDecorations.forEach(curItem => {
			curItem.draw();
		});
		this.dustSprites.forEach(i => i.draw());
		if (this.hintText) {
			const p = this.hintText.pos;
			this.drawHintText(p);
		}
		
		this.drawFade();
	}

	drawHintText() {
		const data = getHintText(this.myLevelInd, this.hintText);
		const text = data.text;
		let pos = data.pos;
		const color = game.animFrame % 30 < 15 ? "#fff1e8" : "#C2C3C7";
		const yAdd = Math.round(2 * Math.sin(game.animFrame * 2 * Math.PI / 60));
		pos = pos.addPoint(Vector({x: 0, y: yAdd}));
		writeText(text, 1, pos, color);
	}

	spawnBat() {
		const y = Math.random() * (PIXEL_GAME_SIZE[0] - 20) + 10;
		const x = -5;
		const direction = 1;
		this.pushDecoration(new Bat(x, y, direction, this));
	}

	spawnDrop() {
		const x = Math.random() * (PIXEL_GAME_SIZE[0] - 8) + 4;
		const y = -5;

		const r0 = Math.random() / 10;
		const r1 = Math.random() * 50;
		const r2 = Math.random() / 10;
		// const actor = new Actor(x, y, 1, 1, true, this);
		// let destroy = false;
		// function p(t) {
		// 	const px = t * r0;
		// 	const py = clampedQuadratic(t, (200+r1), -(0.6 + r2), 0.5+r2);
		// 	if (d(actor)) destroy = true;
		// 	console.log(destroy);
		// 	if (destroy) return {x: -100, y: -100};
		// 	actor.setX(Math.floor(x + px));
		// 	actor.setY(Math.floor(y + py));
		// 	return {x: x + px, y: y + py};
		// }
		// const dust = new Particle(this, "#ffffff", p, Vector({x:2,y:2}));
		// this.pushDustSprite(dust);
		const drop = new Drop(x, y, this);
		this.actors.push(drop);
	}

	endGame() {
	}

	checkCollide(physObj, offset) {
		/*TODO: make a faster collision checking algorithm by:
        *  1) Sorting all solids by their x positions before moving any actors
        *  2) Assuming all solids are sorted, get a slice of the solids array that could possibly intersect with
        *     the actor's hitbox in the x direction
        *  3) Only check collisions with that slice */
		let ret = null;
		this.getAllGeometry().some(checkObj => {
			if (physObj.isOverlap(checkObj, offset)) {
				if (!checkObj.collidable) {
					physObj.onCollide(checkObj);
				} else {
					ret = checkObj;
					return;
				}
			}
		});

		return ret;
	}

	onButtonPush() {
		this.switchBlocks.forEach(s => s.deactivate());
		this.buttons.forEach(b => b.deactivate());

		if (this.getGame().levelInd === 1) {
			this.getGame().bigUnlocked = true;
		}
		audioCon.playSoundEffect(BUTTON_SFX);
	}

	pushDecoration(d) {
		this.decorations.push(d);
	}

	pushDustSprite(g) {
		this.dustSprites.push(g);
	}

	newGhostSpring(playerX, playerY) {
		this.solids.push(new GhostSpring(playerX, playerY + 6, TILE_SIZE - 3, 3, VectorUp, this));
		// this.actors.push(new Spring(gameSpaceX, gameSpaceY + TILE_SIZE - 3, TILE_SIZE, 3, direction, this));
	}

	removeGhostSpring(g) {
		const index = this.solids.indexOf(g);
		if (index > -1) {
			this.solids.splice(index, 1);
		}
	}

	removeDecoration(d) {
		const index = this.decorations.findIndex(de => de.id === d.id);
		if (index > -1) {
			this.decorations.splice(index, 1);
		}
	}

	removeDustSprite(d) {
		const index = this.dustSprites.indexOf(d);
		if (index > -1) {
			this.dustSprites.splice(index, 1);
		}
	}

	updatePhysicsAllPos() {
		this.getAllGeometry().forEach(geom => {
			geom.updatePhysicsPos();
		});
		this.decorations.forEach(decoration => {
			decoration.update();
		});
		this.dustSprites.forEach(g => {
			g.update()
		});

		const nextLevelDir = this.checkNextLevel();

		if (nextLevelDir && this.endLevelFrames === 0) {
			this.nextDirection = this.nextLevelDir();
			this.nextLevelPlayerPos = this.getPlayer().getPos();
			this.game.nextLevel(this.nextDirection, this.nextLevelPlayerPos);
		}
		if (this.endLevelFrames === 1) {
			this.game.nextLevel(this.nextDirection, this.nextLevelPlayerPos);
			this.nextDirection = Direction.NULL;
			this.endLevelFrames = 0;
		}
		if (this.checkPlayerFallDeath() && this.player.deathFrames <= 0 && !this.checkNextLevel()) {
			this.killPlayer();
		}
		/*if (!this.faded && game.onStickyLevel() && game.getCurrentLevel() === this && this.player.getX() > 80) {
            this.faded = true;
            audioCon.fadeOutSong(750);
        }*/
		if (this.endLevelFrames > 1) {
			this.endLevelFrames -= 1;
			this.fade(1 - this.endLevelFrames / 32);
		}
	}

	getAllGeometry() {
		return this.solids.concat(this.actors);
	}

	isOnGround(actor) {
		let ret = null;
		this.getAllGeometry().some(solid => {
				if ((solid.onPlayerCollide().includes("wall")) && solid.collidable && actor.isOnTopOf(solid)) {
					ret = solid;
					return true;
				}
			}
		);
		return ret;
	}

	isBonkHead(actor) {
		let ret = null;
		this.solids.some(solid => {
			if ((solid.onPlayerCollide().includes("wall")) && actor.isUnder(solid)) {
				ret = solid;
				return true;
			}
		});
		return ret;
	}

	isLeftOfWall(actor) {
		let ret = null;
		this.solids.some(solid => {
			if ((solid.onPlayerCollide().includes("wall")) && actor.isLeftOf(solid)) {
				ret = solid;
				return true;
			}
		});
		return ret;
	}

	isRightOfWall(actor) {
		let ret = null;
		this.solids.some(solid => {
			if ((solid.onPlayerCollide().includes("wall")) && actor.isRightOf(solid)) {
				ret = solid;
				return true;
			}
		});
		return ret;
	}

	isOnIce(actor) {
		let ret = null;
		(this.solids.concat(this.actors)).some(solid => {
				if ((solid.onPlayerCollide().includes("ice")) && solid.collidable && actor.isOnTopOf(solid)) {
					ret = solid;
					return true;
				}
			}
		);
		return ret;
	}

	isPushUp(actor) {
		let ret = false;
		this.actors.some(curActor => {
			if (actor !== curActor && (curActor.onPlayerCollide().includes("throwable") || curActor.onPlayerCollide() === "") && actor.isUnder(curActor)) {
				ret = curActor;
				return true;
			}
		});
		return ret;
	}

	getAllRidingActors(solid) {
		let ret = [];
		this.actors.forEach(actor => {
			if (actor.isRiding(solid)) {
				ret.push(actor);
			}
		});
		return ret;
	}

	resetStage(transitioning) {
		let newActors = [];
		this.game.respawn();
		this.actors.forEach(actor => {
			const newActor = actor.respawnClone(this);
			newActors.push(newActor);
			if (actor.onPlayerCollide().includes("throwable")) {
				this.throwable = newActor;
			}
			if (actor.onPlayerCollide() === "") {
				this.player = newActor;
			}
		});

		if (this.currentSpawn == null) {
			this.currentSpawn = Vector({x: 9, y: 104});
			// this.currentSpawn = Vector({x: 64, y: 80});
		}

		if (this.player == null) {
			// this.player = new Player(this.currentSpawn.x - 1, this.currentSpawn.y + 2, 6, 6, this);
			this.player = new Player(this.currentSpawn.x, this.currentSpawn.y, PLAYER_HITBOX_PIXEL_SIZE[0], PLAYER_HITBOX_PIXEL_SIZE[1], this);
			newActors.push(this.player);
		}

		if (transitioning) {
			this.player.respawnFrames = 0;
			this.player.sliding = this.game.lastSliding;
			this.player.canDoubleJump = this.game.lastCanDoubleJump;
			this.player.coyoteTime = this.game.lastCoyoteTime;
		} else {
			this.currentSpawn = Vector({x: this.spawn.x, y: this.spawn.y});
		}
		this.player.setX(this.currentSpawn.x);
		this.player.setY(this.currentSpawn.y);
		this.player.spawn = this.currentSpawn;
		this.player.facing = this.game.lastFacing;
		this.player.getSprite().flip = this.player.facing.x > 0;

		this.endLevelFrames = 0;
		this.actors = newActors;

		if (this.myLevelInd === 11 && this.getGame().visitedLevels[5]) this.hintText = false;
		if (this.myLevelInd === 12 && this.getGame().unlocks.JUMP) this.hintText = false;
		if (this.myLevelInd === 10 && this.getGame().unlocks.SLIDE) this.hintText = false;
		if (this.myLevelInd === 14 && this.getGame().unlocks.DJ) this.hintText = false;
		if (this.myLevelInd === 15 && this.getGame().visitedLevels[5]) this.hintText = false;

		if (this.myLevelInd === 12) {
			const isStuck = this.player.getX() < 104 && this.player.getY() >= 106;
			if (isStuck) this.hintText = 2;
		}
	}

	killPlayer(x, y) {
		this.player.kill(x, y);
		this.game.death();

		audioCon.playSoundEffect(DEATH_SFX);
	}

	setKeys(keys) {
		this.player.setKeys(keys);
	}

	isTouchingThrowable(physObj) {
		return this.throwable && (physObj.isTouching(this.throwable.getHitbox()));
	}

	getSolids() {
		return this.solids;
	}

	getActors() {
		return this.actors;
	}

	getDecorations() {
		return this.decorations;
	}

	getPlayer() {
		return this.player;
	}

	getThrowable() {
		return this.throwable;
	}

	getGame() {
		return this.game;
	}

	checkNextLevel() {
		return this.nextLevelDir() !== Direction.NULL;
	}

	nextLevelDir() {
		if (this.player.getX() <= 0) return Direction.WEST;
		if (this.player.getY() <= -3) return Direction.NORTH;
		if (this.player.getX() + this.player.getWidth() >= PIXEL_GAME_SIZE[0]) return Direction.EAST;
		if (this.player.getY() > PIXEL_GAME_SIZE[1]) return Direction.SOUTH;
		return Direction.NULL;
	}

	checkPlayerFallDeath() {
		return false;
		//return this.player.getY() > PIXEL_GAME_SIZE[1];
	}

	fade(opacity) {
		this.opacity = opacity;
	}

	drawFade() {
		CTX.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
		CTX.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);
	};

	showHintText() {
		this.hintText = true;
	}
}

/*class StartScreen extends Level{
    constructor(tileArr, game) {
        super(tileArr, game);
        this.player.respawnFrames = 0;
        this.keyOrder = ["KeyQ","KeyZ","KeyQ"];
        this.keyOrderInd = 0;

        this.startAnimFrames = 0;

        audioCon.playSong(BEGINNING_MUSIC);
    }

    checkPlayerFallDeath() {
        return false;
    }

    updatePhysicsAllPos() {
        super.updatePhysicsAllPos();
        this.game.scoreboardFrames = 0;
        if(this.startAnimFrames > 0) {
            this.startAnimFrames -= 1;
        }
    }

    setKeys(keys) {
        const z = keys["KeyZ"];
        const x = keys["KeyQ"];
        const checkKey = this.keyOrder[this.keyOrderInd];
        if(!checkKey && this.startAnimFrames === 0) {this.startAnimFrames = START_ANIM_FRAMES;}
        let k = {
            "KeyZ": 0,
            "KeyQ": 0,
            "moveRight": this.startAnimFrames > 0 ? 1 : 0
        };
        if(keys[checkKey] && !(checkKey === "KeyQ" ? this.prevX : this.prevZ)) {
            k[checkKey] = 1;
            this.keyOrderInd += 1;
        }
        const p = this.getPlayer();
        const th = this.getThrowable();
        if(this.startAnimFrames > 0 && p.isTouching(th.getHitbox()) && p.carrying !== th) {
            k["KeyQ"] = 1;
        }
        super.setKeys(k);

        this.prevX = z;
        this.prevZ = x;
    }

    checkNextLevel() {
        return this.startAnimFrames === 1;
    }

    drawAll() {
        if (this.startAnimFrames !== 1) {
            super.drawAll();
        }
        let drawWhite = i => {
            return i === this.keyOrderInd;
        };
        if (this.startAnimFrames > 0) {
            drawWhite = i => {
                return (Math.floor(this.startAnimFrames / 10)) % (this.keyOrderInd) === this.keyOrderInd - 1 - i;
            };
        }
        CTX.drawImage(TITLE_IMG, 10+game.cameraOffset.x, 60+game.cameraOffset.y);
        for (let i = 0; i < this.keyOrderInd + 1; ++i) {
            if (this.keyOrder[i]) {
                const pressText = "Press " + this.keyOrder[i].substr(3, 1);
                writeText(
                    pressText,
                    1,
                    Vector({x: 50, y: 90 + i * 10}),
                    drawWhite(i) ? "#c2c3c7" : "#5f574f",
                );
            }
        }
        if (this.startAnimFrames > 1 && this.startAnimFrames < START_ANIM_FRAMES - START_ANIM_OFFSET_FRAMES) {
            const op = 1 - this.startAnimFrames / (START_ANIM_FRAMES - START_ANIM_OFFSET_FRAMES);
            this.fade(op);
            this.drawFade();
            if (op > 0.98 && !this.faded) {
                this.faded = true;
            }
        }
        if (this.faded) {
            this.fade(1);
            this.drawFade();
        }
    }
}*/

const ENDGAME_ANIM_FRAMES = 180;
const ENDGAME_OFFSET_FRAMES = 60;
const ENDGAME_WALK_OFFSET_FRAMES = 30;
const CREDITS = [{
	"text": "Credits:",
	"size": 2,
	"paddingY": 128 + 64,
}, {
	"text": "A Game By:",
	"size": 1,
	"paddingY": 16
}, {
	"text": "yamEater20",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Color Palette:",
	"size": 1,
	"paddingY": 24,

}, {
	"text": "Pico8",
	"size": 1,
	"paddingY": 8,
	"paddingX": 8,
}, {
	"text": "Music:",
	"size": 1,
	"paddingY": 24,
}, {
	"text": "Velvet Waves",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "  By Lance Conrad",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "SFX:",
	"size": 1,
	"paddingY": 24,
}, {
	"text": "All Anonymous on Storyblocks",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Font:",
	"size": 1,
	"paddingY": 24,
}, {
	"text": "PixelFont By PaulBGD",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Playtesting:",
	"size": 1,
	"paddingY": 24,
}, {
	"text": "Cathy Lin",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Eric",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Esther Moon",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Daniel Carr",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Chase OBrien",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Special Thanks:",
	"size": 1,
	"paddingY": 24,
}, {
	"text": "G+S Yang",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Maddy Thorson",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "And the player",
	"size": 1,
	"paddingY": 8,
}, {
	"text": "Press R to restart",
	"size": 1,
	"paddingY": 64,
}

];

class EndScreen extends Level {
	constructor(tileArr, game, levelInd) {
		super(tileArr, game, levelInd);
		this.endGameFrames = 0;
		this.endWalkFrames = 0;

		this.realCamOffsetY = 0;
	}

	drawAll() {
		this.getDecorations().forEach(e => {
			e.draw();
		});
		this.getSolids().forEach(e => {
			e.draw();
		});
		this.getActors().forEach(e => e.draw());
		this.dustSprites.forEach(i => i.draw());
		this.frontDecorations.forEach(curItem => {
			curItem.draw();
		});
		if (this.endGameFrames > 1) {
			this.fade(1 - (this.endGameFrames / (ENDGAME_ANIM_FRAMES - ENDGAME_OFFSET_FRAMES)));
			this.endGameFrames -= 1;
			this.drawFade();
			const diamond = this.solids.find(e => e.isDiamond);
			if (diamond) diamond.draw();
		} else if (this.endGameFrames === 1) {
			this.fade(1 - (this.endGameFrames / (ENDGAME_ANIM_FRAMES - ENDGAME_OFFSET_FRAMES)));
			this.drawFade();
			this.centerPlayer();
			if (this.endWalkFrames === 0) {
				this.endWalkFrames = ENDGAME_WALK_OFFSET_FRAMES;
			}
			const diamond = this.solids.find(e => e.isDiamond);
			if (diamond) {
				diamond.draw();
			}
		}
		if (this.endWalkFrames > 1) {
			this.endWalkFrames -= 1;
		}
		this.player.draw();
		if (this.throwable) this.throwable.draw();

		CTX.drawImage(TITLE_IMG, 10 + game.cameraOffset.x, 184 + game.cameraOffset.y);
		let textPos = Vector({x: 16, y: 144});
		CREDITS.map(credit => {
			textPos.y += credit["paddingY"] ? credit["paddingY"] : 0;
			// textPos.x = credit["paddingX"] ? credit["paddingX"]+16 : 16;
			const text = credit["text"];
			const size = credit["size"];
			const widthOfText = getWidthOfText(text, size);
			const xPadding = (PIXEL_GAME_SIZE[0] - widthOfText) / 2;
			textPos.x = xPadding;
			if (textPos.y - game.cameraOffset.y < 100 && credit["text"] === "And you!") {
				textPos.y = 100 + game.cameraOffset.y;
			}
			// if(game.cameraOffset.y < -300 && credit["text"] === "And you!") {textPos.y = -game.cameraOffset.y;}
			writeText(credit["text"], credit["size"], textPos, credit["color"] ? credit["color"] : "#fff1e8");
		});
	}

	centerPlayer() {
		if (game.animFrame % 3 === 0) {
			const targetX = PIXEL_GAME_SIZE[0] / 2 - 2;
			if (this.player.getX() !== targetX) this.player.moveX(Math.sign(targetX - this.player.getX()), this.player.onCollide);
		}

		if (this.realCamOffsetY < -80) {
			game.scoreboardRect.pos = Vector({x: 46, y: 128 + 128 + 36});
			game.showMap = true;
			game.scoreboardFrames = 1000000;
		}

		if (this.realCamOffsetY > -624) {
			this.realCamOffsetY += -timeDelta / 90;
			game.cameraOffset.y = Math.round(this.realCamOffsetY);
		}
	}

	endGame() {
		super.endGame();
		this.endGameFrames = ENDGAME_ANIM_FRAMES;
	}

	setKeys(keys) {
		if (this.endGameFrames === 1) {
			if (keys["KeyR"]) {
				window.location.reload();
			}
		}
		
		if (this.endGameFrames === 0) {
			super.setKeys(keys);
		} else {
			const k = {
				"moveRight": 0,
				"moveLeft": 0,
				"jump": 0,
				"KeyQ": 0,
			};
			super.setKeys(k);
		}
	}
}

class PhysObj {
	constructor(x, y, w, h, collidable, level, direction) {
		if (direction) {
			const data = rotateRect(x, y, w, h, direction);
			this.hitbox = new Hitbox(data.newX, data.newY, data.newW, data.newH);
		} else {
			this.hitbox = new Hitbox(x, y, w, h);
		}
		this.direction = direction;
		this.level = level;
		this.collidable = collidable;
		this.velocity = Vector({x: 0, y: 0});
		this.sprite = null;
	}

	getPos() {
		return Vector({x: this.hitbox.getX(), y: this.hitbox.getY()});
	}

	getX() {
		return (this.hitbox.getX());
	}

	getY() {
		return (this.hitbox.getY());
	}

	getWidth() {
		return (this.hitbox.getWidth());
	}

	getHeight() {
		return (this.hitbox.getHeight());
	}

	setHeight(h) {
		this.hitbox.rect.height = h;
	}

	setX(x) {
		this.hitbox.setX(x);
	}

	setY(y) {
		this.hitbox.setY(y);
	}

	incrX(dx) {
		this.hitbox.incrX(dx);
	}

	incrY(dy) {
		this.hitbox.incrY(dy);
	}

	setSprite(s) {
		this.sprite = s;
	}

	getSprite() {
		return this.sprite;
	}

	onPlayerCollide() {
		throw new Error("Specify on player collide in physobj");
	}

	setXVelocity(vx) {
		this.velocity.x = vx;
	}

	setYVelocity(vy) {
		this.velocity.y = vy;
	}

	getXVelocity(vx) {
		return this.velocity.x;
	}

	getYVelocity(vy) {
		return this.velocity.y;
	}

	setVelocity(v) {
		this.velocity.x = v.x;
		this.velocity.y = v.y;
	}

	updatePhysicsPos() {
		this.move(this.velocity.x, this.velocity.y);
		if (this.sprite && this.sprite.update) {
			this.sprite.update();
		}
	}

	move(x, y) {
		throw new Error("implement move in subclass PhysObj");
	}

	isOverlap(physObj, offset) {
		return this !== physObj && this.hitbox.cloneOffset(offset).isOverlap(physObj.getHitbox())
	}

	isTouching(hitbox) {
		return this.collidable && this.hitbox.isTouching(hitbox);
	}

	isOnTopOf(physObj) {
		return this.hitbox.isOnTopOf(physObj.getHitbox());
	}

	isUnder(physObj) {
		return physObj.getHitbox().isOnTopOf(this.hitbox);
	}

	isLeftOf(physObj) {
		return this.hitbox.isLeftOf(physObj.getHitbox());
	}

	isRightOf(physObj) {
		return physObj.getHitbox().isLeftOf(this.getHitbox());
	}

	getHitbox() {
		return (this.hitbox);
	}

	getLevel() {
		return this.level;
	}

	getGame() {
		return this.level.getGame();
	}

	draw(color) {
		if (this.sprite && !color) {
			this.sprite.draw(this.getX(), this.getY());
		} else {
			drawOnCanvas(this.hitbox.rect, color);
		}
	}

	collideOffset(direction) {
		return this.getLevel().checkCollide(this, direction);
	}
}

class Decoration {
	constructor(x, y, sprite, level) {
		this.x = x;
		this.y = y;
		this.id = window.performance.now();
		this.sprite = sprite;
		this.level = level;
	}

	draw() {
		this.sprite.draw(this.x, this.y);
	}

	update() {
		this.sprite.update();
	}
}

class Bat extends Decoration {
	constructor(x, y, direction, level) {
		super(x, y, new AnimatedSprite(
			BAT_SPRITESHEET,
			null,
			[{"frames": 0, onComplete: "loop"}, {"frames": 8, onComplete: "loop", nth: 4}],
			16, 16
		), level);
		this.sprite.setRow(1);
	}

	update() {
		super.update();
		this.x += 1;
		if (this.x > PIXEL_GAME_SIZE[0]) {
			this.level.removeDecoration(this);
			delete this;
		}
	}
}

class BrownDust extends Decoration {
	constructor(x, y, startingYv, sprite, xFunc, level) {
		super(x, y, sprite, level);
		this.sprite.setRow(1);
		this.vy = startingYv;
		this.xFunc = xFunc;
	}

	update() {
		super.update();
		this.x = Math.round(this.xFunc(game.animFrame));
		this.y += Math.round(this.vy);
		this.vy = Math.max(this.vy * 0.9, 1);

		if (this.y > PIXEL_GAME_SIZE[1] - 50) {
			this.level.removeDecoration(this);
		}
	}
}

class Particle extends Decoration {
	constructor(level, color, positionFunction, size) {
		super(0, 0, null, level);
		this.frames = 120;
		this.color = color;
		this.size = size;
		this.positionFunction = positionFunction;
	}

	draw() {
		if (this.frames <= 0 || this.frames === 120) return;

		let alpha = (this.frames) * 255 / 120;
		alpha = Math.ceil(alpha).toString(16).padStart(2, "0");
		CTX.fillStyle = this.color + alpha;
		CTX.fillRect(Math.round(this.x), Math.round(this.y), this.size.x, this.size.y);
	}

	update() {
		if (this.frames <= 0) {
			this.level.removeDecoration(this);
			return;
		}

		this.frames--;
		const p = this.positionFunction((120-this.frames) / 120);
		this.x = p.x;
		this.y = p.y;
	}
}

function drawEllipse(x, y, rad, colorA, colorB) {
	const grad=CTX.createRadialGradient(x,y,0,x,y,rad);
	grad.addColorStop(0,colorA);
	grad.addColorStop(1,colorB ? colorB : colorA);

	CTX.fillStyle = grad;
	CTX.beginPath();
	CTX.ellipse(x + game.cameraOffset.x, y + game.cameraOffset.y, rad, rad, 0, 0, Math.PI * 2, true);
	CTX.fill();
}

function drawRoundedRect(x, y, w, h, rad, colorA, colorB) {
	const grad=CTX.createRadialGradient(x+w/2,y+h/2,0,x+w/2,y+h/2,w);
	grad.addColorStop(0,colorA);
	grad.addColorStop(1,colorB ? colorB : colorA);

	CTX.fillStyle = grad;
	CTX.beginPath();
	CTX.roundRect(x + game.cameraOffset.x, y + game.cameraOffset.y, w, h, rad);
	CTX.fill();
}

class Vine extends Decoration {
	constructor(x, y, level) {
		const ind = Math.floor(Math.random() * 4);
		super(x, y, new Sprite(VINE_IMGS[ind]), level);
	}
}

class Plant extends Decoration {
	constructor(x, y, level) {
		const ind = Math.floor(Math.random() * 4);
		super(x, y, new Sprite(PLANT_IMGS[ind]), level);
	}
}

class GodRay extends Decoration {
	constructor(x, y, level) {
		// const spr = new AnimatedSprite(
		// 	GOD_RAY_IMG,
		// 	null,
		// 	[{frames: 0}, {frames: 1, onComplete: "loop", nth: 60}], 80, 80
		// )
		const spr = new Sprite(GOD_RAY_IMG);
		super(x, y, spr, level);

		// this.sprite.setRow(1);
	}

	draw() {
		// super.draw(this.x, this.y);
		super.draw(this.x - 16, this.y - 16);
	}
}

class Torch extends Decoration {
	constructor(x, y, level, centerTile) {
		super(x, y, new AnimatedSprite(
			FLAME_SPRITESHEET,
			null,
			[{frames: 0, onComplete: null}, {frames: 4, onComplete: "loop", nth: 8}]
		), level);
		this.sprite.setRow(1);
		this.timingOffset = Math.random() * 5;
		this.torchSprite = new Sprite(TORCH_IMG, null);
		this.offset = centerTile ? 0 : 4;
	}

	draw() {
		const offset = Math.sin(Math.PI * game.animFrame / 30 + this.timingOffset) * 0.6;
		const yOffset = Math.round(Math.sin(Math.PI * game.animFrame / 30) * 0.72);
		this.torchSprite.draw(this.x + this.offset, this.y + 9 + yOffset);

		// CTX.ellipse(+game.cameraOffset.x+4+this.offset, this.y+game.cameraOffset.y+8, rad, rad, 0, 0, Math.PI*2, true);
		// drawEllipse(this.x+4+this.offset, this.y+10+yOffset, 10+offset, "rgba(250,198,42,0.1)");
		drawEllipse(this.x + 4 + this.offset, this.y + 10 + yOffset, 18 + offset, "rgba(41,173,255,0.3)", "rgba(41,173,255,0.0)");
		this.sprite.draw(this.x + this.offset, this.y + 2 + yOffset);
	}
}

class ExitArrow extends Decoration {
	constructor(x, y, level, facingLeft) {
		super(x, y, new Sprite(ARROW_IMG), level);
		this.spawnX = x;
		this.sprite.flip = facingLeft;
		//foo
	}

	draw() {
		this.sprite.draw(this.spawnX + Math.round(Math.sin(game.animFrame / 30 * Math.PI)), this.y + 4);
	}

	update() {
	}
}

class GroundDustSprite extends Decoration {
	constructor(x, y, direction, level, rotateDirection) {
		super(x, y, new AnimatedSprite(
			GROUND_DUST_SPRITESHEET,
			rotateDirection,
			[{"frames": 0, "onComplete": null}, {"frames": 7, "onComplete": null, "nth": 6}],
			8, 8,), level
		);
		this.sprite.setRow(1);
		this.direction = direction;
	}

	draw() {
		this.sprite.draw(this.x + this.direction * this.sprite.curCol, this.y);
	}

	update() {
		super.update();
		if (this.sprite.curCol === 0) {
			this.level.removeDustSprite(this);
			delete this;
		}
	}
}

class SpringDustSprite extends Decoration {
	constructor(x, y, w, h, v, level) {
		super(x, y, null, level);
		this.pos = Vector({x: x, y: y});
		this.w = w;
		this.h = h;
		this.v = v;
		this.distance = 0;

		this.direction = Math.sign(Math.random() - 0.5);
		this.ha = x + 3 * this.direction;
		this.k = y - (Math.random() * 5 + 15);
		this.a = (y - this.k) / (this.ha * this.ha);
	}

	tragectoryFunc(t) {
		return this.a * (t - this.ha) * (t - this.ha) + this.k;
	}

	draw() {
		const a = (this.distance - 10) * -0.02 + 1;
		CTX.fillStyle = `rgba(255, 119, 169, ${Math.min(1, a)})`;
		CTX.fillRect(this.pos.x + game.cameraOffset.x, this.pos.y + game.cameraOffset.y, this.w, this.h);
		// alert(this.distance.toString() + " " + a);
	}

	update() {
		// let dx = Math.round(this.v.x);
		// this.v.y += PLAYER_GRAVITY_UP/2;
		// let dy = Math.round(this.v.y);
		// this.pos.x += dx;
		// this.pos.y += dy;
		this.pos.x = Math.round(this.pos.x + this.direction);
		this.pos.y = Math.round(this.tragectoryFunc(this.distance));
		this.distance += 1;
		// alert();

		if (this.pos.y > PIXEL_GAME_SIZE[0]) {
			this.level.removeDustSprite(this);
		}
	}
}

class Spawn {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Actor extends PhysObj {
	constructor(x, y, w, h, collidable, level, direction) {
		super(x, y, w, h, collidable, level, direction);
		this.spawn = Vector({x: x, y: y});
		this.origW = w;
		this.origH = h;
		this.subpixelX = 0;
	}

	respawnClone() {
		throw new Error("Implement respawn clone");
	}

	//Moves the actor by [amount] pixels and calls [onCollide] after collision with any object
	moveX(amount, onCollide) {
		let remainder = Math.round(amount + this.subpixelX);
		this.subpixelX = (amount + this.subpixelX) - remainder;
		const direction = Vector({x: amount < 0 ? -1 : 1, y: 0});
		if (remainder !== 0) {
			const carryingObj = this.getCarrying();
			while (remainder !== 0) {
				let collideObj = this.collideOffset(direction);
				if (collideObj && collideObj !== carryingObj) {
					const shouldBreak = onCollide(collideObj);
					if (shouldBreak) {
						break;
					}
				}
				super.incrX(direction.x);
				if (carryingObj) {
					carryingObj.incrX(direction.x);
				}
				remainder -= direction.x;
			}
		}
	}

	moveY(amount, onCollide) {
		let remainder = Math.round(amount);
		const direction = Vector({y: amount < 0 ? -1 : 1, x: 0});
		if (remainder !== 0) {
			const carryingObj = this.getCarrying();
			while (remainder !== 0) {
				let collideObj = this.collideOffset(direction);
				if (collideObj && collideObj !== carryingObj) {
					const shouldBreak = onCollide(collideObj);
					if (shouldBreak) {
						break;
					}
				}
				super.incrY(direction.y);
				if (carryingObj && carryingObj.getCarrying() !== this) {
					carryingObj.moveY(direction.y, () => {
					});
				}
				remainder -= direction.y;
			}
		}
	}

	isOnGround() {
		return (super.getLevel().isOnGround(this));
	}

	isOnIce() {
		return (super.getLevel().isOnIce(this));
	}

	isBonkHead() {
		return (super.getLevel().isBonkHead(this));
	}

	isPushUp() {
		return (super.getLevel().isPushUp(this));
	}

	isRiding(solid) {
		return (this.getHitbox().isOnTopOf(solid.getHitbox()));
	}

	onCollide(physObj) {
		throw new Error("implement method onCollide in subclass Actor");
	}

	fall() {
		this.setYVelocity(Math.min(MAXFALL, this.velocity.y + timeDelta / 16.666 * (this.velocity.y > 0 ? PLAYER_GRAVITY_UP : PLAYER_GRAVITY_DOWN)));
	}

	squish(physObj) {
		throw new Error("implement method squish in subclass actor");
	}

	getCarrying() {
		return null;
	}

	move(x, y) {
		this.moveX(x, this.onCollide);
		this.moveY(y, this.onCollide);
	}
}

//https://maddythorson.medium.com/celeste-and-towerfall-physics-d24bd2ae0fc5
class Solid extends PhysObj {
	constructor(x, y, w, h, collidable, level, direction) {
		super(x, y, w, h, collidable, level, direction);
	}

	move(moveX, moveY) {
		let remainderX = Math.round(moveX);
		let remainderY = Math.round(moveY);
		if (remainderX !== 0 || remainderY !== 0) {
			const ridingActors = super.getLevel().getAllRidingActors(this);
			const prevCollide = this.collidable;
			this.collidable = false;
			if (remainderX !== 0) {
				super.incrX(remainderX);
				//Warning: if a solid tunnels through an object, the object won't get pushed
				//That's probably fine for now
				super.getLevel().getActors().forEach(actor => {
					if (actor in ridingActors) {
						actor.moveX(remainderX, actor.onCollide);
					} else if (this.getHitbox().isOverlap(actor.getHitbox())) {
						actor.moveX(super.getX() + super.getWidth() - actor.getX(), actor.squish)
					}
				});
			}

			if (remainderY !== 0) {
				super.incrY(remainderY);
				super.getLevel().getActors().forEach(actor => {
					if (actor in ridingActors) {
						actor.moveY(remainderY, actor.onCollide);
					} else if (this.getHitbox().isOverlap(actor.getHitbox())) {
						const moveUp = remainderY > 0 ? super.getY() - super.getHeight() - actor.getY() : super.getY() - actor.getY() - actor.getHeight();
						actor.moveY(moveUp, actor.squish)
					}
				});
			}
			this.collidable = prevCollide;
		}
	}

	onPlayerCollide() {
		return "wall";
	}
}

class Wall extends Solid {
	constructor(x, y, w, h, level, tilesheet, tileVec) {
		super(x, y, w, h, true, level);
		const t = new TileSprite(tilesheet, tileVec);
		super.setSprite(t);
	}
}

class Semisolid extends Solid {
	constructor(x, y, w, h, level, tileSprite) {
		super(x, y, w, h, true, level);
		super.setSprite(tileSprite);
	}

	onPlayerCollide() {
		const p = this.level.getPlayer();
		const b = p.getY() + p.getHeight() <= this.getY();
		if (b) return "wall";
		return "semi";
	}
}

class Ice extends Solid {
	constructor(x, y, w, h, level, tilesheet, tileVec) {
		super(x, y, w, h, true, level);
		super.setSprite(new TileSprite(tilesheet, tileVec));
	}

	onPlayerCollide() {
		return "wall ice";
	}

	// draw() {
	//     super.draw("#2AADFE");
	// }
}

class Pedestal extends Solid {
	constructor(x, y, level) {
		super(x, y, 16, 8, true, level);
		super.setSprite(new Sprite(PEDESTAL_IMG));
	}
}

function rotateRect(x, y, w, h, direction) {
	const xgrid = x - x % TILE_SIZE, ygrid = y - y % TILE_SIZE;

	let newX = x;
	if (direction.x === -1) newX = xgrid + TILE_SIZE - h;
	else if (direction.x === 1) newX = xgrid;

	let newY = direction === VectorUp ? y : y + h - TILE_SIZE;
	if (direction.x === -1) newY = ygrid + x - xgrid;
	if (direction.x === 1) newY = ygrid + x - xgrid;

	return {
		newX: newX,
		newY: newY,
		newW: direction.x === 0 ? w : h,
		newH: direction.x === 0 ? h : w
	};
}

class Drop extends Actor {
	constructor(x, y, level) {
		super(Math.round(x), y, 1, 3, false, level);
		this.velocity.y = 0;
		this.gravity = 0.1;
		this.destroyed = false;
		this.onCollide = this.onCollide.bind(this);
		this.id = window.performance.now();
	}

	respawnClone(level) {
		return new Drop(this.getX(), this.getY(), level);
	}

	draw() {
		drawOnCanvas(this.hitbox.rect, "#29adff80");
	}

	updatePhysicsPos() {
		if (this.destroyed) return;
		this.velocity.y += this.gravity;
		super.updatePhysicsPos();
	}

	onCollide(physObj) {
		if (physObj.onPlayerCollide().includes("wall")) {
			this.destroyed = true;
			const index = this.getLevel().actors.findIndex(a => a.id === this.id);
			if (index > -1) {
				this.getLevel().actors.splice(index, 1);
			}
		}
		return false;
	}

	onPlayerCollide() {return "drop";}
}

class Spring extends Actor {

	constructor(x, y, w, h, direction, level) {
		super(x, y, w, h, true, level, direction);
		super.setSprite(new AnimatedSprite(SPRING_SPRITESHEET, direction, [{frames: 0, onComplete: null}, {
			frames: 16,
			onComplete: null
		}]));
		this.direction = direction;
	}

	respawnClone(level) {
		return new Spring(this.spawn.x, this.spawn.y, this.origW, this.origH, this.direction, level);
	}

	draw() {
		super.getSprite().draw(Math.floor(this.getX() / TILE_SIZE) * TILE_SIZE, this.getY() - TILE_SIZE + this.getHeight());
	}

	updatePhysicsPos() {
		super.updatePhysicsPos();
	}

	onPlayerCollide() {
		return "spring";
	}

	bounceObj(physObj) {
		const newV = this.direction.scalar(SPRING_SCALAR);
		if (newV.x) {
			physObj.setXVelocity(newV.x);
		} else {
			physObj.setYVelocity(newV.y);
		}
		super.getSprite().setRow(1);
		audioCon.playSoundEffect(SPRING_SFX);
		game.spawnSpringParticles(this.getX(), this.getY());
		// const numDusts = 3;
		// for(let i = 0; i<numDusts; ++i) {
		//     const vx = Math.sign(Math.random()-0.5);
		//     const vy = -Math.random()*2;
		//     this.getLevel().pushDustSprite(new SpringDustSprite(this.getX(), this.getY(), 1, 1, Vector({x:vx, y:vy}), this.level));
		// }
	}

	canPassThrough(p) {
		if (p.getXVelocity() * this.direction.x + p.getYVelocity() * this.direction.y > 0) {
			return false;
		}
		return true;
	}
}

/*class GhostSpring extends Spring {
    constructor(x, y, w, h, direction, level) {
        super(x, y, w, h, direction, level);
        this.setX(x);
        this.setY(y);
        this.width = w;
        this.height = h;
    }

    bounceObj(physObj) {
        super.bounceObj(physObj);
        this.getLevel().removeGhostSpring(this);
    }
}*/

class PlayerKill extends Solid {
	constructor(x, y, w, h, level, direction) {
		super(x, y, w, h, false, level, direction);
		this.tilex = Math.floor(x / TILE_SIZE) * TILE_SIZE;
		this.tiley = Math.floor(y / TILE_SIZE) * TILE_SIZE;
		super.setSprite(new Sprite(SPIKES_IMG, direction));
	}

	onPlayerCollide() {
		return "kill";
	}

	draw() {
		// super.draw("#ff0000");

		super.getSprite().draw(this.tilex, this.tiley);
	}

	updatePhysicsPos() {
		super.updatePhysicsPos();
	}

	shouldKill(p) {
		if (p.getXVelocity() * this.direction.x + p.getYVelocity() * this.direction.y > 0) {
			return false;
		}
		return true;
	}
}

class Throwable extends Actor {
	constructor(x, y, w, h, level) {
		super(x, y, w, h, true, level);
		this.throwVelocity = Vector({x: 1.7, y: -1.5});
		this.onCollide = this.onCollide.bind(this);
		this.squish = this.squish.bind(this);
		this.beingCarried = false;
		this.throwHeight = 0;
		this.touchedIce = false;
		this.pickingUp = false;
		super.setSprite(
			new AnimatedSprite(
				THROWABLE_SPRITESHEET,
				null,
				[{frames: 0, onComplete: null}, {frames: 12, onComplete: "boomerang", nth: 2}],
				w, h)
		);
		// super.setSprite(new Sprite())
	}

	onPlayerCollide() {
		return ("wall throwable");
	}

	stopPickingUp() {
		const player = super.getLevel().getPlayer();
		this.setY(player.getY() - this.getHeight() - 2);
		this.setX(player.getX());
		this.pickingUp = false;
	}

	throw(direction) {
		let throwV = direction === VectorLeft ? this.throwVelocity.scalarX(-1) : this.throwVelocity;
		this.stopPickingUp();
		if (this.getSprite().setRow) this.getSprite().setRow(0);
		this.setVelocity(throwV);
		this.touchedIce = false;
		this.beingCarried = false;
		this.throwHeight = this.getY();
	}

	squish() {
		this.getLevel().killPlayer();
	}

	startCarrying() {
		this.pickingUp = 1;
		this.beingCarried = true;
		if (this.getSprite().setRow) this.getSprite().setRow(1);
	}

	respawnClone(level) {
		return new Throwable(this.spawn.x, this.spawn.y, this.origW, this.origH, level);
	}

	isOverlap(physObj, offset) {
		const norm = super.isOverlap(physObj, offset);
		if (this.beingCarried) {
			return physObj !== super.getLevel().getPlayer() && norm;
		} else {
			return norm;
		}
	}

	onCollide(physObj) {
		const playerCollideFunction = physObj.onPlayerCollide();
		if (playerCollideFunction === "spring") {
			physObj.bounceObj(this);
			this.touchedIce = true;
		} else if (playerCollideFunction.includes("wall") && physObj.collidable) {
			if (physObj.isOnTopOf(this)) {
				//Bonk head
				if (playerCollideFunction === "") {
					// physObj.incrY(-10, physObj.onCollide);
				} else {
					this.setYVelocity(0);
				}
			} else if (this.isOnTopOf(physObj)) {
				//Land on ground
				this.setYVelocity(physObj.getYVelocity());
				if (!this.isOnIce() && this.throwHeight > this.getHeight() + 24) {
					this.setXVelocity(physObj.getXVelocity());
				}
			} else if (this.isLeftOf(physObj) || this.isRightOf(physObj)) {
				if (this.getYVelocity() >= 0) this.setYVelocity(-0.5);
				if (playerCollideFunction === "wall") {
					this.getLevel().pushDustSprite(new GroundDustSprite(this.getX(), this.getY() - 3, 0, this.level, this.velocity.x < 0 ? VectorRight : VectorLeft))
				}
				this.setXVelocity(0);
			}
		} else if (playerCollideFunction === "kill") {
			return false;
		} else if (playerCollideFunction.includes("button")) {
			physObj.push();
			return playerCollideFunction.includes("wall");
		}
		return true;
	}

	isOnGround() {
		if (this.isOnTopOf(super.getLevel().getPlayer())) {
			return super.getLevel().getPlayer()
		} else {
			return super.isOnGround();
		}
	}

	pickUpFrames = 12;

	incrPickupFrames() {
		const player = super.getLevel().getPlayer();
		const tx = this.getX();
		const ty = this.getY();
		const px = player.getX();
		const py = player.getY() - this.getHeight() - 2;
		//Move closer to target pos
		let xOffset = Math.floor((px - tx) * this.pickingUp / this.pickUpFrames);
		let yOffset = Math.ceil((py - ty) * this.pickingUp / this.pickUpFrames);

		//Check to make sure there's nothing in the way in the x direction
		let collideObj = super.getLevel().checkCollide(this, Vector({x: xOffset, y: 0}));
		if (collideObj) {
			//If there is something in the way, don't move the box in the x direction
			xOffset = 0;
		}
		//Check to make sure there's nothing in the way in the y direction
		collideObj = super.getLevel().checkCollide(this, Vector({x: 0, y: yOffset}));
		if (collideObj) {
			//If there is something in the way, move the player and the box down
			player.moveY(-1 * yOffset, player.squish);
			yOffset = 0;
		}

		this.setX(tx + xOffset);
		this.setY(ty + yOffset);
		this.pickingUp += 1;
	}

	fall() {
		this.setYVelocity(Math.min(MAXFALL, this.velocity.y + (this.velocity.y > 0 ? PLAYER_GRAVITY_UP : PLAYER_GRAVITY_DOWN)));
	}

	updatePhysicsPos() {
		if (this.getLevel().getPlayer().deathFrames === 0) {
			if (this.pickingUp) {
				if (this.pickingUp < this.pickUpFrames) {
					this.incrPickupFrames();
				} else {
					this.stopPickingUp();
				}
			} else if (this.beingCarried) {

			} else {
				super.updatePhysicsPos();
				if (!this.isOnGround()) {
					this.fall();
					if (this.getY() > this.throwHeight + 5 && !this.touchedIce) {
						this.velocity.x = 0;
					}
				} else {
					if (!this.isOnIce()) {
						this.velocity.x = 0;
						this.touchedIce = false;
					} else {
						this.touchedIce = true;
					}
					this.setYVelocity(this.isOnGround().getYVelocity() * 0.9);

				}
			}
			if (this.getSprite().update) this.getSprite().update();
		}
	}
}

class StickyThrowable extends Throwable {
	constructor(x, y, w, h, level) {
		super(x, y, w, h, level);
		this.onCollide = this.onCollide.bind(this);
		this.stuck = null;
	}

	onPlayerCollide() {
		return "wall sticky throwable";
	}

	respawnClone(level) {
		return new StickyThrowable(this.spawn.x, this.spawn.y, this.origW, this.origH, level);
	}

	draw() {
		super.draw();
		recolorImage(this.getX() + game.cameraOffset.x, this.getY() + game.cameraOffset.y, hexToRgb("#ffffa300"), hexToRgb("#ffff77a9"));
		recolorImage(this.getX() + game.cameraOffset.x, this.getY() + game.cameraOffset.y, hexToRgb("#ffaf5236"), hexToRgb("#ff7e2553"));
	}

	startCarrying() {
		super.startCarrying();
		this.stuck = null;
	}

	fall() {
		if (!this.stuck || this.stuck.onPlayerCollide().includes("ice")) {
			super.fall();
		}
	}

	onCollide(physObj) {
		const playerCollideFunction = physObj.onPlayerCollide();
		if (playerCollideFunction === "spring") {
			physObj.bounceObj(this);
			super.touchedIce = true;
			// return true;
			// this.velocity.y = -3;
			// physObj.bounce();
		} else if (playerCollideFunction.includes("wall") && physObj.collidable) {
			if (this.isOverlap(physObj, VectorZero)) {
				//Must have tunneled through the wall bc of a spike
				const px = physObj.getX();
				if (this.getXVelocity() > 0) {
					//If moving right, push back left
					this.setX(px - this.getWidth());
				} else {
					this.setX(px + physObj.getWidth());
				}
			}
			if (physObj.isOnTopOf(this)) {
				//Bonk head
				if (playerCollideFunction === "") {
					physObj.moveY(-1, physObj.onCollide);
				} else {
					this.setYVelocity(0);
				}
			} else if (this.isOnTopOf(physObj)) {
				//Land on ground
				this.setYVelocity(physObj.getYVelocity() * 0.9);
				if (!this.isOnIce()) {
					this.setXVelocity(physObj.getXVelocity());
				}
			} else if (this.isLeftOf(physObj) || this.isRightOf(physObj)) {
				if (!playerCollideFunction.includes("ice")) {
					this.setYVelocity(0);
					this.stuck = physObj;
				}
				if (playerCollideFunction === "wall") {
					this.getLevel().pushDustSprite(new GroundDustSprite(this.getX(), this.getY() - 3, 0, this.level, this.velocity.x > 0 ? VectorLeft : VectorRight))
				}
				this.setXVelocity(0);
			}
		} else if (playerCollideFunction === "kill") {
			return false;
		} else if (playerCollideFunction.includes("button")) {
			physObj.push();
			return playerCollideFunction.includes("wall");
		}
		return true;
	}
}

function drawLine(x0, y0, x1, y1) {
	const dx = Math.abs(x1 - x0);
	const dy = Math.abs(y1 - y0);
	const sx = (x0 < x1) ? 1 : -1;
	const sy = (y0 < y1) ? 1 : -1;
	let err = dx - dy;
	while (true) {
		CTX.fillRect(x0 + game.cameraOffset.x, y0 + game.cameraOffset.y, 1, 1); // Do what you need to for this
		if (Math.abs(x0 - x1) < 0.01 && Math.abs(y0 - y1) < 0.01) break;
		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}
}

class DiamondThrowable extends StickyThrowable {
	constructor(x, y, w, h, level) {
		super(x, y, w, h, level);
		this.setSprite(new Sprite(DIAMOND_IMG, null));
	}

	onPlayerCollide() {
		return super.onPlayerCollide() + "diamond"
	}

	respawnClone(level) {
		return new DiamondThrowable(this.spawn.x, this.spawn.y, this.getWidth(), this.getHeight(), this.getLevel());
	}

	draw() {
		if (this.beingCarried) {
			this.drawLines();
		}
		this.getSprite().draw(this.getX() - 1, this.getY() - 2);
	}

	updatePhysicsPos() {
		super.updatePhysicsPos();
	}

	startCarrying() {
		super.startCarrying();
		game.endGame();
	}

	drawLineAround(x, y, angle, rad1, rad2) {
		let xCos = Math.cos(angle);
		let ySin = Math.sin(angle);
		let x0 = Math.round(x + xCos * rad1);
		let y0 = Math.round(y + ySin * rad1);
		let x1 = Math.round(x + xCos * rad2);
		let y1 = Math.round(y + ySin * rad2);
		drawLine(x0, y0, x1, y1);
	}

	drawLines() {
		const numLines = 16;
		const radOff = 0.5 * Math.sin(game.animFrame / 30 * Math.PI);
		for (let i = 0; i < numLines; ++i) {
			let angle = 2 * Math.PI * (i + game.animFrame / 30) / numLines;
			CTX.fillStyle = "#7e2553a0";
			this.drawLineAround(this.getX() + 2, this.getY() + 2, angle, 20, 28 + radOff);
			if (i % 2 === 0) {
				CTX.fillStyle = "#ff004de0";
				this.drawLineAround(this.getX() + 2, this.getY() + 2, -angle, 8, 16);
			}
		}
		drawEllipse(this.getX() + 3, this.getY() + 3, 36 + radOff * 2, "rgba(255, 162, 0, 0.3)", "rgba(255, 162, 0, 0)");
		// const offset = Math.sin(game.animFrame/60*2*Math.PI);
		// const colorA = "rgba(255, 162, 0, 0.5)";
		// const colorB = "rgba(255, 231, 252, 0.4)";
		// drawEllipse(this.getX()+3, this.getY()+3, 18+offset*0.5, Math.floor(game.animFrame/20)%2===0 ? colorA : colorB);
		// drawEllipse(this.getX()+3, this.getY()+3, 10+offset, Math.floor(game.animFrame/20)%2===0 ? colorB : colorA);

	}
}

class Player extends Actor {
	constructor(x, y, w, h, level) {
		super(x, y, w, h, true, level);
		//this.test2 = this.test2.bind(this)
		this.onCollide = this.onCollide.bind(this);
		this.squish = this.squish.bind(this);
		this.facing = VectorRight;
		this.carrying = null;
		this.prevXKey = 0;
		this.jumpJustPressed = 0;
		this.xJustPressed = 0;
		this.coyoteTime = 0;
		this.xoyoteTime = 0;
		this.sprite = new AnimatedSprite(
			MAIN_CHARA_SPRITESHEET,
			null,
			[{frames: 0, onpComplete: null}, {frames: 4, onpComplete: "loop", nth: 6}, {
				frames: 1,
				onComplete: null,
				nth: 1
			}, {frames: 1, onComplete: null}]
		);
		this.sprite.flip = true;

		this.spawnSprite = new AnimatedSprite(SPAWN_SPRITESHEET, null, [{frames: 0, onComplete: null}, {
			frames: 24,
			onComplete: null,
			nth: 3
		}], 15, 15);

		this.deathSprites = [];
		for (let i = 0; i < 8; ++i) {
			this.deathSprites.push(
				new AnimatedSprite(
					DEATH_SPRITESHEET,
					null,
					[{frames: 0, onComplete: null}, {frames: 1, onComplete: "boomerang", reverse: false, nth: 60}],
					8, 8)
			);
		}
		this.deathPos = Vector({x: 0, y: 0});
		this.respawnFrames = 48;
		this.playerDied = true;
		this.deathFrames = 0;
		this.spawned = false;
		this.wasOnGround = null;

		this.sliding = false;
		this.slideTimer = -1;
		this.slideBumpFrames = 0;
	}

	kill(x, y) {
		if (x != null && y != null) {
			this.deathPos = Vector({x: x, y: y});
			this.playerDied = false;
		} else {
			this.deathPos = Vector({x: this.getX(), y: Math.min(this.getY(), PIXEL_GAME_SIZE[1])});
			this.playerDied = true;
		}

		this.deathFrames = 64;
		this.deathSprites.map(d => {
			d.setRow(1);
		});
	}

	onCollide(physObj) {
		if (this.getGame().debugFlying) return false;

		const playerCollideFunction = physObj.onPlayerCollide();
		if (playerCollideFunction.includes("button")) {
			physObj.push();
		}
		if (playerCollideFunction === "spring" && physObj.canPassThrough(this)) {
			physObj.bounceObj(this);
			this.canDoubleJump = true;
		} else if (playerCollideFunction.includes("wall") && physObj.collidable) {
			if (physObj.collidable && physObj.isOnTopOf(this) || (this.carrying && physObj.isOnTopOf(this.carrying))) {
				if (playerCollideFunction.includes("throwable")) {
					if (playerCollideFunction.includes("sticky") && physObj.stuck) {
						this.setYVelocity(0);
						physObj.setYVelocity(0);
						return true;
					} else if (!physObj.isOnGround()) {
						physObj.moveY(-1, physObj.onCollide);
					}
				} else {
					this.setYVelocity(0);
					this.jumpJustPressed = 0;
					this.xJustPressed = 0;
				}
			} else if (this.isOnTopOf(physObj)) {
				this.setYVelocity(0);
			} else if (this.sliding && (this.isLeftOf(physObj) || this.isRightOf(physObj)) && this.slideTimer <= 0) {
				const yDiff = physObj.getY() - this.getY();
				if (yDiff < 3 && yDiff >= 0) {
					this.moveY(-4, this.onCollide);
					if (this.isLeftOf(physObj) || this.isRightOf(physObj)) {
						this.moveY(4, this.onCollide);
					} else {
						return true;
					}
				}
				// this.slideTimer = SLIDE_TIMER;
				this.slideBump(this.facing);
			}
		} else if (playerCollideFunction === "kill" && this.isTouching(physObj.getHitbox()) && this.deathFrames === 0) {
			if (this.sliding && physObj.direction === VectorUp) return false;
			if (!physObj.shouldKill(this)) return false;
			this.getLevel().killPlayer();
			return false;
		} else if (playerCollideFunction === "semi") return false;

		return true;
	}

	draw() {
		let row = 0;
		if (this.getXVelocity() !== 0) {
			row = 1;
		}
		// if((this.respawnFrames > 0 || this.deathFrames > 0) && this.playerDied) {
		if (this.deathFrames > 0 && this.playerDied) {

		} else {
			this.sprite.draw(this.getX() - 1, this.getY() - 2, row);
		}
		// if (this.sliding) {
		// 	if (game.animFrame % 16 >= 8) {
		// 		recolorImage(this.getX()-1, this.getY()-2, hexToRgb("#ffffa224"), hexToRgb("#ffff3bda"));
		// 	}
		// }

		if (this.respawnFrames !== 0 && this.spawnSprite.getRow() !== 1 && !this.spawned) {
			this.spawnSprite.setRow(1);
		}
		if (this.respawnFrames > 0) {
			this.spawnSprite.draw(this.spawn.x - 5, this.spawn.y - 5);
			this.spawnSprite.update();
			game.setDrawEmptySquareData(this.spawn.x, this.spawn.y, (32 - this.respawnFrames) * 8, null);
			this.spawned = true;
		} else {
			game.stopDrawEmptySquare();
		}
		const vecs = [
			VectorLeft,
			VectorRight,
			VectorUp,
			VectorDown,
			Vector({x: 0.72, y: 0.72}),
			Vector({x: -0.72, y: 0.72}),
			Vector({x: 0.72, y: -0.72}),
			Vector({x: -0.72, y: -0.72})
		];
		if (this.deathFrames > 0) {
			let i = 0;
			this.deathSprites.map(spr => {
				// const v = numToVec(i);
				const v = vecs[i];
				spr.draw(
					Math.round(this.deathPos.x + Math.sqrt(64 - this.deathFrames) * 7 * v.x - 3),
					Math.round(this.deathPos.y + Math.sqrt(64 - this.deathFrames) * 7 * v.y - 3),
					PIXEL_GAME_SIZE[1]
				);
				spr.update();
				i += 1;
			});
			// if(this.deathFrames < 24) game.setDrawEmptySquareData(this.deathPos.x, this.deathPos.y, this.deathFrames*2, null);
			game.setDrawEmptySquareData(this.deathPos.x + 6, this.deathPos.y + 6, this.deathFrames * 4 + 32, null);
		}
	}

	onPlayerCollide() {
		return "";
	}

	squish(physObj) {
		this.getLevel().killPlayer();
	}

	respawnClone(level, facing) {
		return new Player(this.spawn.x, this.spawn.y, this.origW, this.origH, level);
	}

	isBonkHead() {
		const normBonk = super.isBonkHead();
		if (this.carrying) {
			if (normBonk === this.carrying) {
				return false;
			}
			return normBonk || this.carrying.isBonkHead();
		} else {
			return normBonk;
		}
	}

	jump() {
		this.setYVelocity(PLAYER_JUMP_V);
		this.coyoteTime = 0;
		audioCon.playSoundEffect(JUMP_SFX);
	}

	doubleJump() {
		this.setYVelocity(-2);
		this.canDoubleJump = false;
		audioCon.playSoundEffect(DJUMP_SFX);
		game.spawnDoubleJumpParticles(this.getX(), this.getY());
	}

	isOverlap(physObj, offset) {
		const norm = super.isOverlap(physObj, offset);
		if (this.carrying) {
			return this.carrying !== physObj && (norm || this.carrying.isOverlap(physObj, offset));
		} else {
			return norm;
		}
	}

	pickUp() {
		this.carrying = super.getLevel().getThrowable();
		this.carrying.startCarrying();

		if (this.carrying.onPlayerCollide().includes("diamond")) {
			audioCon.playSoundEffect(GEM_PICKUP_SFX, () => {
				audioCon.playSong(END_MUSIC, true);
				audioCon.queueSong(null)
			});
		} else {
			audioCon.playSoundEffect(PICKUP_SFX);
		}

		this.xJustPressed = 0;
	}

	setKeys(keys) {
		if (this.getGame().debugFlying) {
			if (keys["moveRight"]) {
				this.setXVelocity(2);
			} else if (keys["moveLeft"]) {
				this.setXVelocity(-2);
			} else {
				this.setXVelocity(0);
			}

			if (keys["ArrowUp"]) {
				this.setYVelocity(-2);
			} else if (keys["ArrowDown"]) {
				this.setYVelocity(2);
			} else {
				this.setYVelocity(0);
			}
			return;
		}

		const onGround = this.isOnGround();
		const slidePressed = keys["slide"] && this.getGame().unlocks.SLIDE;

		if (this.respawnFrames === 0 && this.deathFrames === 0) {
			if (slidePressed && onGround && !this.sliding && this.slideBumpFrames <= 0) {
				this.getGame().startScreenShake();
				audioCon.playSoundEffect(THROW_SFX);
				this.sliding = true;
				game.spawnSlideParticles(this.getX(), this.getY(), this.facing.x);
			}

			if (onGround && !onGround.onPlayerCollide().includes("button")) this.getGame().resetFellHeight();

			if (keys["KeyR"]) {
				this.getLevel().killPlayer();
			}
			if (this.sliding) {
				this.setXVelocity(this.facing.x * 1.8);
				if (onGround && this.sprite.getRow() === 0) this.sprite.setRow(1);
			} else if (this.slideBumpFrames > 0) {
				this.setXVelocity(this.slideBumpFacing.x * -1);
			} else {
				if (keys["moveRight"]) {
					if (this.sprite.getRow() === 0 && onGround) this.sprite.setRow(1);
					this.setXVelocity(1);
				} else if (keys["moveLeft"]) {
					if (this.sprite.getRow() === 0 && onGround) this.sprite.setRow(1);
					this.setXVelocity(-1);
				} else {
					this.setXVelocity(0);
					if (onGround) this.sprite.setRow(0);
				}
			}
			if (!onGround && this.sprite.getRow() !== 2) {
				this.sprite.setRow(2);
			}

			const zPressed = this.getGame().unlocks.JUMP && keys["jump"] && !keys["PrevJump"];
			const xPressed = keys["KeyQ"] && !this.prevXKey;
			//If z is pressed, jjp = 8, otherwise decr jjp if jjp > 0
			if (zPressed) {
				this.jumpJustPressed = 133.3;
			} else if (this.jumpJustPressed > 0) {
				this.jumpJustPressed -= timeDelta;
			}

			if (onGround && onGround.onPlayerCollide() === "wall" && !this.wasOnGround) {
				this.getLevel().pushDustSprite(new GroundDustSprite(this.getX(), this.getY() - 2, -this.facing.x, this.level))
			}

			if (!onGround) {
				if (this.coyoteTime > 0 && zPressed) {
					this.jump();
				} else if (zPressed && this.canDoubleJump && this.getGame().unlocks.DJ) {
					this.doubleJump();
				} else {
					this.fall();
					const t = this.getLevel().getThrowable();
					if (t == null) {

					} else if (t !== this.carrying && t.getYVelocity() > 0 && t.getYVelocity() > 0 && this.getHitbox().cloneOffset(Vector({
						x: 0,
						y: 3
					})).isOverlap(t.getHitbox())) {
						// this.moveY(3, this.onCollide);
						t.getCarrying = () => {
							return this
						};
					} else {
						t.getCarrying = () => {
							return null;
						}
					}
				}
			} else {
				this.coyoteTime = 133.3;
				this.canDoubleJump = true;
				if (this.jumpJustPressed > 0) {
					//Jump if jjp and on ground now
					this.jump();
				} else {
					//Set yv to 0 if on ground and not jumping
					// this.setYVelocity(onGround.getYVelocity()*0*0.9);
					const gyv = onGround.getYVelocity();
					if (gyv < 0) {
						this.moveY(Math.min(gyv, this.getYVelocity()), this.onCollide);
						this.setYVelocity(0);
					}
				}
			}

			if (this.coyoteTime > 0) {
				this.coyoteTime -= timeDelta;
			}

			if (this.slideBumpFrames > 0) {
				this.slideBumpFrames--;
				// this.setXVelocity(this.slideBumpFacing * -1 - this.slideBumpFrames/8);
			}

			this.prevXKey = keys["KeyQ"];
		}
		this.wasOnGround = onGround;

		if (this.sliding &&  game.animFrame % 3 == 1 && this.deathFrames <= 0) {
			game.spawnSlideDust(this.getX(), this.getY()+6, this.facing.x);
		}

		this.getGame().lastCoyoteTime = this.coyoteTime;
	}

	updatePhysicsPos() {
		if (this.respawnFrames > 0) {
			this.respawnFrames -= 1;
		} else if (this.deathFrames > 0) {
			this.deathFrames -= 1;
			if (this.deathFrames === 0) {
				this.getLevel().resetStage();
			}
		} else {
			super.updatePhysicsPos();

			if (this.slideBumpFrames === 0) {
				if (this.velocity.x > 0) {
					this.facing = VectorRight;
					this.getSprite().flip = true;
				}
				if (this.velocity.x < 0) {
					this.facing = VectorLeft;
					this.getSprite().flip = false;
				}
				this.getGame().lastFacing = this.facing;

			}

			this.getGame().lastSliding = this.sliding;
			this.getGame().lastCanDoubleJump = this.canDoubleJump;
			this.getGame().lastYVelocity = this.getYVelocity();
		}
	}

	getCarrying() {
		return this.carrying;
	}

	slideBump(facing) {
		this.slideBumpFacing = facing;
		this.slideBumpFrames = 8;
		this.setYVelocity(-2);
		this.sliding = false;
		this.facing = facing.scalar(-1);
		this.getSprite().flip = facing.x < 0;

		this.getLevel().pushDustSprite(new GroundDustSprite(this.getX(), this.getY() - 3, 0, this.level, this.facing.scalar(-1)))
	}
}

class SwitchBlock extends Solid {
	constructor(x, y, w, h, collidable, level, direction) {
		super(x, y, w, h, collidable, level, direction);
		super.setSprite(new AnimatedSprite(BLOCK, VectorUp, [{frames: 0, onComplete: null}, {
			frames: 13,
			onComplete: "stop",
		}]));
	}

	/*draw() {
		if (this.collidable) super.draw("#eeaaaa");
		else super.draw("#50505080");
	}*/

	deactivate() {
		this.collidable = false;
		this.sprite.setRow(1);
	}
}

class Collectible extends Solid {
	constructor(x, y) {
		super(x, y, TILE_SIZE, TILE_SIZE);
		this.timingOffset = Math.random()*30;
	}

	onPlayerCollide() {
		return "collectible";
	}

	draw() {
		const offset = Math.sin(Math.PI * game.animFrame / 30 + this.timingOffset) * 0.6;
		drawEllipse(this.getX()+4, this.getY() - 4 + offset, 4, "rgb(194, 206, 31)","rgb(194, 206, 31)");
	}
}

class Button extends Solid {
	constructor(x, y, w, h, level, onPush) {
		super(x, y, w, h, true, level);
		this.onPush = onPush;
		this.pushed = false;
		super.setSprite(new AnimatedSprite(BUTTON, VectorUp, [{frames: 0, onComplete: null}, {
			frames: 4,
			onComplete: "stop",
		}]));
		this.timingOffset = Math.random()*30;
	}

	onPlayerCollide() {
		return "button";
	}

	push() {
		if (!this.pushed) {
			super.collidable = false;
			this.pushed = true;
			this.onPush();
			this.collidable = false;
			this.getSprite().setRow(1);
		}
	}

	deactivate() {
		this.pushed = true;
		this.collidable = false;
		this.sprite.curCol = this.sprite.animationData[1].frames;
	}

	draw() {
		const offset = Math.sin(Math.PI * game.animFrame / 30 + this.timingOffset) * 0.6;
		super.getSprite().draw(Math.floor(this.getX() / TILE_SIZE) * TILE_SIZE, this.getY() - TILE_SIZE + this.getHeight());
		if (!this.pushed) {
			drawEllipse(this.getX() + 4, this.getY() + 1, 8 + offset, "rgba(0,228,54,0.4)","rgba(0,228,54,0.0)");
		}
	}
}

class DiamondPowerup extends Button {
	constructor(x, y, level, onPush, sprite) {
		super(x, y, 14, 14, level, onPush);
		this.setSprite(new AnimatedSprite(sprite, null, [{frames: 0}, {frames: 4, onComplete: "loop", nth: 15}], 12, 13));
		this.getSprite().setRow(1);

		this.isDiamond = true;
	}

	draw() {
		if (this.pushed) this.drawLines();
		if (this.getLevel().endGameFrames > 0) {
			const pos = game.getPlayer().getPos();
			pos.incrPoint(Vector({x:-3,y: -13}));
			this.setX(pos.x);
			this.setY(pos.y);
		}
		this.getSprite().draw(this.getX(), this.getY());
		const radOff = 0.5 * Math.sin(game.animFrame / 30 * Math.PI);
		drawEllipse(this.getX()+6, this.getY()+5 + Math.floor(this.getSprite().curCol / 2), 12+radOff/2, "rgba(255,0,77,0.3)", "rgba(255,0,77,0)");
	}

	drawLines() {
		const yOff = 5;
		const xOff = 5;

		const numLines = 16;
		const radOff = 0.5 * Math.sin(game.animFrame / 30 * Math.PI);
		for (let i = 0; i < numLines; ++i) {
			let angle = 2 * Math.PI * (i + game.animFrame / 30) / numLines;
			CTX.fillStyle = "#7e2553a0";
			this.drawLineAround(this.getX() + xOff, this.getY() + yOff, angle, 20, 28 + radOff);
			if (i % 2 === 0) {
				CTX.fillStyle = "#ff004de0";
				this.drawLineAround(this.getX() + xOff, this.getY() + yOff, -angle, 8, 16);
			}
		}
		drawEllipse(this.getX() + xOff, this.getY() + yOff, 36 + radOff * 2, "rgba(126, 27, 83, 0.2)", "rgba(126, 27, 83, 0)");
		drawEllipse(this.getX() + xOff, this.getY() + yOff, 24 + radOff * 2, "rgba(126, 27, 83, 0.3)", "rgba(126, 27, 83, 0)");
	}

	drawLineAround(x, y, angle, rad1, rad2) {
		let xCos = Math.cos(angle);
		let ySin = Math.sin(angle);
		let x0 = Math.round(x + xCos * rad1);
		let y0 = Math.round(y + ySin * rad1);
		let x1 = Math.round(x + xCos * rad2);
		let y1 = Math.round(y + ySin * rad2);
		drawLine(x0, y0, x1, y1);
	}
}

class Powerup extends Button {
	constructor(x, y, level, onPush, sprite) {
		super(x, y, 14, 14, level, onPush);
		this.setSprite(new AnimatedSprite(sprite, null, [{frames: 0}, {frames: 4, onComplete: "loop", nth: 15}], 12, 13));
		this.getSprite().setRow(1);
	}

	draw() {
		if (this.pushed) return;
		this.getSprite().draw(this.getX(), this.getY());
		// drawOnCanvas(new Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight()), "#ffa0a0");
	}

	
}

class BigButton extends Button {
	curHeightFall = 0;
	hitboxHeights = [12, 10, 8, 6];

	constructor(x, y, w, h, level, onPush) {
		super(x, y, w, h, level, onPush);
		this.startPos = Vector({x: x, y: y});

		super.setSprite(new AnimatedSprite(BIG_BUTTON, VectorUp, [
			{frames: 0, onComplete: null},
			{frames: 0, onComplete: null},
			{frames: 0, onComplete: null},
			{frames: 0, onComplete: null},
		], 32, 16));
	}

	draw() {
		// drawOnCanvas(new Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight()))
		const offset = Math.sin(Math.PI * game.animFrame / 30 + this.timingOffset) * 0.6;
		const e = 2;
		super.getSprite().draw(Math.floor(this.getX() / TILE_SIZE) * TILE_SIZE, this.getY() - TILE_SIZE*2 + this.getHeight());
		if (!this.pushed) {
			// drawRoundedRect(this.getX()-e-offset/2, this.getY()-e-offset/2, this.getWidth()+e*2+offset, this.getHeight()+e*2+offset, 4, "rgba(255, 236, 39, 0.5)", "rgba(255, 236, 39, 0.0)")
			// drawEllipse(this.getX() + 16, this.getY() + 8, 16 + offset, "rgba(255, 236, 39, 0.5)");
		}
	}

	push() {
		const heightFall = this.getGame().fellFromHeight;
		if (heightFall >= this.curHeightFall) {
			//super.push();
			this.curHeightFall = heightFall + 1;
			this.onPush(this.curHeightFall);
			this.setHeight(this.baseHeight());
			this.sprite.curCol = heightFall+1;
		}
	}

	updatePhysicsPos() {
		super.updatePhysicsPos();
		/*if (this.isUnder(this.getLevel().getPlayer())) {
            this.setHeight(this.baseHeight()-1);
        } else {
            this.setHeight(this.baseHeight());
        }*/
	}

	baseHeight() {
		return this.hitboxHeights[this.curHeightFall]
	}

	setHeight(h) {
		super.setHeight(h);
		this.setY(this.startPos.y + this.hitboxHeights[0] - this.getHeight());
	}

	onPlayerCollide() {
		return "wall button"
	}
}

let keys = {
	"ArrowRight": 0,
	"ArrowLeft": 0,
	"ArrowDown": 0,
	"ArrowUp": 0,
	"KeyZ": 0,
	"PrevJump": 0,
	"KeyX": 0,
	"KeyQ": 0,

	//Debug keys
	"KeyO": 0, //fly
	"KeyH": 0, //jump
	"KeyJ": 0,
	"KeyK": 0,
	"KeyL": 0,
	"KeyI": 0,


	// "KeyP" : 0,
	"KeyC": 0,
	"KeyR": 0,
	"Enter": 0,

	"KeyW": 0,
	"KeyA": 0,
	"KeyS": 0,
	"KeyD": 0,
	"KeyN": 0,
	"KeyM": 0,
};

let diagnosticFrameCount = 0;
let diagnosticTime = 0;

let frameRate = 16.666;
let a = 0;

function diagnostics() {
	if (!paused) {
		diagnosticFrameCount++;
		diagnosticTime += timeDelta;
		if (diagnosticFrameCount === 100) {
			frameRate = diagnosticTime / diagnosticFrameCount;
			//console.log(frameRate);
			diagnosticTime = 0;
			diagnosticFrameCount = 0;
		}
	}
	a = 0;
}


function setMaxSize() {
	const screenHeight = document.body.scrollHeight;
	const size = Math.floor(screenHeight / 128) * 128;
	canvas.style.width = size + "px";
	canvas.style.height = size + "px";
	canvas.style.backgroundSize = size + "px";
}

const toggleFullscreen = (event) => {
	const fullScreen = document.fullscreenElement;
	if (fullScreen) {
		document.exitFullscreen();
	} else {
		document.documentElement.requestFullscreen();
	}
};

function g() {
	clearCanvas();
	game.updateLevelPhysicsPos();
	game.setKeys(keys);
	game.drawCurrentLevel();
	diagnostics();
	setMaxSize();
}
;(function () {
	setup();
})();

function setup() {
	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyUpHandler, false);
	setMaxSize();
	getLevelData().then(levelData => {
		game = new Game(levelData);
		main();
	});
}

function main() {
	canvas.style.backgroundImage = 'url("images/Background.png")';
	var stopMain = window.requestAnimationFrame(main);
	g();
}

function keyDownHandler(event) {
	if (event.code in keys) {
		keys[event.code] = 1;
	}
}

function keyUpHandler(event) {
	if (event.code in keys) {
		keys[event.code] = 0;
	}
}

canvas.ondblclick = () => {
	toggleFullscreen();
};