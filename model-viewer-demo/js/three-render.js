import {DecalGeometry} from '../node_modules/three/examples/jsm/geometries/DecalGeometry.js';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';


let meshes = [];
let mug;
var mouse, raycaster, helper, decalMaterial;


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf5f5f5 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load the Orbitcontroller
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();
        
// Load Light
var ambientLight = new THREE.AmbientLight( 0xcccccc );
scene.add( ambientLight );

let light = new THREE.DirectionalLight(0xffffff, 1.0, 100000);
light.position.set( 0, 20, 100);
scene.add(light);


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
    console.log(meshes)
    let decalImage = new THREE.TextureLoader().load('assets/testImage.png');
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
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    var mesh = meshes[1]
    var intersects = raycaster.intersectObject( mesh );
    
    if ( intersects.length > 0 ) {
    
        var n = intersects[ 0 ].face.normal.clone();
        n.transformDirection( mesh.matrixWorld );
        n.add( intersects[ 0 ].point );
    
        var position = intersects[ 0 ].point;
        position.x = 0
        position.y = 5
        position.z = 30

        var box = new THREE.Box3().setFromObject( mug );
        console.log( box.min, box.max, box.getSize() );
        var sizeScale = 6
        var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);
        
        var decalGeometry = new DecalGeometry( mesh, position, new THREE.Euler(0,0,0), size );
                    
        var decal = new THREE.Mesh( decalGeometry, decalMaterial );
        scene.add( decal );
    
    }
    
}

function animate() {
	requestAnimationFrame( animate );
    //mug.rotation.z += 0.001
    light.position.copy(camera.position);
    //scene.rotation.y += 0.001;
	renderer.render( scene, camera );
}
animate();