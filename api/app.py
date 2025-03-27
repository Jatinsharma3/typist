# .\Scripts\Activate.ps1

from flask import Flask, make_response, request, jsonify
import pymysql
pymysql.install_as_MySQLdb()
from flask_mysqldb import MySQL
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
app.config["JWT_SECRET_KEY"] = 'c04a62e3f192c3c486182a442a394f92c010827787cecbaf2eaf5490bc2806b3422f0b070a286286ce40654f8fe7d37e9c7fcf3189d641be30d3e5347739f0d0d5cf65bcf188d3be8a22df0b6cc09eeabf2144f13c9af7b69aea88f72b01f1c86cf01bc307bfbf2f04183235620f3c2c951a387d4ecdc12da8698b4f3a81ca546c4407e0f10b12a6b7af8992ab24aef274dd6c1929b4688dff98f9a64b4c89391a2a8703d4ecc408db40ab60ce5df0110a660df1470ad49c0a9d1dc0a866e961b2211bbc57d64830bfa9a1578effe720bb038a6040c88282f6a4d3176c1f206863d2e8dec2eddd551a36d4fcdba985d120a4ed25ebd45a3019d90e9423d6ccdf'
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
        print(1)
        verify_jwt_in_request()
        print(2)
        user_id = get_jwt_identity()
        if get_jwt_identity():
            return jsonify(logged_in=True, user= user_id), 200
    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'error': e}), 500

# logout

@app.route('/logout')
def logout():
    response = jsonify({'logout': True})
    response = make_response(response)
    response.set_cookie('access_token_cookie', '', expires=0, httponly=True, secure=True, samesite='None')
    return response


#dashboard
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
