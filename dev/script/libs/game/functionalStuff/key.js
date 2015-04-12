/* Object holding information on which buttons and mouseclicks are 
 * being pressed or released. 
 * Code obtained here: http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html */

define([], function () {

	var key = {

		pressed: {},

	   /**Checks to see if a key is pressed
		* If keyCode is 'none' and 'pressed' is empty,
		* then true will be returned.
*/
		isDown: function (keyCode) {
			return this.pressed[keyCode] || false;
		},

		/**
		 * Set a keyCode as pressed.
		 * Adds it to the "pressed" hash table.
		 *
		 * @return {undefined}
		 */
		onKeydown: function (keyCode) {
			this.pressed[keyCode] = true;
		},

		/**
		 * Set a keyCode as released.
		 * Deletes it from "pressed" hash table.
		 *
		 * @return {undefined}
		 */
		onKeyup: function (keyCode) {
			delete this.pressed[keyCode];
		},

		/**
		 * Empties the "pressed" hash table of
		 * the Key object.
		 *
		 * @return {undefined}
		 */
		resetAll: function(){
			this.pressed = {};
		},

		/**
		 * Gets character code from string.
		 * uses string.charCodeAt(x) for single
		 * character strings e.g. a, or b.
		 *
		 * @return {number} The keyCode of the character.
		 */
		getKeyCode: function (string) {

			// GET CHAR CODE FROM SINGLE CHARACTER STRINGS
			var code = string.charCodeAt(0);

			// SPECIAL CHARACTER CODES
			switch (string) {
				case 'control':
				case 'ctrl':
					code = 17;
				break;
				case 'return':
				case 'enter':
					code = 13;
				break;
				case 'shift':
					code = 16;
				break;
				case 'alt':
					code = 18;
				break;
				case 'backspace':
					code = 8;
				break;
				case 'tab':
					code = 9;
				break;
				case 'capslock':
					code = 20; 
				break;
				case 'esc':
					code = 27;
				break;
				case 'space':
					code = 32;
				case 'pageup':
					code = 33;
				case 'pagedown':
					code = 34;
				break;
				case '35':
					code = 35;
				break;
				case 'home':
					code = 36;
				break;
				case 'left':
					code = 37;
				break;
				case 'up':
					code = 38;
				break;
				case 'right':
					code = 39;
				break;
				case 'down':
					code = 40;
				break;
				case 'ins':
					code = 45;
				break;
				case 'del':
					code = 46;
				break;
				default: 
					code = code;
			}

			return code;
		}
	};

	return key;
});
