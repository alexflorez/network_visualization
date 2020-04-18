import os
from application import app
from flask import render_template, json, jsonify


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/network')
def network():
    return render_template('network.html')


@app.route('/data_json')
def data_json():
	print("Working", os.getcwd())
	filename = "application/data/data_network.json"
	with open(filename) as f:
		data = json.load(f)
	return jsonify(data)
