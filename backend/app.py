from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.utils import secure_filename
from datetime import datetime
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change_me')
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
CORS(app)

jwt = JWTManager(app)
client = MongoClient("mongodb://mongodb:27017/")
db = client.weibo_app

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if db.users.find_one({'username': data['username']}):
        return jsonify({'msg': '用户名已存在'}), 409
    db.users.insert_one({
        'username': data['username'],
        'password': data['password']
    })
    return jsonify({'msg': '注册成功'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.users.find_one({
        'username': data['username'],
        'password': data['password']
    })
    if not user:
        return jsonify({'msg': '用户名或密码错误'}), 401
    token = create_access_token(identity=data['username'])
    return jsonify({'access_token': token}), 200

@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    username = get_jwt_identity()
    text = request.form.get('text', '')
    image = request.files.get('image')
    filename = ''
    if image:
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    db.posts.insert_one({
        'username': username,
        'text': text,
        'image': filename,
        'likes': 0,
        'timestamp': datetime.utcnow()
    })
    return jsonify({'msg': '发帖成功'}), 200

@app.route('/timeline', methods=['GET'])
def timeline():
    raw = db.posts.find(
    {},
    {'username':1,'text':1,'image':1,'likes':1,'timestamp':1}).sort('timestamp', -1)
    posts = []
    for p in raw:
        posts.append({
            '_id': str(p['_id']),
            'username': p['username'],
            'text': p.get('text', ''),
            'image': p['image'],
            'likes': p['likes'],
            'timestamp': p['timestamp'].isoformat()
        })
    # 按时间倒序
    posts.sort(key=lambda p: p['timestamp'], reverse=True)
    return jsonify(posts), 200

@app.route('/my_posts', methods=['GET'])
@jwt_required()
def my_posts():
    me = get_jwt_identity()
    raw = db.posts.find({'username': me}, {'username':1,'text':1,'image':1,'likes':1,'timestamp':1})
    posts = [{
        '_id': str(p['_id']),
        'username': p['username'],
        'text': p.get('text', ''),
        'image': p['image'],
        'likes': p['likes'],
        'timestamp': p['timestamp'].isoformat()
    } for p in raw]
    posts.sort(key=lambda p: p['timestamp'], reverse=True)
    return jsonify(posts), 200

@app.route('/like', methods=['POST'])
@jwt_required()
def like():
    data = request.json
    db.posts.update_one(
        {'_id': ObjectId(data['_id'])},
        {'$inc': {'likes': 1}}
    )
    return jsonify({'msg': '点赞成功'}), 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/post/<post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    username = get_jwt_identity()
    # 查一下帖子是否存在
    post = db.posts.find_one({'_id': ObjectId(post_id)})
    if not post:
        return jsonify({'msg': '帖子不存在'}), 404
    if post['username'] != username:
        return jsonify({'msg': '无权限删除此帖子'}), 403

    # 如果有文件的话，先尝试删掉磁盘上的图片
    if post.get('image'):
        try:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], post['image']))
        except OSError:
            pass

    # 最后数据库删除
    db.posts.delete_one({'_id': ObjectId(post_id)})
    return jsonify({'msg': '删除成功'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

