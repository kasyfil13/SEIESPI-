import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EvidenceService } from '../service/evidence.service';
import { Evidence, Temuan} from '../models/evidence.model';

@Component({
  selector: 'app-evidence-list',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './evidence-list.component.html',
  styleUrls: ['./evidence-list.component.scss']
})
export class EvidenceListComponent implements OnInit {
  evidenceList: Evidence[] = [];

  constructor(private evidenceService: EvidenceService) {}

  newEvidence: Evidence = {
    id: 0, 
    evidence_name: '',
    status_saat_ini: 'Belum Selesai', 
    progress_bulan_ini: '',         
    rekomendasi: {
      id: 0,                      
      deskripsi: '',
      kriteria: 'Prosedur',      
      temuan: { 
        id: 0, 
        temuan: '' 
      }
    }
  };

  addEvidence() {
    this.evidenceService.addEvidence(this.newEvidence).subscribe(res => {
      this.loadEvidence();
      this.newEvidence = {
        id: 0,
        evidence_name: '',
        status_saat_ini: 'Belum Selesai',
        progress_bulan_ini: '0',
        rekomendasi: {
          id: 0,
          deskripsi: '',
          kriteria: 'Prosedur',
          temuan: { id: 0, temuan: '' }
        }
      };
    });
  }

  groupedEvidence: { temuan: string; evidence: Evidence[] }[] = [];

  temuanList: Temuan[] = [];

  groupEvidence() {
    const map = new Map<string, Evidence[]>();
    this.evidenceList.forEach(e => {
      const key = e.rekomendasi.temuan.temuan ?? 'Unknown'; // pastikan string
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(e);
    });

    this.groupedEvidence = Array.from(map.entries()).map(([temuan, evidence]) => ({
      temuan,
      evidence
    }));
  }
  ngOnInit(): void {
    this.loadEvidence();
    this.loadTemuan();
  }
  loadTemuan() {
    this.evidenceService.getTemuanList().subscribe((data: Temuan[]) => {
      this.temuanList = data;
    });
  }
  loadEvidence() {
    this.evidenceService.getAll().subscribe(data => {
      this.evidenceList = data;
      this.groupEvidence();
    });
  }
  }
