# .\Scripts\Activate.ps1

from flask import Flask, make_response, request, jsonify
from flask_mysqldb import MySQL # type: ignore
from flask_cors import CORS
from flask_jwt_extended import create_access_token # type: ignore
from flask_jwt_extended import get_jwt_identity # type: ignore
from flask_jwt_extended import jwt_required,verify_jwt_in_request # type: ignore
from flask_jwt_extended import JWTManager # type: ignore
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app,supports_credentials=True)

expiration_time = datetime.now() + timedelta(days=7)

app.config['MYSQL_HOST'] = 'mysql-2f5470bb-sunilsharma97160-51e9.b.aivencloud.com'
app.config['MYSQL_USER'] = 'avnadmin'
app.config['MYSQL_PASSWORD'] = 'AVNS_q_WA4x48ufadpSCRcdu'
app.config['MYSQL_DB'] = 'defaultdb'
app.config['MYSQL_PORT'] = 25196
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config["JWT_SECRET_KEY"] = '1023'
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']

jwt = JWTManager(app)
mysql = MySQL(app)

@app.route('/')
def index():
    
    try:
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM users''')
        results = cur.fetchall() 
        cur.close()
        # print(results)
        return {'data': results}, 200
    except Exception as e:
        return 'Error connecting to the database: {}'.format(str(e))


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cur.fetchone()
        cur.close()
        print(password)

        if user:
            if password == password:
                access_token = create_access_token(identity=email, expires_delta=timedelta(days=7))
                response = make_response(jsonify({'success': True}))
                response.set_cookie('access_token_cookie', access_token, expires=expiration_time, httponly=True, secure=True, samesite='None')
                print(response)
                return response
            else:
                return {"error": "Incorrect password"}, 401
        else:
            return {"error": "User not found"}, 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500   


@app.route('/register', methods=['POST'])
def register():
        try:
            print("ok")
            data = request.get_json()
            username = data['name']
            email = data['email']
            password = data['password']
            print(username)
            if not (username and email):
                print("fail")
                return jsonify({'error': 'Username and email are required'}), 400
            cur = mysql.connection.cursor()
            cur.execute(
            '''INSERT INTO users(
            username, password, email
            ) VALUES (%s, %s, %s)''', (username, password, email)
            )
            mysql.connection.commit()
            cur.close()
            return jsonify({'message': 'User registered successfully'}), 201
        except Exception as e:
            return jsonify({'error': 'Failed to register user'}), 500
        

# checklogin

@jwt_required
@app.route('/check-login')
def checkLogin():
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        if get_jwt_identity():
            return jsonify(logged_in=True, user= user_id), 200
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

# logout

@app.route('/logout')
def logout():
    response = jsonify({'logout': True})
    response = make_response(response)
    response.set_cookie('access_token_cookie', '', expires=0, httponly=True, secure=True, samesite='None')
    return response

@jwt_required
@app.route('/dashboard')
def dashboard():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM users WHERE email = %s'''
        , [email])
        username = cur.fetchone()
        return jsonify({'success': True, 'data': username})
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
