import { EventDispatcher } from '../../../src/Three';

export class Controls extends EventDispatcher {

	constructor( domElement: HTMLElement );

	domElement: HTMLElement | HTMLDocument;

	// API
	enabled: boolean;

	dispose(): void;

	// PointerEvents handlers
	handlePointerDown( pointers: Array<Pointer> ): void;

	handlePointerMove( pointers: Array<Pointer> ): void;

	handlePointerUp( pointers: Array<Pointer> ): void;

	// Other handlers
	handleWheel( event: any ): void;

	handleKeyDown( event: any ): void;

	handleKeyUp( event: any ): void;

	handleDisabled(): void;

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
