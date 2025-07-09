export namespace entity {
	
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
	export class ScanSummary {
	    id: string;
	    scanDate: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new ScanSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.scanDate = source["scanDate"];
	        this.path = source["path"];
	    }
	}

}

