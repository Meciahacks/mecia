<script>//
	// @ts-nocheck
		
	import {Html5QrcodeScanner,Html5QrcodeScanType} from "html5-qrcode"
	import { onMount } from "svelte";
	import {pb} from '../../auth'
	let html5QrcodeScanner,decodedText
	let dt,loading=false
	let mesg='',error_mesg=''
	let selectedRecordId='',entryexit=''
	let config = {
			fps: 10,	

			qrbox: {width: 250, height: 250},
			rememberLastUsedCamera: true,
			supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
		};
		const fetchRecord=async(decodedText)=>{
			try {            
				loading=true            
				const record = await pb.collection('team_member').getOne(decodedText, {					
						expand: 'team,Entry_via_member',
				});
				console.log('****',record);
				dt=record
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
		const insertRecord=async()=>{
			loading=true
			try {            
				const rr = {
					"member": selectedRecordId,
					"entry_exit": entryexit,
					'punch_time':new Date(),
					reason:'----'
				};
				const record = await pb.collection('Entry').create(rr);        
				entryexit=''
				selectedRecordId=''
				mesg='Successfully Inserted'
				error_mesg=''
				dt=null
				html5QrcodeScanner.clear()            
			} catch (error) {            
				error_mesg=error
				mesg=''
				console.log('****',error)            
			}
			finally{
				loading=false
			}
		}
		const fetchQR=(event) => {
					mesg=''
					error_mesg=''
					selectedRecordId=''
					dt=null
					entryexit=event.target.value;
					html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
					html5QrcodeScanner.render(onScanSuccess, onScanFailure);                   
			}
		const onScanSuccess=(decodedText1, decodedResult)=>{
			if(!entryexit){
				alert('Please ,Select Slot to Proceed')
				return
			}
			mesg=''
			error_mesg=''
			decodedText=decodedText1
			dt=null
			fetchRecord(decodedText)
			selectedRecordId=decodedText1
			html5QrcodeScanner.clear()          
		}
		const onScanFailure=(error)=>{
			console.log('****',error)
			mesg=''
			error_mesg=error
		}
		const resetRecord=()=>{
			selectedRecordId=''
			entryexit=''
			dt=''
			html5QrcodeScanner.clear()          
		}
		onMount(async()=>{
			// html5QrcodeScanner = new Html5QrcodeScanner("reader", config,false);
			// html5QrcodeScanner.render(onScanSuccess, onScanFailure);        
	})
	</script>
	<div>
		<h1 class='bg-slate-800 text-white p-2 text-xl uppercase font-bold'>QR Code Scanner</h1>
		{#if loading}
			<h1 class="text-2xl text-orange-700 text-center p-2">Loading....</h1>
		{/if}
		{#if mesg}
			<p class="text-2xl bg-green-700 text-white font-bold text-center p-2">{mesg}</p>
		{/if}
		{#if error_mesg}
			<p class="text-2xl bg-orange-700 text-white font-bold text-center p-2">{error_mesg}</p>
		{/if}
		<div class="w-full p-2">
			<label class="font-bold text-xl" for='entrybtn'>Entry</label>			
			<input on:change={fetchQR} bind:group={entryexit} type="radio" name="entryexit" value="entry" id='entrybtn'>


			<label for="exitbtn" class="font-bold text-xl">Exit</label>			
			<input on:change={fetchQR} bind:group={entryexit} type="radio" name="entryexit" value="exit" id="exitbtn">
		</div>
		<div id="reader" width="1024"/>        
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
			<div class="m-2 flex justify-center p-2">








				
				<button on:click={insertRecord} class="btn btn-primary">
					{#if loading}<span class="loading loading-spinner"></span>{/if}
					Confirm
				</button>
				<button on:click={()=>{resetRecord()}} class="bg-orange-700 hover:bg-orange-500 text-white btn">Cancel</button>
			</div>
			{#if dt?.expand?.Entry_via_member}
				<div class="mx-auto my-4 w-10/12 p-2">			
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>								
									<th></th>
									<th>Entry/Exit</th>
									<th>Punch Time</th>
								</tr>
							</thead>
							<tbody>
								{#each dt?.expand?.Entry_via_member as record,indx}								
									<tr>
										<th>{indx+1}</th>
										<td>{record.entry_exit}</td>
										<td>{new Date(record.punch_time).toTimeString()}</td>
									</tr>							
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		{:else if loading}
			<p class="text-center text-xl">Loading....</p>   
		{/if}
	</div>
	
	
	
	
	
	
	
	
	
	
	
	
	