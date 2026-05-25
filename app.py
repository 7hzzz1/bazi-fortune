import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, request, send_from_directory, abort
from core.metaphysic import analyze
from core.fortune import get_daily_fortune
from core.naming import recommend_names, get_single_chars

app = Flask(__name__, static_folder='static', static_url_path='/static')


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/api/bazi', methods=['POST'])
def api_bazi():
    data = request.get_json()
    if not data:
        abort(400, "请提供JSON数据")

    year = data.get('year')
    month = data.get('month')
    day = data.get('day')
    hour = data.get('hour', 12)

    if not all([year, month, day]):
        abort(400, "请提供完整的出生年月日")

    try:
        result = analyze(int(year), int(month), int(day), int(hour))
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/fortune/daily', methods=['POST'])
def api_daily_fortune():
    data = request.get_json()
    if not data:
        abort(400, "请提供JSON数据")

    bazi = data.get('bazi')
    wuxing_count = data.get('wuxing_count')

    if not bazi or not wuxing_count:
        abort(400, "请先进行八字排盘")

    try:
        result = get_daily_fortune(bazi, wuxing_count)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/naming', methods=['POST'])
def api_naming():
    data = request.get_json()
    if not data:
        abort(400, "请提供JSON数据")

    lacking_wuxing = data.get('lacking_wuxing', [])
    gender = data.get('gender', 'male')
    surname = data.get('surname', '')
    count = data.get('count', 10)

    if not lacking_wuxing:
        abort(400, "请提供五行缺失信息")

    try:
        names = recommend_names(lacking_wuxing, gender, count, surname)
        chars = get_single_chars(lacking_wuxing, gender)
        return jsonify({"success": True, "data": {"names": names, "chars": chars}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8888)
