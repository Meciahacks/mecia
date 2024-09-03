<script>	 
	import { pb, authStore } from '../../auth.js'
	
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let email = '',password = ''
	let loading=false
	let error = '';
	
	const login=async (event)=>{



		event.preventDefault()
		try {		
		loading=true
		await pb.collection('users').authWithPassword(email, password);
		goto('/entry');
	} catch (err) {
		console.log(err);
		error = 'Invalid login credentials';
	  }
	  finally{
		loading=false
	  }
	}
	onMount(() => {
	  authStore.subscribe((store) => {
		if (store.isLoggedIn) {
		  goto('/entry');
		}
	  });
	});
  </script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="Login" />
</svelte:head>


<div class="mx-auto w-11/12">
  <h2>Login</h2>
  {#if error}
	<p style="color: red;">{error}</p>
  {/if}

  <form on:submit={login} class="container">
	<label class="form-control w-full">
		<div class="label">
		  <span class="label-text">Email</span>
		</div>
		<input type="text" placeholder="Email" class="input input-bordered w-full text-slate-800"  bind:value={email} required/>		
	</label>
	<label class="form-control w-full">
		<div class="label">
		  <span class="label-text">Password</span>
		</div>
		<input type="password" placeholder="Password" class="input input-bordered w-full text-slate-800"  bind:value={password} required/>		
	</label>
	<div class="w-full my-4">
		<button type="submit" class="btn btn-neutral btn-wide w-full">			
			{#if loading}<span class="loading loading-spinner">
				Logging In, Please Wait....
			</span>
			{:else}
				LOGIN
			{/if}
		</button>
	</div>
  </form>
</div>




