do ->
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera 75, 1024/768, 0.1, 1000

  renderer = new THREE.WebGLRenderer()
  renderer.setSize 1024, 768

  document.body.appendChild renderer.domElement

  geometry = new THREE.CubeGeometry 1, 1, 1
  material = new THREE.MeshBasicMaterial
    color: 0x00ff00
  cube = new THREE.Mesh geometry, material

  scene.add cube

  camera.position.z = 5

  rotate= ->
    cube.rotation.x += 0.1
    cube.rotation.y += 0.1
    return

  render= ->
    requestAnimationFrame render
    rotate()
    renderer.render scene, camera
    return

  render()