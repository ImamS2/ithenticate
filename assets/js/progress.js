var progress;
function startEmbeddedProgressBar(form){
	progress={};
	progress.id=generateProgressID();
	if(form.action.match(/\?/))
		form.action+='&progress_id='+progress.id;
	else
		form.action+='?progress_id='+progress.id;
		progress.stalled=0;
		progress.last_received=0;
		progress.last_percent=0;
		progress.processing=false;
		Element.show('progress');
		window.setTimeout(reportUploadProgress,2000);
		return true;
}
function generateProgressID(){
	var id='';
	var alpha="0123456789abcdef";
	for(var i=0;i<32;i++){
		id+=alpha.charAt(Math.round(Math.random()*14));
	}
	return id;
}
function reportUploadProgress(){
	url='progress?progress_id='+progress.id;
	var callback={
		success:function(o){
			handleUploadProgressResults(o.responseText);
		},
		failure:function(o){
			window.setTimeout(reportUploadProgress,4000);
		}
	}
	YAHOO.util.Connect.asyncRequest('GET',url,callback);
}
function handleUploadProgressResults(results){
	var state=JSON.parse(results);
	if(!state)
		return;
	if(state.aborted){
		alert(aborted_msg);
		window.location='/upload';
		return;
	}
	var stall_timeout=60;
	var no_change=false;
	if(state.size==-1){
		no_change=true;
	}
	else if(progress.processing){
		stall_timeout=90;
		no_change=progress.last_percent==state.processed_percent;
		progress.last_percent=state.processed_percent;
	}
	else
	{
		no_change=progress.last_received==state.received;
		progress.last_received=state.received;
	}
	if(no_change){
		if(++progress.stalled>stall_timeout){
			if(!confirm(stalled_msg)){
				window.location='/folder';
				return;
			}
			progress.stalled=0;
		}
	}
	else
	{
		progress.stalled=0;
	}
	window.setTimeout(reportUploadProgress,1000);
	if(state.size==-1)
		return;
	if(!state.total){
		updateProgressBar(state,no_change);
		return;
	}
	if(!progress.processing){
		state.percent=100;
		updateProgressBar(state,false);
		progress.processing=true;
		Element.show('process_meter');
	}
	var percent=state.processed_percent;
	if(percent!=0){
		updateBar(percent,$('p_p_width'),$('p_p_value'));
	}
	return;
}
function updateProgressBar(cur_progress,no_change){
	if(!cur_progress.percent||cur_progress.size<=0)
		return;
	$('p_bytes').innerHTML=cur_progress.recieved_formatted;
	$('p_ttl_bytes').innerHTML=cur_progress.size_formatted;
	$('p_time').innerHTML=cur_progress.total_time;
	$('p_togo').innerHTML=cur_progress.remaining_time;
	$('p_avgkb').innerHTML=cur_progress.avg_rate;
	$('p_kb').innerHTML=cur_progress.cur_rate;
	if(no_change)
		return;
	updateBar(cur_progress.percent,$('p_u_width'),$('p_u_value'));
}
function updateBar(percent,widthElement,valueElement){
	percent=Math.round(percent);
	valueElement.innerHTML=percent+'%';
	var fromValue=parseInt(widthElement.style.width)||0;var attributes={width:{from:fromValue,to:percent,unit:'%'}};
	var myAnim=new YAHOO.util.Anim(widthElement,attributes);
	myAnim.animate();
}