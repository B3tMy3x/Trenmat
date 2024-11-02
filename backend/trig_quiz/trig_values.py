import sympy as sp

trig_values_quadrant1 = {
    "sin": {0: 0, 30: "1/2", 45: "sqrt(2)/2", 60: "sqrt(3)/2", 90: 1},
    "cos": {0: 1, 30: "sqrt(3)/2", 45: "sqrt(2)/2", 60: "1/2", 90: 0},
    "tg": {0: 0, 30: "sqrt(3)/3", 45: 1, 60: "sqrt(3)", 90: "undefined"},
    "ctg": {0: "undefined", 30: "sqrt(3)", 45: 1, 60: "sqrt(3)/3", 90: 0},
}

angles = {
    1: [0, 30, 45, 60, 90],
    2: [120, 135, 150, 180],
    3: [210, 225, 240, 270],
    4: [300, 315, 330, 360],
}

angles_rad = {
    1: [0, sp.pi / 6, sp.pi / 4, sp.pi / 3, sp.pi / 2],
    2: [2 * sp.pi / 3, 3 * sp.pi / 4, 5 * sp.pi / 6, sp.pi],
    3: [7 * sp.pi / 6, 5 * sp.pi / 4, 4 * sp.pi / 3, 3 * sp.pi / 2],
    4: [5 * sp.pi / 3, 7 * sp.pi / 4, 11 * sp.pi / 6, 2 * sp.pi],
}
