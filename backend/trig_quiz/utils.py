from .trig_values import trig_values_quadrant1


def get_value_with_sign(function, angle_deg, quadrant):
    base_value = trig_values_quadrant1[function][angle_deg % 90]

    if base_value == "undefined" or base_value == "0" or base_value == 0:
        return base_value

    if (
        function == "sin"
        and quadrant in [3, 4]
        or function == "cos"
        and quadrant in [2, 3]
        or function == "tg"
        and quadrant in [2, 4]
        or function == "ctg"
        and quadrant in [2, 4]
    ):
        return f"-{base_value}"

    return base_value
