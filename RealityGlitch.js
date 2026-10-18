elements.glitch_matter = {
    color: ["#ff36d1", "#8b35ff", "#38f6ff", "#d44bff"],
    behavior: behaviors.POWDER,
    category: "special",
    state: "solid",
    density: 1800,
    temp: 25,
    desc: "Unstable matter that corrupts nearby materials.",

    tick: function(pixel) {
        // Mutate neighboring materials.
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;

                var nx = pixel.x + dx;
                var ny = pixel.y + dy;

                if (
                    nx < 0 || nx >= width ||
                    ny < 0 || ny >= height
                ) continue;

                var other = pixelMap[nx]?.[ny];
                if (!other || other.element === "glitch_matter") {
                    continue;
                }

                // Corruption is rare, so it doesn't
                // immediately destroy the whole map.
                if (Math.random() < 0.008) {
                    changePixel(other, "null_dust");
                }
            }
        }

        // A little instability can create a rift.
        if (Math.random() < 0.0005) {
            changePixel(pixel, "reality_rift");
        }
    }
};

elements.reality_rift = {
    color: ["#19002b", "#5c00a8", "#fa36ff"],
    behavior: behaviors.WALL,
    category: "special",
    state: "solid",
    density: 99999,
    temp: 25,
    desc: "A tear in reality that distorts nearby matter.",

    tick: function(pixel) {
        // Rift emits particles and scrambles nearby matter.
        for (var dx = -2; dx <= 2; dx++) {
            for (var dy = -2; dy <= 2; dy++) {
                if (dx === 0 && dy === 0) continue;

                var nx = pixel.x + dx;
                var ny = pixel.y + dy;

                if (
                    nx < 0 || nx >= width ||
                    ny < 0 || ny >= height
                ) continue;

                var other = pixelMap[nx]?.[ny];

                if (other && Math.random() < 0.012) {
                    if (other.element !== "reality_rift") {
                        changePixel(other, "glitch_matter");
                    }
                }
            }
        }

        // Occasionally shed null dust nearby.
        if (Math.random() < 0.03) {
            var nx = pixel.x + Math.floor(Math.random() * 3) - 1;
            var ny = pixel.y + Math.floor(Math.random() * 3) - 1;

            if (
                nx >= 0 && nx < width &&
                ny >= 0 && ny < height &&
                isEmpty(nx, ny)
            ) {
                createPixel("null_dust", nx, ny);
            }
        }
    }
};

elements.null_dust = {
    color: ["#302044", "#6741a5", "#a78bfa"],
    behavior: behaviors.POWDER,
    category: "powders",
    state: "solid",
    density: 900,
    temp: 20,
    desc: "Residue of corrupted matter.",

    tick: function(pixel) {
        // Dust can condense into echo glass.
        if (Math.random() < 0.003) {
            changePixel(pixel, "echo_glass");
        }
    }
};

elements.echo_glass = {
    color: ["#58f7ff", "#a65bff", "#e8d6ff"],
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    density: 2500,
    temp: 20,
    tempHigh: 600,
    stateHigh: "glitch_matter",
    desc: "Crystallized reality that destabilizes under heat."
};