precision highp float;


varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPointToLight;

void main(void) {



    float light_dot = dot(vNormal, normalize(vPointToLight)) * 0.5 + 0.5;

    vec3 black = vec3( 0.0 );
    vec3 color = mix(vColor, black, light_dot);

    gl_FragColor = vec4( color, 1.0 );


    // gl_FragColor = vec4( vNormal*0.5+0.5, 1.0 );
}