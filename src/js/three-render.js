/**
 * import scripts
 * */

import {
    AmbientLight,
    Box3, Color,
    DirectionalLight,
    Euler,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry";
import Three from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

/**
 * # insertImage()
 * @description Insert new image and saves it to the local server
 */
function insertImage() {
    // div id of insert button
    const imageInput = document.getElementById('picture');
    // if statement checks if image is imported
    if (imageInput) {
        imageInput.addEventListener('change', () => createImagePath(imageInput));
        // saves the image to local storage
        reader.addEventListener("load", () => {
            localStorage.setItem("current-image", reader.result);
            putDecalOnMesh(meshes[1], generateDecalMaterial(localStorage.getItem("current-image")));
        });
    }
}

/**
 * # createImagePath(imageInput)
 *
 * @description Insert new image and saves it to the local server
 * @param imageInput
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
}

/**
 * # Variables
 */
const camera = new WebGLRenderer( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader;
const reader = new FileReader;
const renderer = new WebGLRenderer;
const scene = new Scene;
scene.background = new Color(0xf5f5f5);
let cameraLight;
let imgPath;
let meshes = [];
let model;


/**
 * # addAmbientLight(color)
 *
 * @param color     {Number}
 *
 */
function addAmbientLight(color = 0xffffff) {
    const ambientLight = new AmbientLight(color);
    scene.add(ambientLight);
    return ambientLight
}

/**
 * # addDirectionalLight(degrees)
 * @param x             {number}
 * @param y             {number}
 * @param z             {number}
 * @param color         {number}
 * @param intensity     {number}
 * @param range         {number}
 *
 * @return {DirectionalLight}
 */
function addDirectionalLight(x,y,z, color = 0xffffff, intensity = 1.0, range = 10){
    const directionalLight = new DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z).normalize();
    scene.add(directionalLight);

    return directionalLight
}

/**
 * # animate()
 */
function animate() {
    cameraLight.position.copy(camera.position);
	renderer.render( scene, camera );

    requestAnimationFrame( animate );
}

/**
 * # eulerRotateConvert(degrees)
 * @param  degrees      {number}
 *
 * @return number
 */
function eulerRotateConvert(degrees) {
    const multiply = degrees / 90
    return (Math.PI / 2) * multiply
}

/**
 * # generateDecalMaterial(imageName)
 * @param imageName             {string}
 *
 * @return {MeshPhongMaterial}
 */
function generateDecalMaterial(imageName) {
    const decalImage = TextureLoader.load(imageName);
    return new MeshPhongMaterial({
        map: decalImage,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
    })
}

/**
 * # init()
 *
 */
export function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Edit Image
    insertImage();

    // Load the Orbitcontroller
    loadControls(camera, renderer.domElement)

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
 * # loadControls(camera, renderer)
 * @param camera        {PerspectiveCamera|any}
 * @param renderer      {any}
 */
function loadControls(camera, renderer) {
    // let controls = new OrbitControls(camera, renderer).

    camera.position.set( 0, 20, 100 );
    controls.update();
}

/**
 * # loadModel(modelName)
 * @param modelName        {string}
 *
 */
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
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

/**
 * # putDecalOnMesh(mesh, decalmaterial)
 * Functions for loading the images in the right order on the right place
 *
 * @param mesh        {any}
 * @param decalMaterial {any}
 */
function putDecalOnMesh(mesh, decalMaterial) {
    const position = new Vector3(0, 10, 0);

    // Get model sizes
    const box = new Box3().setFromObject(model);
    console.log(box.min, box.max, box.getSize(undefined));
    // Scale decal to model size
    const size = new Vector3(box.getSize(undefined).x, box.getSize(undefined).y, box.getSize(undefined).z);

    // Generate decal and add to model (scene)
    const decalGeometry = new DecalGeometry(mesh, position, new Euler(0, 0, 0), size);
    const decal = new Mesh(decalGeometry, decalMaterial);
    scene.add(decal);
}


