import * as THREE from "three";
import Experience from "../Experience.js";

export default class Fox {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.gui.addFolder("Fox");
		}

		// Setup
		this.resource = this.resources.items.foxModel;

		this.setModel();
		this.setAnimation();
	}
	setModel() {
		this.model = this.resource.scene;
		this.model.scale.set(0.02, 0.02, 0.02);
		this.scene.add(this.model);

		this.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
			}
		});
	}
	setAnimation() {
		this.animation = {
			mixer: new THREE.AnimationMixer(this.model),
			actions: {},
			play: (name) => {
				const newAction = this.animation.actions[name];
				const oldAction = this.animation.actions.current;

				newAction.reset();
				newAction.play();
				newAction.crossFadeFrom(oldAction, 1);
				this.animation.actions.current = newAction;
			},
		};
		this.resource.animations.forEach((animation, index) => {
			this.animation.actions[animation.name] = this.animation.mixer.clipAction(
				this.resource.animations[index]
			);
		});
		this.animation.actions.current = this.animation.actions.Survey;
		this.animation.actions.current.play();

		// Debug
		if (this.debug.active) {
			this.resource.animations.forEach((animation) => {
				this.debugFolder
					.add(
						{
							[animation.name]: () => {
								this.animation.play(animation.name);
							},
						},
						animation.name
					)
					.name(`Play ${animation.name}`);
			});
		}
	}
	update() {
		this.animation.mixer.update(this.time.delta * 0.001);
	}
}
