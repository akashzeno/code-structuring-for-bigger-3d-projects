import * as THREE from "three";
import Camera from "./Camera.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import sources from "./sources.js";
import Debug from "./Utils/Debug.js";
let instance = null;

export default class Experience {
	constructor(canvas) {
		if (instance) {
			return instance;
		}
		instance = this;

		// Global Access
		window.experience = this;
		// Options
		this.canvas = canvas;
		// Setup
		this.debug = new Debug();
		this.sizes = new Sizes();
		this.time = new Time();
		this.scene = new THREE.Scene();
		this.resources = new Resources(sources);
		this.camera = new Camera();
		this.renderer = new Renderer();
		this.world = new World();
		// Size Resize Event
		this.sizes.on("resize", () => {
			this.resize();
		});

		// Time Tick Event
		this.time.on("tick", () => {
			this.update();
		});
	}
	resize() {
		this.camera.resize();
		this.renderer.resize();
	}
	update() {
		this.camera.update();
		this.world.update();
		this.renderer.update();
	}
	destroy() {
		this.sizes.off("resize");
		this.time.off("tick");
		this.camera.controls.dispose();
		this.renderer.instance.dispose();

		// Traverse the whole scene
		this.scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();
				for (const key in child.material) {
					const value = child.material[key];

					if (value && typeof value.dispose === "function") {
						value.dispose();
					}
				}
			}
		});

		// Dispose Debug Gui
		if (this.debug.active) {
			this.debug.gui.destroy();
		}
	}
}