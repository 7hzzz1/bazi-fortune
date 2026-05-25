const Naming = (function () {
    const wuxingChars = {
        "金": "七三世丝主书事人仁仕仙任信修倩储儒先册净创初剑助升参双叔善宋宗宙宣宫宸寿尊小少尚川州常庚序心思性悦情慈成才承抒持捷授推操敞新施旋族早星春昌晁晨暄曹曾朝束柔正殊爽珊珠琛瑜瑞璀璨生盛真睿矗社祥神禅竣童纤纯线组绅细织绍绒绚绣续缜聪肃胜舒舜舟船节蝉西认设识诗诚详说诸谆财赏赐赛赞赤超身车轼辛逊逍遵金鉴铭银锋锐锦镇青靖静韶顺",
        "木": "木本杉杏材杜杨杭杰松林果枝柏柯柱柳栋树校栩根格桂桃桐桑桓桥梅梓梦梧械森棋楚楠楷榆榕榛槐模樱橙檀欣歌毅科稻竹笔笙符策简管箫篮籍芊芋芙芝芬芭芯花芳芷芸芹苍苏苑英苹茂茉茗茜茵茶荣莉莎莘莞莲莹菁菊萌萍萧萱蒂蓉蓓蓝蔚蕊蕾薇藤虹觉赫起轻过近逸雅集",
        "水": "万云享付伯佩保候冯冰凝永江池汤汪沁沂沈沐沙沛河治泉泊波泽洁洋洛洞津洪洲活洽流浅济浩浪浮海涛涵淑淘淞淡深淳清渊游湖湘湛源溪滨漫潇潘潜潮澄澜瀚灏点熙白百皇盈盘目盼眉美翰航范荡莫菲萍蒙藻虎行衍补表袤觅计训访评谋豪豹贝贸贺赋跋辉边迈还迷逢遥邦闻阔防雄雨雪雯雷霖霞露非飞香马鱼鸣鸿鹏鹤麦",
        "火": "丁丙丰临丹丽乃之乐亭亮代令传伦佰俊俐光兆全六典农冬刘利午卓南卢历叠召台同吕听呈哲唐团图夏多大天太头奈女妮娜婷媛宁定宝对导将尔年庭廷弄彤彰征德志忠念恬悌戴扬振择招拓摇政敦日旦旭昆昊易昕映昭晃晋晓晔晗晟晴智暖曦朗李梁止段殿毓泰火灵灿炎炜炫炯炳烁烈烨焕煊煜照熠燕爵特田男畅登的督睦知礼祝禄离立章端粮纳练绩绿缇罗翎耀耐聆腾自至致良虞衷褚览詹让论证诺读谅谭贞质赵路跳踏转轮轶辽达迅进连迪通逞遂道遥邓那郎都采里重长陆陈隆零韬顶领题飘龙",
        "土": "一与为予于亚亦允充养准凹切勇勋医卫原友右叶员因园围圆土圣地坊坚坤坦城培基堂域堡增墨壁壹央夷奎宇安完宛宥容寅尉尤山岐岗岚岩岭峡峥峨崇崎嵘巍己幼幽应庸延异引影徽忆怡恩意慰懿戊拥援攸旺昀有欧温燕爱牡王玥玮琬瑛璧用由画畏益盎眺矶砚硕确磊磐禹稳维缘羊羽翁翔翕育胡融衡衣袁裔要誉诩谓豫越跃轩辕辰远逸遐邑野阅阳阿院隐雍韦韫音韵颐鸟鸥鸳"
    };

    const maleCommon = "厚炜杰海瑞衡维茂峥明翼秋强舜科琛瑾韵捷富烽崴耿硕轩庚昊延烨湛炳腾璇顺力曦熹梁通祺卿鹏喜乐皓越亨森刚庆浩豹炯镇琦裕彬冰标枫克牧溪广翊波创剑蔚新昱俊颢钦霆涵坤挺乔丹昌程治洋颂良琨韦志洪杨潮亚锋天功勇典弘谦耀国雄朗岩路圣旗旭意保竹鸣岑虹高野园益宾山昀煌宇佳煜康泰理聪宝岚遥定羽盛家郁增岳鸿卓开晨福运青湘瀚韬显纬光千陆楷童嘉奕璞舒展峰斌舟万沁灏帆焕贺航锐澎涛巍辰栩吉嘉炬菲利怡贤军泳翔源宽威冠霖晋晴鼎震文哲宁扬昭宏希晟朋熠津河飞松虎均凡宪立迪朝平南龙伟勉友亮成超信骏峻凌跃桐尚瑜升添舰江毓逸柯磊兴竞琰淳承杭涌";
    const femaleCommon = "芳华丽秀英敏慧雅静婷玲珍琳瑶莹梅兰竹菊蓉蕾薇萱莉荷蝶燕凤鸾雪冰清洁玉珠翠琼瑛璐瑾璇珊琪琦瑜佳嘉欣悦怡然宁安平和顺畅晴朗明媚春夏秋冬月星辰露霞虹彩云霄天蓝碧翠青黛素雅淑贤惠端庄婉柔温良淳朴真诚善美丹红紫彤艳妍姿容貌颜如意吉祥瑞福禄寿喜乐欢笑语歌舞飞翔鸿雁莺燕鹤凤";

    function recommend(lackingWuxing, gender, surname, count) {
        count = count || 10;
        const pool = [];
        for (const wx of lackingWuxing) {
            if (wuxingChars[wx]) pool.push(...wuxingChars[wx]);
        }
        const genderSet = new Set(gender === 'female' ? femaleCommon : maleCommon);
        let candidates = pool.filter(c => genderSet.has(c));
        if (candidates.length < 2) candidates = pool;

        const names = [];
        const used = new Set();
        let attempts = 0;
        while (names.length < count && attempts < count * 30) {
            attempts++;
            const c1 = candidates[Math.floor(Math.random() * candidates.length)];
            const c2 = candidates[Math.floor(Math.random() * candidates.length)];
            if (c1 !== c2) {
                const name = c1 + c2;
                if (!used.has(name)) {
                    used.add(name);
                    const wx = [];
                    for (const [k, v] of Object.entries(wuxingChars)) {
                        if (v.includes(c1)) { wx.push(k); break; }
                    }
                    for (const [k, v] of Object.entries(wuxingChars)) {
                        if (v.includes(c2)) { wx.push(k); break; }
                    }
                    names.push({ name: surname + name, chars: [c1, c2], wuxing: wx });
                }
            }
        }
        return names;
    }

    function getChars(lackingWuxing, gender, count) {
        count = count || 20;
        const result = [];
        const genderSet = new Set(gender === 'female' ? femaleCommon : maleCommon);
        for (const wx of lackingWuxing) {
            if (!wuxingChars[wx]) continue;
            for (const c of wuxingChars[wx]) {
                if (genderSet.has(c) && result.length < count) {
                    result.push({ char: c, wuxing: wx });
                }
            }
        }
        return result.slice(0, count);
    }

    return { recommend, getChars };
})();
