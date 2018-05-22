module.exports = {
	//接口请求基础地址
	baseApiUrl: process.env.NODE_ENV === 'production' ? '' : 'http://192.168.12.3:3000/',//http://192.168.12.3:3000/
	//baseApiUrl: process.env.NODE_ENV === 'production' ? '' : '',
	//baseApiUrl: process.env.NODE_ENV === 'production' ? '/icourse/v1' : 'http://192.168.13.161:8090/icourse/v1',
	//页面基础地址
	basePageUrl: process.env.NODE_ENV === 'production' ? '' : '',
	//是否是开发环境
	isDevEnv: process.env.NODE_ENV === 'development' ? true : false
};