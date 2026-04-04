"""迁移脚本：为 blogs 表添加阅读量字段"""
import sqlite3
from pathlib import Path

def migrate():
    db_path = Path(__file__).parent.parent / "data" / "supercenter.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 检查 view_count 列是否已存在
    cursor.execute("PRAGMA table_info(blogs)")
    columns = [col[1] for col in cursor.fetchall()]

    if "view_count" not in columns:
        cursor.execute("ALTER TABLE blogs ADD COLUMN view_count INTEGER DEFAULT 0")
        print("Added 'view_count' column to blogs table")
    else:
        print("Column 'view_count' already exists")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
