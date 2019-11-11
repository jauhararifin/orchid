import json
import time
from datetime import date, datetime, timedelta

import simplygo


def get_recent_transactions(username, password, card_unique_code):
	rider = simplygo.Ride(username, password)
	today = (date.today() - timedelta(days=1*365)).strftime('%d-%m-%Y')
	histories = rider.get_transactions(card_unique_code, today)
	journeys = histories['Histories']
	
	transactions = []
	for journey in journeys:
		trips = journey['Trips']
		for trip in trips:
			transactions.append(_get_tx_by_trip(trip, journey))

	return transactions


def _get_tx_by_trip(trip, journey):
	tx = _get_trip_name_dict(trip)
	tx.update(_get_trip_timestamp_dict(trip))
	tx.update(_get_trip_amount_dict(trip))
	tx['description'] = json.dumps(journey)
	return tx


def _get_trip_timestamp_dict(trip):
	date = datetime.strptime(trip['ExitTransactionDate'], '%Y-%m-%dT%H:%M:%S')
	timestamp = int(time.mktime(date.timetuple()))
	return {'timestamp': timestamp}


def _get_trip_name_dict(trip):
	if trip['TransactionType'] == 'T':
		return {'name': 'Topup EZLink'}
	return {'name': '{} {} - {}'.format(
		trip['TransactionType'],
		trip['EntryLocationName'],
		trip['ExitLocationName'],
	)}


def _get_trip_amount_dict(trip):
	amount_detail = {
		'value': float(trip['Fare'][1:]),
		'currency': 'SGD',
		'category': 'Transportation',
	}
	if trip['TransactionType'] == 'T':
		amount_detail.update({
			'channel_source': 'Cash',
			'channel_destination': 'EZLink',
		})
	else:
		amount_detail.update({
			'channel_source': 'EZLink',
			'channel_destination': 'Expense',
		})
	return amount_detail
