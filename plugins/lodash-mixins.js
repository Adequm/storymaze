import _ from 'lodash';

const localDigit = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
const UTC = 1000 * 60 * new Date().getTimezoneOffset();

export default () => {
	_.mixin({ 
		wait: time => new Promise(resolve => _.delay(resolve, time)),
		toLocaleString: date => new Date(date || Date.now() + UTC).toLocaleString('ru-RU', localDigit),
	});
};