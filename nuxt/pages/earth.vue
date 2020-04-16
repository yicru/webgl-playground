<template>
  <section>
    <canvas ref="canvas" />
  </section>
</template>

<script>
import * as THREE from 'three'

export default {
  mounted() {
    const width = window.innerWidth
    const height = window.innerHeight
    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, width / height)
    camera.position.set(0, 0, +1000)

    const geometry = new THREE.SphereGeometry(300, 30, 30)
    const loader = new THREE.TextureLoader()
    const texture = loader.load('/earthmap1k.jpg')
    const material = new THREE.MeshStandardMaterial({ map: texture })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const directionalLight = new THREE.DirectionalLight('0xffffff')
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    tick()

    function tick() {
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }
  }
}
</script>
