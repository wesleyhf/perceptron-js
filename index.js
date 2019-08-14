class Maff {
    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
}

class Perceptron {
    weights = [
        null,
        null,
    ];

    learningRate = 0.00001;

    constructor () {
        this.weights = this.weights.map(weight => Maff.random(-1, 1));
    }

    guess (inputs = []) {
        // sigma (sum)
        const sum = inputs.reduce((acc, input, key) => {
            return acc + (input * this.weights[key]);
        }, 0);

        // step function
        return Math.sign(sum);
    }

    train (inputs = [], target = 0) {
        const error = target - this.guess(inputs);

        for (let index = 0; index < this.weights.length; index++) {
            this.weights[index] = this.fitWeight(
                this.weights[index],
                inputs[index],
                error
            );
        }
    }

    // gradient descent
    fitWeight (weight, input, error) {
        return weight + (error * input * this.learningRate);
    }
}

const points = [];
const perceptron = new Perceptron();

function setup () {
    const width = 500;
    const height = 500;

    createCanvas(width, height);
    background('#ccc');

    line(0, 0, width, height);

    // generating dataset
    for (let index = 0; index < 100; index++) {
        const x = Maff.random(0, width);
        const y = Maff.random(0, height);

        const point = {
            x,
            y,
            label: x > y ? 1 : -1,
            color: x > y ? 'white' : 'black',
        };

        points.push(point);
    }

    // printing dataset
    for (const point of points) {
        fill(point.color);
        noStroke();
        circle(point.x, point.y, 10);
    }

    frameRate(1);
}

function draw () {
    // const output = perceptron.guess([-1, 0.5]);
    // console.log(output);

    for (const point of points) {
        let inputs = [point.x, point.y];

        perceptron.train(inputs, point.label);

        const guess = perceptron.guess(inputs);

        const color = guess === point.label ? 'lime' : 'red';
        fill(color);
        noStroke();
        circle(point.x, point.y, 5);

        // fill(point.color);
        // circle(point.x, point.y, 10);
    }
}