import { gameState, playerState } from "../states/stateManagers.js";
import { areAnyOfTheseKeysDown, playAnimIfNotPlaying } from "../utils.js";

export function generatePlayerComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "player-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
    k.body(),
    k.pos(pos),
    k.opacity(),
    {
      speed: 100,
      attackPower: 1,
      direction: "down",
      isAttacking: false,
    },
    "player",
  ];
}

function playerMovementLogic(
  k,
  player,
  currentKey,
  expectedKey,
  exculdedKeys,
  direction,
  moveVec2
) {
  if (currentKey === expectedKey && !areAnyOfTheseKeysDown(k, exculdedKeys)) {
    player.flipX = direction === "left" ? true : false;
    switch (direction) {
      case "left":
        playAnimIfNotPlaying(player, "player-side");
        break;
      case "right":
        playAnimIfNotPlaying(player, "player-side");
        break;
      case "up":
        playAnimIfNotPlaying(player, "player-up");
        break;
      case "down":
        playAnimIfNotPlaying(player, "player-down");
        break;
      default:
        break;
    }
    player.move(moveVec2);
    player.direction = direction;
    return;
  }
}
export function setPlayerMovement(k, player) {

  k.onKeyDown((key) => {
    if(gameState.getFreezePlayer()) return;
    playerMovementLogic(
      k,
      player,
      key,
      "left",
      ["up", "down", "w", "s", "a"],
      "left",
      k.vec2(-player.speed, 0)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "a",
      ["up", "down", "w", "s", "left"],
      "left",
      k.vec2(-player.speed, 0)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "right",
      ["up", "down", "w", "s", "d"],
      "right",
      k.vec2(player.speed, 0)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "d",
      ["up", "down", "w", "s", "right"],
      "right",
      k.vec2(player.speed, 0)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "up",
      ["w"],
      "up",
      k.vec2(0, -player.speed)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "w",
      ["up"],
      "up",
      k.vec2(0, -player.speed)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "down",
      ["s"],
      "down",
      k.vec2(0, player.speed)
    );
    playerMovementLogic(
      k,
      player,
      key,
      "s",
      ["down"],
      "down",
      k.vec2(0, player.speed)
    );
  });

  k.onKeyPress((key) => {
    if (!["space"].includes(key)) return;
    if (gameState.getFreezePlayer()) return;
    if (!playerState.getIsSwordEquipped()) return;
    player.isAttacking = true;
    k.loadSound("impactSound", "../../assets/sounds/impact.mp3")

    if (k.get("swordHitBox").length === 0) {
      const swordHitBoxPosX = {
        left: player.worldPos().x - 2,
        right: player.worldPos().x + 10,
        up: player.worldPos().x + 5,
        down: player.worldPos().x + 2,
      };

      const swordHitBoxPosY = {
        left: player.worldPos().y + 5,
        right: player.worldPos().y + 5,
        up: player.worldPos().y,
        down: player.worldPos().y + 10,
      };

      k.add([
        k.area({ shape: new k.Rect(k.vec2(0), 8, 8) }),
        k.pos(
          swordHitBoxPosX[player.direction],
          swordHitBoxPosY[player.direction]
        ),
        "swordHitBox",
      ]);
      k.wait(0.1, () => {
        k.destroyAll("swordHitBox");
        if (player.direction === "left" || player.direction === "right") {
          playAnimIfNotPlaying(player, "player-side");
          player.stop();
          return;
        }
        playAnimIfNotPlaying(player, `player-${player.direction}`);
        player.stop();
      });
    }
    k.play("impactSound")
    playAnimIfNotPlaying(player, `player-attack-${player.direction}`);
  });

  k.onKeyRelease(() => {
    player.isAttacking = false;
    player.stop();
  });
}
