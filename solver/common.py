"""Common utilities for solver algorithms."""

import heapq
from dataclasses import dataclass
from typing import Generic, TypeVar, List, Tuple

T = TypeVar("T")


class MinHeap(Generic[T]):
    """Min-heap priority queue for A* algorithm."""

    def __init__(self):
        self.data: List[Tuple[float, T]] = []
        self.counter = 0  # Tie-breaker for stable sorting

    def push(self, key: float, value: T) -> None:
        """Push value with priority key to heap."""
        heapq.heappush(self.data, (key, self.counter, value))
        self.counter += 1

    def pop(self) -> T | None:
        """Pop minimum element from heap."""
        if not self.data:
            return None
        _, _, value = heapq.heappop(self.data)
        return value

    def size(self) -> int:
        """Return number of elements in heap."""
        return len(self.data)

    def empty(self) -> bool:
        """Check if heap is empty."""
        return len(self.data) == 0


@dataclass
class SolveStats:
    """Statistics for puzzle solving."""

    algorithm: str
    steps: int
    nodes_explored: int
    time_ms: float
    found: bool
