var generator;

$(document).ready(function() {
    generator = new MazeGenerator();
    generator.init(100, 100);
    generator.cellSize = 7;
    $("#screen-container").html(`<canvas id="screen" width="${generator.cellSize * generator.width}" height="${generator.cellSize * generator.height}" />`);
    generateNewMaze();
});

/* Generate new maze */
function generateNewMaze() {
    generator.rndSeed = Date.now();
    generator.generate();
    drawMaze();
}

/* Draw maze on canvas */
function drawMaze() {
    const canvas = $("#screen")[0];
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, generator.cellSize * generator.width, generator.cellSize * generator.height);

    ctx.strokeStyle = "white";
    ctx.beginPath();

    for(let y=0;y<generator.height;y++) {
        for(let x=0;x<generator.width;x++) {
            let cell = generator.getCell(x, y);
            if(cell) {
                if(cell.walls[0]) {
                    ctx.moveTo(x * generator.cellSize, y * generator.cellSize);
                    ctx.lineTo((x + 1) * generator.cellSize, y * generator.cellSize);
                }
                if(cell.walls[1]) {
                    ctx.moveTo((x + 1) * generator.cellSize, y * generator.cellSize);
                    ctx.lineTo((x + 1) * generator.cellSize, (y + 1) * generator.cellSize);
                }
                if(cell.walls[2]) {
                    ctx.moveTo((x + 1) * generator.cellSize, (y + 1) * generator.cellSize);
                    ctx.lineTo(x * generator.cellSize, (y + 1) * generator.cellSize);
                }
                if(cell.walls[3]) {
                    ctx.moveTo(x * generator.cellSize, (y + 1) * generator.cellSize);
                    ctx.lineTo(x * generator.cellSize, y * generator.cellSize);
                }
            }
        }
    }

    ctx.stroke();
}