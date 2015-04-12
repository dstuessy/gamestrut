define([
], function () {

	var Collision = function (event, objAId, objBId, execute) {

		this.event = event;
		this.objAId = objAId;
		this.objBId = objBId;
		this.execute = execute;
	};

	/**
	 * Executes assigned execute when appropriate.
	 *
	 * Matches variables in Collision object with
	 * the ones passed as parameters.
	 *
	 * @param {String} event String representing type of collision event.
	 * @param {AnimateEntity} bodyAUserData Animate entity part of collision.
	 * @param {AnimateEntity} bodyBUserData Animate entity part of collision.
	 * @return {undefined}
	 */
	Collision.prototype.run = function (event, bodyAUserData, bodyBUserData) {

		// GET BODY IDs
		var bodyAId = bodyAUserData.id;
		var bodyBId = bodyBUserData.id;
		
		// EXECUTE EVENT IF CONDITIONS MATCH
		if (
			event == this.event
			&&
			((
				bodyAId == this.objAId
				&&
				bodyBId == this.objBId
			) || (
				bodyAId == this.bodyBId
				&&
				bodyBId == this.bodyAId
			))
		) {
			this.execute();
		} 
	};

	return Collision;
});
