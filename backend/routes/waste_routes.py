from flask import Blueprint, request, jsonify
from db import get_connection
from models.db import get_db, get_connection


waste_bp = Blueprint('waste_bp', __name__)

@waste_bp.route('/waste_donations', methods=['GET'])
def get_waste_donations():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM waste_donations")
        donations = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in donations]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@waste_bp.route('/update_waste/<int:waste_id>', methods=['PUT'])
def update_waste_status(waste_id):
    data = request.get_json()
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # ✅ Mark as picked up
        if data.get('mark_picked_up'):
            cursor.execute("""
                UPDATE waste_donations
                SET status = 'picked_up'
                WHERE id = %s
            """, (waste_id,))
            conn.commit()
            return jsonify({'message': 'Marked as picked up'})

        # ✅ Update factory info
        if data.get('factory_name') and data.get('factory_location'):
            cursor.execute("""
                UPDATE waste_donations
                SET factory_name = %s,
                    factory_location = %s,
                    status = 'processing'
                WHERE id = %s
            """, (data['factory_name'], data['factory_location'], waste_id))
            conn.commit()
            return jsonify({'message': 'Factory info updated'})

        # ✅ Update byproduct
        if data.get('byproduct'):
            cursor.execute("""
                UPDATE waste_donations
                SET byproduct = %s,
                    status = 'converted'
                WHERE id = %s
            """, (data['byproduct'], waste_id))
            conn.commit()
            return jsonify({'message': 'Byproduct updated'})

        return jsonify({'error': 'Invalid update request'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
