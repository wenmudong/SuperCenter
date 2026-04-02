"""迁移脚本：为 blogs 表添加 category 列"""
import sqlite3
from pathlib import Path

CATEGORY_OPTIONS = ["Tech", "Emotion", "Diary", "Question"]

def migrate():
    db_path = Path(__file__).parent.parent / "data" / "supercenter.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 检查列是否已存在
    cursor.execute("PRAGMA table_info(blogs)")
    columns = [col[1] for col in cursor.fetchall()]

    if "category" not in columns:
        cursor.execute("ALTER TABLE blogs ADD COLUMN category TEXT DEFAULT 'Diary'")
        # 为现有数据设置默认值
        cursor.execute("UPDATE blogs SET category = 'Diary' WHERE category IS NULL")
        conn.commit()
        print("Added 'category' column to blogs table")
    else:
        print("Column 'category' already exists")

    conn.close()

if __name__ == "__main__":
    migrate()
