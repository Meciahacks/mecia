<script>//
	// @ts-nocheck
		
	import {Html5QrcodeScanner,Html5QrcodeScanType} from "html5-qrcode"
	import { onMount } from "svelte";
	import {pb} from '../../auth'
	let html5QrcodeScanner,decodedText
	let dt,loading=false
	let slotList,selectedSlotText=''
	let mesg='',error_mesg=''
	let config = {
			fps: 10,
	
			qrbox: {width: 250, height: 250},
			rememberLastUsedCamera: true,
			supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA,Html5QrcodeScanType.SCAN_TYPE_FILE]
		};
		const fetchSlotList=async()=>{
			try{
				loading=true
				slotList=await pb.collection('Slot').getFullList()
			}
			catch(error){
				console.log('****',error);
				mesg=''
				error_mesg=error
			}
			finally{
				loading=false
			}
		}
		const fetchRecord=async(decodedText)=>{
			try {            
				loading=true            
				const record = await pb.collection('team_member').getOne(decodedText, {
						expand: 'team,Slotwise_via_member',
				});
				if(record.expand.Slotwise_via_member)
					console.log(record.expand?.Slotwise_via_member[0]?.slot,selectedSlotText);            
							if(record.expand.Slotwise_via_member &&  record.expand.Slotwise_via_member[0].slot==selectedSlotText && record.expand.Slotwise_via_member[0].is_present){
					mesg=''
					error_mesg="Already Present"
					return
				}
				console.log(record)
				dt=record
				// 
				// insertRecord(dt.id)
			} catch (error) {            
				console.log('****',error);
				dt='User !Found'        
				mesg=''    
				error_mesg=error
			}
			finally{
				loading=false
			}
		}
		const insertRecord=async(decodedText)=>{
			try {            
				const rr = {
					"member": decodedText,
					"slot": selectedSlotText,
					"is_present": true
				};
				console.log(rr)            
				const record = await pb.collection('Slotwise').create(rr);        
				selectedSlotText=''
				mesg='Successfully Scanned'
				error_mesg=''
				html5QrcodeScanner.clear()            
			} catch (error) {            
				error_mesg=error
				mesg=''
				console.log('****',error)            
			}
		}
		const fetchQR=(event) => {
					selectedSlotText=event.target.value;
					html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
					html5QrcodeScanner.render(onScanSuccess, onScanFailure);                   
			}
		const onScanSuccess=(decodedText1, decodedResult)=>{
			if(!selectedSlotText){
				alert('Please ,Select Slot to Proceed')
				return
			}
			decodedText=decodedText1
			fetchRecord(decodedText)
			insertRecord(decodedText)
			html5QrcodeScanner.clear()          
		}
		const onScanFailure=(error)=>{
			console.log('****',error)
			mesg=''
			error_mesg=error
		}
		onMount(async()=>{
			console.log('****');        
			fetchSlotList()        
			// html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
			// html5QrcodeScanner.render(onScanSuccess, onScanFailure);        
	})
	</script>
	<div>
		<h1 class='bg-slate-800 text-white p-2 text-xl uppercase font-bold'>QR Code Scanner</h1>
		{#if loading}
			<h1>Loading....</h1>
		{/if}
		{#if mesg}
			<p class="text-2xl bg-green-700 text-white font-bold text-center p-2">{mesg}</p>
		{/if}
		{#if error_mesg}
			<p class="text-2xl bg-orange-700 text-white font-bold text-center p-2">{error_mesg}</p>
		{/if}
		{#if slotList}
			<p>{JSON.stringify(slotList)}</p>
			<div class="w-full p-2">
				<label for="slot1" class="font-bold text-xl">Select Slot</label>
				<select bind:value={selectedSlotText} on:change={fetchQR} id="slot1" class="select w-full"> 
					<option value="" selected disabled></option>
					{#each slotList as record}
						<option value={record.id}>{record.name}</option>
					{/each}
				</select>
			</div>
		{/if}
		<div id="reader" width="1024"/>        
		<!--  
		<input class="input border" on:blur={(event)=>fetchRecord(event.target.value)} type="text">     -->
		{#if dt}
			<div class="md:w-10/12 w-full mx-auto bg-slate-700 text-white p-4">
				<div class="grid grid-cols-2">
					<div>Team Name:</div>
					<div>{dt?.expand?.team?.team_name}</div>
				</div>            
				<div class="grid grid-cols-2">
					<div>Member Name:</div>
					<div>{dt.name}</div>
				</div>
			</div>
	
	
	
	
	
	
	
			<div>
				<button class="btn btn-primary">Confirm</button>
				<button>Cancel</button>
			</div>
		{:else if loading}
			<p class="text-center text-xl">Loading....</p>   
		{/if}
	</div>
	
	
	
	
	
	
	
	
	
	
	
	
	