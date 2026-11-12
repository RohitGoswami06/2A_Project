const fs = require('fs');
const path = require('path');

function getJpegDimensions(buffer) {
    let offset = 2;
    while (offset < buffer.length) {
        const marker = buffer.readUInt16BE(offset);
        if (marker >= 0xFFC0 && marker <= 0xFFC3) {
            return {
                height: buffer.readUInt16BE(offset + 5),
                width: buffer.readUInt16BE(offset + 7)
            };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
    }
    return null;
}

function getPngDimensions(buffer) {
    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20)
    };
}

const assetsDir = 'c:/Users/rg674/OneDrive/Desktop/Project/assets';
const files = fs.readdirSync(assetsDir);
files.forEach(f => {
    if (f.endsWith('.jpg') || f.endsWith('.png')) {
        const filePath = path.join(assetsDir, f);
        const buf = fs.readFileSync(filePath);
        let dim = null;
        if (f.endsWith('.jpg')) dim = getJpegDimensions(buf);
        else if (f.endsWith('.png')) dim = getPngDimensions(buf);
        console.log(`${f}: ${dim ? `${dim.width}x${dim.height}` : 'unknown'} (${buf.length} bytes)`);
    }
});
