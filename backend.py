import k_means as km
from flask import Flask, request, jsonify
from random import randint as rand
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_data_():
    data = [(rand(-100, 100), rand(-100, 100)) for _ in range(200)]
    return data

@app.route('/kmeans', methods=['POST'])
def kmeans():
    k = int(request.json['k'])
    method = request.json['method']
    centroids = request.json.get('centroids', [])
    data = request.json['data']
    kmeans = km.KMeans(k=k, data=data, initialization_method=method, centroids=centroids)
    kmeans.run()

    return jsonify({'snapshots': kmeans.snapshots})

@app.route('/generate_data', methods=['GET'])
def generate_data():
    data = generate_data_()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)