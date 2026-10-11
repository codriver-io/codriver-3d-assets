/** Engine-independent portable scene contract. No browser or Node dependency. */
export function validateSceneManifest(manifest) {
  if (manifest.format !== 'codriver-scene' || manifest.version !== 1) throw new Error('Unsupported scene package');
  const { frame, files, presets, asset, validation } = manifest;
  if (frame?.units !== 'metres' || frame.axes?.x !== 'east' || frame.axes?.y !== 'up' || frame.axes?.z !== 'south'
    || frame.origin?.length !== 2 || !Number.isFinite(frame.origin[0]) || Math.abs(frame.origin[0]) > 180
    || !Number.isFinite(frame.origin[1]) || Math.abs(frame.origin[1]) >= 90 || !frame.verticalDatum) throw new Error('Unsupported coordinate frame');
  if (!files || !Object.keys(files).length) throw new Error('Empty scene package');
  for (const [name, hash] of Object.entries(files)) {
    if (!name.split('/').every(p => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(p)) || !/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid package path or hash');
  }
  if (presets?.cityscape?.terrain !== false || presets?.world?.terrain !== true) throw new Error('Separate placement presets required');
  const dependencies = [asset?.near, asset?.far, manifest.terrain, manifest.roads, manifest.notices, manifest.surfaceRecords,
    presets.cityscape.scene, presets.world.scene];
  if (dependencies.some(name => !name || !Object.hasOwn(files, name))) throw new Error('Unverified scene dependency');
  if (dependencies.slice(-2).some(name => !name.endsWith('.glb'))) throw new Error('Self-contained preset GLBs required');
  if (!['verified', 'not tested'].includes(validation?.viewer)
    || ['cityscape', 'world'].some(mode => !['verified', 'not tested', 'unsupported'].includes(validation?.app?.[mode]))) throw new Error('Explicit placement validation required');
  return dependencies;
}
