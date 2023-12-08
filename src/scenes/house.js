import { generateOldManComponents, startInteraction } from "../entities/oldman.js";
import { generatePlayerComponents, setPlayerMovement } from "../entities/player.js";
import { gameState } from "../states/stateManagers.js";
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData, playAnimIfNotPlaying } from "../utils.js";

export default async function house(k){
  colorizeBackground(k, 27, 29, 52);
 
  const mapData = await fetchMapData("./assets/maps/house.json");
  const map = k.add([k.pos(520, 200)]);
  k.loadSound("doorSound", "../../assets/sounds/door.mp3");
  
  const entities = {
    oldman: null,
    player: null,
  }

  const layers = mapData.layers;
  for (const layer of layers) {
    if (layer.name === "Boundaries") {
      drawBoundaries(k, map, layer);
      continue;
    }

    if (layer.name === "SpawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player") {
          entities.player = map.add(
            generatePlayerComponents(k, k.vec2(object.x, object.y))
          );
          continue;
        }
        if (object.name === "oldman") {
          entities.oldman = map.add(
            generateOldManComponents(k, k.vec2(object.x, object.y))
          );
          continue;
        }
      }

      continue;
    }

    drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
  }

  k.camScale(4);

  setPlayerMovement(k, entities.player);

  entities.player.onCollide("door-exit", () => {
    k.play("doorSound");
    gameState.setPreviousScene("house");
    k.go("world");
  })
  entities.player.onCollide("oldman", () => {
    startInteraction(k, entities.oldman, entities.player)
  })
  entities.player.onCollideEnd("oldman", () => {
    playAnimIfNotPlaying(entities.oldman, "oldman-down")
  })
}