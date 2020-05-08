/********************************
 * F*** iOS PHOTOS!
 ********************************/
export const resizeImage = (file, limit = 1000, callback) => {

	getOrientation(file, (srcOrientation) => {

		const img = new Image();

		img.onload = function () {
			const canvas = document.createElement('canvas'), ctx = canvas.getContext("2d")
			let width = img.width, height = img.height
			//shrink the canvas
			let divisor = 1.1
			while (width > limit || height > limit) {
				width = Math.floor(width / divisor)
				height = Math.floor(height / divisor)
			}
			// set proper canvas dimensions before transform & export
			if (4 < srcOrientation && srcOrientation < 9) {
				canvas.width = height;
				canvas.height = width;
			} else {
				canvas.width = width;
				canvas.height = height;
			}
			// transform context before drawing image
			switch (srcOrientation) {
				case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
				case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
				case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
				case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
				case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
				case 7: ctx.transform(0, -1, -1, 0, height, width); break;
				case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
				default: break;
			}
			// draw image
			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(callback, 'image/jpeg', 0.75)
		}

		//read the file as data url
		const reader = new FileReader();
		reader.onload = function () {
			img.src = reader.result;
		}
		reader.readAsDataURL(file)

	})

}

function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	const byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	// write the bytes of the string to an ArrayBuffer
	const ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	const ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([ab], { type: mimeString });
	return blob;

}

function getOrientation(file, callback) {
	const reader = new FileReader();

	reader.onload = function (event) {
		const view = new DataView(event.target.result);

		if (view.getUint16(0, false) !== 0xFFD8) return callback(-2);

		const length = view.byteLength
		let offset = 2

		while (offset < length) {
			const marker = view.getUint16(offset, false);
			offset += 2;

			if (marker === 0xFFE1) {
				if (view.getUint32(offset += 2, false) !== 0x45786966) {
					return callback(-1);
				}
				const little = view.getUint16(offset += 6, false) === 0x4949;
				offset += view.getUint32(offset + 4, little);
				const tags = view.getUint16(offset, little);
				offset += 2;

				for (let i = 0; i < tags; i++)
					if (view.getUint16(offset + (i * 12), little) === 0x0112)
						return callback(view.getUint16(offset + (i * 12) + 8, little));
			}
			else if ((marker & 0xFF00) !== 0xFF00) break;
			else offset += view.getUint16(offset, false);
		}
		return callback(-1);
	};

	reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};