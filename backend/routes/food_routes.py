from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
from models.db import get_db, get_connection
from datetime import datetime, timedelta

food_bp = Blueprint('food', __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@food_bp.route('/food_donation', methods=['POST'])
def food_donation():
    db = get_db()
    cursor = db.cursor()

    try:
        name = request.form['name']
        quantity = request.form['quantity']
        valid_hours = float(request.form['valid_hours'])
        comment = request.form['comment']
        donor_id = request.form['donor_id']
        location = request.form.get('location')  # Optional

        if 'photo' not in request.files:
            return jsonify({'error': 'No photo uploaded'}), 400

        photo = request.files['photo']
        if not allowed_file(photo.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        filename = secure_filename(photo.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, filename)
        photo.save(filepath)

        query = """
        INSERT INTO food_donations (name, quantity, valid_hours, comment, location, photo, donor_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, quantity, valid_hours, comment, location, filename, donor_id))
        db.commit()

        return jsonify({'message': 'Food donation submitted successfully'})
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Failed to submit donation'}), 500


@food_bp.route('/food_donations/<int:donor_id>', methods=['GET'])
def get_donations_by_donor(donor_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM food_donations WHERE donor_id = %s ORDER BY created_at DESC", (donor_id,))
        donations = cursor.fetchall()
        for d in donations:
            d['photo'] = f"/uploads/{d['photo']}"
            # ✅ Add expiry field:
            created = d['created_at']
            valid = d['valid_hours']
            d['expiry'] = (created + timedelta(hours=valid)).isoformat()
        return jsonify(donations)
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Could not fetch donations'}), 500

@food_bp.route('/all_donations', methods=['GET'])
def get_all_donations():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM food_donations ORDER BY id DESC")
        donations = cursor.fetchall()
        for d in donations:
            d['photo'] = f"/uploads/{d['photo']}"
            created = d['created_at']
            valid = d['valid_hours']
            d['expiry'] = (created + timedelta(hours=valid)).isoformat()

        cursor.close()
        conn.close()
        return jsonify(donations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@food_bp.route('/delete_donation/<int:donation_id>', methods=['DELETE'])
def delete_donation(donation_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM food_donations WHERE id = %s AND status = 'pending'", (donation_id,))
        db.commit()
        return jsonify({"message": "Donation deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@food_bp.route('/update_donation_fields/<int:donation_id>', methods=['PUT'])
def update_donation_fields(donation_id):
    data = request.get_json()
    name = data.get('name')
    quantity = data.get('quantity')
    comment = data.get('comment')

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            UPDATE food_donations
            SET name=%s, quantity=%s, comment=%s
            WHERE id=%s AND status = 'pending'
        """, (name, quantity, comment, donation_id))
        db.commit()
        return jsonify({"message": "Donation updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@food_bp.route('/update_donation/<int:donation_id>', methods=['PUT'])
def update_donation_status(donation_id):
    data = request.get_json()
    status = data.get('status')
    reason = data.get('reason')  # Only needed if rejected

    try:
        db = get_db()
        cursor = db.cursor()
        
        if status == 'rejected':
            cursor.execute("""
                UPDATE food_donations
                SET status = %s, rejection_reason = %s
                WHERE id = %s
            """, (status, reason, donation_id))
        else:
            cursor.execute("""
                UPDATE food_donations
                SET status = %s
                WHERE id = %s
            """, (status, donation_id))

        db.commit()
        return jsonify({'message': 'Donation status updated'})
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Failed to update status'}), 500
