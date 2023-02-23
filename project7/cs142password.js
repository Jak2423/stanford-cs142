const crypto = require('crypto');

function makePasswordEntry(clearTextPassword) {
	var passwordEntry = {};

	var salt = crypto.randomBytes(8).toString('hex');
	var saltedPassword = clearTextPassword.concat(salt);
	var hash = crypto.createHash('sha1').update(saltedPassword).digest('base64');

	passwordEntry.salt = salt;
	passwordEntry.hash = hash;

	return passwordEntry;
}

function doesPasswordMatch(hash, salt, clearTextPassword) {
	var saltedPassword = clearTextPassword.concat(salt);
	var hash2 = crypto.createHash('sha1').update(saltedPassword).digest('base64');

	if (hash === hash2) {
		return true;
	}
	return false;
}

module.exports = { makePasswordEntry, doesPasswordMatch };
