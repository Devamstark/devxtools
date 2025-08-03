// JSON Formatter
function formatJSON() {
    try {
        const input = document.getElementById('jsonInput').value;
        const parsed = JSON.parse(input);
        document.getElementById('jsonOutput').textContent = JSON.stringify(parsed, null, 2);
    } catch (e) {
        alert("Invalid JSON!");
    }
}

// Base64 Tools
function encodeBase64() {
    const text = document.getElementById('base64Input').value;
    document.getElementById('base64Output').textContent = btoa(text);
}

function decodeBase64() {
    const text = document.getElementById('base64Input').value;
    document.getElementById('base64Output').textContent = atob(text);
}

// Color Picker
document.getElementById('colorPicker').addEventListener('input', (e) => {
    const hex = e.target.value;
    document.getElementById('hexCode').textContent = hex;
    
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    document.getElementById('rgbCode').textContent = `rgb(${r}, ${g}, ${b})`;
});
