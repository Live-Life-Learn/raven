// File: src/components/feature/ThemeEditor.tsx

import React, { useEffect, useState } from 'react';
import { applyUserTheme } from '@/utils/applyTheme';

type ThemeScope = 'user' | 'workspace' | 'global';

interface ThemeEditorProps {
  scope: ThemeScope;
  workspaceId?: string;
}

const fieldConfig = [
  { key: 'background', label: 'Background' },
  { key: 'text', label: 'Text' },
  { key: 'sidebar_bg', label: 'Sidebar Background' },
  { key: 'sidebar_text', label: 'Sidebar Text' },
  { key: 'accent', label: 'Accent' }
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ scope, workspaceId }) => {
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  const [theme, setTheme] = useState<Record<string, string>>({});
  const [themeJson, setThemeJson] = useState<string>('{}');

  useEffect(() => {
    const fetchTheme = async () => {
      const url = '/api/method/raven.raven.api.theme.get_theme' +
        (workspaceId ? `?workspace=${workspaceId}` : '');
      const res = await fetch(url);
      const data = await res.json();
      const t = data.message || {};
      setTheme(t);
      setThemeJson(JSON.stringify(t, null, 2));
      for (const [k, v] of Object.entries(t)) {
        document.documentElement.style.setProperty(`--${k}`, v);
      }
    };
    fetchTheme();
  }, [workspaceId]);

  const syncJson = (updatedTheme: Record<string, string>) => {
    setThemeJson(JSON.stringify(updatedTheme, null, 2));
    for (const [k, v] of Object.entries(updatedTheme)) {
      document.documentElement.style.setProperty(`--${k}`, v);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setThemeJson(value);
    try {
      const parsed = JSON.parse(value);
      setTheme(parsed);
      syncJson(parsed);
    } catch {
      // Ignore invalid JSON during typing
    }
  };

  const handleColorChange = (key: string, value: string) => {
    const updated = { ...theme, [key]: value };
    setTheme(updated);
    syncJson(updated);
  };

  const saveTheme = async () => {
    const endpoint =
      scope === 'global'
        ? '/api/method/raven.raven.api.theme.update_global_theme'
        : scope === 'workspace'
          ? '/api/method/raven.raven.api.theme.update_workspace_theme'
          : '/api/method/raven.raven.api.theme.update_user_theme';

    const payload = new URLSearchParams({
      theme_json: JSON.stringify(theme),
      ...(workspaceId && { workspace: workspaceId })
    });

    await fetch(endpoint, { method: 'POST', body: payload });
    await applyUserTheme(workspaceId);
  };

  return (
    <div className="theme-editor">
      <div className="toolbar">
        <button onClick={() => setMode('visual')} className={mode === 'visual' ? 'active' : ''}>Visual</button>
        <button onClick={() => setMode('json')} className={mode === 'json' ? 'active' : ''}>JSON</button>
      </div>

      {mode === 'visual' && (
        <div className="editor">
          {fieldConfig.map(field => (
            <div key={field.key} className="field">
              <label htmlFor={field.key}>
                {field.label}
                <span className="tooltip-trigger">ℹ️
                  <div className="tooltip">
                    <img src={`/theme-help/${field.key}.png`} alt={field.label} />
                  </div>
                </span>
              </label>
              <input
                type="color"
                id={field.key}
                value={theme[field.key] || ''}
                onChange={(e) => handleColorChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {mode === 'json' && (
        <textarea value={themeJson} onChange={handleJsonChange} />
      )}

      <div className="actions">
        <button onClick={saveTheme}>Save</button>
      </div>
    </div>
  );
};
