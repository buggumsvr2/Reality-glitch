/*
  Reality Glitch: Containment Edition
  A Sandboxels mod inspired by Reality Glitch 2.

  Elements:
  - Glitch Matter: corrupting unstable powder
  - Reality Rift: stationary source of corruption
  - Null Dust: residue that crystallizes over time
  - Echo Glass: heat-sensitive reality crystal
  - Reality Anchor: containment material that repairs corruption
*/

(function () {
    "use strict";

    if (typeof elements === "undefined" || typeof behaviors === "undefined") {
        console.error("Reality Glitch: Sandboxels is not ready.");
        return;
    }

    function validPixel(pixel) {
        return pixel && pixelMap[pixel.x] && pixelMap[pixel.x][pixel.y] === pixel;
    }

    function inBounds(x, y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    function eachNeighbor(pixel, radius, callback) {
        for (var dx = -radius; dx <= radius; dx++) {
            for (var dy = -radius; dy <= radius; dy++) {
                if (dx === 0 && dy === 0) continue;
                var x = pixel.x + dx;
                var y = pixel.y + dy;
                if (inBounds(x, y)) callback(pixelMap[x][y], x, y);
            }
        }
    }

    elements.glitch_matter = {
        color: ["#ff36d1", "#8b35ff", "#38f6ff", "#d44bff"],
        behavior: behaviors.POWDER,
        category: "special",
        state: "solid",
        density: 1800,
        temp: 25,
        desc: "Unstable matter that corrupts nearby materials.",
        tick: function (pixel) {
            if (!validPixel(pixel)) return;
            eachNeighbor(pixel, 1, function (other) {
                if (!other || ["glitch_matter", "reality_rift", "null_dust", "reality_anchor"].indexOf(other.element) !== -1) return;
                if (Math.random() < 0.008) changePixel(other, "null_dust");
            });
            if (Math.random() < 0.0005) changePixel(pixel, "reality_rift");
        }
    };

    elements.reality_rift = {
        color: ["#19002b", "#5c00a8", "#fa36ff"],
        behavior: behaviors.WALL,
        category: "special",
        state: "solid",
        density: 99999,
        temp: 25,
        desc: "A tear in reality that corrupts nearby matter.",
        tick: function (pixel) {
            if (!validPixel(pixel)) return;
            eachNeighbor(pixel, 2, function (other) {
                if (!other || other.element === "reality_rift" || other.element === "reality_anchor") return;
                if (Math.random() < 0.012) changePixel(other, "glitch_matter");
            });
            if (Math.random() < 0.03) {
                var x = pixel.x + Math.floor(Math.random() * 3) - 1;
                var y = pixel.y + Math.floor(Math.random() * 3) - 1;
                if (inBounds(x, y) && isEmpty(x, y)) createPixel("null_dust", x, y);
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
        desc: "Residue left behind by corrupted matter.",
        tick: function (pixel) {
            if (validPixel(pixel) && Math.random() < 0.003) changePixel(pixel, "echo_glass");
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
        breakInto: "null_dust",
        desc: "Crystallized reality that destabilizes when heated."
    };

    elements.reality_anchor = {
        color: ["#ffb52e", "#ffe5a3", "#fff7dd"],
        behavior: behaviors.WALL,
        category: "special",
        state: "solid",
        density: 7800,
        temp: 20,
        tempHigh: 1200,
        stateHigh: "molten_iron",
        desc: "Containment material that neutralizes nearby reality glitches.",
        tick: function (pixel) {
            if (!validPixel(pixel)) return;
            eachNeighbor(pixel, 2, function (other) {
                if (!other) return;
                if (other.element === "glitch_matter" && Math.random() < 0.05) {
                    changePixel(other, "null_dust");
                } else if (other.element === "null_dust" && Math.random() < 0.025) {
                    deletePixel(other.x, other.y);
                } else if (other.element === "reality_rift" && Math.random() < 0.002) {
                    changePixel(other, "echo_glass");
                }
            });
        }
    };

    console.log("Reality Glitch: Containment Edition loaded.");
})();
