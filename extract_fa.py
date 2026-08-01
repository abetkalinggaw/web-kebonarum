import os, glob, re

files_to_check = [
    "src/admin/components/AdminLayout.js",
    "src/admin/pages/DashboardPage/index.js",
    "src/admin/pages/DatabaseJemaatPage/index.js",
    "src/admin/pages/KeuanganAdminPage/index.js",
    "src/admin/pages/AgendaPage/index.js",
    "src/admin/pages/WartaPage/index.js",
    "src/admin/pages/StatistikPage/index.js",
    "src/admin/pages/UserListPage/index.js",
    "src/admin/pages/LoginPage/index.js",
    "src/admin/pages/RegisterPage/index.js",
    "src/admin/warta/WartaFormPage.js",
    "src/components/menu/Navbar.js",
    "src/components/menu/Footer.js",
    "src/components/landing_page/*",
    "src/components/about_page/*",
    "src/pages/*"
]

fa_classes = set()
pattern = re.compile(r"className=[\"']([^\"']*\bfa-[a-zA-Z0-9\-]+[^\"']*)[\"']")
i_pattern = re.compile(r"<i\s+[^>]*className=[\"']([^\"']*)[\"']")

for pattern_str in files_to_check:
    for filepath in glob.glob(pattern_str, recursive=True):
        if not os.path.isfile(filepath): continue
        if not filepath.endswith('.js') and not filepath.endswith('.jsx'): continue
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            matches = i_pattern.findall(content)
            for m in matches:
                for word in m.split():
                    if word.startswith("fa-") or word in ["fas", "far", "fab", "fa"]:
                        fa_classes.add(word)

print(sorted(list(fa_classes)))
