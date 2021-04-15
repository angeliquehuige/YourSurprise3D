import {DecalGeometry} from '../node_modules/three/examples/jsm/geometries/DecalGeometry.js';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const reader = new FileReader
const loader = new GLTFLoader
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf5f5f5 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
let meshes = [];
let model;
let cameraLight;

init()
function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "3DModel";
    document.body.appendChild(renderer.domElement);

    document.getElementById("image").addEventListener("change", openImage)
    document.getElementById("activateXR").addEventListener("click", activateXR)
    // Load the Orbitcontroller
    loadControls(camera, renderer)

    // Load Light
    addAmbientLight()
    cameraLight = addDirectionalLight(0, 20, 100, 0xffffff, 0.6, 100000)

    // Load Model
    loadModel("67ekln6jmvyc.gltf")

    // Start animation
    animate();
}

// Load orbitcontroller
function loadControls(camera, renderer) {
    const controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( 0, 20, 100 );
    controls.update();
}

function addAmbientLight(color = 0xffffff) {
    var ambientLight = new THREE.AmbientLight(color);
    scene.add(ambientLight);
    return ambientLight
}

function addDirectionalLight(x,y,z, color = 0xffffff, intensity = 1.0, range = 10){
    var directionalLight = new THREE.DirectionalLight(color, intensity, range);
    directionalLight.position.set(x, y, z).normalize();
    scene.add(directionalLight);
    return directionalLight
}

// Load a model, get meshes, and put image on model mesh
function loadModel(modelName) {
    loader.load(`assets/${modelName}`, function ( gltf ) {
        model = gltf.scene
        model.traverse( function ( child ) {
            if ( child.isMesh ) {
                console.log("MESH FOUND for model: ", modelName)
                meshes.push(child);
            }
        } );
        // Rotate model
        model.rotation.x = eulerRotateConvert(270)
        model.rotation.z = eulerRotateConvert(180)
        model.position.y = -30
        scene.add( model );

        putDecalOnMesh(meshes[1], generateDecalMaterial("from-website.png"))
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function generateDecalMaterial(imageName) {
    let decalImage = new THREE.TextureLoader().load(`assets/${imageName}`);
    let decalMaterial = new THREE.MeshPhongMaterial({
        map: decalImage,
        depthWrite: false, 
        polygonOffset: true, 
        polygonOffsetFactor: - 4, 
    });
    return decalMaterial
}

function generateDecalMaterialFromImage(image) {
    let decalImage = new THREE.TextureLoader().load(reader.readAsDataURL(image));
    let decalMaterial = new THREE.MeshPhongMaterial({
        map: decalImage,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: - 4,
    });
    return decalMaterial
}

// function for putting a decal material on a mesh
function putDecalOnMesh(mesh, decalMaterial) {
    var position = new THREE.Vector3( 0, 17, 0 );

    // Get model sizes
    var box = new THREE.Box3().setFromObject(model);
    console.log(box.min, box.max, box.getSize());
    // Scale decal to model size
    var size = new THREE.Vector3( box.getSize().x, box.getSize().y - 3, box.getSize().z);

    // Generate decal and add to model (scene)
    var decalGeometry = new DecalGeometry(mesh, position, new THREE.Euler(0,0,0), size);
    var decal = new THREE.Mesh(decalGeometry, decalMaterial);
    scene.add(decal);
}

function eulerRotateConvert(degrees) {
    let multiply = degrees / 90
    return (Math.PI / 2) * multiply 
}

function animate() {
	requestAnimationFrame( animate );
    // model.rotation.z += 0.001
    cameraLight.position.copy(camera.position);
    // scene.rotation.y += 0.001
	renderer.render( scene, camera );
}

function openImage(event) {
    console.log("Image")
    console.log(event.target)
    let imageDecal = generateDecalMaterialFromImage(event.target.files[0])
    putDecalOnMesh(meshes[1], imageDecal)
}

async function activateXR(event) {
    let removeCanvas = document.getElementById("3DModel");
    removeCanvas.parentNode.removeChild(removeCanvas);

    event.preventDefault()
    const sceneXR = new THREE.Scene();
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", {xrCompatible: true});

    navigator.xr.supportsSession('immersive-vr').then(() => {
        console.log("Immersive VR is supported: ");
    }).catch((err) => {
        console.log("Immersive VR is not supported: " + err);
    });

    // Set up the WebGLRenderer, which handles rendering to the session's base layer.
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        preserveDrawingBuffer: true,
        canvas: canvas,
        context: gl
    });
    renderer.autoClear = false;
    renderer.xr.enabled = true;
    
    // The API directly updates the camera matrices.
    // Disable matrix auto updates so three.js doesn't attempt
    // to handle the matrices independently.
    const camera = new THREE.PerspectiveCamera();
    camera.matrixAutoUpdate = false;
  
    let reticle;
    loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", function(gltf) {
      reticle = gltf.scene;
      reticle.visible = false;
      sceneXR.add(reticle);
    })

    const session = await navigator.xr.requestSession("immersive-ar", {requiredFeatures: ['hit-test']});
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, gl)
    });

    const referenceSpace = await session.requestReferenceSpace("local");

    // Create another XRReferenceSpace that has the viewer as the origin.
    const viewerSpace = await session.requestReferenceSpace('viewer');
    // Perform hit testing using the viewer as origin.
    const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    // Place model on reticle location
    // session.addEventListener("select", (event) => {
    //     if (model) {
    //       const clone = model.clone();
    //       sceneXR.add(clone);
    //       clone.position.copy(reticle.position);
    //     }
    //   });      

    // Create a render loop that allows us to draw on the AR view.
    const onXRFrame = (time, frame) => {
        // Queue up the next draw request.
        session.requestAnimationFrame(onXRFrame);

        // Bind the graphics framebuffer to the baseLayer's framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)

        // Retrieve the pose of the device.
        // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
        const pose = frame.getViewerPose(referenceSpace);
        if (pose) {
            // In mobile AR, we only have one view.
            const view = pose.views[0];

            const viewport = session.renderState.baseLayer.getViewport(view);
            renderer.setSize(viewport.width, viewport.height)

            // Use the view's transform matrix and projection matrix to configure the THREE.camera.
            camera.matrix.fromArray(view.transform.matrix)
            camera.projectionMatrix.fromArray(view.projectionMatrix);
            camera.updateMatrixWorld(true);

            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length > 0 && reticle) {
                const hitPose = hitTestResults[0].getPose(referenceSpace);
                reticle.visible = true;
                reticle.scale.set(0.3,0.3,0.3)
                reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
                reticle.updateMatrixWorld(true);
            }


            // Render the scene with THREE.WebGLRenderer.
            renderer.render(sceneXR, camera)
        }
    }
    session.requestAnimationFrame(onXRFrame);
}