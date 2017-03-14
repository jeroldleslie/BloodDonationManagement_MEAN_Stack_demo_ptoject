import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DonorService {


    private headers: Headers;
    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    getDonor(id) {
        return this.http.get('/api/donor/' + id, { headers: this.headers })
            .map(res => res.json());
    }

    filterDonors(query) {
        return this.http.post('/api/donors', JSON.stringify(query), { headers: this.headers })
            .map(res => res.json());
    }

    getAllDonors() {
        return this.http.get('/api/donors', { headers: this.headers })
            .map(res => res.json());
    }
    addDonor(newDonor) {
        return this.http.post('/api/donor', JSON.stringify(newDonor), { headers: this.headers })
            .map(res => res.json());
    }

    updateDonor(donor) {
        return this.http.put('/api/donor/' + donor._id, JSON.stringify(donor), { headers: this.headers })
            .map(res => res.json());
    }

    deleteDonor(id) {
        return this.http.delete('/api/donor/' + id, { headers: this.headers })
            .map(res => res.json());
    }


}
