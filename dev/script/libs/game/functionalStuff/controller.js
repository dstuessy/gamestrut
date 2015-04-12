define([
	'Mousetrap', 
	'libs/game/functionalStuff/key'
], function (Mousetrap, Key) {
	/**
	 * This object executes a given function when one or more given keys are pressed or released.
	 *
	 * 'run()' is a function that checks if all keys are pressed or released and then based on 'isPressed',
	 *      executes the given function ('this.method').
	 * 
	 * @param {Array} keys An array holding to the keyCodes in the object 'key'.
	 * @param {Function} method A function, passed through as a variable, referencing an entity's function.
	 * @param {Boolean} isPressed A boolean variable that indicates if the "this.run()" function shall be executed when the key(s) are released or down. 
	 */
	var Controller = function (key, method, event, preventDefault) {

		// IF KEY IS KONAMI CODE
		if (key.indexOf(' ') > -1) {

			// SET MOUSETRAP KONAMI CODE
			Mousetrap.bind(key, method);
		}
		// IF KEY IS COMBINATION
		else if (key.indexOf('+') > -1) {

			// BIND COMBINATION TO MOUSETRAP
			Mousetrap.bind(key, function (e) {

				// PREVENT DEFAULT
				if (preventDefault) {
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
				}

				// EXECUTE METHOD
				method();
			}, event);
		}
		// SET REGULAR CONTROLLER
		else {

			// GET KEY CODE
			var keyCode = Key.getKeyCode(key);
			// BIND KEYCODE TO Key.onKeydown
			var funcOnDown = Key.onKeydown.bind(Key, keyCode);

			// BIND KEY TO MOUSETRAP
			// onkeydown
			Mousetrap.bind(key, function (e) {

				funcOnDown();

				// PREVENT DEFAULT
				if (preventDefault) {
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
				}

			}, 'keydown');
			// onkeyup
			Mousetrap.bind(key, Key.onKeyup.bind(Key, keyCode), 'keyup');
		}

		this.key = key;
		this.isPressed = (event == 'keydown') ? true : false;
		this.method = method || function () {};
	};

	/**
	 * Checks to see if keys are pressed or released
	 * and executes this.method accordingly.
	 *
	 * @return {undefined}
	 */
	Controller.prototype.run = function () {

		// TURN this.key INTO AN ARRAY
		// BASED ON +
		var keys = (

			this.key.length > 1 
			&& 
			this.key.indexOf('+') > -1

		) ? this.key.split('+') : [this.key];
		var count = 0;

		// FOR EACH KEY
		for (var i in keys) {

			// GET KEY CODE
			var key = Key.getKeyCode( keys[i] );

			// IF KEY MATCHES ITS EVENT CONDITION
			if (Key.isDown(key) == this.isPressed) {
				count++;
			} 
		}

		// IF ALL KEYS MATCH THEIR EVENT CONDITION
		if (count == keys.length) {
			this.method();
		}
	};

	return Controller;
});
