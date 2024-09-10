// src/lib/TOTP.js
export class TOTP {
	constructor(secret, digits = 6, step = 30) {
		this.secret = secret;
		this.digits = digits;
		this.step = step;
	}

	async generateTOTP(time) {
		let counter = Math.floor(time / this.step);
		const data = new Uint8Array(8);
		for (let i = 7; i >= 0; i--) {
			data[i] = counter & 0xff;
			counter >>= 8;
		}

		const key = await crypto.subtle.importKey(
			'raw',
			this.base32ToUint8Array(this.secret),
			{ name: 'HMAC', hash: 'SHA-1' },
			false,
			['sign']
		);

		const signature = await crypto.subtle.sign('HMAC', key, data);
		const dataView = new DataView(signature);
		const offset = dataView.getUint8(19) & 0xf;
		const otp = dataView.getUint32(offset) & 0x7fffffff;

		return (otp % Math.pow(10, this.digits)).toString().padStart(this.digits, '0');
	}

	base32ToUint8Array(base32) {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
		let bits = 0;
		let value = 0;
		let index = 0;
		const output = new Uint8Array(Math.ceil((base32.length * 5) / 8));

		for (let i = 0; i < base32.length; i++) {
			value = (value << 5) | alphabet.indexOf(base32[i]);
			bits += 5;
			if (bits >= 8) {
				output[index++] = (value >>> (bits - 8)) & 255;
				bits -= 8;
			}
		}

		return output;
	}

	async verify(token, time = Date.now()) {
		const currentTime = Math.floor(time / 1000);
		for (let i = -1; i <= 1; i++) {
			const currentToken = await this.generateTOTP(currentTime + i * this.step);
			if (token === currentToken) return true;
		}
		return false;
	}
}
