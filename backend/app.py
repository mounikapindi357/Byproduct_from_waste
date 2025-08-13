from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.food_routes import food_bp
from routes.waste_routes import waste_bp
from routes.admin_routes import admin_bp
from models.db import close_db
from flask import send_from_directory
import os



UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER 
app.config.from_object('config.Config')
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max file size

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(food_bp, url_prefix='/api')
app.register_blueprint(waste_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.teardown_appcontext(close_db)



@app.route('/')
def welcome():
    return "✅ ByProduct from Waste backend is running!"

# Serve uploaded food photos
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
