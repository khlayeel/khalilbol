import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { Formation } from '../shared/formation.model';

@Component({
  selector: 'app-recherche-formations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recherche-formations.component.html',
  styleUrl: './recherche-formations.component.css'
})
export class RechercheFormationsComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  searchTerm: string = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void { 
    this.getAllFormations();
  }

  getAllFormations() {
    this.api.getAllFormations().subscribe(res => {
      this.formations = res || [];
      this.filteredFormations = [...this.formations];
    });
  }

  filterFormations() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredFormations = [...this.formations];
      return;
    }

    this.filteredFormations = this.formations.filter((formation: Formation) => {
  
      const matchesTags = formation.tags && formation.tags.length > 0 && formation.tags.some(tag => 
        tag.toLowerCase().includes(term)
      );
      
     
      const matchesTitre = formation.titre && formation.titre.toLowerCase().includes(term);
      
  
      const matchesDescription = formation.description && formation.description.toLowerCase().includes(term);
      
      return matchesTags || matchesTitre || matchesDescription;
    });
  }
}

