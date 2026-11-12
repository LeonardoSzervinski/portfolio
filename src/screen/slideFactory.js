import { SceneSlide } from './SceneSlide.js';
import { VideoSlide } from './VideoSlide.js';

/**
 * Factory: builds the right Slide for a project's media.
 * New media types are added to the registry without touching the callers (Open/Closed).
 */
const registry = {
  scene: (media, context) => {
    const scene = context.scenes[media.scene];
    if (!scene) throw new Error(`Unknown scene "${media.scene}"`);
    return new SceneSlide(scene, context);
  },
  video: (media) => new VideoSlide(media),
};

export function createSlide(media, context) {
  const build = registry[media.type];
  if (!build) throw new Error(`Unsupported media type "${media.type}"`);
  return build(media, context);
}

export const supportedMediaTypes = Object.keys(registry);
