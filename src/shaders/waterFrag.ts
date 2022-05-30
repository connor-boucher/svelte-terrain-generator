export default `
void main() {
    vec3 color = vec3(14.0, 135.0, 204.0) / vec3(255.0, 255.0, 255.0);
    // vec3 color = position / vec3(255.0, 255.0, 255.0);

    gl_FragColor = vec4(color, 0.8);
}
`;
