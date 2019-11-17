from enum import Enum
from typing import Any

INVALID_INPUT = 'INVALID_INPUT'


class APIError(Exception):

	def __init__(self, errcode: str, message: str, extra_data: Any = None):
		self.errcode = errcode
		self.message = message
		self.extra_data = extra_data

	def __str__(self) -> str:
		return "{}: {}".format(self.errcode, self.message)

	@property
	def dict(self):
		return {'errcode': self.errcode, 'errmessage': self.message, 'errdata': self.extra_data}
