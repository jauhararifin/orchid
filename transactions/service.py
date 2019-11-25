from exceptions import INVALID_INPUT, APIError
from typing import Iterable

import cerberus

from transactions import store
from transactions.container import Transaction


def get_last_transactions() -> Iterable[Transaction]:
	return store.get_transactions_order_by_timestamp()


def get_frequent_transactions() -> Iterable[Transaction]:
	query_set = store.get_transactions_order_by_timestamp()
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

	return frequencies


def create_transactions(transactions: Iterable[Transaction]) -> Iterable[Transaction]:
	_validate_create_txs(transactions)
	txs = [Transaction(**tx) for tx in transactions]
	return store.insert_transactions(txs)


def _validate_create_txs(transactions: Iterable[Transaction]):
	validator = cerberus.Validator({
		'timestamp': {'required': True, 'type': 'integer', 'min': 0},
		'name': {'required': True, 'type': 'string', 'minlength': 3, 'maxlength': 100},
		'value': {'required': True, 'type': 'float', 'min': 0, 'max': 1000000000000000},
		'currency': {'required': True, 'type': 'string', 'minlength': 3, 'maxlength': 3},
		'channel_source': {'required': True, 'type': 'string', 'minlength': 1, 'maxlength': 32},
		'channel_destination': {'required': True, 'type': 'string', 'minlength': 1, 'maxlength': 32},
		'category': {'required': True, 'type': 'string', 'minlength': 1, 'maxlength': 32},
		'description': {'required': False, 'type': 'string', 'maxlength': 4096, },
	})
	errors = []
	success = True
	for tx in transactions:
		success = success and validator.validate(tx)
		errors.append(validator.errors)
	
	if not success:
		raise APIError(INVALID_INPUT, 'invalid transactions input', errors)


def delete_transactions(transaction_ids: Iterable[int]) -> Iterable[Transaction]:
	_validate_delete_txs(transaction_ids)
	return store.delete_transactions(transaction_ids)


def _validate_delete_txs(tx_ids: Iterable[int]):
	errors = [
		'invalid id' if not isinstance(txid, int) or txid <= 0 else None
		for txid in tx_ids
	]
	if any(err is not None for err in errors):
		raise APIError(INVALID_INPUT, 'invalid transaction ids input', errors)
