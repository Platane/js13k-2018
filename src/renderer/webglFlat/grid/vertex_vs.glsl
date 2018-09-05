precision highp float;

attribute vec2 aVertexPosition;

uniform mat4 uWorldMatrix;


void main(void) {
  gl_Position = uWorldMatrix * vec4(aVertexPosition, 0.0, 1.0);
}