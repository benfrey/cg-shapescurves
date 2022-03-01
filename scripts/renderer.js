class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }

    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        // Draw rectangle
        let pt0 = {x: 100, y: 100};
        let pt1 = {x: 500, y: 300};
        let myColor = [255, 0, 0, 255]; // red
        this.drawRectangle(pt0, pt1, myColor, ctx);
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
       // Draw rectangle
       let center = {x: 300, y: 200};
       let radius = 40;
       let myColor = [255, 0, 0, 255]; // red
       this.drawCircle(center, radius, myColor, ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {
        // Draw bezier curve
        let pt0 = {x: 100, y: 100};
        let pt1 = {x: 150, y: 300};
        let pt2 = {x: 550, y: 250};
        let pt3 = {x: 500, y: 150};
        let myColor = [255, 0, 0, 255]; // red
        this.drawBezierCurve(pt0, pt1, pt2, pt3, myColor, ctx);
    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        // B: line and two curves
        // E: four lines
        // N: three lines
        // !: line and circle

        let myColor = [255, 0, 0, 255]; // red

        // B
        this.drawLine({x: 100, y:100}, {x:100, y:400}, myColor, ctx);
        this.drawBezierCurve({x: 100, y: 400}, {x: 300, y: 350}, {x: 300, y: 300}, {x:100, y: 250}, myColor, ctx);
        this.drawBezierCurve({x: 100, y: 250}, {x: 300, y: 200}, {x: 300, y: 150}, {x:100, y: 100}, myColor, ctx);

        // E
        this.drawLine({x: 300, y:100}, {x:300, y:400}, myColor, ctx);
        this.drawLine({x: 300, y:100}, {x:400, y:100}, myColor, ctx);
        this.drawLine({x: 300, y:250}, {x:400, y:250}, myColor, ctx);
        this.drawLine({x: 300, y:400}, {x:400, y:400}, myColor, ctx);

        // N
        this.drawLine({x: 500, y:100}, {x:500, y:400}, myColor, ctx);
        this.drawLine({x: 500, y:400}, {x:600, y:100}, myColor, ctx);
        this.drawLine({x: 600, y:100}, {x:600, y:400}, myColor, ctx);

        // !
        this.drawCircle({x: 700, y: 100}, 10, myColor, ctx);
        this.drawLine({x: 700, y:200}, {x:700, y:400}, myColor, ctx);
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        // Draw four lines for rectangle
        //console.log("Drawing"+left_bottom.y)
        //this.drawLine(left_bottom, right_top, color, ctx);
        this.drawLine({x: left_bottom.x, y: left_bottom.y}, {x: right_top.x, y: left_bottom.y}, color, ctx);
        this.drawLine({x: left_bottom.x, y: left_bottom.y}, {x: left_bottom.x, y: right_top.y}, color, ctx);
        this.drawLine({x: right_top.x, y: right_top.y}, {x: left_bottom.x, y: right_top.y}, color, ctx);
        this.drawLine({x: right_top.x, y: right_top.y}, {x: right_top.x, y: left_bottom.y}, color, ctx);
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        // Loop through each arc
        let dPhi = 2*Math.PI/this.num_curve_sections
        let phi = 0
        for (let i = 0; i<this.num_curve_sections; i++) {
            // Calculate first point
            let pt0 = {x: (center.x + radius * Math.cos(phi)), y: (center.y + radius * Math.sin(phi))};

            // Adjust phi value
            phi = phi + dPhi;

            // Calculate second point
            let pt1 = {x: (center.x + radius * Math.cos(phi)), y: (center.y + radius * Math.sin(phi))};

            // Draw the line
            this.drawLine(pt0, pt1, color, ctx);
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        // Split into sections
        let dt = 1.0/this.num_curve_sections;
        //let t = 0.0;
        for (let t = 0.0; t<0.99; 0) {
            // Draw until run out of sections

            // Calculate first point
            let tempX = this.bezFunction(t,pt0.x,pt1.x,pt2.x,pt3.x);
            let tempY = this.bezFunction(t,pt0.y,pt1.y,pt2.y,pt3.y);
            let tempPoint0 = {x: tempX, y: tempY};

            // Increment t
            t = t+dt;

            // Calculate second point
            tempX = this.bezFunction(t,pt0.x,pt1.x,pt2.x,pt3.x);
            tempY = this.bezFunction(t,pt0.y,pt1.y,pt2.y,pt3.y);
            let tempPoint1 = {x: tempX, y: tempY};

            // Draw the line
            this.drawLine(tempPoint0, tempPoint1, color, ctx);
        }

        // If vertex mapping enabled, draw a filled rectangle at each of the control points in green
        if (this.show_points == true) {
          console.log("here bezier")
          let myColor = [0, 255, 0, 255]; // green
          let sideLength = 10;
          ctx.strokeStyle = 'rgba(' + myColor[0] + ',' + myColor[1] + ',' + myColor[2] + ',' + (myColor[3]/255.0) + ')';
          ctx.strokeRect(pt1.x-sideLength/2, pt1.y-sideLength/2, sideLength, sideLength);  // Control point (pt1)
          ctx.strokeRect(pt2.x-sideLength/2, pt2.y-sideLength/2, sideLength, sideLength);  // Control point (pt2)
        }
    }

    // Fill in values for bez equation. Ex: pt0x = (1-t)^3*c0.x+3*(1-t)^2*t*c1.x+3*(1-t)*t^2*c2.x+t^3*c3.x
    bezFunction(t,c0,c1,c2,c3) {
        //console.log(1**(3))
        //console.log(t,c0,c1,c2,c3);
        //console.log((1-t)^3*c0,(1-t)^2*t*c1,3*(1-t)*t^2*c2,t^3*c3);
        //let result = (1-t)^3*c0+3*(1-t)^2*t*c1+3*(1-t)*t^2*c2+t^3*c3;
        let result = (1-t)**3*c0+3*(1-t)**2*t*c1+3*(1-t)*t**2*c2+t**3*c3;
        return result;
    }


    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        //console.log(pt0)
        //console.log("Drawing line "+pt0.x+pt0.y)
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();

        // If vertex mapping enabled, draw a filled rectangle at vertices
        if (this.show_points == true) {
          console.log("here")
          let myColor = [0, 0, 255, 255]; // blue
          let sideLength = 8;
          ctx.fillStyle = 'rgba(' + myColor[0] + ',' + myColor[1] + ',' + myColor[2] + ',' + (myColor[3]/255.0) + ')';
          ctx.fillRect(pt0.x-sideLength/2, pt0.y-sideLength/2, sideLength, sideLength);
          ctx.fillRect(pt1.x-sideLength/2, pt1.y-sideLength/2, sideLength, sideLength);
        }
    }
};
