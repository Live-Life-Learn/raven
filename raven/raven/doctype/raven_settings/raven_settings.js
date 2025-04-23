// Copyright (c) 2023, The Commit Company and contributors
// For license information, please see license.txt

frappe.ui.form.on("Raven Settings", {
  refresh(frm) {
    if (frm.doc.global_theme) {
      frm.add_custom_button("Edit Global Theme", () => {
        frappe.set_route("Form", "Raven User Theme", frm.doc.global_theme);
      }, "Theme");
    }

    if (!frm.doc.enable_user_theme) {
      frm.dashboard.set_headline(
        "Personal themes are currently disabled. Users will see only the global or workspace theme."
      );
    }
  },

  enable_user_theme(frm) {
    const msg = frm.doc.enable_user_theme
      ? "Personal theming enabled."
      : "Personal theming disabled.";
    const indicator = frm.doc.enable_user_theme ? "green" : "orange";

    frappe.show_alert({ message: msg, indicator });
  }
});