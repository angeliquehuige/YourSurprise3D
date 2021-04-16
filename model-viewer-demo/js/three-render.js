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
let model, modelXR;
let cameraLight;
let imgPath;

init()
function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "3DModel";
    document.body.appendChild(renderer.domElement);

    // Edit Image
    insertImage();

    document.getElementById("image").addEventListener("change", openImage)
    document.getElementById("activateXR").addEventListener("click", activateXR)
    // Load the Orbitcontroller
    loadControls(camera, renderer)

    // Load Light
    addAmbientLight()
    //addDirectionalLight(0,1,1)
    cameraLight = addDirectionalLight(0, 20, 100, 0xffffff, 0.5, 100000)

    // Load Model
    loadModel("67ekln6jmvyc.gltf")

    // Start animation
    animate();
}

/**
 * Insert new image and saves it to the local server
 */
function insertImage() {

    // div id of insert button
    let imageInput = document.getElementById('picture');

    // if statement checks if image is imported
    if (imageInput) {
        imageInput.addEventListener('change', () => {
            createImagePath(imageInput);
        });

        // saves the image to local storage
        reader.addEventListener("load", () => {
            localStorage.setItem("current-image", reader.result);
            putDecalOnMesh(meshes[1], generateDecalMaterial(localStorage.getItem("current-image")));
        });
    }
}

/**
 * 
 */
function createImagePath(imageInput) {
    if (imageInput.files && imageInput.files[0]) {
        
        // Generate imgPath
        reader.onload = (event) => {
            imgPath = event.currentTarget.result;
        };

        // Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
        reader.readAsDataURL(imageInput.files[0]);
    }
};

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
        modelXR = gltf.scene
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
    let decalImage = new THREE.TextureLoader().load(imageName);
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

function eulerRotateConvert(degrees) {
    let multiply = degrees / 90
    return (Math.PI / 2) * multiply 
}

function animate() {
    // model.rotation.z += 0.001
    cameraLight.position.copy(camera.position);
    // scene.rotation.y += 0.001
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

function openImage(event) {
    console.log("Image")
    console.log(event.target)
    let imageDecal = generateDecalMaterialFromImage(event.target.files[0])
    putDecalOnMesh(meshes[1], imageDecal)
}

// Functions for loading the images in the right order on the right place
function putDecalOnMesh(mesh, decalMaterial) {

    var { position, box, size, decalGeometry, decal } = decalObject(-30, 58.85, 90, -1.6);
    var { position, box, size, decalGeometry, decal } = decalObject(30, 58.85, 90, 1.6);
    var { position, box, size, decalGeometry, decal } = decalObject(0, 40, 28, 0);

    
    function decalObject(xPosition, zPosition, decalDepth, decalAngle) {
        var position = new THREE.Vector3(xPosition, 17, zPosition);
        // Get model sizes
        var box = new THREE.Box3().setFromObject(model);
        console.log(box.min, box.max, box.getSize());
        // Scale decal to model size
        var size = new THREE.Vector3(180, 89, decalDepth);

        // Generate decal and add to model (scene)
        var decalGeometry = new DecalGeometry(mesh, position, new THREE.Euler(0, decalAngle, 0), size);
        var decal = new THREE.Mesh(decalGeometry, decalMaterial);
        scene.add(decal);
        return { position, box, size, decalGeometry, decal };
    }
}
async function activateXR(event) {
    let removeCanvas = document.getElementById("3DModel");
    removeCanvas.parentNode.removeChild(removeCanvas);

    event.preventDefault()
    const sceneXR = new THREE.Scene();
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", {xrCompatible: true});
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    // Set up the WebGLRenderer, which handles rendering to the session's base layer.
    const rendererXR = new THREE.WebGLRenderer({
        alpha: true,
        preserveDrawingBuffer: true,
        canvas: canvas,
        context: gl
    });
    rendererXR.autoClear = false;
    rendererXR.xr.enabled = true;
    
    navigator.xr.isSessionSupported('immersive-ar').then(() => {
        console.log("Immersive AR is supported: ");
    }).catch((err) => {
        console.log("Immersive AR is not supported: " + err);
    });
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
  
    const material = new THREE.MeshBasicMaterial({color: 0xff0000})
    const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), material);
    cube.position.set(1, 1, 1);
    sceneXR.add(cube);



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
    session.addEventListener("select", (event) => {
        if (cube) {
          console.log("Click")
          const clone = cube.clone();
          clone.position.copy(reticle.position);
          sceneXR.add(clone);
        }
      });      

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
            rendererXR.setSize(viewport.width, viewport.height)

            // Use the view's transform matrix and projection matrix to configure the THREE.camera.
            camera.matrix.fromArray(view.transform.matrix)
            camera.projectionMatrix.fromArray(view.projectionMatrix);
            camera.updateMatrixWorld(true);

            const hitTestResults = frame.getHitTestResults(hitTestSource);
            console.log("before hitTest,", hitTestResults.length )
            if (hitTestResults.length > 0 && reticle) {
                const hitPose = hitTestResults[0].getPose(referenceSpace);
                reticle.visible = true;
                reticle.scale.set(0.3,0.3,0.3)
                reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
                reticle.updateMatrixWorld(true);
            }


            // Render the scene with THREE.WebGLRenderer.
            rendererXR.render(sceneXR, camera)
        }
    }
    session.requestAnimationFrame(onXRFrame);
}
