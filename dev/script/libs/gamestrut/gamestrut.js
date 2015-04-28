
define([
	'Mousetrap', 
	'libs/gamestrut/functionalStuff/box2dvariables', 
	'libs/gamestrut/functionalStuff/key',
	'libs/gamestrut/functionalStuff/controller',
	'libs/gamestrut/entities/level',
	'libs/gamestrut/entities/background',
	'libs/gamestrut/entities/textEntity',
	'libs/gamestrut/entities/entity',
	'libs/gamestrut/entities/animateEntity',
	'libs/gamestrut/entities/staticEntity',
	'game'
], function (Mousetrap, box2d, key, Controller, Level, Background, TextEntity, Entity, AnimateEntity, StaticEntity, Game) {

	/*! 
	 * GameStrut, Version 2.0!
	 * @author Daniel Stuessy
	 * @description An html5 canvas video game framework.
	 *
	 * This work of Daniel Stuessy uses the libraries 
	 * Mousetrap.js and Box2dWeb.js. 
	 * They are used to provide a video game framework 
	 * that developers can use to save development time. 
	 * 
	 * Hopefully this will be of use to someone. :)
	 *
	 *
	 *
	 * The MIT License (MIT)
	 *
	 * Copyright (c) 2015 Daniel Stuessy
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	window.GameStrut = {

		/**
		 * A Game class,
		 * @type {Game}
		 */
		Game: Game,

		/**
		 * A Level class,
		 * @type {Level}
		 */
		Level: Level,

		/**
		 * A Background class.
		 * @type {Background}
		 */
		Background: Background,

		/**
		 * A TextEntity class.
		 * @type {TextEntity}
		 */
		TextEntity: TextEntity,

		/**
		 * Mixin of functions for all AnimateEntities.
		 * @type {Object}
		 */
		Entity: Entity,

		/**
		 * An AnimateEntity class.
		 * @type {AnimateEntity}
		 */
		AnimateEntity: AnimateEntity,

		/** 
		 * A StaticEntity class.
		 * @type StaticEntity
		 */
		StaticEntity: StaticEntity,

		/**
		 * Holds and manages all the key codes pressed.
		 * @type {Object}
		 */
		Key: key,

		/**
		 * box2d variable
		 * Holds all the classes used from box2d
		 * @type {Box2d}
		 */
		box2d: box2d
	};

	return GameStrut;
});
