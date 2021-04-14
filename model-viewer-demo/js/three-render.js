import {DecalGeometry} from '../node_modules/three/examples/jsm/geometries/DecalGeometry.js';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
<<<<<<< HEAD

let meshes = [];
let mug;
var mouse, raycaster, helper, decalMaterial;

var reader = new FileReader();
let imageSource = document.getElementById("image").files[0];


=======
const reader = new FileReader
const loader = new GLTFLoader
>>>>>>> 47173d61bf48c10ee707dc2b5690675c7025fea7
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf5f5f5 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
<<<<<<< HEAD
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load the Orbitcontroller
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();
        
// Load Light
var ambientLight = new THREE.AmbientLight( 0xdddddd );
scene.add( ambientLight );
        
var directionalLight = new THREE.DirectionalLight( 0xdddddd );
directionalLight.position.set( 0, 1, 1 ).normalize();
scene.add( directionalLight );

scene.background = new THREE.Color( 0xf5f5f5 );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
cube.material.opacity = 0.5;
scene.add( cube );
scene.remove( cube )
=======
let meshes = [];
let model;
let cameraLight;
>>>>>>> 47173d61bf48c10ee707dc2b5690675c7025fea7

init()
function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.getElementById("image").addEventListener("change", openImage)
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

<<<<<<< HEAD
function addDecalToMesh() {
    let decalImage;
    try {
        //decalImage = new THREE.TextureLoader().load(reader.readAsDataURL());
        //console.log(decalImage);
        let decalImage = fileToUrl(imageSource);
        console.log('string ' + decalImage)
    } catch( error ) {
        console.log('catch')
        decalImage = new THREE.TextureLoader().load('assets/dolan.png')
    }
    
=======
function generateDecalMaterial(imageName) {
    let decalImage = new THREE.TextureLoader().load(`assets/${imageName}`);
>>>>>>> 47173d61bf48c10ee707dc2b5690675c7025fea7
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

<<<<<<< HEAD
function onClick( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    let imageSource = document.getElementById("image").files[0];
    console.log(imageSource);
    console.log('event ' + json.parse(event))

    addDecalToMesh();

    raycaster.setFromCamera( mouse, camera );

    var mesh = meshes[1]
    var intersects = raycaster.intersectObject( mesh );
    
    if ( intersects.length > 0 ) {
    
        var n = intersects[ 0 ].face.normal.clone();
        n.transformDirection( mesh.matrixWorld );
        n.add( intersects[ 0 ].point );
    
        var position = intersects[ 0 ].point;
        position.x = 0
        position.y = 3.5
        position.z = 30
        

        var box = new THREE.Box3().setFromObject( mug );
        // console.log( box.min, box.max, box.getSize() );
        var sizeScale = 6
        var size = new THREE.Vector3( box.getSize().x, box.getSize().y - 5, box.getSize().z);
        
        var decalGeometry = new DecalGeometry( mesh, position, new THREE.Euler(0,0,0), size );
                    
        var decal = new THREE.Mesh( decalGeometry, decalMaterial );
        scene.add( decal );
    
    }
    
}

=======
    // Generate decal and add to model (scene)
    var decalGeometry = new DecalGeometry(mesh, position, new THREE.Euler(0,0,0), size);
    var decal = new THREE.Mesh(decalGeometry, decalMaterial);
    scene.add(decal);
}

function eulerRotateConvert(degrees) {
    let multiply = degrees / 90
    return (Math.PI / 2) * multiply 
}

>>>>>>> 47173d61bf48c10ee707dc2b5690675c7025fea7
function animate() {
	requestAnimationFrame( animate );
    // model.rotation.z += 0.001
    cameraLight.position.copy(camera.position);
    // scene.rotation.y += 0.001
	renderer.render( scene, camera );
}

<<<<<<< HEAD
animate();

//file upload
// function readURL(input) {
//     console.log('file upload working')
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();

//         reader.onload = function (img) {
//             document.getElementById('image').src =  img.target.result;
//         }

//         reader.readAsDataURL(input.files[0]);
//     }
// }

function openImg(event) {
    console.log(event.target.files[0])
    
    let imageSource = document.getElementById("image").files[0];
}

function fileToUrl(file) {
    let canvas = document.getElementById('test');
    let context = canvas.getContext("2d");

    context.drawImage(file, 0, 0);

    // const blob = new Blob(file);
    // let kaas = URL.createObjectURL(blob);

    // return kaas.href;
    //return URL.revokeObjectURL(blob);
}

=======
function openImage(event) {
    console.log("Image")
    console.log(event.target)
    let imageDecal = generateDecalMaterialFromImage(event.target.files[0])
    putDecalOnMesh(meshes[1], imageDecal)
}
>>>>>>> 47173d61bf48c10ee707dc2b5690675c7025fea7
