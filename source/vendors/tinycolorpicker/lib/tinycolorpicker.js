;(function(window, undefined) {
    "use strict";

    function extend() {
        for(var i=1; i < arguments.length; i++) {
            for(var key in arguments[i]) {
                if(arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    var pluginName = "tinycolorpicker"
    ,   defaults   = {
            backgroundUrl : null
        }
    ;

    function Plugin($container, options) {
        /**
         * The options of the colorpicker extended with the defaults.
         *
         * @property options
         * @type Object
         */
        this.options = extend({}, defaults, options);

        /**
         * @property _defaults
         * @type Object
         * @private
         * @default defaults
         */
        this._defaults = defaults;

        /**
         * @property _name
         * @type String
         * @private
         * @final
         * @default 'tinycolorpicker'
         */
        this._name = pluginName;

        var self          = this
        ,   $track        = $container.querySelectorAll(".track")[0]
        ,   $color        = $container.querySelectorAll(".color")[0]
        ,   $colorInner   = $container.querySelectorAll(".colorInner")[0]
        ,   $canvas       = null
        ,   $colorInput   = $container.querySelectorAll(".colorInput")[0]

        ,   context      = null
        ,   mouseIsDown  = false
        ,   hasCanvas    = !!document.createElement("canvas").getContext
        ,   touchEvents  = "ontouchstart" in document.documentElement
        ,   changeEvent  = document.createEvent("HTMLEvents")
        ;

        changeEvent.initEvent("change", true, true);

        /**
         * The current active color in hex.
         *
         * @property colorHex
         * @type String
         * @default ""
         */
        this.colorHex = "";

        /**
         * The current active color in rgb.
         *
         * @property colorRGB
         * @type String
         * @default ""
         */
        this.colorRGB = "";

        /**
         * @method _initialize
         * @private
         */
        function _initialize() {
            if(hasCanvas) {
                $canvas = document.createElement("canvas");
                $track.appendChild($canvas);

                context = $canvas.getContext("2d");

                _setImage();
            }

            _setEvents();

            return self;
        }

        /**
         * @method _setImage
         * @private
         */
        function _setImage() {
            var colorPicker   = new Image()
            ,   style         = $track.currentStyle || window.getComputedStyle($track, false)
            ,   backgroundUrl = style.backgroundImage.replace(/"/g, "").replace(/url\(|\)$/ig, "")
            ;

            colorPicker.crossOrigin = "Anonymous";
            $track.style.backgroundImage = "none";

            colorPicker.onload = function() {
                $canvas.width = this.width;
                $canvas.height = this.height;

                context.drawImage(colorPicker, 0, 0, this.width, this.height);
            };

            colorPicker.src = self.options.backgroundUrl || backgroundUrl;
        }

        /**
         * @method _setEvents
         * @private
         */
        function _setEvents() {
            var eventType = touchEvents ? "touchstart" : "mousedown";

            if(hasCanvas) {
                $color["on" + eventType] = function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $track.style.display = 'block';

                    document.onmousedown = function(event) {
                        document.onmousedown = null;

                        self.close();
                    };
                };

                if(!touchEvents) {
                    $canvas.onmousedown = function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        mouseIsDown = true;

                        _getColorCanvas(event);

                        document.onmouseup = function(event) {
                            document.onmouseup = null;

                            self.close();

                            return false;
                        };
                    };

                    $canvas.onmousemove = _getColorCanvas;
                }
                else {
                    $canvas.ontouchstart = function(event) {
                        mouseIsDown = true;

                        _getColorCanvas(event.touches[0]);

                        return false;
                    };

                    $canvas.ontouchmove = function(event) {
                        _getColorCanvas(event.touches[0]);

                        return false;
                    };

                    $canvas.ontouchend = function(event) {
                        self.close();

                        return false;
                    };
                }
            }
        }

        /**
         * @method _getColorCanvas
         * @private
         */
        function _getColorCanvas(event) {
            if(mouseIsDown) {
                var offset    = event.target.getBoundingClientRect()
                ,   colorData = context.getImageData(event.clientX - offset.left, event.clientY - offset.top, 1, 1).data
                ;

                self.setColor("rgb(" + colorData[0] + "," + colorData[1] + "," + colorData[2] + ")");

                $container.dispatchEvent(changeEvent, [self.colorHex, self.colorRGB]);
            }
        }

        /**
         * Set the color to a given hex or rgb color.
         *
         * @method setColor
         * @chainable
         */
        this.setColor = function(color) {
            if(color.indexOf("#") >= 0) {
                self.colorHex = color;
                self.colorRGB = self.hexToRgb(self.colorHex);
            }
            else {
                self.colorRGB = color;
                self.colorHex = self.rgbToHex(self.colorRGB);
            }

            $colorInner.style.backgroundColor = self.colorHex;
            $colorInput.value = self.colorHex;
        };

        /**
         * Close the picker
         *
         * @method close
         * @chainable
         */
        this.close = function() {
            mouseIsDown = false;

            $track.style.display = 'none';
        };

        /**
         * Cobert hex to rgb
         *
         * @method hexToRgb
         * @chainable
         */
        this.hexToRgb = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
        };

        /**
         * Cobert rgb to hex
         *
         * @method rgbToHex
         * @chainable
         */
        this.rgbToHex = function(rgb) {
            var result = rgb.match(/\d+/g);

            function hex(x) {
                var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
                return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
            }

            return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
        };

       return _initialize();
    }

    /**
     * @class window.tinycolorpicker
     * @constructor
     * @param {Object} $container
     * @param {Object} options
        @param {String} [options.backgroundUrl=''] It will look for a css image on the track div. If not found it will look if there's a url in this property.
     */
    var tinycolorpicker = function($container, options) {
        return new Plugin($container, options);
    };

    if(typeof define == 'function' && define.amd) {
        define(function(){ return tinycolorpicker; });
    }
    else if(typeof module === 'object' && module.exports) {
        module.exports = tinycolorpicker;
    }
    else {
        window.tinycolorpicker = tinycolorpicker;
    }
})(window);
