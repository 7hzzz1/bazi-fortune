import datetime
import hashlib
from core import ganzhi

tiangans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
dizhis = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

WUXING_RELATIONS = {
    "金": {"生": "水", "克": "木", "被生": "土", "被克": "火"},
    "木": {"生": "火", "克": "土", "被生": "水", "被克": "金"},
    "水": {"生": "木", "克": "火", "被生": "金", "被克": "土"},
    "火": {"生": "土", "克": "金", "被生": "木", "被克": "水"},
    "土": {"生": "金", "克": "水", "被生": "火", "被克": "木"},
}

FORTUNE_TEMPLATES = {
    "excellent": [
        "今日运势极佳，诸事顺遂，宜把握机会积极行动。",
        "贵人运旺盛，有望获得他人帮助，事半功倍。",
        "今日灵感充沛，适合创新思考和重要决策。",
    ],
    "good": [
        "今日运势平稳向好，脚踏实地便有收获。",
        "人际关系和谐，适合社交和团队合作。",
        "财运小有起色，适合稳健投资和理财规划。",
    ],
    "neutral": [
        "今日运势平平，宜守不宜攻，保持平常心。",
        "事务进展平缓，不急不躁方为上策。",
        "今日适合学习充电，为未来积蓄能量。",
    ],
    "poor": [
        "今日运势稍弱，行事需谨慎，避免冲动决定。",
        "注意人际摩擦，多一分忍让少一分烦恼。",
        "今日不宜冒险，稳中求进为佳。",
    ],
}

CAREER_TIPS = [
    "工作中注意细节，避免粗心大意。",
    "适合与同事沟通协作，集思广益。",
    "今日适合处理文书和规划类工作。",
    "保持专注，一件事做好再做下一件。",
    "适合学习新技能，提升自我竞争力。",
]

LOVE_TIPS = [
    "感情运势温和，适合与伴侣共度时光。",
    "单身者今日桃花运不错，可多参加社交活动。",
    "感情中多一些理解和包容，关系更加融洽。",
    "适合表达心意，真诚是最好的沟通方式。",
    "今日适合反思感情中的问题，寻找改善方向。",
]

HEALTH_TIPS = [
    "注意作息规律，早睡早起精神好。",
    "适合户外运动，呼吸新鲜空气。",
    "饮食宜清淡，多喝水多吃蔬果。",
    "注意颈椎和腰部保养，避免久坐。",
    "今日适合冥想放松，缓解压力。",
]

LUCKY_COLORS = {
    "金": ["白色", "银色", "金色"],
    "木": ["绿色", "青色", "翠色"],
    "水": ["黑色", "蓝色", "深灰"],
    "火": ["红色", "紫色", "橙色"],
    "土": ["黄色", "棕色", "米色"],
}

LUCKY_NUMBERS = {
    "金": [4, 9],
    "木": [3, 8],
    "水": [1, 6],
    "火": [2, 7],
    "土": [5, 0],
}

LUCKY_DIRECTIONS = {
    "金": "西方",
    "木": "东方",
    "水": "北方",
    "火": "南方",
    "土": "中央",
}


def _get_today_ganzhi():
    today = datetime.date.today()
    base = datetime.date(1901, 2, 15)
    diff = (today - base).days
    index = diff % 60
    from core.ganzhi import CHINESE_60, CHINESE_10_1, CHINESE_12_1
    gz = CHINESE_60[index]
    tiangan = CHINESE_10_1[int(gz[0:2])]
    dizhi = CHINESE_12_1[int(gz[2:4])]
    return tiangan, dizhi


def _deterministic_index(seed_str, max_val):
    h = hashlib.md5(seed_str.encode()).hexdigest()
    return int(h[:8], 16) % max_val


def get_daily_fortune(bazi_str, wuxing_count):
    today = datetime.date.today()
    today_str = today.strftime("%Y-%m-%d")
    today_tiangan, today_dizhi = _get_today_ganzhi()

    from core.metaphysic import wuxing_for_tiangan, wuxing_for_dizhi
    today_wuxing = wuxing_for_tiangan[today_tiangan]

    day_master = bazi_str.split("-")[2][0] if len(bazi_str.split("-")) >= 3 else "甲"
    day_master_wuxing = wuxing_for_tiangan[day_master]

    relation = _get_relation(day_master_wuxing, today_wuxing)

    if relation in ("被生", "同"):
        level = "excellent"
        score = _deterministic_index(today_str + bazi_str + "score", 10) + 85
    elif relation == "生":
        level = "good"
        score = _deterministic_index(today_str + bazi_str + "score", 15) + 70
    elif relation == "克":
        level = "neutral"
        score = _deterministic_index(today_str + bazi_str + "score", 15) + 55
    else:
        level = "poor"
        score = _deterministic_index(today_str + bazi_str + "score", 15) + 40

    score = min(score, 99)

    seed = today_str + bazi_str
    overall = FORTUNE_TEMPLATES[level][_deterministic_index(seed + "overall", len(FORTUNE_TEMPLATES[level]))]
    career = CAREER_TIPS[_deterministic_index(seed + "career", len(CAREER_TIPS))]
    love = LOVE_TIPS[_deterministic_index(seed + "love", len(LOVE_TIPS))]
    health = HEALTH_TIPS[_deterministic_index(seed + "health", len(HEALTH_TIPS))]

    lucky_wuxing = WUXING_RELATIONS[day_master_wuxing]["被生"]
    lucky_color = LUCKY_COLORS[lucky_wuxing][_deterministic_index(seed + "color", len(LUCKY_COLORS[lucky_wuxing]))]
    lucky_number = LUCKY_NUMBERS[lucky_wuxing][_deterministic_index(seed + "number", len(LUCKY_NUMBERS[lucky_wuxing]))]
    lucky_direction = LUCKY_DIRECTIONS[lucky_wuxing]

    return {
        "date": today_str,
        "today_ganzhi": today_tiangan + today_dizhi,
        "today_wuxing": today_wuxing,
        "score": score,
        "level": level,
        "overall": overall,
        "career": career,
        "love": love,
        "health": health,
        "lucky_color": lucky_color,
        "lucky_number": lucky_number,
        "lucky_direction": lucky_direction,
    }


def _get_relation(my_wuxing, other_wuxing):
    if my_wuxing == other_wuxing:
        return "同"
    relations = WUXING_RELATIONS[my_wuxing]
    for rel, target in relations.items():
        if target == other_wuxing:
            return rel
    return "neutral"
