import language from '@/src/mixins/i18n/language.js'

import axios from 'axios'
import Swal from 'sweetalert2'

import ProgressSpinner from 'primevue/progressspinner'

const created = function() {
	const that = this
	
	// set language
	this.setLanguage(this.$route)
}

const computed = {
	dashboardClass() {
		return this.theme + '-dashboard-' + this.themeVariety
	},
	locale() {
		return this.$store.getters['dashboard/getLocale']
	},
	theme() {
		return this.$store.getters['dashboard/getTheme']
	},
	themeVariety() {
		return this.$store.getters['dashboard/getThemeVariety']
	}
}

const watch = {
	peers: {
		async handler(state, before) {
			await this.parsePeers(state)
		},
		deep: true,
		immediate: false
	},
	peerIdObjs: {
		async handler(state, before) {
			await this.getMiners()
		},
		deep: true,
		immediate: false
	},
	miners: {
		handler(state, before) {
			this.parseMiners(state)
		},
		deep: true,
		immediate: false
	}
}

const mounted = async function() {
	const routeParams = this.$route.params
	if(routeParams['cid']) {
		this.loading = true
		this.cid = routeParams['cid']
		await this.getPeers(this.cid)
		this.loading = false
	}
}

const methods = {
	async getPeers(cid) {
		this.peerIdObjs.length = 0
		const getUri = 'https://cid.contact/cid/' + cid
		try {
			this.peers = await axios(getUri, {
				method: 'get'
			})
		}
		catch (error) {
			Swal.fire({
				title: this.$t("message.heading.error"),
				text: `${this.$t("message.heading.could-not-retrieve-peers-for-cid")} ${this.cid}`,
				icon: 'error',
				confirmButtonText: this.$t("message.heading.cool")
			})
		}
	},
	async parsePeers(peers) {
		this.peerIdObjs.length = 0
		try {
			const providerResults = peers.data.MultihashResults.map((p) => {return p.ProviderResults})
			for (const pr of providerResults) {
				this.peerIdObjs = this.peerIdObjs.concat(pr.map((p) => {return p.Provider}))
			}
		}
		catch (error) {
			Swal.fire({
				title: this.$t("message.heading.error"),
				text: `${this.$t("message.heading.could-not-retrieve-peers-for-cid")} ${this.cid}`,
				icon: 'error',
				confirmButtonText: this.$t("message.heading.cool")
			})
		}
	},
	async getMiners() {
		for (const pobj of this.peerIdObjs) {
			const getUri = 'https://green.filecoin.space/minerid-peerid/api/v1/miner-id?peer_id=' + pobj.ID
			try {
				this.miners = await axios(getUri, {
					method: 'get'
				})
			}
			catch (error) {
				Swal.fire({
					title: this.$t("message.heading.error"),
					text: `${this.$t("message.heading.could-not-retrieve-miner-for-peer")} ${pobj.ID}`,
					icon: 'error',
					confirmButtonText: this.$t("message.heading.cool")
				})
			}
		}
	},
	async parseMiners(miners) {
		try {
			for (const miner of miners.data) {
				for (let peerObj of this.peerIdObjs) {
					if(peerObj.ID == miner.PeerId)
						peerObj.minerId = miner.MinerId
				}
			}
		}
		catch (error) {
			Swal.fire({
				title: this.$t("message.heading.error"),
				text: `${this.$t("message.heading.could-not-resolve-miner")}`,
				icon: 'error',
				confirmButtonText: this.$t("message.heading.cool")
			})
		}
	}
}

const destroyed = function() {
}

export default {
	mixins: [
		language
	],
	components: {
		ProgressSpinner
	},
	directives: {
	},
	name: 'Dashboard',
	data () {
		return {
			loading: false,
			cid: null,
			peers: [],
			peerIdObjs: [],
			miners: []
		}
	},
	created: created,
	computed: computed,
	watch: watch,
	mounted: mounted,
	methods: methods,
	destroyed: destroyed
}
