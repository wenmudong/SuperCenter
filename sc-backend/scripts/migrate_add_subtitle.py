"""迁移脚本：为 blogs 表添加 subtitle 列"""
import sqlite3
from pathlib import Path

def migrate():
    db_path = Path(__file__).parent.parent / "data" / "supercenter.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 检查列是否已存在
    cursor.execute("PRAGMA table_info(blogs)")
    columns = [col[1] for col in cursor.fetchall()]

    if "subtitle" not in columns:
        cursor.execute("ALTER TABLE blogs ADD COLUMN subtitle TEXT")
        conn.commit()
        print("Added 'subtitle' column to blogs table")
    else:
        print("Column 'subtitle' already exists")

    conn.close()

if __name__ == "__main__":
    migrate()
