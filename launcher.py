import sys
import os
import webbrowser
import threading

base_dir = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, base_dir)
os.chdir(base_dir)

from app import app

def open_browser():
    webbrowser.open('http://127.0.0.1:8888')

if __name__ == '__main__':
    print("命理轩 - 八字算命平台")
    print("正在启动，请稍候...")
    print("浏览器将自动打开，如未打开请手动访问: http://127.0.0.1:8888")
    print("关闭此窗口即可退出程序")
    print()
    threading.Timer(1.5, open_browser).start()
    app.run(host='127.0.0.1', port=8888, debug=False)
