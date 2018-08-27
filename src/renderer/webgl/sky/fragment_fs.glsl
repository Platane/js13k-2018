precision highp float;

varying vec2 vPos;


void main(void) {

  vec3 A = vec3( 0.5 , 0.4, 0.72 );
  vec3 B = vec3( 0.6, 0.32, 0.62 );


  vec3 color = mix(B, A, abs(vPos.x) );

  gl_FragColor = vec4( color, 1.0 );
}