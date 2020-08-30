import { EventDispatcher } from '../../../src/Three';

export class Controls extends EventDispatcher {

	constructor( domElement: HTMLElement );

	domElement: HTMLElement | HTMLDocument;

	// API
	enabled: boolean;

	// Event handlers
	onContextMenu( event: any ): void;
	onWheel( event: any ): void;
	
	onPointerDown( pointers: Array<Pointer> ): void;
	onPointerMove( pointers: Array<Pointer> ): void;
	onPointerUp( pointers: Array<Pointer> ): void;
	
	onKeyDown( event: any ): void;
	onKeyUp( event: any ): void;
	
	onDisabled(): void;

	connect(): void;
	disconnect(): void;
	dispose(): void;

}

export class Pointer {

	constructor( pointerEvent: PointerEvent );

	domElement: HTMLElement | HTMLDocument;

	button: number;

	ctrlKey: boolean;

	metaKey: boolean;

	shiftKey: boolean;

	type: string;

	id: number;

	x: number;
	y: number;

	startX: number;
	startY: number;

	movementX: number;
	movementY: number;

	deltaX: number;
	deltaY: number;

	update( pointerEvent: PointerEvent ): void;

}
