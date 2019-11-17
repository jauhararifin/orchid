import os
from exceptions import APIError
from functools import wraps

import cerberus
import flask

from app import app
from ezlink import service as ez_service
from transactions import service as tx_service


def error_handler(func):
	@wraps(func)
	def wrapper(*args, **kwargs):
		try:
			return func(*args, **kwargs)
		except APIError as e:
			return flask.jsonify(e.dict), 400
	return wrapper


@app.route('/')
@error_handler
def hello():
	return 'ok'


@app.route('/api/v0/get-last-transactions', methods=['GET'])
@error_handler
def get_last_transactions():
	return flask.jsonify(tx_service.get_last_transactions())


@app.route('/api/v0/get-frequent-transactions', methods=['GET'])
@error_handler
def get_frequent_transactions():
	return flask.jsonify(tx_service.get_frequent_transactions())


@app.route('/api/v0/create-transactions', methods=['POST'])
@error_handler
def create_transactions():
	txs = flask.request.json
	return flask.jsonify(tx_service.create_transactions(txs))


@app.route('/api/v0/delete-transactions', methods=['POST'])
@error_handler
def delete_transactions():
	tx_ids = flask.request.json
	return flask.jsonify(tx_service.delete_transactions(tx_ids))


@app.route('/api/v0/sync-ezlink-transactions', methods=['POST'])
@error_handler
def sync_ezlink_transactions():
	txs = ez_service.sync_ezlink_transactions()
	return flask.jsonify(txs)


if __name__ == '__main__':
	port = int(app.config['PORT'])
	app.run(threaded=True, port=port)
