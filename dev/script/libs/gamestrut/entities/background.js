
define([
	'libs/gamestrut/entities/entity'
], function ( Entity ) {

	var Background = function ( options ) {

		Entity.call( this, options );

		// SET DEFAULT OPTIONS
		this.type = 'Background';
		this.width = ( typeof this.texture != 'undefined' ) ? this.texture.width : 0;
		this.height = ( typeof this.texture != 'undefined' ) ? this.texture.height : 0;
		
		this.init();
	};

	Background.prototype = Object.create( Entity.prototype );
	Background.prototype.constructor = Background;

	return Background;
});
