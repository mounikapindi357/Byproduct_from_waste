from flask import Blueprint, jsonify, send_file
from models.db import get_connection
import csv
import io

admin_bp = Blueprint('admin', __name__)

# Get total stats: donors, NGOs, food donations, waste donations
@admin_bp.route('/admin/stats', methods=['GET'])
def get_admin_stats():
    conn = get_connection()
    cursor = conn.cursor()

    stats = {}
    try:
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'donor'")
        stats['total_donors'] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'ngo'")
        stats['total_ngos'] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM food_donations")
        stats['total_food_donations'] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM waste_donations")
        stats['total_waste_donations'] = cursor.fetchone()[0]

        return jsonify(stats)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to fetch stats"}), 500
    finally:
        cursor.close()
        conn.close()

# Export food donations CSV
@admin_bp.route('/admin/export_food', methods=['GET'])
def export_food_csv():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM food_donations")
        rows = cursor.fetchall()
        header = [i[0] for i in cursor.description]

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(header)
        writer.writerows(rows)

        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='food_donations.csv'
        )
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to export food donations"}), 500
    finally:
        cursor.close()
        conn.close()

# Export waste donations CSV
@admin_bp.route('/admin/export_waste', methods=['GET'])
def export_waste_csv():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM waste_donations")
        rows = cursor.fetchall()
        header = [i[0] for i in cursor.description]

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(header)
        writer.writerows(rows)

        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='waste_donations.csv'
        )
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to export waste donations"}), 500
    finally:
        cursor.close()
        conn.close()
