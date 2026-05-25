const Charts = {
    drawWuxingRadar(canvasId, wuxingScores) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) / 2 - 40;

        ctx.clearRect(0, 0, w, h);

        const labels = ['金', '木', '水', '火', '土'];
        const colors = ['#d97706', '#16a34a', '#2563eb', '#dc2626', '#92400e'];
        const values = [
            wuxingScores['金'] || 0,
            wuxingScores['木'] || 0,
            wuxingScores['水'] || 0,
            wuxingScores['火'] || 0,
            wuxingScores['土'] || 0,
        ];

        const angleStep = (Math.PI * 2) / 5;
        const startAngle = -Math.PI / 2;

        // Draw grid circles
        for (let i = 1; i <= 4; i++) {
            const r = (radius * i) / 4;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axes
        for (let i = 0; i < 5; i++) {
            const angle = startAngle + i * angleStep;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw data polygon
        const maxVal = Math.max(...values, 0.01);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = startAngle + i * angleStep;
            const val = values[i] / maxVal;
            const x = cx + radius * val * Math.cos(angle);
            const y = cy + radius * val * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw data points and labels
        for (let i = 0; i < 5; i++) {
            const angle = startAngle + i * angleStep;
            const val = values[i] / maxVal;
            const x = cx + radius * val * Math.cos(angle);
            const y = cy + radius * val * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = colors[i];
            ctx.fill();

            const lx = cx + (radius + 20) * Math.cos(angle);
            const ly = cy + (radius + 20) * Math.sin(angle);
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = colors[i];
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], lx, ly);
        }
    },
};
