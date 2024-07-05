const imgVal = (req, res, next) => {
    // 2 megabytes
    const valSize = 2 * 1024 * 1024;;
    const valType = ['image/jpeg', 'image/png', 'image/gif'];
    console.log(req.body);

    const img = req.body.image;

    if (!img) {
         return next();
    }

    // Extract MIME type and base64 data
    const matches = img.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: 'Invalid image format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Check if the image type is valid
    if (!valType.includes(mimeType)) {
        return res.status(400).json({ message: 'Invalid image type. Only JPEG, PNG, and GIF are allowed.' });
    }

    // Decode base64 data to check the size
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > valSize) {
        return res.status(400).json({ message: 'Image size exceeds 2MB' });
    } else {
         return next();
    }
}
module.exports = imgVal;