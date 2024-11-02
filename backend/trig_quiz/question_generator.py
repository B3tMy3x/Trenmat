import random
from .trig_values import angles, angles_rad
from .utils import get_value_with_sign


def generate_question():
    function = random.choice(["sin", "cos", "tg", "ctg"])
    quadrant = random.choice([1, 2, 3, 4])
    angle_deg = random.choice(angles[quadrant])
    answer = get_value_with_sign(function, angle_deg, quadrant)

    wrong_answers = set()
    while len(wrong_answers) < 3:
        random_quadrant = random.choice([1, 2, 3, 4])
        wrong_answer = get_value_with_sign(
            function, random.choice(angles[random_quadrant]), random_quadrant
        )
        if wrong_answer != answer:
            wrong_answers.add(wrong_answer)

    all_answers = list(wrong_answers) + [answer]
    random.shuffle(all_answers)

    angle_rad = angles_rad[quadrant][angles[quadrant].index(angle_deg)]
    unit = random.choice(["градусов", "радиан"])
    angle = f"{angle_deg}°" if unit == "градусов" else f"{angle_rad}"
    question = f"{function}({angle})"

    return question, answer, all_answers
