from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os


waste_bp = Blueprint('waste', __name__)
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Waste Donation ---
@waste_bp.route('/waste_donation', methods=['POST'])
def waste_donation():
    db = get_db()
    cursor = db.cursor()

    try:
        name = request.form['name']
        quantity = request.form['quantity']
        description = request.form['description']
        donor_id = request.form['donor_id']

        if 'photo' not in request.files:
            return jsonify({'error': 'No photo uploaded'}), 400

        photo = request.files['photo']
        if not allowed_file(photo.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        filename = secure_filename(photo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        photo.save(filepath)

        query = """
        INSERT INTO waste_donations (name, quantity, description, photo, donor_id)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, quantity, description, filename, donor_id))
        db.commit()

        return jsonify({'message': 'Waste donation submitted successfully'})
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Failed to submit waste donation'}), 500


# --- Get Donations by Donor ---
@waste_bp.route('/waste_donations/<int:donor_id>', methods=['GET'])
def get_waste_donations_by_donor(donor_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM waste_donations WHERE donor_id = %s ORDER BY created_at DESC", (donor_id,))
        donations = cursor.fetchall()
        for d in donations:
            d['photo'] = f"/uploads/{d['photo']}"
        return jsonify(donations)
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Could not fetch waste donations'}), 500


# --- Mark Picked Up ---
@waste_bp.route('/update_waste/<int:waste_id>', methods=['PUT'])
def update_waste_status(waste_id):
    data = request.get_json()
    try:
        conn = get_connection()
        cursor = conn.cursor()

        if data.get('mark_picked_up'):
            cursor.execute("""
                UPDATE waste_donations
                SET status = 'picked_up'
                WHERE id = %s
            """, (waste_id,))
            conn.commit()
            return jsonify({'message': 'Marked as picked up'})

        return jsonify({'error': 'Invalid update request'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- Update Factory Info (Only) ---
@waste_bp.route('/update_factory_info/<int:waste_id>', methods=['PUT'])
def update_factory_info(waste_id):
    data = request.get_json()
    factory_name = data.get('factory_name')
    factory_location = data.get('factory_location')

    if not factory_name or not factory_location:
        return jsonify({'error': 'Factory name and location are required'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE waste_donations
            SET factory_name = %s, factory_location = %s, status = 'processing'
            WHERE id = %s
        """, (factory_name, factory_location, waste_id))
        conn.commit()
        return jsonify({'message': 'Factory info updated'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- Update Byproduct (Only) ---
@waste_bp.route('/update_byproduct/<int:waste_id>', methods=['PUT'])
def update_byproduct(waste_id):
    data = request.get_json()
    byproduct = data.get('byproduct')

    if not byproduct:
        return jsonify({'error': 'Byproduct is required'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE waste_donations
            SET byproduct = %s, status = 'converted'
            WHERE id = %s
        """, (byproduct, waste_id))
        conn.commit()
        return jsonify({'message': 'Byproduct updated'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- Get All Waste Donations ---
@waste_bp.route('/all_waste_donations', methods=['GET'])
def get_all_waste_donations():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM waste_donations ORDER BY id DESC")
        donations = cursor.fetchall()
        print("Waste donations returned to frontend:", donations)
        for d in donations:
            if d['photo']:
                d['photo'] = f"/uploads/{d['photo']}"
        return jsonify(donations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- Delete Pending Waste ---
@waste_bp.route('/delete_waste/<int:waste_id>', methods=['DELETE'])
def delete_waste(waste_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM waste_donations WHERE id = %s AND status = 'pending'", (waste_id,))
        db.commit()
        return jsonify({"message": "Waste donation deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Update Waste Fields (Basic Info) ---
@waste_bp.route('/update_waste_fields/<int:waste_id>', methods=['PUT'])
def update_waste_fields(waste_id):
    data = request.get_json()
    name = data.get('name')
    quantity = data.get('quantity')
    description = data.get('description')

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            UPDATE waste_donations
            SET name=%s, quantity=%s, description=%s
            WHERE id=%s AND status = 'pending'
        """, (name, quantity, description, waste_id))
        db.commit()
        return jsonify({"message": "Waste updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

