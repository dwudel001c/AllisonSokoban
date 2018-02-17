import React, { Component } from 'react';

import './App.css';

class BoardTemp extends Component {
    render() {
        return (
            <div className="BoardTemp">
                <canvas id="myCanvas" width="600" height="400" style="border:1px solid #d3d3d3;">
                    Your browser does not support the HTML5 canvas tag.</canvas>

                var c = document.getElementById("myCanvas");
                var ctx = c.getContext("2d");

                // Red rectangle
                ctx.beginPath();
                ctx.lineWidth = "2";
                ctx.strokeStyle = "red";
                ctx.rect(0, 0, 100, 100);
                ctx.stroke();

                // Green rectangle
                ctx.beginPath();
                ctx.lineWidth = "4";
                ctx.strokeStyle = "green";
                ctx.rect(100, 0, 100, 100);
                ctx.stroke();
            </div>
        );
    }
}

export default BoardTemp;