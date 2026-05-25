const API = {
    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    async getBazi(year, month, day, hour) {
        return this.post('/api/bazi', { year, month, day, hour });
    },

    async getDailyFortune(bazi, wuxingCount) {
        return this.post('/api/fortune/daily', { bazi, wuxing_count: wuxingCount });
    },

    async getNaming(lackingWuxing, gender, surname, count = 10) {
        return this.post('/api/naming', {
            lacking_wuxing: lackingWuxing,
            gender,
            surname,
            count,
        });
    },
};
