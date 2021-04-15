
import {
    AmbientLight,
    Box3, Color,
    DirectionalLight, Euler,
    Mesh,
    MeshPhongMaterial, PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry";

const reader = new FileReader()
const loader = new GLTFLoader
const scene = new Scene();
scene.background = new Color( 0xf5f5f5);
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer();
let meshes = [];
let model;
let cameraLight;
let imgPath = 'assets/testImage.png';


export function init() {
    let x = document.createElement("INPUT");
    x.setAttribute("type", "file");
    x.setAttribute("accept","image/*")
    document.body.appendChild(x);

    x.addEventListener('input', (e) => {
        let file = new FileReader();
        reader.readAsDataURL(new Blob(e.input))
        console.log(e.input);
        console.log(e)
    })

    renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    document.body.appendChild(renderer.domElement);

    //test rob
    let imageInput = document.getElementById('picture');

    if(imageInput){
        imageInput.addEventListener('change', () => {
            previewImage(imageInput);
        });
    }
    const previewImage = (imageInput) => {
        if (imageInput.files && imageInput.files[0]){
            const reader = new FileReader();
            reader.onload = (event) => {
                imgPath = event.currentTarget.result;
                console.log();
            }

            let file = document.createElement('img')
            file.setAttribute("src", imgPath);
            document.currentScript.appendChild(file)
        }
    }
    //end test rob

    // Load the Orbitcontroller
    loadControls(camera, renderer)

    // Load Light
    addAmbientLight()
    addDirectionalLight(0,1,1)
    cameraLight = addDirectionalLight(0, 20, 100, 0xffffff, 0.5, 100000)

    // Load Model
    loadModel("67ekln6jmvyc.gltf")

    // Start animation
    animate();
}

// Load orbitcontroller
function loadControls(camera, renderer) {
    camera.position.set( 0, 20, 100 );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
}

function addAmbientLight(color = 0xffffff) {
    const ambientLight = new AmbientLight(color);
    scene.add(ambientLight);

    return ambientLight
}

function addDirectionalLight(x,y,z, color = 0xffffff, intensity = 1.0, range = 10){
    let directionalLight = new DirectionalLight(color, intensity);
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

        putDecalOnMesh(meshes[1], generateDecalMaterial(imgPath))
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function generateDecalMaterial(imageName) {
    let decalImage = new TextureLoader().load(imageName);

    return new MeshPhongMaterial({
        map: decalImage,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
    })
}

function generateDecalMaterialFromImage(image) {
    let decalImage = new TextureLoader().load(image);
    return new MeshPhongMaterial({
        map: decalImage,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
    })
}

// function for putting a decal material on a mesh
function putDecalOnMesh(mesh, decalMaterial) {
    let position = new Vector3( 0, 10, 0 );

    // Get model sizes
    const box = new Box3().setFromObject(model);
    console.log(box.min, box.max, box.getSize());
    // Scale decal to model size
    const size = new Vector3(box.getSize(undefined).x, box.getSize(undefined).y, box.getSize(undefined).z);

    // Generate decal and add to model (scene)
    const decalGeometry = new DecalGeometry(mesh, position, new Euler(0, 0, 0), size);
    const decal = new Mesh(decalGeometry, decalMaterial);
    scene.add(decal);
}

function eulerRotateConvert(degrees) {
    const multiply = degrees / 90
    return (Math.PI / 2) * multiply 
}

function animate() {
    // model.rotation.z += 0.001
    cameraLight.position.copy(camera.position);
    // scene.rotation.y += 0.001
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

