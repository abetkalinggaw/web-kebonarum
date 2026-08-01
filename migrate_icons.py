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

fa_map = {
    'fa-arrow-right': 'ArrowRight',
    'fa-arrow-up': 'ArrowUp',
    'fa-arrow-up-right-from-square': 'ExternalLink',
    'fa-bars': 'Menu',
    'fa-boxes': 'Package',
    'fa-calendar': 'Calendar',
    'fa-calendar-alt': 'CalendarDays',
    'fa-calendar-check': 'CalendarCheck',
    'fa-chart-bar': 'BarChart',
    'fa-chart-line': 'LineChart',
    'fa-chart-pie': 'PieChart',
    'fa-check-circle': 'CheckCircle',
    'fa-church': 'Church',
    'fa-circle-notch': 'Loader2',
    'fa-clock': 'Clock',
    'fa-coins': 'Coins',
    'fa-cross': 'Cross',
    'fa-database': 'Database',
    'fa-edit': 'Edit',
    'fa-envelope': 'Mail',
    'fa-envelope-open-text': 'MailOpen',
    'fa-exclamation-circle': 'AlertCircle',
    'fa-exclamation-triangle': 'AlertTriangle',
    'fa-external-link-alt': 'ExternalLink',
    'fa-file-invoice-dollar': 'FileText',
    'fa-file-pdf': 'FileText',
    'fa-hand-holding-usd': 'HandCoins',
    'fa-hands-helping': 'Handshake',
    'fa-id-card': 'IdCard',
    'fa-info-circle': 'Info',
    'fa-instagram': 'Camera', 
    'fa-newspaper': 'Newspaper',
    'fa-phone-alt': 'Phone',
    'fa-plus': 'Plus',
    'fa-plus-circle': 'PlusCircle',
    'fa-save': 'Save',
    'fa-search': 'Search',
    'fa-shield-alt': 'Shield',
    'fa-sign-in-alt': 'LogIn',
    'fa-sign-out-alt': 'LogOut',
    'fa-spin': 'Loader',
    'fa-spinner': 'Loader',
    'fa-star': 'Star',
    'fa-sync-alt': 'RefreshCw',
    'fa-tachometer-alt': 'Gauge',
    'fa-times': 'X',
    'fa-trash': 'Trash',
    'fa-trash-alt': 'Trash2',
    'fa-user': 'User',
    'fa-user-circle': 'UserCircle',
    'fa-user-edit': 'UserCog',
    'fa-user-lock': 'UserMinus',
    'fa-user-plus': 'UserPlus',
    'fa-user-shield': 'ShieldCheck',
    'fa-user-tie': 'UserCheck',
    'fa-users': 'Users',
    'fa-users-cog': 'Users',
    'fa-whatsapp': 'MessageCircle',
    'fa-youtube': 'Video',
    # additions from grep
    'fa-map-marker-alt': 'MapPin',
    'fa-sun': 'Sun',
    'fa-address-book': 'Contact',
    'fa-directions': 'Map',
    'fa-camera': 'Camera',
    'fa-folder-open': 'FolderOpen',
    'fa-google-drive': 'Cloud',
    'fa-download': 'Download',
    'fa-folder': 'Folder',
}

def process_file(filepath):
    if not filepath.endswith('.js') and not filepath.endswith('.jsx'): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    used_icons = set()

    # match <i ...></i> or <i ... />
    # we need to carefully find className="..." and replace
    def replacer(match):
        full_tag = match.group(0)
        class_match = re.search(r'className=["\']([^"\']+)["\']', full_tag)
        if not class_match:
            return full_tag
        
        class_names = class_match.group(1).split()
        fa_classes = [c for c in class_names if c.startswith('fa-') or c in ['fas', 'far', 'fab', 'fa']]
        other_classes = [c for c in class_names if c not in fa_classes]

        icon_comp = None
        for c in fa_classes:
            if c in fa_map:
                icon_comp = fa_map[c]
                break
        
        if 'fa-spin' in fa_classes:
            other_classes.append('fa-spin')
            
        if not icon_comp:
            # fallback
            icon_comp = "Info"

        used_icons.add(icon_comp)

        # replace the <i ... > with <IconComp ... >
        # replace className string
        if other_classes:
            new_class_str = f'className="{" ".join(other_classes)}"'
        else:
            new_class_str = ''

        # replace tag name
        new_tag = re.sub(r'^<i\b', f'<{icon_comp} size={{18}}', full_tag)
        if new_class_str:
            new_tag = new_tag.replace(f'className="{class_match.group(1)}"', new_class_str)
        else:
            new_tag = new_tag.replace(f' className="{class_match.group(1)}"', '')
            new_tag = new_tag.replace(f'className="{class_match.group(1)}"', '')

        # handle closing tag if exists
        new_tag = re.sub(r'</i>$', f'</{icon_comp}>', new_tag)
        return new_tag

    # regex for matching <i ... > ... </i> or <i ... />
    content = re.sub(r'<i\b[^>]*>(?:.*?</i>)?', replacer, content, flags=re.DOTALL)

    if content != original_content:
        # Add imports
        import_match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];?', content)
        if import_match:
            existing = [x.strip() for x in import_match.group(1).split(',')]
            used_icons.update([x for x in existing if x])
            new_import = f"import {{ {', '.join(sorted(list(used_icons)))} }} from 'lucide-react';"
            content = content[:import_match.start()] + new_import + content[import_match.end():]
        else:
            new_import = f"import {{ {', '.join(sorted(list(used_icons)))} }} from 'lucide-react';\n"
            last_import = content.rfind('import ')
            if last_import != -1:
                end_line = content.find('\n', last_import)
                content = content[:end_line+1] + new_import + content[end_line+1:]
            else:
                content = new_import + content

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Replaced icons in {filepath}")

for pattern_str in files_to_check:
    for filepath in glob.glob(pattern_str, recursive=True):
        if os.path.isfile(filepath):
            process_file(filepath)
            
# also need to walk through directories because glob with * doesn't go deep recursively unless ** is used
# I will just run a manual walk for the directories
for root_dir in [
    "src/components/landing_page",
    "src/components/about_page",
    "src/pages"
]:
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            process_file(os.path.join(dirpath, f))
