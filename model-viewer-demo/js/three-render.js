import {DecalGeometry} from '../node_modules/three/examples/jsm/geometries/DecalGeometry.js';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let meshes = [];
let mug;
var mouse, raycaster, helper, decalMaterial;


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

const loader = new GLTFLoader


loader.load( './assets/67ekln6jmvyc.gltf', function ( gltf ) {
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
    

    // Functions for loading the images in the right order on the right place

    var { n, position, box, sizeScale, size, decal } = decalMid();

    var { n, position, box, sizeScale, size, decal } = decalMidLeft();

    var { n, position, box, sizeScale, size, decal } = decalMidRight();

    var { n, position, box, sizeScale, size, decal, decalGeometryLeft } = decalLeft();

    var { n, position, box, sizeScale, size, decal, decalGeometryLeft } = decalRight();
    

    function decalRight() {
        if (intersects.length > 0) {

            var n = intersects[0].face.normal.clone();
            n.transformDirection(mesh.matrixWorld);
            n.add(intersects[0].point);

            var position = intersects[0].point;
            position.x = 30;
            position.y = 3;
            position.z = 44;

            var box = new THREE.Box3().setFromObject(mug);
            console.log(box.min, box.max, box.getSize());
            var sizeScale = 6;
            // var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);
            var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

            var decalGeometryLeft = new DecalGeometry(mesh, position, new THREE.Euler(0, 1.6, 0), size);


            var decal = new THREE.Mesh(decalGeometryLeft, decalMaterial);
            scene.add(decal);

        }
        return { n, position, box, sizeScale, size, decal, decalGeometryLeft };
    }

    function decalMidRight() {
        if (intersects.length > 0) {

            var n = intersects[0].face.normal.clone();
            n.transformDirection(mesh.matrixWorld);
            n.add(intersects[0].point);

            var position = intersects[0].point;
            position.x = 10;
            position.y = 3;
            position.z = 39.87;

            var box = new THREE.Box3().setFromObject(mug);
            console.log(box.min, box.max, box.getSize());
            var sizeScale = 6;
            // var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);
            var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

            var decalGeometryMidRight = new DecalGeometry(mesh, position, new THREE.Euler(0, 1, 0), size);


            var decal = new THREE.Mesh(decalGeometryMidRight, decalMaterial);
            scene.add(decal);

        }
        return { n, position, box, sizeScale, size, decal };
    }

    function decalMid() {
        if (intersects.length > 0) {

            var n = intersects[0].face.normal.clone();
            n.transformDirection(mesh.matrixWorld);
            n.add(intersects[0].point);

            var position = intersects[0].point;
            position.x = 0;
            position.y = 3;
            position.z = 30;

            var box = new THREE.Box3().setFromObject(mug);
            console.log(box.min, box.max, box.getSize());
            var sizeScale = 6;
            // var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);
            var size = new THREE.Vector3(122, 60, 10); // Image resize (width, height, depth)

            var decalGeometryMid = new DecalGeometry(mesh, position, new THREE.Euler(0, 0, 0), size);


            var decal = new THREE.Mesh(decalGeometryMid, decalMaterial);
            scene.add(decal);

        }
        return { n, position, box, sizeScale, size, decal };
    }

    function decalMidLeft() {
        if (intersects.length > 0) {

            var n = intersects[0].face.normal.clone();
            n.transformDirection(mesh.matrixWorld);
            n.add(intersects[0].point);

            var position = intersects[0].point;
            position.x = -10;
            position.y = 3;
            position.z = 39.79;

            var box = new THREE.Box3().setFromObject(mug);
            console.log(box.min, box.max, box.getSize());
            var sizeScale = 6;
            // var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);
            var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

            var decalGeometryMidLeft = new DecalGeometry(mesh, position, new THREE.Euler(0, -1, 0), size);


            var decal = new THREE.Mesh(decalGeometryMidLeft, decalMaterial);
            scene.add(decal);

        }
        return { n, position, box, sizeScale, size, decal };
    }

    function decalLeft() {
        if (intersects.length > 0) {

            var n = intersects[0].face.normal.clone();
            n.transformDirection(mesh.matrixWorld);
            n.add(intersects[0].point);

            var position = intersects[0].point;
            position.x = -28;
            position.y = 3;
            position.z = 43.34;

            var box = new THREE.Box3().setFromObject(mug);
            console.log(box.min, box.max, box.getSize());
            var sizeScale = 6;
            // var size = new THREE.Vector3( box.getSize().x, box.getSize().y, box.getSize().z);
            var size = new THREE.Vector3(122, 60, 8); // Image resize (width, height, depth)

            var decalGeometryLeft = new DecalGeometry(mesh, position, new THREE.Euler(0, -1.6, 0), size);


            var decal = new THREE.Mesh(decalGeometryLeft, decalMaterial);
            scene.add(decal);

        }
        return { n, position, box, sizeScale, size, decal, decalGeometryLeft };
    }
}


function animate() {
	requestAnimationFrame( animate );
    // mug.rotation.z += 0.001
    // scene.rotation.y += 0.001
	renderer.render( scene, camera );
}
animate();