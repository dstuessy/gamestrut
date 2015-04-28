
define([
   'libs/gamestrut/entities/entity'
], function ( Entity ) {

	var TextEntity = function ( options ) {

		Entity.call( this, options );
		
		// SETTING DEFAULT OPTIONS
		this.type = 'Text';
		this.fontSize = this.fontSize || 20;
		this.fontColor = this.fontColor || 'black';
		this.fontFamily = this.fontFamily || 'Arial';

		this.init();
	};

	TextEntity.prototype = Object.create( Entity.prototype );
	TextEntity.constructor = TextEntity;

	return TextEntity;
});
