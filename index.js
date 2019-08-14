class Maff {
    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
}

class Perceptron {
    weights = [];

    learningRate = 0.01;

    constructor (size) {
        for (let index = 0; index < size; index++) {
            this.weights.push(Maff.random(-1, 1));
        }
    }

    guess (inputs = []) {
        return inputs
            .map((input, key) => {
                return input * this.weights[key];
            })
            .map(input => Math.sign(input) > 0 ? 1 : 0);
    }

    train (inputs = [], targets = []) {
        const guess = this.guess(inputs);

        const errors = targets.map((target, index) => {
            return target - guess[index]
        });

        this.weights = this.weights.map((weight, index) => {
            return weight + (errors[index] * inputs[index] * this.learningRate);
        });
    }
}

let perceptron = null;
let originalImage = [];
let noisedImage = [];

function setup () {
    const width = 500;
    const height = 500;

    loadImage('original.png', img => {
        image(img, 0, 0);

        img.loadPixels();

        for (let index = 0; index < img.pixels.length; index+=4) {
            const isWhite = img.pixels[index] > 0 ? 1 : 0;
            originalImage.push(isWhite);
        }
    });

    loadImage('noised.png', img => {
        image(img, 28, 0);

        img.loadPixels();

        for (let index = 0; index < img.pixels.length; index+=4) {
            const isWhite = img.pixels[index] > 0 ? 1 : 0;
            noisedImage.push(isWhite);
        }

        perceptron = new Perceptron(noisedImage.length);
    });

    // frameRate(5);
}

function draw () {
    if (! perceptron) {
        return;
    }

    perceptron.train(noisedImage, originalImage);

    const guess = perceptron.guess(noisedImage);

    const guessImage = createImage(28, 28);

    guessImage.loadPixels();

    for (let x = 0; x < guessImage.width; x++) {
        for (let y = 0; y < guessImage.height; y++) {
            const index = y * guessImage.width + x;
            const fillColor = guess[index] ? 'white' : 'black';

            guessImage.set(x, y, color(fillColor));
        }
    }

    guessImage.updatePixels();

    image(guessImage, 56, 0);
}