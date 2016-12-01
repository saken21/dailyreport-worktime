$(document).on('ready',function() {
	
	var $memberName = $('#memberName');
	var $from       = $('#from');
	var $to         = $('#to');
	var $submit     = $('#submit');
	var $result     = $('#result');
	
	init();
	
	function init() {
		
		var date = new Date;
		
		setFrom(date,-35);
		setTo(date);
		
		$submit.on('click',submit);
		
		return false;
		
	}
	
	function submit() {
		
		var memberName = $memberName.prop('value');
		var from       = $from.prop('value');
		var to         = $to.prop('value');
		
		$.ajax({

			type     : 'POST',
			url      : 'http://gwp.php.xdomain.jp/api/dailyReport2/',
			data     : { mode:'memberWorktime', member:memberName, from:from, to:to },
			dataType : 'json'

		}).then(function(data) {
			
			var html   = '<ul>';
			var length = data.length;
			var total  = 0;
			
			for (var i = 0; i < length; i++) {
				
				var date     = data[i].updatetime;
				var overtime = getOvertime(date.split(' ')[1]);
				
				html += '<li>[' + getZero(i + 1) + '] ' + date + ' : ' + overtime + '</li>';
				
				total += overtime;
			
			}
			
			html += '</ul>';
			html += '<p>目安残業時間 : ' + total + '</p>'
			
			$result.html(html);
			
			return false;

		});
		
		return false;
		
	}
	
	function getOvertime(time) {
		
		var splits = time.split(':');
		var h      = splits[0];
		var m      = splits[1];
		
		if (h < 18) return 0;
		
		var overH = h - 18;
		var overM = (m > 30) ? .5 : 0;
		
		return overH + overM;
		
	}
	
	function setFrom(date,diff) {
		
		setDate($from,new Date(date.getTime() + diff * 24 * 60 * 60 * 1000));
		return false;
		
	}
	
	function setTo(date) {
		
		setDate($to,date);
		return false;
		
	}
	
	function setDate($target,date) {
		
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();

		$target.prop('value',y + '-' + getZero(m) + '-' + getZero(d));
		
		return false;
		
	}
	
	function getZero(i) {

		return (i > 9) ? i : '0' + i;

	}
	
	return false;
	
});