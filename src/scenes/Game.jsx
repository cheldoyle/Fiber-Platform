import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Fish } from '../components/Fish';

const Game = ({ onGameOver }) => {
    const [score, setScore] = useState(0);
    let enemies = [];
    let bullets = [];
    let frames = 0;
    let spawnRate = 200;

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.set(2, 5, 6);

        const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
        });

        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);



        class Box extends THREE.Mesh {

            constructor({
            width, 
            height, 
            depth, 
            color = '#00ff00', 
            velocity = {
                x: 0, 
                y: 0, 
                z: 0 },
            position = {
                x: 0,
                y: 0,
                z: 0
            }, 
            zAcceleration = false}) {
                super(
                    new THREE.BoxGeometry(width, height, depth), 
                    new THREE.MeshStandardMaterial({ color })
                );

                {/* Below sets the sides of the boxes for collision in game */}

                this.width = width
                this.height = height
                this.depth = depth

                this.position.set(position.x, position.y, position.z)

                this.right = this.position.x + this.width / 2
                this.left = this.position.x - this.width / 2

                this.bottom = this.position.y - this.height / 2
                this.top = this.position.y + this.height / 2

                this.front = this.position.z + this.depth / 2
                this.back = this.position.z - this.depth / 2

                this.velocity = velocity
                this.gravity = -.005

                this.zAcceleration = zAcceleration
            };

            updateSides() {
                this.right = this.position.x + this.width / 2
                this.left = this.position.x - this.width / 2
                this.bottom = this.position.y - this.height / 2
                this.top = this.position.y + this.height / 2
                this.front = this.position.z + this.depth / 2
                this.back = this.position.z - this.depth / 2
            };

            update(ground) {
                this.updateSides()

                if (this.zAcceleration) this.velocity.z += .0001

                this.position.x += this.velocity.x
                this.position.z += this.velocity.z

                this.applyGravity(ground)
            };

            applyGravity(ground) {
                this.velocity.y += this.gravity

                if (boxCollision({box1: this, box2: ground})) {
                    this.velocity.y *= .5
                    this.velocity.y = -this.velocity.y
                }
                else this.position.y += this.velocity.y
            };
        };

        class Bullet extends Box {
            constructor({ position }) {
                super({
                    width: 0.1,
                    height: 0.1,
                    depth: 0.1,
                    color: '#ffff00',
                    velocity: { x: 0, y: 0, z: -0.2 },
                    position: position
                });
            };

            update() {
                this.position.z += this.velocity.z
                this.updateSides()
            };
        };

        {/* Set collision, using two boxes -  */}

        function boxCollision({box1, box2}) {
            const xCollision = box1.right >= box2.left && box1.left <= box2.right
            const yCollision = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom
            const zCollision = box1.front >= box2.back && box1.back <= box2.front

            return xCollision && yCollision && zCollision
        };

        {/* cube is the player */}

        const cube = new Box({
            width: 1,
            height: 1,
            depth: 1,
            velocity: {
                x: 0,
                y: -.05,
                z: 0
            }
        });

        {/* castShadow and receiveShadow create shadows in game */}

        cube.castShadow = true
        scene.add(cube)

        {/* Design ground cubes will be on */}

        const ground = new Box({
            width: 10,
            height: .5,
            depth: 50,
            color: '#0369a1',
            position: {
                x: 0,
                y: -2,
                z: 0
            }
        });

        {/* Below sets light and shadows for 3D scene
            Keys sets all keys to be used, keeping inactive/false until pressed */}

        ground.receiveShadow = true;
        scene.add(ground);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.y = 3;
        light.position.z = 1;
        light.castShadow = true;
        scene.add(light);

        scene.add(new THREE.AmbientLight(0xffffff, .5));

        camera.position.z = 5;

        const keys = {
          a: { pressed: false },
          d: { pressed: false },
          s: { pressed: false },
          w: { pressed: false },
          e: { pressed: false }
        };

        window.addEventListener('keydown', (event) => {
          switch (event.code) {
            case 'KeyA':
              keys.a.pressed = true
              break
            case 'KeyD':
              keys.d.pressed = true
              break
            case 'KeyS':
              keys.s.pressed = true
              break
            case 'KeyW':
              keys.w.pressed = true
              break
            case 'KeyE':
              keys.e.pressed = true
              break
            case 'Space':
              cube.velocity.y = 0.1
              break
          };
        });

        {/* Avoid ongoing movement so nothing moves without keys being pressed */}
        window.addEventListener('keyup', (event) => {
          switch (event.code) {
            case 'KeyA':
              keys.a.pressed = false
              break
            case 'KeyD':
              keys.d.pressed = false
              break
            case 'KeyS':
              keys.s.pressed = false
              break
            case 'KeyW':
              keys.w.pressed = false
              break
            case 'KeyE':
              keys.e.pressed = false
              break
          };
        });

        function shoot() {
          const bullet = new Bullet({ position: { x: cube.position.x, y: cube.position.y, z: cube.position.z - 1 } })
          scene.add(bullet)
          bullets.push(bullet)
        };

        function animate() {
          const animationID = requestAnimationFrame(animate);
          renderer.render(scene, camera);

          {/* Handle cube movement for WASD */}

          cube.velocity.x = 0;
          cube.velocity.z = 0;
          if (keys.a.pressed) {
            cube.velocity.x = -.05;
          } else if (keys.d.pressed) {
            cube.velocity.x = .05;
          }
          if (keys.s.pressed) {
            cube.velocity.z = .05;
          } else if (keys.w.pressed) {
            cube.velocity.z = -.05;
          }

          cube.update(ground);

          if (keys.e.pressed) {
            shoot();
            keys.e.pressed = false;
          };

          {/* Checks bullet collisions and removes enemy, bullet at collision index
              setScore +10 every removal */}
          bullets.forEach((bullet, index) => {
            bullet.update();
            enemies.forEach((enemy, enemyIndex) => {
              if (boxCollision({ box1: bullet, box2: enemy })) {
                scene.remove(enemy);
                enemies.splice(enemyIndex, 1);

                setScore((prevScore) => prevScore + 10);

                scene.remove(bullet);
                bullets.splice(index, 1);
              };
            });
          });
          
          {/* Check for player - enemy collision -> Call onGameOver() and remove body from element if collision
              onGameOver handles post-death appearance - removeChild avoids duplicate games on restart */}
          enemies.forEach((enemy) => {
            enemy.update(ground);
            if (boxCollision({ box1: cube, box2: enemy })) {
              cancelAnimationFrame(animationID);
              onGameOver();
              document.body.removeChild(renderer.domElement);
            }
          });
          
          {/* Determine enemy spawn based on frame number and push new enemy to screen - Spawn rate (200 default)
            Higher frame number, lower spawn rate (20 min) for faster spawns */}
          if (frames % spawnRate === 0) {
            if (spawnRate > 20) spawnRate -= 20;
              const enemy = new Box({
                width: 1,
                height: 1,
                depth: 1,
                position: {
                  x: (Math.random() - 0.5) * 10,
                  y: 0,
                  z: -20,
                },
                velocity: {
                  x: 0,
                  y: 0,
                  z: 0.005,
                },
                color: 'red',
                zAcceleration: true,
              });
            enemy.castShadow = true;
            scene.add(enemy);
            enemies.push(enemy);
          };

        frames++;

      };

    animate();

  }, []);

  {/* Display Score */}
  return (
    <div>
      <div style={styles.score}>Score: {score}</div>
    </div>
  );
};

export default Game;

// Styles for the score display
const styles = {
  score: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
    zIndex: 1
  }
};
