// Type definitions for lib/game-capsule.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace GameCapsule.prototype{
	// GameCapsule.prototype.getDispTime.!ret
	
	/**
	 * 
	 */
	interface GetDispTimeRet {
				
		/**
		 * 
		 */
		s : number;
	}
}

/**
 * 
 */
declare interface GameCapsule {
		
	/**
	 * 
	 * @param options 
	 */
	new (options : any);
		
	/**
	 * 
	 */
	init(): void;
		
	/**
	 * 
	 * @param event 
	 */
	update(event : any): void;
		
	/**
	 * 
	 * @return  
	 */
	play(): boolean;
		
	/**
	 * 
	 */
	pause(): void;
		
	/**
	 * 
	 */
	reset(): void;
		
	/**
	 * 
	 * @param isZeroPadding 
	 * @return  
	 */
	getDispTime(isZeroPadding : any): GameCapsule.prototype.GetDispTimeRet;
		
	/**
	 * 
	 * @param isZeroPadding 
	 * @return  
	 */
	getRemainingTime(isZeroPadding : any): boolean;	
	/**
	 * 
	 */
	getRemainingTime();
		
	/**
	 * 
	 * @param num 
	 * @return  
	 */
	divisionRetina(num : any): any;
		
	/**
	 * 
	 * @param min 
	 * @param max 
	 * @return  
	 */
	createRandom(min : any, max : any): number;
		
	/**
	 * 
	 * @param target 
	 * @param digit 
	 * @return  
	 */
	zeroPadding(target : number | string, digit : number): string;
		
	/**
	 * 
	 * @return  
	 */
	isCountDownComplete(): boolean;
		
	/**
	 * 
	 */
	_clearStage(): void;
		
	/**
	 * 
	 */
	_initTimer(): void;
		
	/**
	 * 
	 */
	_initStage(): void;
		
	/**
	 * 
	 */
	_setCanvasSize(): void;
		
	/**
	 * 
	 */
	_devicePixelRatio(): void;
		
	/**
	 * 
	 */
	_resizeHandle(): void;
}
