
export function generatePotionComponents(k, pos) {
    return [
        k.sprite("assets", {
            anim: "potion",
        }),
        k.area({shape: new k.Rect(k.vec2(0,6), 16, 10)}),
        k.body(),
        k.pos(pos),
        k.offscreen(),
        k.opacity(),
        "potion",
    ];
}