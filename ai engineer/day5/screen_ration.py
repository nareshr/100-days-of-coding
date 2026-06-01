from fractions import Fraction
import math

# def get_wider_aspect_ratio(first_screen, second_screen):

#     f_screen_w, f_screen_h = first_screen.split("x")
#     s_screen_w, s_screen_h = second_screen.split("x")

#     f = Fraction(int(f_screen_w), int(f_screen_h))

#     s = Fraction(int(s_screen_w), int(s_screen_h))

#     return f"{f.numerator}:{f.denominator}" if f > s else f"{s.numerator}:{s.denominator}"


# print(get_wider_aspect_ratio("1920x1080", "800x600"))


def get_wider_aspect_ratio(dim1, dim2):
    def parse_and_calculate(dim_str):
        w, h = map(int, dim_str.split("x"))

        ratio = w / h
        gcd = math.gcd(w, h)
        simplified = f"{w//gcd}:{h//gcd}"
        return ratio, simplified

    r1, s1 = parse_and_calculate(dim1)
    r2, s2 = parse_and_calculate(dim2)

    return s1 if r1 > r2 else s2


print(get_wider_aspect_ratio("1920x1080", "800x600"))
print(get_wider_aspect_ratio("1080x1350", "2048x1536"))
print(get_wider_aspect_ratio("640x480", "2440x1220"))
print(get_wider_aspect_ratio("360x640", "1080x1920"))
print(get_wider_aspect_ratio("3440x1440", "2048x858"))
print(get_wider_aspect_ratio("12345x61234", "12534x51234"))