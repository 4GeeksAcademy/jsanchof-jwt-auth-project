"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import create_access_token, JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from flask_cors import CORS

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "da_secre_qi"
jwt = JWTManager(app)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    expose_headers=["Authorization"],
    allow_headers=["Content-Type", "Authorization"]
)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.errorhandler(NoAuthorizationError)
@app.errorhandler(InvalidHeaderError)
def handle_auth_error(e):
    return jsonify({"msg": "Token inválido o ausente"}), 401

@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    return jsonify({"msg": "Token expirado"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(err_str):
    return jsonify({"msg": f"Token inválido: {err_str}"}), 422

@jwt.unauthorized_loader
def custom_unauthorized_response(err_str):
    return jsonify({"msg": f"Falta o mal header: {err_str}"}), 401

@app.errorhandler(422)
def handle_unprocessable_entity(err):
    return jsonify({"msg": "El token enviado es inválido o faltan datos"}), 422
# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/register', methods=['POST'])
def handle_register():
    try:
        data = request.get_json(silent=True)
        email = data.get("email")
        password = data.get("password")

        # Aquí debes verificar si el email ya existe
        if not email or not password:
            return jsonify({"msg": "Email y password requeridos"}), 400

        # Crear y guardar el usuario
        role = data.get("role", "user")  # si no lo envían, se asigna "user"
        new_user = User(email=email, password=password,
                        is_active=True, role=role)
        db.session.add(new_user)
        db.session.commit()

        # Crear token después de crear usuario
        claims = {"role": "user"}
        access_token = create_access_token(
            identity=new_user.id, additional_claims=claims)

        return jsonify({
            "msg": "Usuario registrado exitosamente.",
            "access_token": access_token
        }), 201
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500


@app.route('/login', methods=['POST'])
def handle_login():
    try:
        data = request.get_json(silent=True)
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or user.password != password:
            return jsonify({"msg": "Credenciales inválidas"}), 401

        claims = {
            "role": user.role,
            "otra_informacion": {"info": "info...", "data": "data info"}
        }
        access_token = create_access_token(
            identity=str(user.id), additional_claims=claims)

        return jsonify({
            "ok": True,
            "msg": "Login exitoso",
            "access_token": access_token,
            "role": claims["role"]
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
