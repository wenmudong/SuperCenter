"""迁移脚本：为 comments 表添加软删除字段"""
import sqlite3
from pathlib import Path

def migrate():
    db_path = Path(__file__).parent.parent / "data" / "supercenter.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 检查 is_deleted 列是否已存在
    cursor.execute("PRAGMA table_info(comments)")
    columns = [col[1] for col in cursor.fetchall()]

    if "is_deleted" not in columns:
        cursor.execute("ALTER TABLE comments ADD COLUMN is_deleted INTEGER DEFAULT 0")
        print("Added 'is_deleted' column to comments table")
    else:
        print("Column 'is_deleted' already exists")

    if "deleted_at" not in columns:
        cursor.execute("ALTER TABLE comments ADD COLUMN deleted_at TIMESTAMP")
        print("Added 'deleted_at' column to comments table")
    else:
        print("Column 'deleted_at' already exists")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
