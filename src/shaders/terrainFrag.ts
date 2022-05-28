export default `
varying vec3 pos;

void main() {
    vec3 normal = normalize(pos);
    gl_FragColor = vec4(normal, 1.0);
}
`;
