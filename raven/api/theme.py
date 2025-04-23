import frappe
import json
from frappe import _

def user_is_admin():
    return "System Manager" in frappe.get_roles()

def get_raven_settings():
    return frappe.get_single("Raven Settings")

@frappe.whitelist()
def get_theme(user=None, workspace=None):
    """
    Returns the effective theme for a given user and workspace
    with fallback from user -> workspace -> global.
    """
    theme = {}
    settings = get_raven_settings()

    # Load global theme if available
    global_theme_json = settings.global_theme
    if global_theme_json:
        try:
            theme.update(json.loads(global_theme_json))
        except Exception:
            frappe.log_error("Invalid global theme JSON")

    # Apply workspace theme if set
    if workspace:
        ws = frappe.get_doc("Raven Workspace", workspace)
        if ws.theme:
            theme_doc = frappe.get_doc("Raven User Theme", ws.theme)
            try:
                theme.update(json.loads(theme_doc.theme_json))
            except Exception:
                frappe.log_error("Invalid workspace theme JSON")

    # Apply user theme if allowed
    if settings.enable_user_theme and user:
        user_theme = frappe.get_all("Raven User Theme", filters={"user": user}, limit=1)
        if user_theme:
            theme_doc = frappe.get_doc("Raven User Theme", user_theme[0].name)
            try:
                theme.update(json.loads(theme_doc.theme_json))
            except Exception:
                frappe.log_error("Invalid user theme JSON")

    return theme

@frappe.whitelist()
def update_global_theme(theme_json):
    if not user_is_admin():
        frappe.throw(_("Not permitted"), frappe.PermissionError)
    settings = get_raven_settings()
    settings.global_theme = theme_json
    settings.save()
    return {"message": "Global theme updated"}

@frappe.whitelist()
def update_workspace_theme(workspace, theme_json):
    ws = frappe.get_doc("Raven Workspace", workspace)
    if not ws.has_permission("write"):
        frappe.throw(_("Not permitted to update workspace theme"), frappe.PermissionError)

    if ws.theme:
        theme_doc = frappe.get_doc("Raven User Theme", ws.theme)
        theme_doc.theme_json = theme_json
        theme_doc.save()
    else:
        theme_doc = frappe.get_doc({
            "doctype": "Raven User Theme",
            "theme_name": f"Workspace {ws.workspace_name} Theme",
            "theme_json": theme_json
        }).insert()
        ws.theme = theme_doc.name
        ws.save()
    return {"message": "Workspace theme updated"}

@frappe.whitelist()
def update_user_theme(theme_json):
    user = frappe.session.user
    if user == "Guest":
        frappe.throw(_("Login required"), frappe.PermissionError)

    settings = get_raven_settings()
    if not settings.enable_user_theme:
        frappe.throw(_("User theming is disabled by admin"), frappe.PermissionError)

    existing = frappe.get_all("Raven User Theme", filters={"user": user}, limit=1)
    if existing:
        doc = frappe.get_doc("Raven User Theme", existing[0].name)
        doc.theme_json = theme_json
        doc.save()
    else:
        frappe.get_doc({
            "doctype": "Raven User Theme",
            "theme_name": f"{user} Theme",
            "user": user,
            "theme_json": theme_json
        }).insert()
    return {"message": "Theme saved"}

@frappe.whitelist()
def is_personal_theme_allowed():
    return bool(get_raven_settings().enable_user_theme)
