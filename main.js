/**
 * @authors Alex Gibson, Tejas Kumar
 * @name SketchPad
 * @desc Multi-touch sketchpad demo for HTML5 Canvas drawing
 */

var settings = {

  colors:
  {
    r: 0, //red stroke
    g: 0, //green stroke
    b: 0, //blue stroke
    a: 1 //alpha opacity
  },
  started: false,
  moved: false,
  width: window.innerWidth,
  height: window.innerHeight,
  size: 10,
  lines: [],
  optionsOpen: false,
  pixelRatio: 1,
  element: 'body'

};

var sketch = (function()
{

  var canvas, //canvas element.
    ctx, //drawing context.
    xPos,
    yPos;

  return {

    init: function()
    {

      var doc = document,
        head = doc.getElementsByTagName('head')[0],
        meta = doc.createElement('meta'),
        dataURL = null,
        image = new Image(),
        hasLocalStorage = 'localStorage' in window && window['localStorage'] !== null;

      pixelRatio = sketch.getPixelRatio();

      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=device-width, user-scalable=no, maximum-scale=' + (1 / pixelRatio) +
        ', initial-scale=' + (1 / pixelRatio));
      head.appendChild(meta);

      canvas = document.createElement('canvas');
      doc.querySelector(settings.element)
        .appendChild(canvas);

      canvas.setAttribute("height", settings.height + "px");
      canvas.setAttribute("width", settings.width + "px");
      canvas.style.width = settings.width + 'px';
      canvas.style.height = settings.height + 'px';

      if (!canvas.getContext)
      {
        alert('Your browser does not support Canvas 2D drawing.');
      }
      else
      {
        ctx = canvas.getContext('2d');

        canvas.addEventListener('touchstart', sketch.onTouchStart, false);
        canvas.addEventListener('touchmove', sketch.onTouchMove, false);
        canvas.addEventListener('touchend', sketch.onTouchEnd, false);
        canvas.addEventListener('touchcancel', sketch.onTouchCancel, false);
        canvas.addEventListener('mousedown', sketch.onMouseDown, false);
      }

      //prevent default scrolling on document window
      document.addEventListener('touchmove', function(e)
      {
        e.preventDefault()
      }, false);

      //shake gesture
      window.addEventListener('shake', sketch.clearCanvas, false);

      if (hasLocalStorage)
      {
        dataURL = localStorage.getItem('sketchpad');
        if (dataURL)
        {
          image.onload = function()
          {
            ctx.drawImage(image, 0, 0);
          }
          image.src = dataURL;
        }

      }
    },

    getPixelRatio: function()
    {
      if ('devicePixelRatio' in window)
      {
        return window.devicePixelRatio;
      }
      return 1;
    },

    onTouchStart: function(e)
    {

      e.preventDefault();

      _.each(e.touches, function(touch)
      {
        settings.lines[touch.identifier] = {
          x: touch.clientX,
          y: touch.clientY
        };
      }, this);
      moved = false;
      settings.started = true;
    },

    onTouchMove: function(e)
    {

      e.preventDefault();

      if (settings.started && !settings.optionsOpen)
      {
        _.each(e.touches, function(touch)
        {

          var id = touch.identifier,
            moveX = touch.clientX - settings.lines[id].x,
            moveY = touch.clientY - settings.lines[id].y,
            newPos = sketch.drawMulti(id, moveX, moveY);

          settings.lines[id].x = newPos.x;
          settings.lines[id].y = newPos.y;

        }, this);
      }
      moved = true;
    },

    onTouchEnd: function(e)
    {
      if (e.touches.length === 0)
      {
        settings.lines = [];
        moved = false;
        settings.started = false;
      }
    },

    onTouchCancel: function(e)
    {
      if (e.touches.length === 0)
      {
        settings.lines = [];
        moved = false;
        settings.started = false;
      }
    },

    onMouseDown: function(e)
    {
      moved = false;
      settings.started = true;
      canvas.addEventListener('mousemove', sketch.onMouseMove, false);
      canvas.addEventListener('mouseup', sketch.onMouseUp, false);
    },

    onMouseMove: function(e)
    {
      if (settings.started && !settings.optionsOpen)
      {
        sketch.drawLine(e.clientX, e.clientY);
      }
      moved = true;
    },

    onMouseUp: function(e)
    {
      sketch.endDraw();
      moved = false;
      settings.started = false;
      canvas.removeEventListener('mousemove', sketch.onMouseMove, false);
      canvas.removeEventListener('mouseup', sketch.onMouseUp, false);
    },

    drawLine: function(x, y)
    {

      if (!xPos || !yPos)
      {
        xPos = x;
        yPos = y;
      }

      /*var grad1 = ctx.createLinearGradient(0, 0, settings.width, settings.height);
			grad1.addColorStop(0,    'yellow');
			grad1.addColorStop(0.25, 'red');
			grad1.addColorStop(0.50, 'blue');
			grad1.addColorStop(0.75, 'limegreen');*/
      //ctx.strokeStyle = grad1;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = settings.size;
      ctx.strokeStyle = 'rgba(' + settings.colors.r + ',' + settings.colors.g + ',' + settings.colors.b + ',' +
        settings.colors.a + ')';
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();

      xPos = x;
      yPos = y;
    },

    endDraw: function(x, y)
    {
      xPos = null;
      yPos = null;
    },

    drawMulti: function(id, moveX, moveY)
    {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = settings.size;
      /*var grad1 = ctx.createLinearGradient(0, 0, settings.width, settings.height);
			grad1.addColorStop(0,    'yellow');
			grad1.addColorStop(0.25, 'red');
			grad1.addColorStop(0.50, 'blue');
			grad1.addColorStop(0.75, 'limegreen');*/
<<<<<<< Updated upstream
      //ctx.strokeStyle = grad1;
      ctx.strokeStyle = 'rgba(' + settings.colors.r + ',' + settings.colors.g + ',' + settings.colors.b + ',' + settings.colors.a + ')';
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(settings.lines[id].x, settings.lines[id].y);
      ctx.lineTo(settings.lines[id].x + moveX, settings.lines[id].y + moveY);
      ctx.stroke();
      ctx.closePath();

      return {
        x: settings.lines[id].x + moveX,
        y: settings.lines[id].y + moveY
      };
    },

    saveImageData: function()
    {
      var data = ctx.getImageData(0, 0, settings.width, settings.height);
      if (hasLocalStorage)
      {
        try
        {
          localStorage.setItem('sketchpad', canvas.toDataURL("image/png"));
        }
        catch (e)
        {
          if (e === 'QUOTA_EXCEEDED_ERR')
          {
            console.error('Could not save the image data as localStorage max quota has been exceeded.');
          }
        }
      }
    },

    clearCanvas: function()
    {

      if (!confirm("Clear the drawing?"))
      {
        return;
      }
      canvas.setAttribute("height", settings.height + "px");
      canvas.setAttribute("width", settings.width + "px");
      sketch.saveImageData();
    },

    toggleOptions: function()
    {
      if (!settings.optionsOpen)
      {
        sketch.showDrawingOptions();
      }
      else
      {
        sketch.closeDrawingOptions();
      }
    },

    showDrawingOptions: function()
    {
      var doc = document,
        clearButton = doc.getElementById('clear-canvas');
      clearButton.style.fontSize = 100 * pixelRatio + '%';
      clearButton.addEventListener('click', this.clearCanvas, false);
      doc.querySelector('.options')
        .style.display = 'block';
      settings.optionsOpen = true;
    },

    closeDrawingOptions: function()
    {
      var doc = document;
      doc.getElementById('clear-canvas')
        .removeEventListener('click', this.clearCanvas, false);
      doc.querySelector('.options')
        .style.display = 'none';
      settings.optionsOpen = false;
    }
  };
=======
			//ctx.strokeStyle = grad1;
			ctx.strokeStyle = 'rgba(' + settings.colors.r + ',' + settings.colors.g + ',' + settings.colors.b + ',' + settings.colors.a + ')';
			ctx.globalCompositeOperation = 'source-over';
		    ctx.beginPath();
		    ctx.moveTo(lines[id].x, lines[id].y);
		    ctx.lineTo(lines[id].x + moveX, lines[id].y + moveY);
		    ctx.stroke();
		    ctx.closePath();

		    return { x: lines[id].x + moveX, y: lines[id].y + moveY };
		},

		saveImageData: function () {
			var data = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
			if (hasLocalStorage) {
				try {
					localStorage.setItem('sketchpad', canvas.toDataURL("image/png"));
				} catch (e) {
					if (e === 'QUOTA_EXCEEDED_ERR') {
						console.error('Could not save the image data as localStorage max quota has been exceeded.');
					}
				}
			}
		},
		
		clearCanvas: function () {
		
			if (!confirm("Clear the drawing?")) {
				return;
			}
			canvas.setAttribute("height", window.innerHeight + "px"); 
			canvas.setAttribute("width",  window.innerWidth + "px");
			sketch.saveImageData();
		},

		toggleOptions: function () {
			if (!optionsOpen) {
				sketch.showDrawingOptions();
			} else {
				sketch.closeDrawingOptions();
			}
		},

		showDrawingOptions: function () {
			var doc = document,
			clearButton = doc.getElementById('clear-canvas');
			clearButton.style.fontSize = 100 * pixelRatio + '%';
			clearButton.addEventListener('click', this.clearCanvas, false);
			doc.querySelector('.options').style.display = 'block';
			optionsOpen = true;
		},

		closeDrawingOptions: function () {
			var doc = document;
			doc.getElementById('clear-canvas').removeEventListener('click', this.clearCanvas, false);
			doc.querySelector('.options').style.display = 'none';
			optionsOpen = false;
		}
	};
>>>>>>> Stashed changes
}());

window.addEventListener('DOMContentLoaded', sketch.init, true);