import { EventDispatcher } from "../../../build/three.module.js";

// Generic class for various interactive controls.
// It handles event listener setup and teardown, pointer capture and tracking.

var Controls = function ( domElement ) {

	if ( domElement === undefined ) console.warn( 'THREE.Controls: The second parameter "domElement" is now mandatory.' );
	if ( domElement === document ) console.error( 'THREE.Controls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

	var scope = this;

	this.domElement = domElement;

	var enabled = true;
	Object.defineProperty( this, 'enabled', {
		enumerable: true,
		get: function () {
			return enabled;
		},
		set: function (value) {
			enabled = value;
			value ? scope.onEnabled() : scope.onDisabled();
		}
	});

	Object.defineProperty( this, '_pointers', {
		value: [],
		enumerable: false,
	});

	function _onContextMenu( event ) {

		event.preventDefault();

		scope.onContextMenu( event );

	}

	function _onWheel( event ) {

		event.preventDefault();
		event.stopPropagation();

		scope.onWheel( event );

	}

	function _onPointerDown( event ) {

		scope.domElement.setPointerCapture( event.pointerId );

		scope.domElement.focus ? scope.domElement.focus() : window.focus();

		scope._pointers.push( new Pointer( event ) );

		scope.onPointerDown( scope._pointers );

	}

	function _onPointerMove( event ) {

		var i = scope._pointers.findIndex( pointer => pointer.id === event.pointerId );

		if ( scope._pointers[ i ] ) scope._pointers[ i ].update( event );

		scope.onPointerMove( scope._pointers );

	}

	function _onPointerUp( event ) {

		var i = scope._pointers.findIndex( pointer => pointer.id === event.pointerId );

		scope._pointers.splice(i, 1);

		scope.domElement.releasePointerCapture( event.pointerId );

		scope.onPointerUp( scope._pointers );

	}

	function _onKeyDown( event ) {

		event.preventDefault();
		event.stopPropagation();

		scope.onKeyDown( event );

	}

	function _onKeyUp( event ) {

		event.preventDefault();
		event.stopPropagation();

		scope.onKeyUp( event );

	}

	this.connect = function () {

		this.domElement.addEventListener( 'contextmenu', _onContextMenu, false );
		this.domElement.addEventListener( 'wheel', _onWheel, false );

		this.domElement.addEventListener( 'pointerdown', _onPointerDown, false );
		this.domElement.addEventListener( 'pointermove', _onPointerMove, false );
		this.domElement.addEventListener( 'pointerup', _onPointerUp, false );

		this.domElement.addEventListener( 'keydown', _onKeyDown, false );
		this.domElement.addEventListener( 'keyup', _onKeyUp, false );

	}

	this.disconnect = function () {

		scope.domElement.removeEventListener( 'contextmenu', _onContextMenu, false );
		scope.domElement.removeEventListener( 'wheel', _onWheel, false );

		scope.domElement.removeEventListener( 'pointerdown', _onPointerDown, false );
		scope.domElement.removeEventListener( 'pointermove', _onPointerMove, false );
		scope.domElement.removeEventListener( 'pointerup', _onPointerUp, false );

		scope.domElement.removeEventListener( 'keydown', _onKeyDown, false );
		scope.domElement.removeEventListener( 'keyup', _onKeyUp, false );

		for (var i = 0; i < this._pointers.length; i++) {

			this.domElement.releasePointerCapture( this._pointers[i].id );
	
		}
	
		this._pointers.length = 0;

	};

	this.dispose = function () {

		this.disconnect();

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	}


	// make sure element can receive keys.

	if ( this.domElement.tabIndex === - 1 ) {

		this.domElement.tabIndex = 0;

	}

	// make sure element has disabled touch-actions.

	if ( window.getComputedStyle( this.domElement ).touchAction !== 'none' ) {

		this.domElement.style.touchAction = 'none';

	}

	this.connect();

}

Controls.prototype = Object.create( EventDispatcher.prototype );
Controls.prototype.constructor = Controls;

Controls.prototype.onContextMenu = function ( event ) {};
Controls.prototype.onWheel = function ( event ) {};

Controls.prototype.onPointerDown = function ( pointers ) {};
Controls.prototype.onPointerMove = function ( pointers ) {};
Controls.prototype.onPointerUp = function ( pointers ) {};

Controls.prototype.onKeyDown = function ( event ) {};
Controls.prototype.onKeyUp = function ( event ) {};

Controls.prototype.onDisabled = function() {

	this.disconnect();

	return false;

}

Controls.prototype.onEnabled = function() {

	this.connect();

	return true;

}

// Pointer class to keep track of pointer movements

var Pointer = function ( pointerEvent ) {

	this.domElement = pointerEvent.srcElement;

	this.button = pointerEvent.button;

	this.ctrlKey = pointerEvent.ctrlKey;
	this.metaKey = pointerEvent.metaKey;
	this.shiftKey = pointerEvent.shiftKey;

	this.type = pointerEvent.pointerType;

	this.id = pointerEvent.pointerId;

	this.x = pointerEvent.clientX;
	this.y = pointerEvent.clientY;

	this.startX = this.x;
	this.startY = this.y;

	this.movementX = pointerEvent.movementX;
	this.movementY = pointerEvent.movementY;

	this.deltaX = 0;
	this.deltaY = 0;

	this.update = function ( pointerEvent ) {

		if ( this.id !== pointerEvent.pointerId ) {

			console.error( 'Invalid pointerId!' );

			return;

		}

		this.x = pointerEvent.clientX;
		this.y = pointerEvent.clientY;

		this.movementX = pointerEvent.movementX;
		this.movementY = pointerEvent.movementY;

		this.deltaX = this.x - this.startX;
		this.deltaY = this.y - this.startY;

	}

}

export { Controls, Pointer };
