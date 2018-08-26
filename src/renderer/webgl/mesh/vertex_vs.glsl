precision highp float;

uniform mat4 uWorldMatrix;
uniform vec3 uLightSource;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPointToLight;

void main(void) {
  gl_Position = uWorldMatrix * vec4(aVertexPosition, 1.0);
  vNormal = aVertexNormal;
  vColor = aVertexColor;

  vPointToLight = aVertexPosition - uLightSource;
}