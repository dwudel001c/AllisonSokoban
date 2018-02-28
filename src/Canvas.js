import React, {Component} from 'react';
import logo from './logo.svg';
import layout from './Layout.js';

class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            storedCount: 0,
            playerMessage: "Click on board to set Focus",
            height: 50,
            width: 50,
            layoutArray: {}
        };


        this.handleKey = this.handleKey.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateBoardPiece = this.updateBoardPiece.bind(this);
        this.moveCrate = this.moveCrate.bind(this);
        this.moveWorker = this.moveWorker.bind(this);
        this.restorePreviousPosition = this.restorePreviousPosition.bind(this);
        this.makeItRed = this.makeItRed.bind(this);
        this.draw = this.draw.bind(this);
    }

    // This moves the crate and worker as long as there is no brick wall or crates in the way
    moveCrate(theWorker, theCrate, x3, y3) {
        var result = -1;
        console.log("Moving Crate to " + x3 + " " + y3);
        var wx = theCrate.rectangle.x;
        var wy = theCrate.rectangle.y;
        // check adjacent -
        if (this.state.layoutArray[x3][y3].name !== "Brick Wall" && this.state.layoutArray[x3][y3].name !== "Crate") {


            this.restorePreviousPosition(theCrate);
            if (this.state.layoutArray[x3][y3].name === "Storage") {
                theCrate.stored = true;
                var currentCount = this.state.storedCount + 1;
                this.setState((state) => ({storedCount: this.state.storedCount + 1}));
                if (currentCount === 6) {
                    this.setState((state) => ({playerMessage: "You Have Done It!!! You WON!"}));

                }
            }
            else {
                if (this.state.layoutArray[wx][wy].name === "Storage") {
                    this.setState((state) => ({storedCount: this.state.storedCount - 1}));
                }
                theCrate.stored = false;
            }


            theCrate.rectangle.x = x3;
            theCrate.rectangle.y = y3;
            this.state.layoutArray[x3][y3] = theCrate;

            this.draw(theCrate);
            this.moveWorker(theWorker, wx, wy);
            result = 0;
        } else {
            console.log("Crate hit the " + this.state.layoutArray[x3][y3].name + ". Can't move it");
        }


        return result;
    }

    // this moves the worker and refreshes the space behind the worker
    moveWorker(theWorker, x2, y2) {
        var result = -1;
        // check adjacent -
        if (this.state.layoutArray[x2][y2].name !== "Brick Wall") {

            this.restorePreviousPosition(theWorker);


            if (this.state.layoutArray[x2][y2].name === "Storage") {
                theWorker.stored = true;
            }
            else {
                theWorker.stored = false;
            }

            this.state.layoutArray[x2][y2] = theWorker;

            theWorker.rectangle.x = x2;
            theWorker.rectangle.y = y2;

            this.draw(theWorker);
            result = 0;
        }


        return result;
    }

    // draw the worker, crate or storage bin in it new place
    draw(piece) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        var h = this.state.height;
        var w = this.state.width;

        console.log("Drawing " + piece.name + " " + piece.rectangle.x + " " + piece.rectangle.y + " stored=" + piece.stored);
        ctx.beginPath();
        ctx.fillStyle = piece.fillStyle;
        ctx.fillRect((piece.rectangle.x * w) + 5, (piece.rectangle.y * h) + 5, h - 10, w - 10);
        if (piece.stored === true) {
            var cx = (piece.rectangle.x * w) + w / 2;
            var cy = (piece.rectangle.y * h) + h / 2;
            ctx.arc(cx, cy, w / 4, 0, 2 * Math.PI);
        }
        ctx.stroke();
        ctx.closePath();

        // update the layoutArray
        this.state.layoutArray[piece.rectangle.x][piece.rectangle.y] = piece;


    }

    makeItRed(piece, x, y) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        var h = this.state.height;
        var w = this.state.width;

        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "white";
        ctx.rect(x * w, y * h, h, w);

        ctx.fillStyle = "red";
        ctx.fillRect((x * w) + 5, (y * h) + 5, h - 10, w - 10);
        ctx.stroke();
        ctx.closePath();


    }

    // redraw the previous position
    restorePreviousPosition(piece) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        var h = this.state.height;
        var w = this.state.width;

        var blankSpace = Object.assign({}, layout[1]); // clone the blank space object
        blankSpace.rectangle.x = piece.rectangle.x;
        blankSpace.rectangle.y = piece.rectangle.y;
        this.state.layoutArray[piece.rectangle.x][piece.rectangle.y] = blankSpace;
        // if the worker was on a storage location
        if (piece.stored === true) {
            // restore storage indicator at this position.
            blankSpace.name = "Storage";
            blankSpace.fillStyle = "tan";
            piece.stored = false;
        }
        this.draw(blankSpace);

    }

    // Take the current x,y and the position to move to x2, y2 and the look ahead to x3, y3
    updateBoardPiece(x, y, x2, y2, x3, y3) {

        var result = 0;

        var piece = this.state.layoutArray[x2][y2];

        if (x2 > 0 && y2 > 0) {
            //var piece = this.state.layoutArray[x2][y2];
            if (piece != null) {
                console.log(piece.name + " " + piece.rectangle.x);
            }
            else {
                console.log("the item is null");
            }
        } else {
            console.log("x2 out of range ...");
        }


        if (x2 < 0 || y2 < 0) {
            result = -1;
        }
        else if (this.state.layoutArray[x2][y2].name === "Crate") {
            // Move the crate
            var crate = this.state.layoutArray[x2][y2];

            if (crate.rectangle.x !== x2 || crate.rectangle.y !== y2) {
                console.log(" ERROR - the contents are out of sync ");
            }
            var worker = this.state.layoutArray[x][y];
            result = this.moveCrate(worker, crate, x3, y3); // from and to

        }

        else if (this.state.layoutArray[x2][y2].name === "Brick Wall") {

            this.makeItRed(piece, x, y);
        }
        else {
            // remove piece from current position

            this.moveWorker(layout[0], x2, y2); // move 'mover' to here


        }


        return result;
    }

    handleClick = e => {
        console.log(e);
    }

    handleKey = e => {

        var x = layout[0].rectangle.x;
        var y = layout[0].rectangle.y;
        console.log(e.keyCode);
        console.log()
        const LEFT = 76;
        const RIGHT = 82;
        const UP = 85;
        const DOWN = 68;


        if (e.keyCode === RIGHT) {
            this.updateBoardPiece(x, y, x + 1, y, x + 2, y);

        }
        if (e.keyCode === UP) {

            this.updateBoardPiece(x, y, x, y - 1, x, y - 2);

        }
        if (e.keyCode === DOWN) {

            this.updateBoardPiece(x, y, x, y + 1, x, y + 2);

        }
        if (e.keyCode === LEFT) {

            var result = this.updateBoardPiece(x, y, x - 1, y, x - 2, y);
            console.log("Left move The result is " + result);

        }

    }

    anotherExamplecomponentDidMount() {
        const context = this.canvasA.getContext('2d');

        const image = new Image();
        image.src = "whereever-you-image-url-live.jpg";
        image.onload = () => {
            context.drawImage(image, 0, 0, this.canvasA.width, this.canvasA.height);
        };
    }

// render the board
// initialize the lookupArray to check for adjacent items during navigation
    componentDidMount() {

        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        const img = this.refs.image
        img.onload = () => {

            var h = this.state.height;
            var w = this.state.width;


            var lookupArray = {};
            for (var i = 0; i < 8; i++) {
                lookupArray[i] = new Array();
                for (var j = 0; j < 8; j++) {
                    lookupArray[i][j] = layout[1]; // this is a bug - need a layout for white spaces?
                }
            }


            ctx.beginPath();
            for (var index = 0; index < layout.length; index++) {

                var x = layout[index].rectangle.x;
                var y = layout[index].rectangle.y;

                lookupArray[layout[index].rectangle.x][layout[index].rectangle.y] = layout[index];
                ctx.beginPath();


                ctx.fillStyle = layout[index].fillStyle;
                if (layout[index].name === "Brick Wall") {
                    ctx.fillStyle = "Gray";
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = layout[index].strokeStyle;
                    ctx.rect(x * w, y * h, h, w);
                    ctx.fillRect((x * w) + 1, (y * h) + 1, h - 2, w - 2);
                }
                else {

                    ctx.fillRect((x * w) + 5, (y * h) + 5, h - 10, w - 10);
                }
                ctx.stroke();
                ctx.closePath();
            }

            this.setState(function () {
                var newState = {
                    layoutArray: lookupArray,
                };
                return newState;
            })
        }

        // Red rectangle
        canvas.addEventListener('keydown', this.handleKey);
        canvas.addEventListener('click', this.handleClick, false);
        canvas.focus();

    }

    componentWillUnmount() {
        this.canvas.removeEventListener('keydown', this.handleKey);

        this.canvas.removeEventListener('click', this.handleClick, false);

    }


    render() {
        return (
            <div tabIndex="0" onKeyDown={this.handleKey}>
                Select Canvas to enable key press. Use the "U" "D" "R" and "L" keys to move the warehouse operator
                (blue)
                <br/>
                There are {this.state.storedCount} in storage. Move the green crates into the Tan storage
                compartments. {this.state.playerMessage}
                <canvas ref="canvas" width={800} height={900}/>
                <img ref="image" src={logo} width="10" height="10"/>
                <p> Player Name: &nbsp;
                    {layout[0].name}
                    <br/>
                    Read This: https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
                    <br/>
                    https://www.kirupa.com/canvas/moving_shapes_canvas_keyboard.htm
                </p>


            </div>
        )
    }
}

export default Canvas