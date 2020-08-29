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
			if (!value) scope.handleDisabled();
		}
	})

	Object.defineProperty( this, '_pointers', {
		value: [],
		enumerable: false,
	})

	function onContextMenu( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

	}

	function onWheel( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		scope.handleWheel( event );

	}

	function onPointerDown( event ) {

		if ( scope.enabled === false ) return;

		scope.domElement.setPointerCapture( event.pointerId );

		scope.domElement.focus ? scope.domElement.focus() : window.focus();

		scope._pointers.push( new Pointer( event ) );

		scope.handlePointerDown( scope._pointers );

	}

	function onPointerMove( event ) {

		if ( scope.enabled === false ) return;

		var i = scope._pointers.findIndex( pointer => pointer.id === event.pointerId );

		if ( scope._pointers[ i ] ) scope._pointers[ i ].update( event );

		scope.handlePointerMove( scope._pointers );

	}

	function onPointerUp( event ) {

		if ( scope.enabled === false ) return;

		var i = scope._pointers.findIndex( pointer => pointer.id === event.pointerId );

		scope._pointers.splice(i, 1);

		scope.domElement.releasePointerCapture( event.pointerId );

		scope.handlePointerUp( scope._pointers );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		scope.handleKeyDown( event );

	}

	function onKeyUp( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		scope.handleKeyUp( event );

	}

	this.domElement.addEventListener( 'contextmenu', onContextMenu, false );
	this.domElement.addEventListener( 'wheel', onWheel, false );

	this.domElement.addEventListener( 'pointerdown', onPointerDown, false );
	this.domElement.addEventListener( 'pointermove', onPointerMove, false );
	this.domElement.addEventListener( 'pointerup', onPointerUp, false );

	this.domElement.addEventListener( 'keydown', onKeyDown, false );
	this.domElement.addEventListener( 'keyup', onKeyUp, false );

	// make sure element can receive keys.

	if ( this.domElement.tabIndex === - 1 ) {

		this.domElement.tabIndex = 0;

	}

	// make sure element has disabled touch-actions.

	if ( window.getComputedStyle( this.domElement ).touchAction !== 'none' ) {

		this.domElement.style.touchAction = 'none';

	}

	this.dispose = function () {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'wheel', onWheel, false );
	
		scope.domElement.removeEventListener( 'pointerdown', onPointerDown, false );
		scope.domElement.removeEventListener( 'pointermove', onPointerMove, false );
		scope.domElement.removeEventListener( 'pointerup', onPointerUp, false );
	
		scope.domElement.removeEventListener( 'keydown', onKeyDown, false );
		scope.domElement.removeEventListener( 'keyup', onKeyUp, false );
	
		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
	
	};
	

}

Controls.prototype = Object.create( EventDispatcher.prototype );
Controls.prototype.constructor = Controls;

Controls.prototype.handlePointerDown = function ( pointers ) {};
Controls.prototype.handlePointerMove = function ( pointers ) {};
Controls.prototype.handlePointerUp = function ( pointers ) {};

Controls.prototype.handleWheel = function ( event ) {};
Controls.prototype.handleKeyDown = function ( event ) {};
Controls.prototype.handleKeyUp = function ( event ) {};

Controls.prototype.handleDisabled = function() {

	for (var i = 0; i < this._pointers.length; i++) {

		this.domElement.releasePointerCapture( this._pointers[i].id );

	}

	this._pointers.length = 0;

	return false;

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
