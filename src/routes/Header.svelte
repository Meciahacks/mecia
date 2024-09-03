<script>
	import { onMount } from "svelte";
	
	import { authStore, pb } from '../auth.js';	
	import {goto} from '$app/navigation'	
	export let isValid=false
	const shuffleText=(label)=>{
		if(!label)
				return
		let itration=0,originalText=label.textContent
		const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


		const shuffleText1=(/** @type {HTMLElement | null} */ label)=>{
			let shuffledText = '';	
			for (let i = 0; i < originalText.length; i++) {
				if (i < itration) {		
					shuffledText += originalText[i];
				} else {
					shuffledText += charList.charAt(Math.floor(Math.random() * charList.length));
				}
			}
			if(!label)
				return
			label.textContent = shuffledText;
			itration += 1 / 4;
			if (itration <= originalText.length) {
				requestAnimationFrame(()=>shuffleText1(label));
			} else {
				itration = 0;
			}
		}
		shuffleText1(label)
	}
	const logout=()=>{
		pb.authStore.clear();
		isValid=false
		goto('/login');
	}

	
	onMount(()=>{
		shuffleText(document.getElementById('text1'))    
		authStore.subscribe((store) => {
			if(!store || !store.user) 
				return;
			isValid = store.token?true:false			
		});		
	})
	</script>
	<div class="navbar bg-[#01c38d] text-white uppercase font-bold py-4 px-2">
		<div class="flex-1">
			<a class="btn bg-transparent text-xl text-white font-[synthan] border-none" href='/'><p id='text1'>MECIA2.0 VASAD</p></a>
		</div>
		<!-- <div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h7" />
				</svg>
			</div>
			<ul
				class="menu menu-sm dropdown-content bg-base-100 rounded-box right-2 z-[1] mt-2 w-52 p-2 shadow">
				<li class="text-slate-700 text-xl"><a>Homepage</a></li>
				<li class="text-slate-700 text-xl"><a>Portfolio</a></li>
			</ul>
			</div>-->
			<div class="flex-none gap-2">         
				<a href="/attend" class="uppercase font-bold btn btn-ghost">attendance</a>
				<a href="/entry" class="uppercase font-bold btn btn-ghost">slotwise</a>
		</div> 
	</div>
	


