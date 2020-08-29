import { WebGLRenderer, Scene, Mesh, Line, Vector3, Euler, Camera, PerspectiveCamera, OrthographicCamera, LineBasicMaterial, MeshBasicMaterial, Vector4 } from '../../../src/Three';

export declare const gizmoMaterial: MeshBasicMaterial;

export declare const gizmoLineMaterial: LineBasicMaterial;

export interface ControlsHelperGeometrySpec {
	name: string;
	color: Vector4;
	position?: Vector3;
	rotation?: Euler;
	scale?: Vector3;
	thickness?: number;
	outlineThickness?: number;
	tag?: string;
	mode?: string;
}

export declare class ControlsHelper extends Mesh {

	camera: PerspectiveCamera | OrthographicCamera;
	enabled: boolean;
	axis: 'X' | 'Y' | 'Z' | 'XY' | 'YZ' | 'XZ' | 'XYZ' | 'XYZE' | 'E' | '';
	mode: string;
	size: number;
	dragging: boolean;
	showX: boolean;
	showY: boolean;
	showZ: boolean;
	eye: Vector3;
	sizeAttenuation: number;
	constructor( gizmoMap?: [Mesh | Line, ControlsHelperGeometrySpec][] );
	onBeforeRender: ( renderer: WebGLRenderer, scene: Scene, camera: Camera ) => void;
	updateHandleTransform( handle: Mesh ): void;
	updateHandleVisibility( handle: Mesh ): void;
	updateMatrixWorld(): void;

}
