const methods = {
	setLanguage(route){
		try{
			if(route.query['lang'])
				this.$i18n.locale = route.query['lang'];
		}
		catch(e){
			console.log(e);
		}
	}
}

export default {
	data () {
		return {
		}
	},
	methods: methods
}
