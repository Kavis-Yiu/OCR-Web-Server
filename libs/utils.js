// export the utils library
exports = module.exports = {
	az: function(n) {
		return (n > 9? n: "0"+n);
	},
	now: function(f) {
		let d = new Date();
		
		if (!f) {
			return d.getTime();
		}
		
		if (f.indexOf("Y") > -1) {
			f = f.replace(/Y/g, d.getFullYear());
		}
		if (f.indexOf("M") > -1) {
			f = f.replace(/M/g, this.az(d.getMonth()+1));
		}
		if (f.indexOf("D") > -1) {
			f = f.replace(/D/g, this.az(d.getDate()));
		}
		if (f.indexOf("h") > -1) {
			f = f.replace(/h/g, this.az(d.getHours()));
		}
		if (f.indexOf("m") > -1) {
			f = f.replace(/m/g, this.az(d.getMinutes()));
		}
		if (f.indexOf("s") > -1) {
			f = f.replace(/s/g, this.az(d.getSeconds()));
		}
		
		return f;
	},
	obj: function(e, m, r) {
		let j = {err: e};
		
		if (m !== undefined) {
			j.msg = m;
		}
		else {
			j.msg = (e? "ERROR": "OK");
		}
		
		if (r != undefined) {
			j.res = r;
		}
		
		return j;
	}
};