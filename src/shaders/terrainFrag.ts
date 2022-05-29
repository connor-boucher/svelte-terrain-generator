export default `
uniform vec3 u_color;

void main() {
    vec3 color = u_color / vec3(255.0, 255.0, 255.0);
    gl_FragColor = vec4(color, 1.0);
}
`;
