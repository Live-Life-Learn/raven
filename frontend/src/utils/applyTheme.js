export async function applyUserTheme(workspaceId = null) {
  try {
    let endpoint = "/api/method/raven.raven.api.theme.get_theme";
    if (workspaceId) {
      endpoint += `?workspace=${workspaceId}`;
    }

    const res = await fetch(endpoint);
    const { message: theme } = await res.json();

    if (!theme || typeof theme !== "object") return;

    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
  } catch (err) {
    console.error("Failed to apply theme:", err);
  }
}