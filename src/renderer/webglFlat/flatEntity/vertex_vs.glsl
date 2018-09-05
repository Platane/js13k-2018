precision highp float;

attribute vec2 aVertexPosition;
attribute vec2 aVertexUV;

uniform mat4 uWorldMatrix;

varying vec2 vTextureCoord;

void main(void) {
  gl_Position = uWorldMatrix * vec4(aVertexPosition, 0.0, 1.0);
  vTextureCoord = aVertexUV;
}