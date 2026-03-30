"""Router for manual trade overrides and configuration."""
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

class ManualOverrides(BaseModel):
    stop_loss_pct: Optional[float] = 0.0
    take_profit_pct: Optional[float] = 0.0
    min_allocation_pct: Optional[float] = 0.0
    max_allocation_pct: Optional[float] = 0.0
    manual_coin: Optional[str] = ""
    timeframe: Optional[str] = ""

class SettingsRouter:
    """Handles manual overrides for trading parameters."""
    def __init__(self, config, logger):
        self.router = APIRouter(prefix="/api/settings", tags=["settings"])
        self.config = config
        self.logger = logger
        self.overrides_path = Path(self.config.DATA_DIR) / "manual_overrides.json"

        # Register routes
        self.router.add_api_route("/overrides", self.get_overrides, methods=["GET"])
        self.router.add_api_route("/overrides", self.update_overrides, methods=["POST"])

    def _ensure_data_dir(self):
        """Ensure data directory exists."""
        os.makedirs(os.path.dirname(self.overrides_path), exist_ok=True)

    async def get_overrides(self) -> Dict[str, Any]:
        """Fetch current manual overrides from disk."""
        if not self.overrides_path.exists():
            return {
                "stop_loss_pct": 0,
                "take_profit_pct": 0,
                "min_allocation_pct": 0,
                "max_allocation_pct": 0,
                "manual_coin": ""
            }
        try:
            with open(self.overrides_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            self.logger.error("Failed to load overrides: %s", e)
            return {}

    async def update_overrides(self, overrides: ManualOverrides) -> Dict[str, Any]:
        """Save manual overrides to disk."""
        try:
            self._ensure_data_dir()
            data = overrides.dict()
            with open(self.overrides_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
            self.logger.info("Manual overrides updated: %s", data)
            return {"status": "success", "message": "Overrides saved successfully", "data": data}
        except Exception as e:
            self.logger.error("Failed to save overrides: %s", e)
            raise HTTPException(status_code=500, detail=str(e))
