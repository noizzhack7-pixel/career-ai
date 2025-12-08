from typing import List, Dict, Optional
from app.models.Employee import Employee
from app.models.Position import Position
from app.models.Skill import Skill


class IngestionService:
    """Service for ingesting and accessing in-memory data (MVP without DB)."""

    def __init__(self):
        # In-memory stores; swap to DB later
        self._employees: Dict[str, Employee] = {}
        self._positions: Dict[str, Position] = {}

    # ---- Employees ----
    def ingest_employees(self, employees: List[Employee]) -> List[Employee]:
        for c in employees:
            self._employees[c.employee_id] = c
        return employees

    def ingest_employee(self, employee: Employee) -> Employee:
        self._employees[employee.employee_id] = employee
        return employee

    def get_employee(self, employee_id: str) -> Optional[Employee]:
        return self._employees.get(employee_id)

    def list_employees(self) -> List[Employee]:
        return list(self._employees.values())

    def delete_employee(self, employee_id: str) -> None:
        self._employees.pop(employee_id, None)

    def clear_employees(self) -> None:
        self._employees.clear()

    # ---- Positions ----
    def ingest_positions(self, positions: List[Position]) -> List[Position]:
        for p in positions:
            self._positions[str(p.id)] = p
        return positions

    def ingest_position(self, position: Position) -> Position:
        self._positions[str(position.id)] = position
        return position

    def get_position(self, position_id: str) -> Optional[Position]:
        return self._positions.get(position_id)

    def list_positions(self) -> List[Position]:
        return list(self._positions.values())

    def delete_position(self, position_id: str) -> None:
        self._positions.pop(position_id, None)

    def clear_positions(self) -> None:
        self._positions.clear()

    # ---- Skills (placeholder for parity) ----
    def ingest_skills(self, skills: List[Skill]) -> List[Skill]:
        # No global skills store needed for MVP
        return skills

    # ---- Validation (basic) ----
    def validate_employee(self, employee: Employee) -> bool:
        return bool(employee.name and employee.hard_skills and employee.soft_skills)

    def validate_position(self, position: Position) -> bool:
        return bool(position.name and position.category is not None)


# Singleton instance
ingestion_service = IngestionService()
