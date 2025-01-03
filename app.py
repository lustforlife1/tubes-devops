from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Ganti dengan kunci rahasia
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Data simulasi
users = [{'username': 'admin', 'password': bcrypt.generate_password_hash('admin').decode('utf-8')}]
todos = []

# Endpoint untuk registrasi pengguna
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    users.append({'username': data['username'], 'password': hashed_pw})
    return jsonify({'message': 'User registered successfully!'})

# Endpoint untuk login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    for user in users:
        if user['username'] == data['username'] and bcrypt.check_password_hash(user['password'], data['password']):
            token = create_access_token(identity=data['username'])
            return jsonify({'message': 'Login successful!', 'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401

# Endpoint CRUD dengan autentikasi
@app.route('/todos', methods=['POST'])
@jwt_required()
def add_todo():
    data = request.json
    todos.append({'id': len(todos) + 1, 'task': data['task']})
    return jsonify({'message': 'To-Do added successfully!', 'todos': todos})

@app.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    return jsonify(todos)

if __name__ == '__main__':
    app.run(debug=True)
