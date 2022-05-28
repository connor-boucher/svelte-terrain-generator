<script lang="ts">
    import * as THREE from 'three';
    import * as SC from 'svelte-cubed';
    import * as dat from 'dat.gui';

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
        u_x_offset: { type: 'f', value: 0.0 },
        u_z_offset: { type: 'f', value: 0.0 },
        u_speed: { type: 'f', value: 0.5 },
        u_time: { type: 'f', value: 0.0 },
    };

    const clock = new THREE.Clock();

    SC.onFrame(() => {
        uniforms.u_time.value = clock.getElapsedTime();
    });

    //
    // PROPERTIES SHIT
    //

    let environmentProperties = {
        background: false,
        grid: true,
    };

    let planeGeometryProperties = {
        width: 5,
        length: 5,
        widthSegments: 250,
        lengthSegments: 250,
    };

    let planeMaterialProperties = {
        wireframe: true,
    };

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
    terrainFolder.add(uniforms.u_frequency, 'value', 0, 3).name('frequency');
    terrainFolder.add(uniforms.u_height, 'value', 0, 1).name('height');
    terrainFolder.add(uniforms.u_octaves, 'value', 1, 10).name('octaves');
    terrainFolder.add(uniforms.u_x_offset, 'value').name('x offset').step(0.1);
    terrainFolder.add(uniforms.u_z_offset, 'value').name('z offset').step(0.1);

    const environmentFolder = gui.addFolder('Environment');
    environmentFolder
        .add(environmentProperties, 'background')
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
        background={environmentProperties.background
            ? new THREE.Color('papayawhip')
            : new THREE.Color('black')}
        fog={new THREE.FogExp2(
            'papayawhip',
            environmentProperties.background ? 0.1 : 0
        )}
        shadows
    >
        <SC.Group position={[0, -1, 0]}>
            <SC.Mesh
                geometry={new THREE.PlaneGeometry(50, 50)}
                material={new THREE.MeshStandardMaterial({
                    color: environmentProperties.background
                        ? 'burlywood'
                        : 'black',
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
