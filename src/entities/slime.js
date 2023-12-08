import { playAnimIfNotPlaying } from "../utils.js";

const directionalStates = ["left", "right", "up", "down"];
export function generateSlimeComponents(k, pos) {
    return [
        k.sprite("assets", {
            anim: "slime-idle-down",
        }),
        k.area({shape: new k.Rect(k.vec2(0,6), 16, 10)}),
        k.body(),
        k.pos(pos),
        k.offscreen(),
        k.opacity(),
        k.health(3),
        k.state(
            "idle",
            ["idle", ...directionalStates]
        ),
        {
            speed: 30,
            attackPower: 0.5,
        },
        "slime",
    ];
}

export function setSlimeAI(k, slime) {
    k.onUpdate(() => {
        switch (slime.state) {
            case "right":
                slime.move(slime.speed, 0)
                break;
            case "left":
                slime.move(-slime.speed, 0)
                break;
            case "up":
                slime.move(0, -slime.speed)
                break;
            case "down":
                slime.move(0, slime.speed)
                break;
            default:
                break;
        }
    })
    const idle = slime.onStateEnter("idle", async() => {
        slime.stop();
        await k.wait(3)
        slime.enterState(
            directionalStates[Math.floor(Math.random() * directionalStates.length)]
        )
    })

    const right = slime.onStateEnter("right", async() => {
        slime.flipX = false;    
        playAnimIfNotPlaying(slime, "slime-side");
        await k.wait(3);
        slime.enterState("idle");
    })
    const left = slime.onStateEnter("left", async() => {
        slime.flipX = true;    
        playAnimIfNotPlaying(slime, "slime-side");
        await k.wait(3);
        slime.enterState("idle");
    })
    const up = slime.onStateEnter("up", async() => {
        playAnimIfNotPlaying(slime, "slime-up");
        await k.wait(3);
        slime.enterState("idle");
    })
    const down = slime.onStateEnter("down", async() => {
        playAnimIfNotPlaying(slime, "slime-down");
        await k.wait(3);
        slime.enterState("idle");
    })

    k.onSceneLeave(() => {
        idle.cancel();
        right.cancel();
        left.cancel();
        up.cancel();
        down.cancel();
    })
}