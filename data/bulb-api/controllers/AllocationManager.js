var AllocationManager = function( allocation, user, asset ){
	this.allocation = allocation;
	this.user = user;
	this.asset = asset;
}

AllocationManager.prototype.possible = function() {
	var begins = new Date(this.allocation.get("begins"));
	var ends   = new Date(this.allocation.get("ends"));

	// ARBITRARY ASSUMPTION :  "value",  "value", dateTime objects represent a "positive" time interval
	// 							that is begin < end.
	//							This assumption is made upon the idea that in a real-life app the db
	//							will be validated.
	//							
	//
	//            X---------------Y					current "wannabe" allocation
	//                     A-----------B			existing allocation overlapping from right
	//         A------B 							existing allocation overlapping from left
	//                    A---B 					existing allocation is a subset of "wannabe"
	//
	// Given two date ranges, the simplest way to determine whether the two date ranges overlap is
	// (X <= B ) &&  (Y >= A)
	//
	// X = begins of this allocation
	// Y = ends   of this allocation
	// A = begins of db data
	// B = ends   of db data

	// proof
	// XY and AB do not overlap if 
	// (a)		XY is completely after  AB  --> ( X > B) --> not(a) == (X<B)
	// (b)		XY is completely before AB  --> ( Y < A) --> not(b) == (Y>A)
	//
	// XY and AB overlap if not( a or b )
	// by using De Morgan law it can be shown that
	// not(a or b) === not(a) and not(b)

	allocation.where({assetId: this.asset.id })
	.where(begins, "<=", "ends")
	.where(ends,   ">=", "begins")
	.fetchOne() 								// one element is sufficient to determine overlap
	.then(function(data){
		return false;
	});

	return true;

};



