import os

import flask
import flask_sqlalchemy
import sqlalchemy

import ezlink

app = flask.Flask(__name__)
app.config['PORT'] = os.environ.get('PORT', 5000)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['EZLINK_EMAIL'] = os.environ['EZLINK_EMAIL']
app.config['EZLINK_PASSWORD'] = os.environ['EZLINK_PASSWORD']
app.config['EZLINK_CARD_UNIQUE_CODE'] = os.environ['EZLINK_PASSWORD']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = flask_sqlalchemy.SQLAlchemy(app)


@app.route('/')
def hello():
	return 'ok'


class Transaction(db.Model):
	id = db.Column(db.Integer(), primary_key=True)
	timestamp = db.Column(db.Integer(), nullable=False)
	name = db.Column(db.String(100), nullable=False)
	value = db.Column(db.Float(), nullable=False)
	currency = db.Column(db.String(3), nullable=False)
	channel_source = db.Column(db.String(32), nullable=False)
	channel_destination = db.Column(db.String(32), nullable=False)
	category = db.Column(db.String(32), nullable=False)
	description = db.Column(db.Text())

	__tablename__ = 'orc_transactions_tab'

	@property
	def json(self):
		return {
			'id': self.id,
			'timestamp': self.timestamp,
			'name': self.name,
			'value': self.value,
			'currency': self.currency,
			'channel_source': self.channel_source,
			'channel_destination': self.channel_destination,
			'category': self.category,
			'description': self.description,
		}


@app.route('/api/v0/get-last-transactions', methods=['GET'])
def get_last_transactions():
	query_set = Transaction.query.order_by(sqlalchemy.desc(Transaction.timestamp)).all()
	return flask.jsonify([tx.json for tx in query_set])


@app.route('/api/v0/get-frequent-transactions', methods=['GET'])
def get_frequent_transactions():
	query_set = Transaction.query.all()
	frequency = {}
	for tx in query_set:
		key = (tx.name, tx.value, tx.currency, tx.channel_source, tx.channel_destination, tx.category)
		frequency.setdefault(key, 0)
		frequency[key] += 1
	
	frequencies = [(freq, {
		'name': key[0],
		'value': key[1],
		'currency': key[2],
		'channel_source': key[3],
		'channel_destination': key[4],
		'category': key[5],
	}) for key, freq in frequency.items()]
	frequencies = sorted(frequencies, key=lambda x: x[0], reverse=True)[:30]
	frequencies = [freq[1] for freq in frequencies]

	return flask.jsonify(frequencies)


@app.route('/api/v0/create-transaction', methods=['POST'])
def create_transaction():
	body = flask.request.json
	tx = Transaction(
		timestamp=body['timestamp'],
		name=body['name'],
		value=body['value'],
		currency=body['currency'],
		channel_source=body['channel_source'],
		channel_destination=body['channel_destination'],
		category=body['category'],
		description=body.get('description'),
	)
	db.session.add(tx)
	db.session.commit()
	return flask.jsonify(tx.json)


@app.route('/api/v0/delete-transaction', methods=['POST'])
def delete_transaction():
	body = flask.request.json
	tx_id = body['transaction_id']
	tx = Transaction.query.get(tx_id)
	db.session.delete(tx)
	db.session.commit()
	return flask.jsonify(tx.json)


@app.route('/api/v0/fetch-ezlink-transactions', methods=['POST'])
def fetch_ezlink_transactions():
	txs = ezlink.get_recent_transactions(
		app.config['EZLINK_EMAIL'],
		app.config['EZLINK_PASSWORD'],
		app.config['EZLINK_CARD_UNIQUE_CODE'],
	)
	newly_added = []
	for tx in txs:
		exists_query = Transaction.query.filter(
			Transaction.name==tx['name'],
			Transaction.timestamp==tx['timestamp']
		).exists()
		exists = db.session.query(exists_query).scalar()
		if exists:
			break
		new_tx = Transaction(**tx)
		db.session.add(new_tx)
		newly_added.append(new_tx.json)
	db.session.commit()
	return flask.jsonify(newly_added)


if __name__ == '__main__':
	port = int(app.config['PORT'])
	app.run(threaded=True, port=port)
