import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';
import { paintings } from './paintings';
const BASE_URL = '/gallery-threejs/';

class Gallery {
  paintingDistanceThreshold = 5;
  keyboardEvents = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    ShiftLeft: false,
  };
  bufferLoaded = false;
  paintings = [];

  constructor() {
    this._initializeGallery();
    this._render();
  }

  _initializeGallery() {
    this._initializeClock();
    this._initializeScene();
    this._initializeCamera();
    this._initializeControls();
    this._initializeRenderer();
    this._initializeLights();
    this._initializeKeyboardEventListeners();
    this._initializePlayButtonEventListener();

    this._createGalleryShapes();
    this._clickHandler();
  }

  _createGalleryShapes() {
    this._createWalls();
    this._createFloor();
    this._createCeiling();
  }

  _initializePlayButtonEventListener() {
    const playButton = document.getElementById('play_button');
    playButton.addEventListener('click', () => {
      this.controls.lock();
    });
  }

  _render() {
    const delta = this.clock.getDelta();

    this._updateMovement(delta);
    this._handleShowPaintingInfo();
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this._render());
  }

  _handleShowPaintingInfo() {
    let paintingToShow;
    paintings.forEach((painting) => {
      const distanceToPainting = this.camera.position.distanceTo(
        painting.position
      );
      if (distanceToPainting < this.paintingDistanceThreshold)
        paintingToShow = painting;
    });

    if (paintingToShow) {
      this._displayPaintingInfo(paintingToShow.userData.info);
    } else {
      this._hidePaintingInfo();
    }
  }

  _createFloor() {
    const floorTexture = new THREE.TextureLoader().load(
      BASE_URL + 'images/WoodFloor040_1K-JPG_Color.jpg'
    );
    // Create Floor
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = Math.PI / 2;
    planeMesh.position.y = -10;

    this.scene.add(planeMesh);
  }

  _createWalls() {
    const wallTexture = new THREE.TextureLoader().load(
      BASE_URL + 'images/leather_white_diff_1k.jpg'
    );
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(1, 1);

    this.wallGroup = new THREE.Group();
    this.scene.add(this.wallGroup);

    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(50, 20, 0.001),
      new THREE.MeshBasicMaterial({ map: wallTexture })
    );
    frontWall.position.z = -25;

    this.wallGroup.add(frontWall);

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(50, 20, 0.001),
      new THREE.MeshBasicMaterial({ map: wallTexture })
    );
    backWall.position.z = 25;

    this.wallGroup.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(50, 20, 0.001),
      new THREE.MeshBasicMaterial({ map: wallTexture })
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -25;

    this.wallGroup.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(50, 20, 0.001),
      new THREE.MeshBasicMaterial({ map: wallTexture })
    );
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.x = 25;

    this.wallGroup.add(rightWall);

    for (let i = 0; i < this.wallGroup.children.length; i++) {
      this.wallGroup.children[i].BBox = new THREE.Box3();
      this.wallGroup.children[i].BBox.setFromObject(this.wallGroup.children[i]);
    }
  }

  _createCeiling() {
    const ceilingTexture = new THREE.TextureLoader().load(
      BASE_URL + 'images/OfficeCeiling005_1K-JPG_Color.jpg'
    );
    const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
    const ceilingMaterial = new THREE.MeshBasicMaterial({
      map: ceilingTexture,
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceilingMesh.position.y += 10;
    ceilingMesh.rotation.x = Math.PI / 2;

    this.scene.add(ceilingMesh);
  }

  addPaintings(paintings) {
    paintings.forEach((painting) => {
      const newPainting = this._createPainting(painting);
      newPainting.userData = painting.userData;
      this.paintings.push(newPainting);
      this.scene.add(newPainting);
    });
  }

  _createPainting(painting) {
    const TextureLoader = new THREE.TextureLoader();
    const paintingTexture = TextureLoader.load(painting.src);
    const paintingMaterial = new THREE.MeshBasicMaterial({
      map: paintingTexture,
    });
    const paintingGeometry = new THREE.PlaneGeometry(
      painting.width,
      painting.height
    );
    const newPainting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    newPainting.position.set(
      painting.position.x,
      painting.position.y,
      painting.position.z
    );
    newPainting.rotation.y = painting.rotation;

    newPainting.castShadow = true;
    newPainting.receiveShadow = true;

    return newPainting;
  }

  _checkCollision() {
    const playerBoundingBox = new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();

    this.camera.getWorldPosition(cameraWorldPosition);

    playerBoundingBox.setFromCenterAndSize(
      cameraWorldPosition,
      new THREE.Vector3(1, 1, 1)
    );

    for (let i = 0; i < this.wallGroup.children.length; i++) {
      const wall = this.wallGroup.children[i];
      if (playerBoundingBox.intersectsBox(wall.BBox)) return true;
    }

    return false;
  }

  _createBox() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  _updateMovement(delta) {
    let moveSpeed = 7 * delta;

    if (!this.controls.isLocked) return;

    const previousPosition = this.camera.position.clone();

    if (this.keyboardEvents.ShiftLeft) {
      moveSpeed *= 2;
    }

    if (this.keyboardEvents.ArrowRight || this.keyboardEvents.KeyD) {
      this.controls.moveRight(moveSpeed);
    }

    if (this.keyboardEvents.ArrowLeft || this.keyboardEvents.KeyA) {
      this.controls.moveRight(-moveSpeed);
    }

    if (this.keyboardEvents.ArrowUp || this.keyboardEvents.KeyW) {
      this.controls.moveForward(moveSpeed);
    }

    if (this.keyboardEvents.ArrowDown || this.keyboardEvents.KeyS) {
      this.controls.moveForward(-moveSpeed);
    }

    if (this._checkCollision()) {
      this.camera.position.copy(previousPosition);
    }
  }

  _initializeClock() {
    this.clock = new THREE.Clock();
  }
  _initializeScene() {
    this.scene = new THREE.Scene();
  }
  _initializeCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);
  }
  _initializeControls() {
    this.controls = new PointerLockControls(this.camera, document.body);
    this.controls.addEventListener('lock', () => this._hideMenu());
  }
  _initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(this.renderer.domElement);
  }
  _initializeLights() {
    const ambientLight = new THREE.AmbientLight(0x101010, 0.6);
    this.scene.add(ambientLight);

    const spotLight1 = this._createSpotLight(
      0,
      20,
      10,
      2,
      new THREE.Vector3(0, 2, 20)
    );

    const spotLight2 = this._createSpotLight(
      0,
      20,
      10,
      2,
      new THREE.Vector3(0, 2, 20)
    );

    const spotLight3 = this._createSpotLight(
      10,
      20,
      0,
      2,
      new THREE.Vector3(20, 2, 0)
    );

    const spotLight4 = this._createSpotLight(
      10,
      20,
      0,
      2,
      new THREE.Vector3(20, 2, 0)
    );

    this.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);
    this.scene.add(
      spotLight1.target,
      spotLight2.target,
      spotLight3.target,
      spotLight4.target
    );
  }
  _createSpotLight(x, y, z, intensity, targetPosition) {
    const spotLight = new THREE.SpotLight(0xffffff, intensity);
    spotLight.position.set(x, y, z);
    spotLight.target.position.copy(targetPosition);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 3;
    spotLight.penumbra = 1;
    spotLight.decay = 1.5;
    spotLight.distance = 40;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    return spotLight;
  }
  _initializeKeyboardEventListeners() {
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.code in this.keyboardEvents) {
          this.keyboardEvents[e.code] = true;
        }

        if (e.code === 'Space' && this.controls.isLocked) {
          this.controls.unlock();
        } else if (e.code === 'Space' && !this.controls.isLocked) {
          this.controls.lock();
        }

        if (e.code === 'Enter' && !this.controls.isLocked) {
          this.controls.lock();
        }

        if (e.code === 'KeyM') {
          this.controls.unlock();
          this._showMenu();
        }
      },
      false
    );
    document.addEventListener(
      'keyup',
      (e) => {
        if (e.code in this.keyboardEvents) {
          this.keyboardEvents[e.code] = false;
        }
      },
      false
    );
  }

  _hideMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = 'none';
  }
  _showMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = 'block';
  }

  _displayPaintingInfo(info) {
    const infoElement = document.getElementById('painting-info');
    infoElement.innerHTML = `
    <h3>${info.title}</h3>
    <p>Artist: ${info.artist}</p>
    <p>Description: ${info.description}</p>
    <p>Year: ${info.year}</p>
  `;
    infoElement.classList.add('show');
  }
  _hidePaintingInfo() {
    const infoElement = document.getElementById('painting-info');
    infoElement.classList.remove('show');
  }

  addAudio(src) {
    const listener = new THREE.AudioListener();

    this.camera.add(listener);

    sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(src, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      this.bufferLoaded = true;
    });
  }

  _startAudio() {
    if (sound && this.bufferLoaded) {
      sound.play();
    }
  }
  _stopAudio() {
    if (sound) {
      sound.pause();
    }
  }

  _clickHandler() {
    this.mouse = new THREE.Vector2();
    this.rayCaster = new THREE.Raycaster();

    this.renderer.domElement.addEventListener('click', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this._onClick();
    });
  }
  _onClick() {
    console.log('handleClick');
    this.rayCaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.paintings);

    if (intersects.length > 0) {
      const clickedPainting = intersects[0].object;
      window.open(clickedPainting.userData.info.link, '_blank');
    }
  }
}

const gallery = new Gallery();
gallery.addPaintings(paintings);
