var root = {
    characters: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレワヰヱヲンヺ・ーヽヿ0123456789゠",
    fontColor: {
        r: 0,
        g: 255,
        b: 70
    },
    rainbow: false,
    rainbowSpeed: 50,
    backgroundColor: {
        r: 0,
        g: 0,
        b: 0
    },
    rainSpeed: 75,
    trailLength: 80
};

function livelyPropertyListener(name, val) {
    switch (name) {
        case "characters":
            if (val == "") {
                root.characters = " ";
                break;
            }
            val = val.replace(/(\r\n|\n|\r|\s)/gm, "");
            root.characters = val;
            break;
        case "fontColor":
            root.fontColor = hexToRgb(val);
            break;
        case "rainbow":
            root.rainbow = val;
            break;
        case "rainbowSpeed":
            root.rainbowSpeed = val / 100;
            break;
        case "backgroundColor":
            root.backgroundColor = hexToRgb(val);
            break;
        case "rainSpeed":
            clearInterval(main_loop);
            max_interval = 200;
            root.rainSpeed = ((100 - val) / 100) * max_interval;
            main_loop = setInterval(draw, root.rainSpeed);
            break;
        case "trailLength":
            max_length = 0.5;
            min_length = 0.05;
            root.trailLength = (val / 100) * (min_length - max_length) + max_length;
            break;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function createRGBAstring(hex_red, hex_green, hex_blue, alpha) {
    if (typeof alpha === "undefined") {
        rgbaString = "rgba(" + hex_red + "," + hex_green + "," + hex_blue + ")";
    } else {
        rgbaString = "rgba(" + hex_red + "," + hex_green + "," + hex_blue + "," + alpha + ")";
    }
    return rgbaString;
}

function draw() {
    // Converting the string into an array of characters
    var characters = root.characters.split("");

    // The trail length effect is from the translucent background
    ctx.fillStyle = createRGBAstring(root.backgroundColor.r, root.backgroundColor.g, root.backgroundColor.b, root.trailLength)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Looping over drops
    for (var y = 0; y < drops.length; y++) {
        ctx.fillStyle = createRGBAstring(root.backgroundColor.r, root.backgroundColor.g, root.backgroundColor.b, root.trailLength)
        ctx.fillRect(y * font_size, drops[y] * font_size, font_size, font_size);

        if (root.rainbow) {
            hue += 0.01;
            var hex_red = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 0) + 128);
            var hex_green = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 2) + 128);
            var hex_blue = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 4) + 128);
        } else {
            var hex_red = root.fontColor.r
            var hex_green = root.fontColor.g
            var hex_blue = root.fontColor.b
        }

        var random_character = characters[Math.floor(Math.random() * characters.length)];

        ctx.fillStyle = createRGBAstring(hex_red, hex_green, hex_blue)
        ctx.fillText(random_character, y * font_size, drops[y] * font_size);

        // Incrementing Y coordinate
        drops[y]++;
        // Sending the drop back to the top randomly after it has crossed the screen
        // Adding randomness to the reset to make the drops scattered on the Y axis
        if (drops[y] * font_size > canvas.height && Math.random() > 0.975)
            drops[y] = 0;
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Making the canvas full screen
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var characters = root.characters.split("");
var font_size = 14;
ctx.font = font_size + "px arial";

// Initialize the hue value
var hue = 0.01;

// Number of columns for the rain
var columns = canvas.width / font_size;

// An array of drops: one per column
var drops = [];
for (var x_coordinate = 0; x_coordinate < columns; x_coordinate++)
    // 1 = y-coordinate of the drop (same for every drop initially)
    drops[x_coordinate] = 1;

window.onresize = () => {
    location.reload();
}

var main_loop = setInterval(draw, root.rainSpeed);
