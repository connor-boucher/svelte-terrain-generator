const printLoadedShaders = (vertexShader, fragmentShader) => {
    console.groupCollapsed('Loaded shaders');
    console.groupCollapsed('Vertex Shader');
    console.log(vertexShader.trim());
    console.groupEnd();

    console.groupCollapsed('Fragment Shader');
    console.log(fragmentShader.trim());
    console.groupEnd();
    console.groupEnd();
};

export { printLoadedShaders };
