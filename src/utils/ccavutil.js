var crypto = require('crypto');
exports.encrypt = function (plainText, workingKey) {
	console.log(workingKey)
	const hash = crypto.createHash('md5').update(workingKey).digest();
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
	var cipher = crypto.createCipheriv('aes-128-cbc', hash, iv);
	var encoded = cipher.update(plainText, 'utf8', 'hex');
	encoded += cipher.final('hex');
	return encoded;
};


exports.decrypt = function (encText, workingKey) {
	const hash = crypto.createHash('md5').update(workingKey).digest();
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
	var decipher = crypto.createDecipheriv('aes-128-cbc', hash, iv);
	var decoded = decipher.update(encText, 'hex', 'utf8');
	decoded += decipher.final('utf8');
	return decoded;
};

