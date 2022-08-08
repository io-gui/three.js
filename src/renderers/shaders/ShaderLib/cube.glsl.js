export const vertex = /* glsl */`
varying vec3 vWorldDirection;

#include <common>

void main() {

	// UMA Mbody: fix background rotation to camera
	// vWorldDirection = transformDirection( position, modelMatrix );
	vWorldDirection = (envRotationMatrix * vec4(transformDirection( position, modelMatrix ), 1.0)).xyz;

	#include <begin_vertex>
	#include <project_vertex>

	gl_Position.z = gl_Position.w; // set z to camera.far

}
`;

export const fragment = /* glsl */`
#include <envmap_common_pars_fragment>
uniform float opacity;

varying vec3 vWorldDirection;

#include <cube_uv_reflection_fragment>

void main() {

	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>

	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;

	#include <tonemapping_fragment>
	#include <encodings_fragment>

}
`;
