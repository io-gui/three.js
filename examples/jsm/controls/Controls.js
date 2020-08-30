import { EventDispatcher } from "../../../build/three.module.js";

/**
 * Generic superclass for various interactive controls. 
 * - Adds/removes event listeners during lifecycle and on `enabled` property change.
 * - Forwards all events via `EventDispatcher.dispatchEvent()` API.
 * - Emits synthetic multi-pointer events "multipointerdown", "multipointermove", "multipointerup".
 */

/**
 * Forwarded events:
 * "contextmenu", "wheel", "pointerdown", "pointermove", "pointerup", "keydown", "keyup"
 *
 * Synthetic events:
 * "enabled", "disabled", "multipointerdown", "multipointermove", "multipointerup", "dispose"
 */

 var Controls = function ( domElement ) {

	if ( domElement === undefined ) console.warn( 'THREE.Controls: The second parameter "domElement" is now mandatory.' );
	if ( domElement === document ) console.error( 'THREE.Controls: "domElement" should be "renderer.domElement".' );

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

			// Adds/removes event listeners on `enabled` property change.

			if (enabled) {

				_connect();

				scope.dispatchEvent( { type: 'enabled' } );

			} else {

				_disconnect();

				scope.dispatchEvent( { type: 'disabled' } );

			}

		}
	});

	Object.defineProperty( this, '_pointers', {
		value: [],
		enumerable: false,
	});

	function _onContextMenu( event ) {

		scope.dispatchEvent( event );

	}

	function _onWheel( event ) {

		scope.dispatchEvent( event );

	}

	function _onPointerDown( event ) {

		scope.domElement.setPointerCapture( event.pointerId );

		scope.domElement.focus ? scope.domElement.focus() : window.focus();

		scope._pointers.push( new Pointer( event ) );

		scope.dispatchEvent( event );
		scope.dispatchEvent( { type: 'multipointerdown', pointers: scope._pointers } );

	}

	function _onPointerMove( event ) {

		var i = scope._pointers.findIndex( pointer => pointer.id === event.pointerId );

		if ( scope._pointers[ i ] ) scope._pointers[ i ].update( event );

		scope.dispatchEvent( event );
		scope.dispatchEvent( { type: 'multipointermove', pointers: scope._pointers } );

	}

	function _onPointerUp( event ) {

		var i = scope._pointers.findIndex( pointer => pointer.id === event.pointerId );

		scope._pointers.splice(i, 1);

		scope.domElement.releasePointerCapture( event.pointerId );

		scope.dispatchEvent( event );
		scope.dispatchEvent( { type: 'multipointerup', pointers: scope._pointers } );

	}

	function _onKeyDown( event ) {

		scope.dispatchEvent( event );

	}

	function _onKeyUp( event ) {

		scope.dispatchEvent( event );

	}

	function _connect () {

		scope.domElement.addEventListener( 'contextmenu', _onContextMenu, false );
		scope.domElement.addEventListener( 'wheel', _onWheel, false );

		scope.domElement.addEventListener( 'pointerdown', _onPointerDown, false );
		scope.domElement.addEventListener( 'pointermove', _onPointerMove, false );
		scope.domElement.addEventListener( 'pointerup', _onPointerUp, false );

		scope.domElement.addEventListener( 'keydown', _onKeyDown, false );
		scope.domElement.addEventListener( 'keyup', _onKeyUp, false );

		// make sure element can receive keys.

		if ( scope.domElement.tabIndex === - 1 ) {

			scope.domElement.tabIndex = 0;

		}

		// make sure element has disabled touch-actions.

		if ( window.getComputedStyle( scope.domElement ).touchAction !== 'none' ) {

			scope.domElement.style.touchAction = 'none';

		}

		// TODO: consider reverting "tabIndex" and "style.touchAction" attributes on disconnect.

	}

	function _disconnect () {

		scope.domElement.removeEventListener( 'contextmenu', _onContextMenu, false );
		scope.domElement.removeEventListener( 'wheel', _onWheel, false );

		scope.domElement.removeEventListener( 'pointerdown', _onPointerDown, false );
		scope.domElement.removeEventListener( 'pointermove', _onPointerMove, false );
		scope.domElement.removeEventListener( 'pointerup', _onPointerUp, false );

		scope.domElement.removeEventListener( 'keydown', _onKeyDown, false );
		scope.domElement.removeEventListener( 'keyup', _onKeyUp, false );

		for (var i = 0; i < scope._pointers.length; i++) {

			scope.domElement.releasePointerCapture( scope._pointers[i].id );
	
		}
	
		scope._pointers.length = 0;

	};

	this.dispose = function () {

		_disconnect();

		scope.dispatchEvent( { type: 'dispose' } );

	}

	_connect();

}

Controls.prototype = Object.create( EventDispatcher.prototype );
Controls.prototype.constructor = Controls;
Controls.prototype.dispatchEvent = function( event ) {

	Object.defineProperty( event, 'target', { writable: true } );

	EventDispatcher.prototype.dispatchEvent.call( this, event );

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
