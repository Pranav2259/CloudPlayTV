import React from "react";

interface ControllerSettingsProps {
  settings: {
    vibration: boolean;
    sensitivity: number;
    buttonMapping: string;
    deadzone: number;
  };
  onSettingsChange: (settings: any) => void;
}

export function ControllerSettings({
  settings,
  onSettingsChange,
}: ControllerSettingsProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Controller Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Controller Configuration</h3>
          <div className="bg-card rounded-lg divide-y divide-muted">
            <div className="p-4 flex justify-between items-center">
              <label
                htmlFor="vibration-toggle"
                className="text-muted-foreground"
              >
                Vibration
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="vibration-toggle"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.vibration}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      vibration: e.target.checked,
                    })
                  }
                  aria-label="Toggle vibration"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label
                htmlFor="sensitivity-slider"
                className="text-muted-foreground"
              >
                Sensitivity
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sensitivity-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sensitivity}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      sensitivity: parseInt(e.target.value),
                    })
                  }
                  className="w-32"
                  aria-label="Sensitivity slider"
                />
                <span>{settings.sensitivity}%</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label
                htmlFor="button-mapping-select"
                className="text-muted-foreground"
              >
                Button Mapping
              </label>
              <select
                id="button-mapping-select"
                className="bg-muted rounded px-3 py-1"
                value={settings.buttonMapping}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    buttonMapping: e.target.value,
                  })
                }
                aria-label="Select button mapping"
              >
                <option value="default">Default</option>
                <option value="alternative">Alternative</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label
                htmlFor="deadzone-slider"
                className="text-muted-foreground"
              >
                Deadzone
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="deadzone-slider"
                  type="range"
                  min="0"
                  max="20"
                  value={settings.deadzone}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      deadzone: parseInt(e.target.value),
                    })
                  }
                  className="w-32"
                  aria-label="Deadzone slider"
                />
                <span>{settings.deadzone}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
