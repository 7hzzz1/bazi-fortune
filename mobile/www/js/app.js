(function () {
    let currentBaziData = null;

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            if (tab.dataset.tab === 'fortune' && currentBaziData) loadFortune();
        });
    });

    const monthSelect = document.getElementById('birth-month');
    const daySelect = document.getElementById('birth-day');
    const hourSelect = document.getElementById('birth-hour');
    for (let i = 1; i <= 12; i++) monthSelect.innerHTML += `<option value="${i}">${i}月</option>`;
    for (let i = 1; i <= 31; i++) daySelect.innerHTML += `<option value="${i}">${i}日</option>`;
    const shichen = [[0,'子时 (23:00-01:00)'],[1,'丑时 (01:00-03:00)'],[3,'寅时 (03:00-05:00)'],[5,'卯时 (05:00-07:00)'],[7,'辰时 (07:00-09:00)'],[9,'巳时 (09:00-11:00)'],[11,'午时 (11:00-13:00)'],[13,'未时 (13:00-15:00)'],[15,'申时 (15:00-17:00)'],[17,'酉时 (17:00-19:00)'],[19,'戌时 (19:00-21:00)'],[21,'亥时 (21:00-23:00)']];
    shichen.forEach(([val, label]) => { hourSelect.innerHTML += `<option value="${val}">${label}</option>`; });

    document.getElementById('bazi-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const year = parseInt(document.getElementById('birth-year').value);
        const month = parseInt(document.getElementById('birth-month').value);
        const day = parseInt(document.getElementById('birth-day').value);
        const hour = parseInt(document.getElementById('birth-hour').value);

        try {
            currentBaziData = BaziCore.analyze(year, month, day, hour);
            renderBaziResult(currentBaziData);
            updateFortuneTab();
            updateNamingTab();
        } catch (err) {
            alert('排盘失败: ' + err.message);
        }
    });

    function renderBaziResult(data) {
        document.getElementById('bazi-result').classList.remove('hidden');
        const pillarsEl = document.getElementById('pillars-display');
        pillarsEl.innerHTML = data.pillars.map(p => `
            <div class="pillar">
                <div class="pillar-label">${p.label}</div>
                <div class="pillar-tiangan">${p.tiangan}</div>
                <div class="pillar-dizhi">${p.dizhi}</div>
                <div class="pillar-wuxing">${p.tiangan_yinyang}${p.tiangan_wuxing} / ${p.dizhi_wuxing}</div>
            </div>`).join('');

        document.getElementById('shengxiao-display').innerHTML = `生肖：<strong>${data.shengxiao}</strong>`;
        Charts.drawWuxingRadar('wuxing-chart', data.wuxing_scores);

        const wuxingColors = {'金':'jin','木':'mu','水':'shui','火':'huo','土':'tu'};
        document.getElementById('wuxing-detail').innerHTML = Object.entries(data.wuxing_count).map(([wx, count]) => {
            const pct = Math.round(data.wuxing_scores[wx] * 100);
            return `<div class="wuxing-bar"><span class="wuxing-bar-label wx-${wuxingColors[wx]}">${wx}</span><div class="wuxing-bar-track"><div class="wuxing-bar-fill bar-${wuxingColors[wx]}" style="width:${pct}%"></div></div><span class="wuxing-bar-value">${count}个</span></div>`;
        }).join('');

        const lackingEl = document.getElementById('wuxing-lacking');
        if (data.lacking_wuxing.length > 0) {
            const zero = data.lacking_wuxing.filter(wx => data.wuxing_count[wx] === 0);
            lackingEl.innerHTML = zero.length > 0
                ? `五行缺 <strong>${zero.join('、')}</strong>，起名时可考虑补充相应属性的字。`
                : `五行中 <strong>${data.lacking_wuxing.join('、')}</strong> 较弱，起名时可适当补充。`;
        } else {
            lackingEl.innerHTML = '五行较为均衡。';
        }
    }

    function updateFortuneTab() {
        document.getElementById('fortune-need-bazi').classList.add('hidden');
        document.getElementById('fortune-result').classList.remove('hidden');
        loadFortune();
    }

    function loadFortune() {
        if (!currentBaziData) return;
        const data = BaziCore.getDailyFortune(currentBaziData.bazi, currentBaziData.wuxing_count);
        const levelNames = {excellent:'大吉',good:'小吉',neutral:'平',poor:'小凶'};
        document.getElementById('fortune-score').textContent = data.score + '分';
        document.getElementById('fortune-level').textContent = levelNames[data.level];
        document.getElementById('fortune-date').textContent = data.date + ' ' + data.today_ganzhi + '日';
        document.getElementById('fortune-overall').textContent = data.overall;
        document.getElementById('fortune-career').textContent = data.career;
        document.getElementById('fortune-love').textContent = data.love;
        document.getElementById('fortune-health').textContent = data.health;
        document.getElementById('fortune-color').textContent = data.lucky_color;
        document.getElementById('fortune-number').textContent = data.lucky_number;
        document.getElementById('fortune-direction').textContent = data.lucky_direction;
        document.getElementById('fortune-ganzhi').textContent = data.today_ganzhi;
    }

    function updateNamingTab() {
        document.getElementById('naming-need-bazi').classList.add('hidden');
        document.getElementById('naming-form-area').classList.remove('hidden');
        const badgeArea = document.getElementById('lacking-wuxing-info');
        badgeArea.innerHTML = currentBaziData.lacking_wuxing.length > 0
            ? '<span style="font-size:0.85rem;color:#64748b;">五行补充：</span>' + currentBaziData.lacking_wuxing.map(wx => `<span class="lacking-badge">${wx}</span>`).join('')
            : '<span style="font-size:0.85rem;color:#64748b;">五行均衡，将推荐综合用字</span>';
    }

    document.getElementById('naming-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentBaziData) return;
        const surname = document.getElementById('surname').value;
        const gender = document.getElementById('name-gender').value;
        let lacking = currentBaziData.lacking_wuxing;
        if (lacking.length === 0) lacking = ['金','木','水','火','土'];
        const names = Naming.recommend(lacking, gender, surname, 10);
        const chars = Naming.getChars(lacking, gender);
        document.getElementById('naming-result').classList.remove('hidden');
        document.getElementById('names-list').innerHTML = names.map(n => `<div class="name-card"><div class="name-card-name">${n.name}</div><div class="name-card-wuxing">${n.wuxing.join(' + ')}</div></div>`).join('');
        document.getElementById('chars-list').innerHTML = chars.map(c => `<span class="char-tag"><span class="char-tag-char">${c.char}</span><span class="char-tag-wx">${c.wuxing}</span></span>`).join('');
    });
})();
