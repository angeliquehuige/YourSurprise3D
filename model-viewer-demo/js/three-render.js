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

// function for putting a decal material on a mesh
function putDecalOnMesh(mesh, decalMaterial) {

    decalLoad();
    // var position = new THREE.Vector3( 0, 0, 0 );

    // // Get model sizes
    // var box = new THREE.Box3().setFromObject(model);
    // console.log(box.min, box.max, box.getSize());
    // // Scale decal to model size
    // var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);

    // // Generate decal and add to model (scene)
    // var decalGeometry = new DecalGeometry(mesh, position, new THREE.Euler(0,0,0), size);
    // var decal = new THREE.Mesh(decalGeometry, decalMaterial);
    // scene.add(decal);
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

// Functions for loading the images in the right order on the right place
function decalLoad() {
    // var { n, position, box, sizeScale, size, decal } = decalMid();
    // var { n, position, box, sizeScale, size, decal } = decalMidLeft();
    // var { n, position, box, sizeScale, size, decal } = decalMidRight();
    // var { n, position, box, sizeScale, size, decal } = decalLeft();
    // var { n, position, box, sizeScale, size, decal } = decalRight();

    var { n, position, box, sizeScale, size, decal } = decalObject(0, 30, 10, 0); //Mid
    var { n, position, box, sizeScale, size, decal } = decalObject(-10, 39.79, 8, -1); //MidLeft
    var { n, position, box, sizeScale, size, decal } = decalObject(10, 39.87, 8, 1); //MidRight
    var { n, position, box, sizeScale, size, decal } = decalObject(-28, 43.34, 8, -1.6); //Left
    var { n, position, box, sizeScale, size, decal } = decalObject(30, 44, 8, 1.6); //Right

}

function decalObject(xPosition, zPosition, imageDepth, decalAngle) {
    if (intersects.length > 0) {

        // var n = intersects[0].face.normal.clone();
        // n.transformDirection(mesh.matrixWorld);
        // n.add(intersects[0].point);

        var position = intersects[0].point;
        // Position of the image
        position.x = xPosition;
        position.y = 3;
        position.z = zPosition;

        var box = new THREE.Box3().setFromObject(mug);
        console.log(box.min, box.max, box.getSize());
        var sizeScale = 6;
        // Image resize (width, height, depth)
        var size = new THREE.Vector3(122, 60, imageDepth); 

        // Angle of where the image is displayed on the object
        var decalGeometry = new DecalGeometry(mesh, position, new THREE.Euler(0, decalAngle, 0), size);


        var decal = new THREE.Mesh(decalGeometry, decalMaterial);
        scene.add(decal);

    }
    return { n, position, box, sizeScale, size, decal };
}

function decalRight() {
    if (intersects.length > 0) {

        // var n = intersects[0].face.normal.clone();
        // n.transformDirection(mesh.matrixWorld);
        // n.add(intersects[0].point);

        var position = intersects[0].point;
        // Position of the image
        position.x = 30;
        position.y = 3;
        position.z = 44;

        var box = new THREE.Box3().setFromObject(mug);
        console.log(box.min, box.max, box.getSize());
        var sizeScale = 6;
        // Image resize (width, height, depth)
        var size = new THREE.Vector3(122, 60, 8); 

        // Angle of where the image is displayed on the object
        var decalGeometryLeft = new DecalGeometry(mesh, position, new THREE.Euler(0, 1.6, 0), size);


        var decal = new THREE.Mesh(decalGeometryLeft, decalMaterial);
        scene.add(decal);

    }
    return { n, position, box, sizeScale, size, decal };
}

function decalMidRight() {
    if (intersects.length > 0) {

        // var n = intersects[0].face.normal.clone();
        // n.transformDirection(mesh.matrixWorld);
        // n.add(intersects[0].point);

        var position = intersects[0].point;
        position.x = 10;
        position.y = 3;
        position.z = 39.87;

        var box = new THREE.Box3().setFromObject(mug);
        console.log(box.min, box.max, box.getSize());
        var sizeScale = 6;
        var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

        var decalGeometryMidRight = new DecalGeometry(mesh, position, new THREE.Euler(0, 1, 0), size);


        var decal = new THREE.Mesh(decalGeometryMidRight, decalMaterial);
        scene.add(decal);

    }
    return { n, position, box, sizeScale, size, decal };
}

function decalMid() {
    if (intersects.length > 0) {

        // var n = intersects[0].face.normal.clone();
        // n.transformDirection(mesh.matrixWorld);
        // n.add(intersects[0].point);

        var position = intersects[0].point;
        position.x = 0;
        position.y = 3;
        position.z = 30;

        var box = new THREE.Box3().setFromObject(mug);
        console.log(box.min, box.max, box.getSize());
        var sizeScale = 6;
        var size = new THREE.Vector3(122, 60, 10); // Image resize (width, height, depth)

        var decalGeometryMid = new DecalGeometry(mesh, position, new THREE.Euler(0, 0, 0), size);


        var decal = new THREE.Mesh(decalGeometryMid, decalMaterial);
        scene.add(decal);

    }
    return { n, position, box, sizeScale, size, decal };
}

function decalMidLeft() {
    if (intersects.length > 0) {

        // var n = intersects[0].face.normal.clone();
        // n.transformDirection(mesh.matrixWorld);
        // n.add(intersects[0].point);

        var position = intersects[0].point;
        position.x = -10;
        position.y = 3;
        position.z = 39.79;

        var box = new THREE.Box3().setFromObject(mug);
        console.log(box.min, box.max, box.getSize());
        var sizeScale = 6;
        var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

        var decalGeometryMidLeft = new DecalGeometry(mesh, position, new THREE.Euler(0, -1, 0), size);


        var decal = new THREE.Mesh(decalGeometryMidLeft, decalMaterial);
        scene.add(decal);

    }
    return { n, position, box, sizeScale, size, decal };
}

function decalLeft() {
    if (intersects.length > 0) {

        // var n = intersects[0].face.normal.clone();
        // n.transformDirection(mesh.matrixWorld);
        // n.add(intersects[0].point);

        var position = intersects[0].point;
        position.x = -28;
        position.y = 3;
        position.z = 43.34;

        var box = new THREE.Box3().setFromObject(mug);
        console.log(box.min, box.max, box.getSize());
        var sizeScale = 6;
        var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

        var decalGeometryLeft = new DecalGeometry(mesh, position, new THREE.Euler(0, -1.6, 0), size);


        var decal = new THREE.Mesh(decalGeometryLeft, decalMaterial);
        scene.add(decal);

    }
    return { n, position, box, sizeScale, size, decal };
}