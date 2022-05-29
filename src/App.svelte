<script lang="ts">
    import * as THREE from 'three';
    import * as SC from 'svelte-cubed';
    import * as dat from 'dat.gui';

    import { rgbFromHex } from './lib/colorUtils';
    import { printLoadedShaders } from './lib/shaderDebug';

    import vertexShader from './shaders/terrainVert';
    import fragmentShader from './shaders/terrainFrag';

    //
    // SHADER SHIT
    //

    printLoadedShaders(vertexShader, fragmentShader);

    let uniforms = {
        u_frequency: { type: 'f', value: 1.0 },
        u_height: { type: 'f', value: 0.5 },
        u_octaves: { type: 'f', value: 5.0 },
        u_x_offset: { type: 'f', value: 1.0 },
        u_z_offset: { type: 'f', value: 1.0 },
        u_speed: { type: 'f', value: 0.05 },
        u_time: { type: 'f', value: 0.0 },
        u_color: { type: 'vec3', value: new THREE.Vector3(255, 62, 0) },
    };

    const clock = new THREE.Clock();

    SC.onFrame(() => {
        uniforms.u_time.value = clock.getElapsedTime();
    });

    //
    // PROPERTIES SHIT
    //

    let terrainProperties = {
        water: false,
        waterHeight: 0,
        color: '#ff3e00',
    };

    let environmentProperties = {
        void: true,
        color: '#ffefd6',
        grid: true,
    };
    $: backgroundColor = environmentProperties.void
        ? 'black'
        : environmentProperties.color;

    let planeGeometryProperties = {
        width: 4,
        length: 4,
        widthSegments: 150,
        lengthSegments: 150,
    };

    let planeMaterialProperties = {
        wireframe: true,
    };

    const updateTerrainColor = () => {
        uniforms.u_color.value = rgbFromHex(terrainProperties.color);
    };

    const regenerateTerrain = () => (terrainProperties = terrainProperties);

    const regenerateEnvironment = () =>
        (environmentProperties = environmentProperties);

    const regeneratePlaneGeometry = () =>
        (planeGeometryProperties = planeGeometryProperties);

    //
    // DAT.GUI SHIT
    //

    const gui = new dat.GUI();
    gui.close();

    const terrainFolder = gui.addFolder('Terrain');
    terrainFolder
        .addColor(terrainProperties, 'color')
        .onChange(updateTerrainColor);
    terrainFolder.add(terrainProperties, 'water').onChange(regenerateTerrain);
    terrainFolder
        .add(terrainProperties, 'waterHeight', -0.5, 0.5)
        .name('water height')
        .step(0.01)
        .onChange(regenerateTerrain);
    terrainFolder.add(uniforms.u_frequency, 'value', 0, 3).name('frequency');
    terrainFolder.add(uniforms.u_height, 'value', 0, 1).name('height');
    terrainFolder.add(uniforms.u_octaves, 'value', 1, 10).name('octaves');
    terrainFolder.add(uniforms.u_x_offset, 'value').name('x offset').step(0.1);
    terrainFolder.add(uniforms.u_z_offset, 'value').name('z offset').step(0.1);

    const environmentFolder = gui.addFolder('Environment');
    environmentFolder
        .add(environmentProperties, 'void')
        .onChange(regenerateEnvironment);
    environmentFolder
        .addColor(environmentProperties, 'color')
        .onChange(regenerateEnvironment);
    environmentFolder
        .add(environmentProperties, 'grid', 0, 1)
        .onChange(regenerateEnvironment);

    const geometryFolder = gui.addFolder('Geometry');
    geometryFolder
        .add(planeGeometryProperties, 'width', 1, 20)
        .onChange(regeneratePlaneGeometry);
    geometryFolder
        .add(planeGeometryProperties, 'length', 1, 20)
        .onChange(regeneratePlaneGeometry);
    geometryFolder
        .add(planeGeometryProperties, 'widthSegments', 10, 500)
        .onChange(regeneratePlaneGeometry);
    geometryFolder
        .add(planeGeometryProperties, 'lengthSegments', 10, 500)
        .onChange(regeneratePlaneGeometry);

    const materialFolder = gui.addFolder('Material');
    materialFolder.add(planeMaterialProperties, 'wireframe');

    const motionFolder = gui.addFolder('Motion');
    motionFolder.add(uniforms.u_speed, 'value', 0.0, 2.0).name('speed');
</script>

<main>
    <SC.Canvas
        antialias
        background={new THREE.Color(backgroundColor)}
        fog={new THREE.FogExp2(
            backgroundColor,
            environmentProperties.void ? 0 : 0.1
        )}
        shadows
    >
        <SC.Group position={[0, -1, 0]}>
            <SC.Mesh
                geometry={new THREE.PlaneGeometry(50, 50)}
                material={new THREE.MeshStandardMaterial({
                    color: environmentProperties.void ? 'black' : 'burlywood',
                })}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            />

            {#if environmentProperties.grid}
                <SC.Primitive
                    object={new THREE.GridHelper(
                        50,
                        50,
                        'papayawhip',
                        'papayawhip'
                    )}
                    position={[0, 0.001, 0]}
                />
            {/if}
        </SC.Group>

        {#if terrainProperties.water}
            <SC.Mesh
                geometry={new THREE.PlaneGeometry(
                    planeGeometryProperties.width,
                    planeGeometryProperties.length,
                    planeGeometryProperties.widthSegments,
                    planeGeometryProperties.lengthSegments
                )}
                material={new THREE.MeshBasicMaterial({ color: '#0e87cc' })}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, terrainProperties.waterHeight, 0]}
            />
        {/if}

        <SC.Mesh
            geometry={new THREE.PlaneGeometry(
                planeGeometryProperties.width,
                planeGeometryProperties.length,
                planeGeometryProperties.widthSegments,
                planeGeometryProperties.lengthSegments
            )}
            material={new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                wireframe: planeMaterialProperties.wireframe,
                side: THREE.DoubleSide,
            })}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
        />

        <SC.PerspectiveCamera position={[1, 1, 3]} />
        <SC.OrbitControls maxPolarAngle={Math.PI * 0.51} />
        <SC.AmbientLight intensity={0.6} />
        <SC.DirectionalLight
            intensity={0.6}
            position={[-2, 3, 2]}
            shadow={{ mapSize: [2048, 2048] }}
        />
    </SC.Canvas>
</main>
