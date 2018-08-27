precision highp float;

attribute vec2 aVertexPosition;

varying vec2 vPos;

void main(void) {
  gl_Position = vec4( aVertexPosition, 0.99999, 1.0 );
  vPos = aVertexPosition;
}