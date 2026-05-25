import random
from core.wuxing_data import wuxingDic
from core.characters import male, female


def recommend_names(lacking_wuxing, gender="male", count=10, surname=""):
    wuxing_chars = []
    for wx in lacking_wuxing:
        chars = wuxingDic.get(wx, [])
        wuxing_chars.extend(chars)

    if gender == "male":
        gender_chars = set(male)
    else:
        gender_chars = set(female)

    candidates = list(set(wuxing_chars) & gender_chars)

    if len(candidates) < 2:
        candidates = list(wuxing_chars) if wuxing_chars else list(gender_chars)

    random.shuffle(candidates)

    names = []
    used = set()
    attempts = 0
    max_attempts = count * 20

    while len(names) < count and attempts < max_attempts:
        attempts += 1
        if len(candidates) >= 2:
            c1 = random.choice(candidates)
            c2 = random.choice(candidates)
            if c1 != c2:
                name = c1 + c2
                if name not in used:
                    used.add(name)
                    name_wuxing = []
                    for wx, chars in wuxingDic.items():
                        if c1 in chars:
                            name_wuxing.append(wx)
                            break
                    for wx, chars in wuxingDic.items():
                        if c2 in chars:
                            name_wuxing.append(wx)
                            break
                    names.append({
                        "name": surname + name,
                        "chars": [c1, c2],
                        "wuxing": name_wuxing,
                    })
        elif len(candidates) == 1:
            c1 = candidates[0]
            c2 = random.choice(list(gender_chars))
            if c1 != c2:
                name = c1 + c2
                if name not in used:
                    used.add(name)
                    names.append({
                        "name": surname + name,
                        "chars": [c1, c2],
                        "wuxing": lacking_wuxing,
                    })

    return names


def get_single_chars(lacking_wuxing, gender="male", count=20):
    wuxing_chars = []
    for wx in lacking_wuxing:
        chars = wuxingDic.get(wx, [])
        wuxing_chars.extend([(c, wx) for c in chars])

    if gender == "male":
        gender_set = set(male)
    else:
        gender_set = set(female)

    filtered = [(c, wx) for c, wx in wuxing_chars if c in gender_set]

    if not filtered:
        filtered = wuxing_chars

    random.shuffle(filtered)
    result = []
    seen = set()
    for c, wx in filtered[:count]:
        if c not in seen:
            seen.add(c)
            result.append({"char": c, "wuxing": wx})

    return result
