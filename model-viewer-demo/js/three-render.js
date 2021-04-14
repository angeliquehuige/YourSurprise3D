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
    document.body.appendChild(renderer.domElement);

    document.getElementById("image").addEventListener("change", openImage)
    // Load the Orbitcontroller
    loadControls(camera, renderer)

    // Load Light
    addAmbientLight()
    addDirectionalLight(0,1,1)
    cameraLight = addDirectionalLight(0, 20, 100, 0xffffff, 1.0, 100000)

    // Load Model
    loadModel("67ekln6jmvyc.gltf")

    // Start animation
    animate();
}

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

        putDecalOnMesh(meshes[1], generateDecalMaterial("testImage.png"))
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


function putDecalOnMesh(mesh, decalMaterial) {
    var position = new THREE.Vector3( 0, 0, 0 );

    // Get model sizes
    var box = new THREE.Box3().setFromObject(model);
    console.log(box.min, box.max, box.getSize());
    // Scale decal to model size
    var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);

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