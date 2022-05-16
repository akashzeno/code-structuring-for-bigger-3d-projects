import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
	constructor(sources) {
		super();

		// Options
		this.sources = sources;

		// Setup
		this.items = {};
		this.toLoad = this.sources.length;
		this.loaded = 0;

		this.setLoaders();
		this.startLoading();
	}

	setLoaders() {
		this.loaders = {
			gltfLoader: new GLTFLoader(),
			textureLoader: new THREE.TextureLoader(),
			cubeTextureLoader: new THREE.CubeTextureLoader(),
		};
	}
	startLoading() {
		this.sources.forEach((source) => {
			if (source.type === "gltfModel") {
				this.loaders.gltfLoader.load(source.path, (file) => {
					this.sourcesLoaded(source, file);
				});
			} else if (source.type === "texture") {
				this.loaders.textureLoader.load(source.path, (file) => {
					this.sourcesLoaded(source, file);
				});
			} else if (source.type === "cubeTexture") {
				this.loaders.cubeTextureLoader.load(source.path, (file) => {
					this.sourcesLoaded(source, file);
				});
			}
		});
	}

	sourcesLoaded(source, file) {
		this.items[source.name] = file;
		this.loaded++;

		if (this.loaded === this.toLoad) {
			this.trigger("ready");
		}
	}
}
