import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS

# Import models and routes
try:
    from src.models.gift import db
    from src.routes.wedding import wedding_bp
    print("✅ Imports successful")
except Exception as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
CORS(app)  # Permite requisições de qualquer origem
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Register blueprint
app.register_blueprint(wedding_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
try:
    db.init_app(app)
    with app.app_context():
        db.create_all()
    print("✅ Database initialized successfully")
except Exception as e:
    print(f"❌ Database error: {e}")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/health')
def health_check():
    return {'status': 'healthy', 'message': 'Wedding site is running!'}

if __name__ == '__main__':
    print("🚀 Starting Wedding Site server...")
    print(f"📁 Static folder: {app.static_folder}")
    print(f"💾 Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"❌ Server error: {e}")