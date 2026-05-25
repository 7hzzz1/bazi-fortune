import datetime
import math
from core import ganzhi

tiangans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
dizhis = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
wuxing_names = ["金", "木", "水", "火", "土"]

wuxing_for_tiangan = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
    "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
}

wuxing_for_dizhi = {
    "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土",
    "巳": "火", "午": "火", "未": "土", "申": "金", "酉": "金", "戌": "土", "亥": "水"
}

yinyang_for_tiangan = {
    "甲": "阳", "乙": "阴", "丙": "阳", "丁": "阴", "戊": "阳",
    "己": "阴", "庚": "阳", "辛": "阴", "壬": "阳", "癸": "阴"
}

shengxiao_names = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]


def calculate_time_ganzhi(tiangan_of_day, hour):
    tiangan_index = (2 * tiangan_of_day - 1) % 10
    if hour == 23 or hour == 0 or hour == 24:
        dizhi_index = 0
    else:
        dizhi_index = hour / 2
        if dizhi_index >= 0.5:
            dizhi_index = math.ceil(dizhi_index)
        else:
            dizhi_index = round(dizhi_index)
    dizhi_index = int(dizhi_index)
    return tiangans[(tiangan_index - 1 + dizhi_index) % 10] + dizhis[dizhi_index]


def get_bazi(year, month, day, hour):
    data = ganzhi.day(year, month, day)
    tiangan_of_day = data[2]
    tiangan_of_day_index = tiangans.index(tiangan_of_day) + 1
    ganzhi_of_time = calculate_time_ganzhi(tiangan_of_day_index, hour)
    bazi_str = data[0] + '-' + ganzhi_of_time
    return bazi_str, data[1]


def get_wuxing(bazi_str):
    bazi_list = bazi_str.split("-")
    wuxing_count = {"金": 0, "木": 0, "水": 0, "火": 0, "土": 0}

    for gz in bazi_list:
        if len(gz) >= 2:
            wuxing_count[wuxing_for_tiangan[gz[0]]] += 1
            wuxing_count[wuxing_for_dizhi[gz[1]]] += 1

    total = sum(wuxing_count.values())
    wuxing_scores = {k: round(v / total, 4) for k, v in wuxing_count.items()}
    return wuxing_count, wuxing_scores


def get_lacking_wuxing(wuxing_count):
    min_val = min(wuxing_count.values())
    return [k for k, v in wuxing_count.items() if v == min_val]


def analyze(year, month, day, hour):
    bazi_str, shengxiao = get_bazi(year, month, day, hour)
    wuxing_count, wuxing_scores = get_wuxing(bazi_str)
    lacking = get_lacking_wuxing(wuxing_count)

    pillars = bazi_str.split("-")
    pillar_details = []
    labels = ["年柱", "月柱", "日柱", "时柱"]
    for i, p in enumerate(pillars):
        if len(p) >= 2:
            pillar_details.append({
                "label": labels[i],
                "tiangan": p[0],
                "dizhi": p[1],
                "tiangan_wuxing": wuxing_for_tiangan[p[0]],
                "dizhi_wuxing": wuxing_for_dizhi[p[1]],
                "tiangan_yinyang": yinyang_for_tiangan[p[0]],
            })

    return {
        "bazi": bazi_str,
        "pillars": pillar_details,
        "shengxiao": shengxiao,
        "wuxing_count": wuxing_count,
        "wuxing_scores": wuxing_scores,
        "lacking_wuxing": lacking,
    }
