import {DecalGeometry} from '../node_modules/three/examples/jsm/geometries/DecalGeometry.js';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let meshes = [];
let mug;
var mouse, raycaster, helper, decalMaterial;

var reader = new FileReader();
let imageSource = document.getElementById("image").files[0];


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
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

const loader = new GLTFLoader


loader.load( 'assets/67ekln6jmvyc.gltf', function ( gltf ) {
    mug = gltf.scene
    mug.traverse( function ( child ) {
        if ( child.isMesh ) {
            console.log("MESH FOUND")
            meshes.push(child);
        }
    } );
    // Rotate model 270 degrees
    mug.renderOrder = 0
    mug.rotation.x = (Math.PI / 2) * 3 
    mug.rotation.z = (Math.PI / 2) * 2
    mug.position.y = -30
    mug.scale.set(0.7,0.7,0.7) // scale here
	scene.add( mug );
    addDecalToMesh()


    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    helper = new THREE.Object3D();
    decalMaterial = addDecalToMesh()
    document.addEventListener( 'click', onClick );  

}, undefined, function ( error ) {

	console.error( error );

} );


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
    
    let decalMaterial = new THREE.MeshPhongMaterial({
        map: decalImage,
        depthWrite: false, 
        polygonOffset: true, 
        polygonOffsetFactor: - 4, 
        renderOrder: 10,
    });
    return decalMaterial
}



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

function animate() {
	requestAnimationFrame( animate );
    // mug.rotation.z += 0.001
    // scene.rotation.y += 0.001
	renderer.render( scene, camera );
}

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

