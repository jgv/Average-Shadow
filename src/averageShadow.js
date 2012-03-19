(function($){

    $.avgShadow = function(el, options){
        // jquerified and regular references to 'this'
        var base = this;       
        base.$el = $(el);
        base.el = el; 

        // Sets up our options
        base.init = function(){            
            base.options = $.extend({}, $.avgShadow.options, options);
            base.cleanOptions();
            
            // you dont support canvas, bye.
            if (!base.supportsCanvas()) return;

            // whats up with this image is it cached?
            // if not wait for the onload event
            if (base.el.complete || base.readystate === 4) {
                base.start();
            } else {
                base.el.onload = function(){
                    base.start();
                }
            }
        };

        // Make sure that the options passed into average shadow will be ok
        // Takes no arguments and returns nothing
        base.cleanOptions = function(){
            // if we want inset, make the value of this option 'inset' instead of true
            if (base.options.inset) base.options.inset = 'inset';            

            // iterate over the options object looking for a string that contains 'px'
            for (var key in base.options) {
                var value = base.options[key];
                if (typeof value === 'string') {
                    // if we find and instance of 'px' delete it...
                    var cleanValue = value.replace(/px/i, '');
                    // and trim the string just incase
                    $.trim(cleanValue)
                    base.options[key] = cleanValue;
                }
            }
            
            // do stuff
            base.start();
        };
                
        // Extract the rgb color values and map to box shadow
        base.start = function() {            

            // set up empty color object
            var color = { 
                r: 0, 
                g: 0, 
                b: 0
            };

            // our sample size for the image
            var sample = 5;

            // create a canvas element
            var canvas = document.createElement('canvas');

            // assign the canvas element a width and height based on the image
            canvas.width = base.el.width;
            canvas.height = base.el.height;


            // get the canvas' context and draw the image
            var ctx = canvas.getContext && canvas.getContext('2d');
            ctx.drawImage(base.el, 0, 0, base.el.width, base.el.height);

            // extract the image data after the image has been drawn
            var data = ctx.getImageData(0, 0, base.el.width, base.el.height);

            // the length of the pixel array
            var length = data.data.length;

            // boring iterator
            var i = -4;

            // boring counter
            var count = 0;
            
            // iterate over the canvas based on our sample size
            while ( (i += sample * 4) < length) {                    
                ++count;
                
                // extract the average color based on pixel array data
                color.r += data.data[i];
                color.g += data.data[i + 1];
                color.b += data.data[i + 2];                    
            }

            // floor the values
            color.r = ~~(color.r / count);
            color.g = ~~(color.g / count);
            color.b = ~~(color.b / count);

            // assign the image box shadow based on the avergae color
            base.el.style.boxShadow = base.options.horizontal + 'px ' + base.options.vertical + 'px ' + base.options.blur + 'px ' +  base.options.spread + 'px ' + 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' + base.options.inset;


        };

        // feature detect for <canvas>
        base.supportsCanvas = function() {
            var test = document.createElement('canvas');
            return (test.getContext) ? true : false;
        };
        
        // start
        base.init();
    };


    // options object
    $.avgShadow.options = { 
        horizontal: 0,
        vertical: 0,
        blur: '10px',
        spread: 5,
        inset: '' // this needs to be an empty string, not false or null
    };

    $.fn.avgShadow = function(options){
        return this.each(function(){
            (new $.avgShadow(this, options));
        });
    };
    
})(jQuery);
