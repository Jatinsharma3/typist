from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'mysql-2f5470bb-sunilsharma97160-51e9.b.aivencloud.com'
app.config['MYSQL_USER'] = 'avnadmin'
app.config['MYSQL_PASSWORD'] = 'AVNS_q_WA4x48ufadpSCRcdu'
app.config['MYSQL_DB'] = 'defaultdb'
app.config['MYSQL_PORT'] = 25196

mysql = MySQL(app)

@app.route('/')
def index():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM users''')
        results = cur.fetchall() 
        cur.close()
        return {'data': results}, 200
    except Exception as e:
        return 'Error connecting to the database: {}'.format(str(e))

@app.route('/register', methods=['POST'])
def register():
    # if request.method == 'POST':
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

if __name__ == '__main__':
    app.run(debug=True)
