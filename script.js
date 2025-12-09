// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // light sky blue

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());

// Floor
const floorGeo = new THREE.PlaneGeometry(200, 200);
const floorMat = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Walls
function wall(x, z) {
  const geo = new THREE.BoxGeometry(10, 10, 10);
  const mat = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, 5, z);
  scene.add(mesh);
}

wall(20, 0);
wall(20, 20);
wall(0, 20);
wall(-20, 10);
wall(-10, -30);

// Cat
const catGeo = new THREE.BoxGeometry(4, 4, 4);
const catMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const cat = new THREE.Mesh(catGeo, catMat);
cat.position.set(
  (Math.random() - 0.5) * 80,
  2,
  (Math.random() - 0.5) * 80
);
scene.add(cat);

// Player
camera.position.set(0, 4, 50);

let keys = {};
document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

let velocityY = 0;
let isGrounded = false;

const walkSpeed = 0.15;
const sprintSpeed = 0.35;
const jumpForce = 0.45;
const gravity = 0.02;

function updateMovement() {
  let speed = keys["shift"] ? sprintSpeed : walkSpeed;

  if (controls.isLocked) {
    if (keys["w"]) controls.moveForward(speed);
    if (keys["s"]) controls.moveForward(-speed);
    if (keys["a"]) controls.moveRight(-speed);
    if (keys["d"]) controls.moveRight(speed);

    if (keys[" "] && isGrounded) {
      velocityY = jumpForce;
      isGrounded = false;
    }
  }

  camera.position.y += velocityY;
  velocityY -= gravity;

  if (camera.position.y <= 4) {
    camera.position.y = 4;
    velocityY = 0;
    isGrounded = true;
  }
}

function checkCatFound() {
  const dist = camera.position.distanceTo(cat.position);
  if (dist < 5) {
    document.getElementById("message").innerText = "YOU FOUND THE CAT! 🐱";
  }
}

function animate() {
  updateMovement();
  checkCatFound();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
