

/*
  Reality Glitch Mod for Sandboxels
  Elements:
  - Glitch Matter
  - Reality Rift
  - Null Dust
  - Echo Glass
*/

(function () {
    "use strict";

    // Wait until Sandboxels has loaded its element system.
    if (typeof elements === "undefined" ||
        typeof behaviors === "undefined") {
        console.error("Reality Glitch: Sandboxels is not ready.");
        return;
    }

    // Safely check whether a pixel is still active.
    function validPixel(pixel) {
        return pixel &&
            pixelMap[pixel.x] &&
            pixelMap[pixel.x][pixel.y] === pixel;
    }

    // Check world boundaries.
    function inBounds(x, y) {
        return x >= 0 && x < width &&
               y >= 0 && y < height;
    }

    // 1. GLITCH MATTER
    elements.glitch_matter = {
        color: [
            "#ff36d1",
            "#8b35ff",
            "#38f6ff",
            "#d44bff"
        ],
        behavior: behaviors.POWDER,
        category: "special",
        state: "solid",
        density: 1800,
        temp: 25,
        desc: "Unstable matter that corrupts nearby materials.",

        tick: function (pixel) {
            if (!validPixel(pixel)) return;

            // Slowly corrupt nearby materials.
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;

                    var nx = pixel.x + dx;
                    var ny = pixel.y + dy;

                    if (!inBounds(nx, ny)) continue;

                    var other = pixelMap[nx][ny];

                    if (!other ||
                        other.element === "glitch_matter" ||
                        other.element === "reality_rift" ||
                        other.element === "null_dust") {
                        continue;
                    }

                    if (Math.random() < 0.008) {
                        changePixel(other, "null_dust");
                    }
                }
            }

            // Rarely transform into a reality rift.
            if (Math.random() < 0.0005) {
                changePixel(pixel, "reality_rift");
            }
        }
    };

    // 2. REALITY RIFT
    elements.reality_rift = {
        color: [
            "#19002b",
            "#5c00a8",
            "#fa36ff"
        ],
        behavior: behaviors.WALL,
        category: "special",
        state: "solid",
        density: 99999,
        temp: 25,
        desc: "A tear in reality that corrupts nearby matter.",

        tick: function (pixel) {
            if (!validPixel(pixel)) return;

            // Corrupt matter within a five-by-five area.
            for (var dx = -2; dx <= 2; dx++) {
                for (var dy = -2; dy <= 2; dy++) {
                    if (dx === 0 && dy === 0) continue;

                    var nx = pixel.x + dx;
                    var ny = pixel.y + dy;

                    if (!inBounds(nx, ny)) continue;

                    var other = pixelMap[nx][ny];

                    if (!other ||
                        other.element === "reality_rift") {
                        continue;
                    }

                    if (Math.random() < 0.012) {
                        changePixel(other, "glitch_matter");
                    }
                }
            }

            // Occasionally create null dust nearby.
            if (Math.random() < 0.03) {
                var dustX = pixel.x +
                    Math.floor(Math.random() * 3) - 1;
                var dustY = pixel.y +
                    Math.floor(Math.random() * 3) - 1;

                if (inBounds(dustX, dustY) &&
                    isEmpty(dustX, dustY)) {
                    createPixel("null_dust", dustX, dustY);
                }
            }
        }
    };

    // 3. NULL DUST
    elements.null_dust = {
        color: [
            "#302044",
            "#6741a5",
            "#a78bfa"
        ],
        behavior: behaviors.POWDER,
        category: "powders",
        state: "solid",
        density: 900,
        temp: 20,
        desc: "Residue left behind by corrupted matter.",

        tick: function (pixel) {
            if (!validPixel(pixel)) return;

            // Slowly crystallize into echo glass.
            if (Math.random() < 0.003) {
                changePixel(pixel, "echo_glass");
            }
        }
    };

    // 4. ECHO GLASS
    elements.echo_glass = {
        color: [
            "#58f7ff",
            "#a65bff",
            "#e8d6ff"
        ],
        behavior: behaviors.WALL,
        category: "solids",
        state: "solid",
        density: 2500,
        temp: 20,
        tempHigh: 600,
        stateHigh: "glitch_matter",
        desc: "Crystallized reality that destabilizes when heated."
    };

    console.log("Reality Glitch loaded successfully!");
})();
