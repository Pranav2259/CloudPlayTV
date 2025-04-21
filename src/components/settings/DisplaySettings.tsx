import React, { useState } from "react";

interface DisplaySettingsProps {
  settings: {
    theme: string;
    resolution: string;
    refreshRate: string;
    hdr: boolean;
    volume: number;
    mute: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export function DisplaySettings({
  settings,
  onSettingsChange,
}: DisplaySettingsProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Display & Sound Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Display Settings</h3>
          <div className="bg-card rounded-lg divide-y divide-muted">
            <div className="p-4 flex justify-between items-center">
              <label htmlFor="theme-select" className="text-muted-foreground">
                Theme
              </label>
              <select
                id="theme-select"
                className="bg-muted rounded px-3 py-1"
                value={settings.theme}
                onChange={(e) =>
                  onSettingsChange({ ...settings, theme: e.target.value })
                }
                aria-label="Select theme"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label
                htmlFor="resolution-select"
                className="text-muted-foreground"
              >
                Resolution
              </label>
              <select
                id="resolution-select"
                className="bg-muted rounded px-3 py-1"
                value={settings.resolution}
                onChange={(e) =>
                  onSettingsChange({ ...settings, resolution: e.target.value })
                }
                aria-label="Select resolution"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="1440p">1440p</option>
                <option value="4k">4K</option>
              </select>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label
                htmlFor="refresh-rate-select"
                className="text-muted-foreground"
              >
                Refresh Rate
              </label>
              <select
                id="refresh-rate-select"
                className="bg-muted rounded px-3 py-1"
                value={settings.refreshRate}
                onChange={(e) =>
                  onSettingsChange({ ...settings, refreshRate: e.target.value })
                }
                aria-label="Select refresh rate"
              >
                <option value="60Hz">60Hz</option>
                <option value="120Hz">120Hz</option>
                <option value="144Hz">144Hz</option>
              </select>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label htmlFor="hdr-toggle" className="text-muted-foreground">
                HDR
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="hdr-toggle"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.hdr}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, hdr: e.target.checked })
                  }
                  aria-label="Toggle HDR"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Sound Settings</h3>
          <div className="bg-card rounded-lg divide-y divide-muted">
            <div className="p-4 flex justify-between items-center">
              <label htmlFor="volume-slider" className="text-muted-foreground">
                Volume
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      volume: parseInt(e.target.value),
                    })
                  }
                  className="w-32"
                  aria-label="Volume slider"
                />
                <span>{settings.volume}%</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <label htmlFor="mute-toggle" className="text-muted-foreground">
                Mute
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="mute-toggle"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.mute}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, mute: e.target.checked })
                  }
                  aria-label="Toggle mute"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
