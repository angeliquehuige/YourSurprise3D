let mug;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load the Orbitcontroller
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();
        
// Load Light
var ambientLight = new THREE.AmbientLight( 0xcccccc );
scene.add( ambientLight );
        
var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 1, 1 ).normalize();
scene.add( directionalLight );		

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
cube.material.opacity = 0.5;
scene.add( cube );
scene.remove( cube )

import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader



loader.load( '../assets/67ekln6jmvyc.gltf', function ( gltf ) {
    mug = gltf.scene
    // Rotate model 270 degrees
    mug.rotation.x = (Math.PI / 2) * 3 
    mug.position.y = -30
    mug.scale.set(0.7,0.7,0.7) // scale here
	scene.add( mug );

}, undefined, function ( error ) {

	console.error( error );

} );


function animate() {
	requestAnimationFrame( animate );
    mug.rotation.z += 0.001
    console.log(mug.rotation.x)
	renderer.render( scene, camera );
}
animate();