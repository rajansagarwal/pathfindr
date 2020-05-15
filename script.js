// Function to delete element from the array
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }

  function distance(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    return d;
  }

  var cols = 40;
  var rows = cols;
  
  var grid = new Array(cols);
  
  var openSet = [];
  var closedSet = [];
  
  var start;
  var end;

  let divs = document.getElementsByClassName("add_to_me");

  var w, h;
  var path = [];

  
  
  function setup() {
    createCanvas(450, 450);
    console.log('A*');
    w = width / cols;
    h = height / rows; 
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }
  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }
    function Spot(i, j) {

        this.i = i; 
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
      
        this.neighbors = [];
      
        this.previous = undefined;
      
        // wall
        this.wall = false;
        if (random(1) < 0.32) {
          this.wall = true;
        }
        /*var ran = (int)(Math.random() * 230);
        console.log(ran);*/


        var colors = [0, 120, 220];
        var color = colors[Math.floor(Math.random()*colors.length)];
        // Display
        this.show = function(col) {
          if (this.wall) {
            fill(color);
            noStroke();
            ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
          } else if (col) {
            fill(col);
            rect(this.i * w, this.j * h, w, h);
          }
        }
      
        // neighbours
        this.addNeighbors = function(grid) {
          var i = this.i;
          var j = this.j;
          if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
          }
          if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
          }
          if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
          }
          if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
          }
          if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
          }
          if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
          }
          if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
          }
          if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
          }
        }
      }
      //end secondary
    // Start and end
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;
  
    // openSet starts with beginning only
    openSet.push(start);
  }
  
  function draw() {
  
    // Search status
    if (openSet.length > 0) {
  
      // Best next option
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];
  
      var ran = Math.floor(Math.random() * 18) + 8;
      // Finish Status
      if (current === end) {
        noLoop();
        console.log("DONE!");
        alert("This is your optimal path. The time it takes to reach this location is approximately " + ran + " minutes! Have a fun walk, and remember to stay safe!");
      }

      // Best option moves from openSet to closedSet
      removeFromArray(openSet, current);
      closedSet.push(current);
  
      // Check all surroundings
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
  
        // check for boundaries
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + distance(neighbor, current);
  
          // check for correct way
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }
  
          // correct way
          if (newPath) {
            neighbor.h = distance(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
  
      }
      // no solution
    } else {
      console.log('no solution');
      noLoop();
      alert('There is no route to get to your desired location without crossing or coming in to direct contact with another person. Try refreshing your location or entering a new path!')
      return;
    }
    // Draw current state of everything
    background(242,242,248);
  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].show();
      }
    }
  
    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(10, 237, 231, 100));
    }
  
    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(216, 192, 192, 50));
    }
  
  
    // Find the path
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  
  
    // for (var i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255));
    //}
    var img = document. createElement("img");
    img. src = "path.png";
    var src = document. getElementById("x");
    // Drawing path as continuous line
    noFill();
    stroke(69,179,224);
    strokeWeight(w/1.5);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w / 4, path[i].j * h + h / 2);
    }
    endShape();
  }
