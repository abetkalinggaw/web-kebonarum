const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Note: we can use a simple recursive function instead to avoid dependency issues if glob isn't installed. But we will just use a recursive function.

const filesToCheck = [
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
    "src/components/landing_page",
    "src/components/about_page",
    "src/pages"
];

const faMap = {
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
    'fa-youtube': 'Video'
};

function getAllFiles(dirPath, arrayOfFiles) {
    let files;
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        return arrayOfFiles; // Not a dir or doesn't exist
    }

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

let files = [];
for (let p of filesToCheck) {
    if (fs.existsSync(p)) {
        if (fs.statSync(p).isDirectory()) {
            files = getAllFiles(p, files);
        } else {
            files.push(path.join(__dirname, p));
        }
    }
}

// Remove duplicates
files = [...new Set(files)];

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let usedIcons = new Set();
    
    // Process <i className="..."></i> or <i className='...'></i>
    // Replace with <IconName size={18} className="..." />
    // Note: there might be other classes besides FA classes, we should preserve them.
    
    const iTagRegex = /<i\s+([^>]*?)className=(["'])(.*?)\2([^>]*?)><\/i>|<i\s+([^>]*?)className=(["'])(.*?)\6([^>]*?)\/>/g;
    
    content = content.replace(iTagRegex, (match, beforeClass1, quote1, classNames1, afterClass1, beforeClass2, quote2, classNames2, afterClass2) => {
        let classNames = classNames1 || classNames2;
        let beforeClass = beforeClass1 || beforeClass2;
        let afterClass = afterClass1 || afterClass2;
        
        let classes = classNames.split(' ');
        let faClasses = classes.filter(c => c.startsWith('fa-') || ['fas', 'far', 'fab', 'fa'].includes(c));
        let otherClasses = classes.filter(c => !c.startsWith('fa-') && !['fas', 'far', 'fab', 'fa'].includes(c));
        
        let iconComp = null;
        for (let faClass of faClasses) {
            if (faMap[faClass]) {
                iconComp = faMap[faClass];
                break;
            }
        }
        
        // If it's a spin class, maybe add className="animate-spin" or something? The user says ensure styling maps smoothly.
        if (faClasses.includes('fa-spin')) {
            otherClasses.push('fa-spin'); // keep fa-spin class for CSS to handle, or let lucide handle it if they have it
        }
        
        if (iconComp) {
            usedIcons.add(iconComp);
            let otherClassStr = otherClasses.length > 0 ? ` className="${otherClasses.join(' ')}"` : '';
            // keep other props
            let otherProps = (beforeClass + ' ' + afterClass).trim();
            if (otherProps) otherProps = ' ' + otherProps;
            
            return `<${iconComp} size={18}${otherClassStr}${otherProps} />`;
        } else {
            return match; // If not found, don't replace
        }
    });

    if (content !== originalContent) {
        // Add imports
        // Check if there is already an import for lucide-react
        let importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/;
        let match = content.match(importRegex);
        if (match) {
            let existingIcons = match[1].split(',').map(s => s.trim()).filter(s => s);
            existingIcons.forEach(i => usedIcons.add(i));
            let newImportStr = `import { ${Array.from(usedIcons).sort().join(', ')} } from 'lucide-react';`;
            content = content.replace(importRegex, newImportStr);
        } else {
            let newImportStr = `import { ${Array.from(usedIcons).sort().join(', ')} } from 'lucide-react';\n`;
            // insert after last import or at beginning
            let lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                let endOfLine = content.indexOf('\n', lastImportIndex);
                content = content.substring(0, endOfLine + 1) + newImportStr + content.substring(endOfLine + 1);
            } else {
                content = newImportStr + content;
            }
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Replaced icons in ${file}`);
    }
}
