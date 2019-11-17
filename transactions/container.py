from dataclasses import asdict, dataclass
from typing import Optional


@dataclass
class Transaction:
	timestamp: int
	name: str
	value: int
	currency: str
	channel_source: str
	channel_destination: str
	category: str
	id: Optional[int] = None
	description: Optional[str] = None

	@property
	def dict(self) -> dict:
		return asdict(self)
