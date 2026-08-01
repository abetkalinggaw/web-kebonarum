const lucide = require('lucide-react');
const icons = ['Instagram', 'Youtube', 'Church', 'Cross', 'Gauge', 'HandCoins', 'Handshake', 'MessageCircle'];
for (const icon of icons) {
    if (lucide[icon]) {
        console.log(icon + ' exists');
    } else {
        console.log(icon + ' DOES NOT exist');
    }
}
