import json
import time
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from typing import Iterable

import pytz
import simplygo

from app import app
from transactions import store as tx_store
from transactions.container import Transaction


def sync_ezlink_transactions() -> Iterable[Transaction]:
	card_info = _get_all_card_info(
		app.config['EZLINK_EMAIL'],
		app.config['EZLINK_PASSWORD'],
	)

	txs = []
	for ci in card_info:
		txs += _get_recent_transactions(
			app.config['EZLINK_EMAIL'],
			app.config['EZLINK_PASSWORD'],
			ci,
		)
	newly_added = []

	names = [tx.name for tx in txs]
	timestamps = [tx.timestamp for tx in txs]
	existances = tx_store.is_transactions_exist(names, timestamps)
	return tx_store.insert_transactions(
			tx for tx, exist in zip(txs, existances) if not exist
	)


def _get_all_card_info(username: str, password: str) -> Iterable[str]:
	rider = simplygo.Ride(username, password)
	card_info = rider.get_card_info()
	return card_info


def _get_recent_transactions(username: str, password: str, card_info: dict) -> Iterable[Transaction]:
	rider = simplygo.Ride(username, password)
	today = (date.today() - timedelta(days=1*365)).strftime('%d-%m-%Y')
	histories = rider.get_transactions(card_info['UniqueCode'], today)
	journeys = histories['Histories']
	
	transactions = []
	for journey in journeys:
		trips = journey['Trips']
		for trip in trips:
			tx_dict = _get_tx_by_trip(trip, journey, card_info)
			transactions.append(Transaction(**tx_dict))

	return transactions


def _get_tx_by_trip(trip: dict, journey: dict, card_info: dict) -> dict:
	tx = _get_trip_name_dict(trip)
	tx.update(_get_trip_timestamp_dict(trip))
	tx.update(_get_trip_amount_dict(trip, card_info))
	tx['description'] = json.dumps(journey)
	return tx


def _get_trip_timestamp_dict(trip: dict) -> dict:
	date = datetime.strptime(trip['ExitTransactionDate'], '%Y-%m-%dT%H:%M:%S')
	tzinfo = pytz.timezone('Asia/Singapore')
	date.replace(tzinfo=tzinfo)
	timestamp = int(time.mktime(date.timetuple()))
	return {'timestamp': timestamp}


def _get_trip_name_dict(trip: dict) -> dict:
	if trip['TransactionType'] == 'T':
		return {'name': 'Topup EZLink'}
	return {'name': '{} {} - {}'.format(
		trip['TransactionType'],
		trip['EntryLocationName'],
		trip['ExitLocationName'],
	)}


def _get_trip_amount_dict(trip: dict, card_info: dict) -> dict:
	amount_detail = {
		'value': float(trip['Fare'][1:]),
		'currency': 'SGD',
		'category': 'Transportation',
	}
	card_type = card_info['Description']
	if trip['TransactionType'] == 'T':
		amount_detail.update({
			'channel_source': 'Cash',
			'channel_destination': card_type,
		})
	else:
		amount_detail.update({
			'channel_source': card_type,
			'channel_destination': 'Expense',
		})
	return amount_detail
