const BaziCore = (function () {
    const TIANGAN = Ganzhi.TIANGAN;
    const DIZHI = Ganzhi.DIZHI;

    const WUXING_FOR_TIANGAN = {
        "甲":"木","乙":"木","丙":"火","丁":"火","戊":"土",
        "己":"土","庚":"金","辛":"金","壬":"水","癸":"水"
    };
    const WUXING_FOR_DIZHI = {
        "子":"水","丑":"土","寅":"木","卯":"木","辰":"土",
        "巳":"火","午":"火","未":"土","申":"金","酉":"金","戌":"土","亥":"水"
    };
    const YINYANG = {
        "甲":"阳","乙":"阴","丙":"阳","丁":"阴","戊":"阳",
        "己":"阴","庚":"阳","辛":"阴","壬":"阳","癸":"阴"
    };

    function calculateTimeGanzhi(tianganOfDay, hour) {
        const tianganIndex = (2 * tianganOfDay - 1) % 10;
        let dizhiIndex = 0;
        if (hour === 23 || hour === 0 || hour === 24) {
            dizhiIndex = 0;
        } else {
            dizhiIndex = Math.ceil(hour / 2);
        }
        return TIANGAN[(tianganIndex - 1 + dizhiIndex) % 10] + DIZHI[dizhiIndex];
    }

    function analyze(year, month, day, hour) {
        const data = Ganzhi.day(year, month, day);
        const tianganOfDay = data[2];
        const tianganIndex = TIANGAN.indexOf(tianganOfDay) + 1;
        const timeGZ = calculateTimeGanzhi(tianganIndex, hour);
        const baziStr = data[0] + '-' + timeGZ;

        const pillars = baziStr.split('-');
        const labels = ["年柱", "月柱", "日柱", "时柱"];
        const pillarDetails = pillars.map((p, i) => ({
            label: labels[i],
            tiangan: p[0],
            dizhi: p[1],
            tiangan_wuxing: WUXING_FOR_TIANGAN[p[0]],
            dizhi_wuxing: WUXING_FOR_DIZHI[p[1]],
            tiangan_yinyang: YINYANG[p[0]],
        }));

        const wuxingCount = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
        for (const p of pillars) {
            wuxingCount[WUXING_FOR_TIANGAN[p[0]]]++;
            wuxingCount[WUXING_FOR_DIZHI[p[1]]]++;
        }
        const total = Object.values(wuxingCount).reduce((a, b) => a + b, 0);
        const wuxingScores = {};
        for (const [k, v] of Object.entries(wuxingCount)) {
            wuxingScores[k] = Math.round(v / total * 10000) / 10000;
        }
        const minVal = Math.min(...Object.values(wuxingCount));
        const lacking = Object.entries(wuxingCount).filter(([k, v]) => v === minVal).map(([k]) => k);

        return {
            bazi: baziStr,
            pillars: pillarDetails,
            shengxiao: data[1],
            wuxing_count: wuxingCount,
            wuxing_scores: wuxingScores,
            lacking_wuxing: lacking,
        };
    }

    // Fortune
    const WUXING_RELATIONS = {
        "金": { "生": "水", "克": "木", "被生": "土", "被克": "火" },
        "木": { "生": "火", "克": "土", "被生": "水", "被克": "金" },
        "水": { "生": "木", "克": "火", "被生": "金", "被克": "土" },
        "火": { "生": "土", "克": "金", "被生": "木", "被克": "水" },
        "土": { "生": "金", "克": "水", "被生": "火", "被克": "木" },
    };

    const FORTUNE_TEMPLATES = {
        excellent: [
            "今日运势极佳，诸事顺遂，宜把握机会积极行动。",
            "贵人运旺盛，有望获得他人帮助，事半功倍。",
            "今日灵感充沛，适合创新思考和重要决策。",
        ],
        good: [
            "今日运势平稳向好，脚踏实地便有收获。",
            "人际关系和谐，适合社交和团队合作。",
            "财运小有起色，适合稳健投资和理财规划。",
        ],
        neutral: [
            "今日运势平平，宜守不宜攻，保持平常心。",
            "事务进展平缓，不急不躁方为上策。",
            "今日适合学习充电，为未来积蓄能量。",
        ],
        poor: [
            "今日运势稍弱，行事需谨慎，避免冲动决定。",
            "注意人际摩擦，多一分忍让少一分烦恼。",
            "今日不宜冒险，稳中求进为佳。",
        ],
    };
    const CAREER_TIPS = ["工作中注意细节，避免粗心大意。","适合与同事沟通协作，集思广益。","今日适合处理文书和规划类工作。","保持专注，一件事做好再做下一件。","适合学习新技能，提升自我竞争力。"];
    const LOVE_TIPS = ["感情运势温和，适合与伴侣共度时光。","单身者今日桃花运不错，可多参加社交活动。","感情中多一些理解和包容，关系更加融洽。","适合表达心意，真诚是最好的沟通方式。","今日适合反思感情中的问题，寻找改善方向。"];
    const HEALTH_TIPS = ["注意作息规律，早睡早起精神好。","适合户外运动，呼吸新鲜空气。","饮食宜清淡，多喝水多吃蔬果。","注意颈椎和腰部保养，避免久坐。","今日适合冥想放松，缓解压力。"];

    const LUCKY_COLORS = {"金":["白色","银色","金色"],"木":["绿色","青色","翠色"],"水":["黑色","蓝色","深灰"],"火":["红色","紫色","橙色"],"土":["黄色","棕色","米色"]};
    const LUCKY_NUMBERS = {"金":[4,9],"木":[3,8],"水":[1,6],"火":[2,7],"土":[5,0]};
    const LUCKY_DIRECTIONS = {"金":"西方","木":"东方","水":"北方","火":"南方","土":"中央"};

    function hashStr(s) {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }

    function getDailyFortune(baziStr, wuxingCount) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const baseDays = Math.round((today - new Date(1901, 1, 15)) / 86400000);
        const idx60 = ((baseDays % 60) + 60) % 60;
        const gz60 = Ganzhi.CHINESE_60[idx60];
        const todayTiangan = TIANGAN[parseInt(gz60.substring(0, 2))];
        const todayDizhi = DIZHI[parseInt(gz60.substring(2, 4))];
        const todayWuxing = WUXING_FOR_TIANGAN[todayTiangan];

        const dayMaster = baziStr.split('-')[2][0];
        const dayMasterWuxing = WUXING_FOR_TIANGAN[dayMaster];

        let relation = "neutral";
        if (dayMasterWuxing === todayWuxing) relation = "同";
        else {
            for (const [rel, target] of Object.entries(WUXING_RELATIONS[dayMasterWuxing])) {
                if (target === todayWuxing) { relation = rel; break; }
            }
        }

        let level, score;
        const seed = hashStr(todayStr + baziStr);
        if (relation === "被生" || relation === "同") {
            level = "excellent"; score = (seed % 10) + 85;
        } else if (relation === "生") {
            level = "good"; score = (seed % 15) + 70;
        } else if (relation === "克") {
            level = "neutral"; score = (seed % 15) + 55;
        } else {
            level = "poor"; score = (seed % 15) + 40;
        }
        score = Math.min(score, 99);

        const s = seed;
        const luckyWuxing = WUXING_RELATIONS[dayMasterWuxing]["被生"];

        return {
            date: todayStr,
            today_ganzhi: todayTiangan + todayDizhi,
            today_wuxing: todayWuxing,
            score: score,
            level: level,
            overall: FORTUNE_TEMPLATES[level][s % FORTUNE_TEMPLATES[level].length],
            career: CAREER_TIPS[(s + 1) % CAREER_TIPS.length],
            love: LOVE_TIPS[(s + 2) % LOVE_TIPS.length],
            health: HEALTH_TIPS[(s + 3) % HEALTH_TIPS.length],
            lucky_color: LUCKY_COLORS[luckyWuxing][(s + 4) % LUCKY_COLORS[luckyWuxing].length],
            lucky_number: LUCKY_NUMBERS[luckyWuxing][(s + 5) % LUCKY_NUMBERS[luckyWuxing].length],
            lucky_direction: LUCKY_DIRECTIONS[luckyWuxing],
        };
    }

    return { analyze, getDailyFortune, WUXING_FOR_TIANGAN, WUXING_FOR_DIZHI };
})();
