<template>
	<section :class="dashboardClass">
		<div class="search-box-container">
			<div class="search-box-heading">
				<div class="search-box-heading-title">
					<div class="search-box-heading-cid">{{ $t("message.heading.cid") }}</div>
					<div class="search-box-heading-place">{{ $t("message.heading.place") }}</div>
				</div>
			</div>
			<div class="search-box">
				<div class="search-box-input">
					<input @keyup.enter="getPeers(cid)" v-model="cid" type="text" :placeholder="$t('message.heading.place-your-cid-here')" />
				</div>
				<div class="search-box-button"
					@click="getPeers(cid)">{{ $t("message.heading.search") }}</div>
			</div>
		</div>
		<div class="results-box-container">
			<div v-for="(pobj, pobjIndex) in peerIdObjs" class="results-box-host" :key="pobjIndex">
				<div class="results-title">{{ $t("message.heading.miner") }}:</div>
				<div class="results-box-minerid">
					{{ pobj.minerId }}
				</div>
				<div class="results-title">{{ $t("message.heading.peer") }}:</div>
				<div class="results-box-peerid">
					{{ pobj.ID }}
				</div>
				<div class="results-title">{{ $t("message.heading.addresses") }}:</div>
				<div class="results-box-multiaddrs">
					<div v-for="(addr, addrIndex) in peerIdObjs[pobjIndex].Addrs" class="results-box-multiaddr" :key="addrIndex">
						{{ addr }}
					</div>
				</div>
				<div class="hr" />
			</div>
		</div>
		<div class="loader"
			v-show="loading">
			<ProgressSpinner />
		</div>
	</section>
</template>

<script src="@/src/js/dashboard.js" scoped />
<style src="@/src/scss/dashboard.scss" lang="scss" scoped />
