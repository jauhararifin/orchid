from typing import Iterable

import sqlalchemy

from app import db
from transactions.container import Transaction


class TransactionModel(db.Model):
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
	def dict(self):
		return {
			"id": self.id,
			"timestamp": self.timestamp,
			"name": self.name,
			"value": self.value,
			"currency": self.currency,
			"channel_source": self.channel_source,
			"channel_destination": self.channel_destination,
			"category": self.category,
			"description": self.description,
		}


def get_transactions_order_by_timestamp() -> Iterable[Transaction]:
	txs = TransactionModel.query.order_by(
		sqlalchemy.desc(TransactionModel.timestamp)
	).all()
	return [Transaction(**tx.dict) for tx in txs]


def insert_transactions(txs: Iterable[Transaction]) -> Iterable[Transaction]:
	txs = [TransactionModel(**tx.dict) for tx in txs]
	db.session.add_all(txs)
	db.session.commit()
	return [Transaction(**tx.dict) for tx in txs]


def delete_transactions(tx_ids: Iterable[int]) -> Iterable[Transaction]:
	txs = TransactionModel.query.filter(TransactionModel.id.in_(tx_ids))
	deleting = txs.all()
	txs.delete(synchronize_session='fetch')
	db.session.commit()
	return [Transaction(**tx.dict) for tx in deleting]


def is_transactions_exist(names: Iterable[str], timestamps: Iterable[int]) -> Iterable[bool]:
	result = []
	for name, timestamp in zip(names, timestamps):
		exists_query = TransactionModel.query.filter(
			TransactionModel.name==name,
			TransactionModel.timestamp==timestamp,
		).exists()
		existance = db.session.query(exists_query).scalar()
		result.append(existance)
	return result
