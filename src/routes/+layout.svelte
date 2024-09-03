<script>
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import Header from './Header.svelte';
	import { onMount } from "svelte";
	import '../app.css';	
	import { authStore, pb } from '../auth.js';	
	let isValid=false
	onMount(()=>{
		authStore.subscribe((store) => {

			if(!store || !store.user) 
				return;//....
    		isValid = store.token?true:false			
			if (!store.isLoggedIn) {
				console.log('****');
				goto('/login')
			}		
		});		
	})
  </script>
<div class="bg-gray-100 text-slate-800 p-2 min-h-screen">
	{#if isValid}
		<Header isValid={isValid}></Header>			
	{/if}
	<main class="min-h-screen p-2">

		<!-- {#if !isValid}
			{#if $page?.route?.id?.toString()=='/' || $page.url.toString().includes('login')}
				<slot />
			{:else}
				<p class="text-2xl text-orange-700 text-center w-full">You are Not Authorized,Please Login to Proceed</p>
			{/if}
		{:else}
			<slot/>			
		{/if} -->

		<div>
			<slot></slot>
		</div>
	</main>
	<footer>
		<p class="bg-slate-800 text-white uppercase text-center p-2">visit <a class="underline text-xl" href="https://meciahacks2.odoo.com">MECIA2.0 WEBSITE</a></p>
	</footer>
</div>
<style>	
</style>




