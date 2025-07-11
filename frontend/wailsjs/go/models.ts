export namespace entity {
	
	export class DeletionRequest {
	    paths: string[];
	    force: boolean;
	
	    static createFrom(source: any = {}) {
	        return new DeletionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.paths = source["paths"];
	        this.force = source["force"];
	    }
	}
	export class DeletionResult {
	    id: string;
	    path: string;
	    success: boolean;
	    error?: string;
	    isDirectory: boolean;
	    size: number;
	    deletedAt: string;
	
	    static createFrom(source: any = {}) {
	        return new DeletionResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.path = source["path"];
	        this.success = source["success"];
	        this.error = source["error"];
	        this.isDirectory = source["isDirectory"];
	        this.size = source["size"];
	        this.deletedAt = source["deletedAt"];
	    }
	}
	export class DeletionSummary {
	    id: string;
	    totalItems: number;
	    successCount: number;
	    failureCount: number;
	    totalSize: number;
	    results: DeletionResult[];
	    startedAt: string;
	    completedAt: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new DeletionSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.totalItems = source["totalItems"];
	        this.successCount = source["successCount"];
	        this.failureCount = source["failureCount"];
	        this.totalSize = source["totalSize"];
	        this.results = this.convertValues(source["results"], DeletionResult);
	        this.startedAt = source["startedAt"];
	        this.completedAt = source["completedAt"];
	        this.status = source["status"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DirEntry {
	    id: string;
	    scanDate: string;
	    name: string;
	    path: string;
	    size: number;
	    isDir: boolean;
	    children?: DirEntry[];
	    elapsed: number;
	    totalDirs: number;
	    totalFiles: number;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new DirEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.scanDate = source["scanDate"];
	        this.name = source["name"];
	        this.path = source["path"];
	        this.size = source["size"];
	        this.isDir = source["isDir"];
	        this.children = this.convertValues(source["children"], DirEntry);
	        this.elapsed = source["elapsed"];
	        this.totalDirs = source["totalDirs"];
	        this.totalFiles = source["totalFiles"];
	        this.status = source["status"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DiskStats {
	    total: number;
	    free: number;
	    used: number;
	
	    static createFrom(source: any = {}) {
	        return new DiskStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total = source["total"];
	        this.free = source["free"];
	        this.used = source["used"];
	    }
	}
	export class ScanSummary {
	    id: string;
	    scanDate: string;
	    path: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new ScanSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.scanDate = source["scanDate"];
	        this.path = source["path"];
	        this.status = source["status"];
	    }
	}

}

