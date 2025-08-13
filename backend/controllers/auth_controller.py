from flask import request, jsonify
from models.user_model import create_user, find_user_by_email
from werkzeug.security import generate_password_hash, check_password_hash

def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']
    role = data['role']

    if find_user_by_email(email):
        return jsonify({'error': 'User already exists'}), 400

    hashed_pw = generate_password_hash(password)
    create_user(name, email, hashed_pw, role)
    return jsonify({'message': 'Registered successfully'}), 201

def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = find_user_by_email(email)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if check_password_hash(user['password'], password):
        return jsonify({
            'message': 'Login successful',
            'role': user['role'],
            'id': user['id'],
            'username': user['name']  # ✅ send username to frontend
        }), 200
    else:
        return jsonify({'error': 'Incorrect password'}), 401

